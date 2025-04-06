import bcrypt from "bcrypt";

import UserRepository from "../repository/user.repository";
import { UserPayload, UserResponse } from "../types/user.types";
import { CreateNewUserDTO } from "../dto/auth/createNewUser.dto";
import { UserDTO } from "../dto/users/user.dto";
import { LoginUserDTO } from "../dto/auth/loginUser.dto";

class UserService {
    private _userRepository: UserRepository;

    constructor() {
        this._userRepository = new UserRepository();
    }

    /**
     * @dev This method checks if a user exists. Returns either the user or (null | throw an error)
     * @param email 
     */
    async findUserByEmail(email: UserDTO["email"]) {
        const user = await this._userRepository.findByEmail(email);
        return user;
    }

    /**
     * @dev Hash user password
     * @param password
     */
    async hashPassword(password: UserDTO["password"]) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }

    /**
     * @dev Compare user password
     * @param password
     */
    async comparePassword(userPassword: UserDTO["password"], payloadPassword: UserDTO["password"]) {
        const isPasswordEquallyMatched = await bcrypt.compare(payloadPassword, userPassword);
        return isPasswordEquallyMatched;
    }

    /**
     * @dev Creates a user if user doesn't exist
     * @param email 
     * @param username
     * @param password
     */
    async createUser(data: CreateNewUserDTO) {
        // Hash password if user doesn't exist
        const hashedPassword = await this.hashPassword(data.password);
            
        const newUser = {
            ...data,
            password: hashedPassword
        };

        // Store user in database
        this._userRepository.create(newUser);

        // Return message after successfully adding user
        return "Successfully added user";
    }

    /**
     * @dev Update user password
     * @param userId - UserDTO["id"]
     * @param oldPassword - UserDTO["password"]
     * @param newPassword - UserDTO["password"]
     */
    async updateUserPassword(
        userId: UserDTO["id"],
        newPassword: UserDTO["password"]
    ) {
        await this._userRepository.updatePassword(userId, newPassword);
        return "Password successfully updated";
    }
}

export default UserService;