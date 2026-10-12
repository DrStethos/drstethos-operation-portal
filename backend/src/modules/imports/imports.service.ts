import * as xlsx from 'xlsx';
import fs from 'fs';
import { ImportJob } from '../../models/ImportJob';
import { Hospital } from '../../models/Hospital';
import { HospitalAccessAssignment } from '../../models/HospitalAccessAssignment';

interface HospitalImporter {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}

export const importHospitals = async (filePath: string, user: HospitalImporter) => {
  const job = await ImportJob.create({ status: 'PROCESSING', totalRows: 0, failedRows: 0, errors: [] });

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error('Excel file has no valid sheets');
    }
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      throw new Error('Worksheet data could not be read');
    }
    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    job.totalRows = data.length;
    await job.save();

    let failed = 0;
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        if (!row['Hospital Name']) throw new Error('Missing Hospital Name');

        const vacancyValue = row['Vacancy'];
        const vacancy = vacancyValue === undefined || vacancyValue === null || vacancyValue === ''
          ? undefined
          : Number(vacancyValue);
        if (vacancy !== undefined && (!Number.isInteger(vacancy) || vacancy < 0)) {
          throw new Error('Vacancy must be a non-negative whole number');
        }

        const hospital = await Hospital.create({
          name: row['Hospital Name'],
          ...(row['Hospital Type'] ? { hospitalType: row['Hospital Type'] } : {}),
          ...(row['Hospital Speciality'] ? { speciality: row['Hospital Speciality'] } : {}),
          ...(row['Address'] ? { location: row['Address'] } : {}),
          ...(row['Phone Number'] ? { contactNumber: row['Phone Number'] } : {}),
          ...(row['Email ID'] ? { email: row['Email ID'] } : {}),
          ...(row['Source'] ? { source: row['Source'] } : {}),
          ...(vacancy !== undefined ? { vacancy } : {}),
          createdById: user.id,
          ...(user.name ? { createdByName: user.name } : {}),
          ...(user.email ? { createdByEmail: user.email } : {}),
          ...(user.role ? { createdByRole: user.role } : {}),
        });

        await HospitalAccessAssignment.create({
          userId: user.id,
          hospitalId: hospital._id
        });
      } catch (err: any) {
        failed++;
        job.errors.push({ rowNumber: i + 2, error: err.message });
      }
    }

    job.status = failed === data.length && data.length > 0 ? 'FAILED' : 'COMPLETED';
    job.failedRows = failed;
    await job.save();

  } catch (error: any) {
    job.status = 'FAILED';
    await job.save();
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return job.toJSON();
};
