import { Request, Response } from 'express';
import { hospitalOptionsService } from './hospital-options.service';

export const getOptions = async (_req: Request, res: Response) => {
  try {
    res.json(await hospitalOptionsService.getOptions());
  } catch (error) {
    console.error('Failed to load hospital field options:', error);
    res.status(500).json({ message: 'Failed to load hospital field options' });
  }
};

export const addOption = async (req: Request, res: Response) => {
  try {
    res.json(await hospitalOptionsService.addOption(req.body.field, req.body.value));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add hospital field option';
    const status = message.startsWith('Invalid ') || message.startsWith('Option value') ? 400 : 500;
    if (status === 500) console.error('Failed to add hospital field option:', error);
    res.status(status).json({ message });
  }
};

export const removeOption = async (req: Request, res: Response) => {
  try {
    res.json(await hospitalOptionsService.removeOption(req.body.field, req.body.value));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to remove hospital field option';
    const status = message.startsWith('Invalid ') || message.startsWith('Option value') ? 400 : 500;
    if (status === 500) console.error('Failed to remove hospital field option:', error);
    res.status(status).json({ message });
  }
};
