export interface UserPayload {
    email: string;
    username: string;
    password: string;
}

export interface UserResponse extends UserPayload {
    id: number;
}