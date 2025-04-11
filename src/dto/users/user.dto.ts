import { CreateGoogleAuthDTO, CreateNewUserDTO } from "../auth/createNewUser.dto";

export interface UserDTO extends CreateNewUserDTO {
    id: number;
    valid?: boolean;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface UserGoogleAuthDTO extends CreateGoogleAuthDTO {
    id: number;
    valid?: boolean;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}