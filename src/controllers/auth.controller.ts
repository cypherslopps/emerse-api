import { NextFunction, Request, Response } from "express";

import UserService from "../services/user.service";
import { CreateNewUserDTO } from "../dto/auth/createNewUser.dto";
import { LoginUserDTO } from "../dto/auth/loginUser.dto";

// User Service
const userService = new UserService();

/**
 * #dev registerUser controller create a new user if user doesn't already exist
 * @payload { email, username, password }
 */
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, role, password }: CreateNewUserDTO = req.body;

    try {
        if (email && username && password) {
            // Create user
            await userService.register({
                email,
                username,
                role: role ?? "customer",
                password
            });
            
            res.status(201).json({ 
                status: true,
                message: "Successfully added user" 
            });
        } else {
            throw new Error("Check payloads");
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @dev loginUser controller signs in user. 
 * @payload { username, password }
 */
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: LoginUserDTO = req.body;
    
    try {
        if (email && password) {
            const { token, refreshToken } = await userService.login({
                email,
            password
            });

            res.cookie("jwt", token, {
                maxAge: 60 * 60 * 60 * 24 * 7,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV !== "development"
            });
            
            // Send successful message & code
            res.status(200).json({ 
                status: true,
                accessToken: token, 
                refreshToken 
            });
        } else {
            throw new Error("Check payloads");
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @dev Verifies user email after successful registration
 * @param token - Unique token sent to mail
 * @param email - User email
 */
const verifyUserMail = async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    try {
        if (code) {
            await userService.verifyUserMail(code);
            res.status(200).json({
                status: true,
                message: "Verification complete"
            });
        }
    } catch (error) {
        next(error);
    }  
}

/**
 * @dev Resend verification token after it expires
 * @param email - User email 
 */
const resendVerificationCode = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    try {
        if (email) {
            await userService.resendVerificationCode(email);
            res.status(200).json({
                status: true,
                message: "Verification code resent successfully"
            });
        }
    } catch (error) {
        next(error);
    }
}

/**
 * @dev Forgot Password - Sends link to user for changing password
 * @param email
 */
const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    try {
        if (email) {
            await userService.sendResetPasswordToken(email);
            res.status(200).json({
                status: true,
                message: "Token sent to user mail"
            });
        } else {
            res.status(409).json({ message: "Check email payload" })
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @dev Forgot Password - Sends link to user for changing password
 * @param email - User email
 * @param token - Valid token for verification
 * @param newPassword - New password
 */
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { token, email, newPassword } = req.body;

    try {
        await userService.resetUserPassword(
            email,
            token,
            newPassword
        );

        res.status(200).json({
            status: true,
            message: "Password successfully reset"
        });
    } catch (error) {
        next(error)
    }
};

/**
 * @dev logs out user. Only authorized user can log out
 */
const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.logout(() => {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(500).send('Could not log out');
                }
                res.redirect("/api/auth/login");
            });
        });

        // Clear cookies if it exists
        if (req?.cookies.jwt) {
            res.clearCookie("jwt");
        }
        
        res.status(200).json({
            status: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        next(error)
    }
}


export {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    logout,
    verifyUserMail,
    resendVerificationCode
}