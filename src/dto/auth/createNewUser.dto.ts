
export type UserRoles = "customer" | "admin";

export interface CreateNewUserDTO {
    email: string;
    username: string;
    role?: UserRoles;
    password: string;
}

export interface CreateGoogleAuthDTO {
    google_id: string;
    email: string;
    displayName: string;
    email_verified: boolean;
}