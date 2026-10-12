import { Request, Response } from 'express';
import * as invitationService from './invitations.service';

export type Role = 'SUPER_ADMIN' | 'MANAGER';

export const createInvitation = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' });
    }
    const invitation = await invitationService.createInvitation(email, role as Role);
    res.status(201).json(invitation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getInvitations = async (req: Request, res: Response) => {
  try {
    const invitations = await invitationService.getInvitations();
    res.status(200).json(invitations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteInvitation = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await invitationService.deleteInvitation(id);
    res.status(200).json({ message: 'Invitation revoked successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const acceptInvitation = async (req: Request, res: Response) => {
  try {
    const token = String(req.params.token);
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    const user: any = await invitationService.acceptInvitation(token, password);
    res.status(200).json({ 
      message: 'Invitation accepted successfully', 
      user: { id: user.id || user._id, email: user.email, role: user.role } 
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
