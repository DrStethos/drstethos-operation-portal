export declare const getUsers: () => Promise<(import("../../models/User").IUser & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
})[]>;
export declare const deleteUser: (id: string, currentUserId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../../models/User").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/User").IUser & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const updateUserRole: (id: string, role: "SUPER_ADMIN" | "MANAGER") => Promise<(import("../../models/User").IUser & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
//# sourceMappingURL=users.service.d.ts.map