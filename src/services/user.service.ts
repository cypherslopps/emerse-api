import bcrypt from "bcrypt";

import UserRepository from "../repositories/user.repository";
import jwt from "jsonwebtoken";
import { CreateNewUserDTO } from "../dto/auth/createNewUser.dto";
import { UserDTO } from "../dto/users/user.dto";
import { LoginUserDTO } from "../dto/auth/loginUser.dto";
import MailService from "./mail.service";

class UserService {
    private _userRepository: UserRepository;
    private _mailService: MailService;

    constructor() {
        this._userRepository = new UserRepository();
        this._mailService = new MailService();
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
     * @dev This method checks if a user exists. Returns either the user or (null | throw an error)
     * @param id 
     */
    async findUserById(id: UserDTO["id"]) {
        const user = await this._userRepository.findById(id);
        return user;
    }

    /**
     * @dev Send verify mail token
     * @param email
     */
    async sendVerificationCode(email: UserDTO["email"]) {
        // Create verify mail token
        const verifyMailToken = await jwt.sign(
            { email: email },
            process.env.JWT_VERIFY_MAIL_TOKEN,
            { expiresIn: "10m" }
        )

        // Send user mail
        this._mailService.sendVerifyMail(email, {
            token: verifyMailToken
        });
    }

    /**
     * @dev Creates a user if user doesn't exist
     * @param email 
     * @param username
     * @param password
     */
    async register(data: CreateNewUserDTO) {
        // Check if user already exists
        const user = await this._userRepository.findByEmail(data.email);

        // Throw an error if user exists
        if (user) {
            throw new Error("User already exists");
        }

        // Hash password if user doesn't exist
        const hashedPassword = await bcrypt.hash(data.password, 10);
            
        const newUser = {
            ...data,
            password: hashedPassword
        };

        // Store user in database
        this._userRepository.create(newUser);

        // Send verification code
        await this.sendVerificationCode(data.email);

        return true;
    }

    /**
     * @dev Login user service
     * @param email
     * @param password
     */
    async login(data: LoginUserDTO) {
        // Check if user exists
        const user = await this._userRepository.findByEmail(data.email);

        if (!user.valid) {
            throw new Error("User is unverified");
        }

        // Throw error if user doesn't exists
        if (!user) {
            throw new Error("User not found");
        }

        // Compare payload password to hashed password
        const isPasswordEquallyMatched = await bcrypt.compare(data.password, user.password);

        if (!isPasswordEquallyMatched) {
            throw new Error("Invalid Credentials");
        }

        // Create access token & Session
        const userInfo = {
            userId: user.id,
            role: user.role
        };

        const token = await jwt.sign(
            userInfo,
            process.env.JWT_ACCESS_TOKEN,
            { expiresIn: "1w" }
        );
        const refreshToken = await jwt.sign(
            userInfo,
            process.env.JWT_ACCESS_TOKEN
        );

        return { token, refreshToken };
    }

    /**
     * @dev Verifies user mail
     * @payload token
     */
    async verifyUserMail(token: string) {
        const userData = jwt.verify(token, process.env.JWT_VERIFY_MAIL_TOKEN)
        
        if (!userData) {
            throw new Error("Invalid Token");
        }

        // Check user
        const user = await this._userRepository.findByEmail(userData.email);

        if (!user) {
            throw new Error("User not found");
        }

        // Validate user
        this._userRepository.validateUser(userData.email);
    }

    /**
     * @dev Resnd user verification code
     * @param email
     */
    async resendVerificationCode(email: UserDTO["email"]) {
        // Check user
        const user = await this._userRepository.findByEmail(email);

        // Throw an error if user doesn't exist
        if (!user) {
            throw new Error("User not found");
        }

        // Throw an error if user is already verified
        if (user.valid) {
            throw new Error("User is already validated");
        }

        // Send verification code
        await this.sendVerificationCode(email);
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