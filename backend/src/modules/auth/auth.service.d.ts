export declare class AuthService {
    static login(email: string, password: string): Promise<{
        user: {
            id: string;
            email: string;
            role: "SUPER_ADMIN" | "MANAGER";
            firstName: string | undefined;
            lastName: string | undefined;
        };
        token: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map