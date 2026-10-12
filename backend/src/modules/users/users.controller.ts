import { Request, Response } from 'express';
import * as usersService from './users.service';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await usersService.getUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const currentUserId = (req as any).user?.id || (req as any).user?.userId;
    await usersService.deleteUser(id, currentUserId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { role } = req.body;
    if (!role || !['SUPER_ADMIN', 'MANAGER'].includes(role)) {
      return res.status(400).json({ error: 'Valid role is required (SUPER_ADMIN or MANAGER)' });
    }
    const updated = await usersService.updateUserRole(id, role);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

