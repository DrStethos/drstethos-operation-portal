import * as xlsx from 'xlsx';
import fs from 'fs';
import { ImportJob } from '../../models/ImportJob';
import { Hospital, type IHospital } from '../../models/Hospital';
import { HospitalAccessAssignment } from '../../models/HospitalAccessAssignment';

interface HospitalImporter {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}

const normalizeHeader = (header: string) =>
  header.toLowerCase().replace(/[^a-z0-9]/g, '');

const getCellValue = (
  row: Record<string, unknown>,
  aliases: string[],
): unknown => {
  const normalizedAliases = new Set(aliases.map(normalizeHeader));
  const matchingHeader = Object.keys(row).find((header) =>
    normalizedAliases.has(normalizeHeader(header)),
  );
  return matchingHeader === undefined ? undefined : row[matchingHeader];
};

const getOptionalString = (value: unknown): string | undefined => {
  if (value === null || value === undefined) return undefined;
  const stringValue = String(value).trim();
  return stringValue ? stringValue : undefined;
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const mapHospitalRow = (
  row: Record<string, unknown>,
): Partial<IHospital> & Pick<IHospital, 'name'> => {
  const name = getOptionalString(getCellValue(row, ['Hospital Name', 'Hospital']));
  if (!name) throw new Error('Missing Hospital Name');

  const hospitalFields: Partial<IHospital> & Pick<IHospital, 'name'> = { name };
  const serialNumber = getOptionalString(
    getCellValue(row, ['S.No', 'S No', 'Serial Number', 'Serial No']),
  );
  const hospitalType = getOptionalString(
    getCellValue(row, ['Hospital Type', 'Type']),
  );
  const speciality = getOptionalString(
    getCellValue(row, [
      'Hospital Speciality',
      'Hospital Specialty',
      'Speciality',
      'Specialty',
    ]),
  );
  const location = getOptionalString(
    getCellValue(row, [
      'Location / Full Address',
      'Location',
      'Address',
      'Full Address',
    ]),
  );
  const contactNumber = getOptionalString(
    getCellValue(row, [
      'Contact Number',
      'Phone Number',
      'Phone',
      'Mobile Number',
    ]),
  );
  const email = getOptionalString(
    getCellValue(row, ['Email Address', 'Email ID', 'Email']),
  );
  const source = getOptionalString(
    getCellValue(row, ['Source Website', 'Website', 'Website URL', 'Source']),
  );
  const vacancyValue = getOptionalString(getCellValue(row, ['Vacancy']));
  const vacancy = vacancyValue === undefined ? undefined : Number(vacancyValue);

  if (vacancy !== undefined && (!Number.isInteger(vacancy) || vacancy < 0)) {
    throw new Error('Vacancy must be a non-negative whole number');
  }

  if (serialNumber) hospitalFields.serialNumber = serialNumber;
  if (hospitalType) hospitalFields.hospitalType = hospitalType;
  if (speciality) hospitalFields.speciality = speciality;
  if (location) hospitalFields.location = location;
  if (contactNumber) hospitalFields.contactNumber = contactNumber;
  if (email) hospitalFields.email = email;
  if (source) hospitalFields.source = source;
  if (vacancy !== undefined) hospitalFields.vacancy = vacancy;

  return hospitalFields;
};

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
    const data: Record<string, unknown>[] = xlsx.utils.sheet_to_json(sheet, {
      defval: '',
      raw: false,
    });

    job.totalRows = data.length;
    await job.save();

    const assignedHospitalIds = await HospitalAccessAssignment.distinct('hospitalId', {
      userId: user.id,
    });
    let failed = 0;
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        if (!row) throw new Error('Spreadsheet row could not be read');

        const hospitalFields = mapHospitalRow(row);

        const existingRecords = await Hospital.find({
          name: {
            $regex: `^${escapeRegExp(hospitalFields.name)}$`,
            $options: 'i',
          },
          $or: [
            { createdById: user.id },
            { _id: { $in: assignedHospitalIds } },
          ],
        });

        let hospitals = existingRecords;
        if (existingRecords.length > 0) {
          await Hospital.updateMany(
            { _id: { $in: existingRecords.map((hospital) => hospital._id) } },
            { $set: hospitalFields },
            { runValidators: true },
          );
          await Hospital.collection.updateMany(
            { _id: { $in: existingRecords.map((hospital) => hospital._id) } },
            { $unset: { sourceWebsite: '' } },
          );
        } else {
          hospitals = [
            await Hospital.create({
              ...hospitalFields,
              createdById: user.id,
              ...(user.name ? { createdByName: user.name } : {}),
              ...(user.email ? { createdByEmail: user.email } : {}),
              ...(user.role ? { createdByRole: user.role } : {}),
            }),
          ];
        }

        if (hospitals.length === 0) {
          throw new Error('Failed to save hospital record');
        }

        await Promise.all(
          hospitals.map((hospital) =>
            HospitalAccessAssignment.updateOne(
              { userId: user.id, hospitalId: hospital._id },
              { $setOnInsert: { userId: user.id, hospitalId: hospital._id } },
              { upsert: true },
            ),
          ),
        );
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
