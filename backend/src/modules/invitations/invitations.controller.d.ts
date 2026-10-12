import { Request, Response } from 'express';
export type Role = 'SUPER_ADMIN' | 'MANAGER';
export declare const createInvitation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getInvitations: (req: Request, res: Response) => Promise<void>;
export declare const deleteInvitation: (req: Request, res: Response) => Promise<void>;
export declare const acceptInvitation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=invitations.controller.d.ts.map