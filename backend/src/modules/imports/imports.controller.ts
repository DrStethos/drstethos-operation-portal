import { Request, Response } from 'express';
import * as importService from './imports.service';

export const importHospitals = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const user = (req as any).user;
    const userId = user.userId || user.id;
    const job = await importService.importHospitals(req.file.path, {
      id: userId,
      email: user.email,
      name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name,
      role: user.role,
    });
    res.status(202).json({ message: 'Import started', jobId: (job as any).id || (job as any)._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
