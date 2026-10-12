export declare const createInvitation: (email: string, role: "SUPER_ADMIN" | "MANAGER") => Promise<{
    email: string;
    token: string;
}>;
export declare const getInvitations: () => Promise<(import("../../models/AdminInvitation").IAdminInvitation & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
})[]>;
export declare const deleteInvitation: (id: string) => Promise<(import("mongoose").Document<unknown, {}, import("../../models/AdminInvitation").IAdminInvitation, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/AdminInvitation").IAdminInvitation & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const acceptInvitation: (token: string, password: string) => Promise<import("../../models/User").IUser & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=invitations.service.d.ts.map