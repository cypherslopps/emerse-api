import { CreateNewUserDTO } from "../auth/createNewUser.dto";

export interface UserDTO extends CreateNewUserDTO {
    id: number;
    valid?: boolean;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}