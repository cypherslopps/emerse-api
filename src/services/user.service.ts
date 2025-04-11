import bcrypt from "bcrypt";

import UserRepository from "../repositories/user.repository";
import jwt from "jsonwebtoken";
import { CreateGoogleAuthDTO, CreateNewUserDTO } from "../dto/auth/createNewUser.dto";
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
     * @dev Find all users
     */
    async findAllUsers() {
        const users = this._userRepository.findAll();
        return users;
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
     * @dev Find user by Google ID
     * @param google_id
     */
    async findUserByGoogleID(google_id: CreateGoogleAuthDTO["google_id"]) {
        const user = await this._userRepository.findByGoogleID(google_id);;
        return user;
    } 

    /**
     * @dev Check if user exists
     * @param email
     */
    async checksUserAvailability(email: UserDTO["email"]) {
        // Check if user exists
        const user = await this._userRepository.findByEmail(email);
        
        // Throw error if user doesn't exists
        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    /**
     * @dev Send verify mail token
     * @param email
     */
    async sendCodeToMail(email: UserDTO["email"], secretKey?: string) {
        try {
            const secretToken = secretKey ?? process.env.JWT_VERIFY_MAIL_TOKEN;

            // Create verify mail token
            const verifyMailToken = await jwt.sign(
                { email: email },
                secretToken,
                { expiresIn: "10m" }
            )

            // Send user mail
            this._mailService.sendVerifyMail(email, {
                token: verifyMailToken
            });
        } catch(error) {
            throw new Error(error?.message || "An error occured");
        }
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
            
        // New user payload
        const newUser = {
            ...data,
            password: hashedPassword
        };

        // Store user in database
        this._userRepository.create(newUser);

        // Send verification code
        await this.sendCodeToMail(data.email);

        return true;
    }

    /**
     * @dev Register OAuth user
     * @param google_id - Unique user Google ID
     * @param email - user email
     * @param displayName
     * @param email_verified
     */
    async registerAuthUser(data: CreateGoogleAuthDTO) {
        // Check user
        const doesGoogleIDExist = await this._userRepository.findByGoogleID(data.google_id);
        const doesUserEmailExist = await this._userRepository.findByEmail(data.email);

        if (doesGoogleIDExist || doesUserEmailExist) {
            throw new Error("User already exists");
        }

        // Create User
        this._userRepository.createAuth(data);
    }

    /**
     * @dev Login user service
     * @param email
     * @param password
     */
    async login(data: LoginUserDTO) {
        // Check if user exists
        const user = await this.checksUserAvailability(data.email);

        if (!user.valid) {
            throw new Error("User is unverified");
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
     * @dev Send user reset password token to mail
     * @param email
     */
    async sendResetPasswordToken(email: UserDTO["email"]) {
        // Check if user exists
        await this.checksUserAvailability(email);

        // Send Code
        await this.sendCodeToMail(email, process.env.JWT_RESET_PASSWORD_TOKEN);

        return true;
    }

    /**
     * @dev Reset user password
     * @param email
     * @param token
     * @param newPassword
     */
    async resetUserPassword(
        email: UserDTO["email"],
        token: string,
        newPassword: UserDTO["password"]
    ) {
        // Check if user exists
        const user = await this.checksUserAvailability(email);

        // Verify token
        const verifiedToken = jwt.verify(token, process.env.JWT_RESET_PASSWORD_TOKEN);

        // Handle error if token is invalid
        if (!verifiedToken) {
            throw new Error("Invalid token");
        }

        // Compare both passwords
        const isEquallyMatched = await bcrypt.compare(user.password, newPassword);
        
        if (isEquallyMatched) {
            throw new Error("Use a different password");
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        this._userRepository.updatePassword(user.id, hashedPassword);
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
        const user = await this.checksUserAvailability(userData.email);

        // Validate user
        this._userRepository.validateUser(user.email);
    }

    /**
     * @dev Resnd user verification code
     * @param email
     */
    async resendVerificationCode(email: UserDTO["email"]) {
        // Check user
        const user = await this.checksUserAvailability(email);

        // Throw an error if user is already verified
        if (user.valid) {
            throw new Error("User is already validated");
        }

        // Send verification code
        await this.sendCodeToMail(email);
    }
}

export default UserService;