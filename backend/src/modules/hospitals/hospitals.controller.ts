import { Request, Response } from 'express';
import { hospitalsService } from './hospitals.service';

export const getAllHospitals = async (req: Request, res: Response) => {
  try {
    const hospitals = await hospitalsService.getAllHospitals((req as any).user);
    res.json(hospitals);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getHospitalById = async (req: Request, res: Response) => {
  try {
    const hospitalId = String(req.params.id);
    const hospital = await hospitalsService.getHospitalById(hospitalId, (req as any).user);
    res.json(hospital);
  } catch (error: any) {
    if (error.message === 'Hospital not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Unauthorized to access this hospital') {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }
};

export const createHospital = async (req: Request, res: Response) => {
  try {
    const hospital = await hospitalsService.createHospital(req.body, (req as any).user);
    res.status(201).json(hospital);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const updateHospital = async (req: Request, res: Response) => {
  try {
    const hospitalId = String(req.params.id);
    const hospital = await hospitalsService.updateHospital(hospitalId, req.body, (req as any).user);
    res.json(hospital);
  } catch (error: any) {
    if (error.message === 'Hospital not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message === 'Unauthorized to access this hospital') {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }
};

export const deleteHospital = async (req: Request, res: Response) => {
  try {
    const hospitalId = String(req.params.id);
    await hospitalsService.deleteHospital(hospitalId, (req as any).user);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Hospital not found') {
      res.status(404).json({ message: error.message });
    } else if (
      error.message === 'Unauthorized to access this hospital' ||
      error.message === 'Unauthorized to delete this hospital'
    ) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }
};
