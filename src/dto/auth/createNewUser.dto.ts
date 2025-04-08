
export type UserRoles = "customer" | "admin";

export interface CreateNewUserDTO {
    email: string;
    username: string;
    role?: UserRoles;
    password: string;
}