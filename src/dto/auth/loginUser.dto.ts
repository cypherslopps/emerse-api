import { CreateNewUserDTO } from "./createNewUser.dto";

export interface LoginUserDTO extends Omit<CreateNewUserDTO, "username"> {}