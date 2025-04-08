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
                role,
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
                token, 
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
        // if (email) {
        //     // Check if user exists
        //     const user = await userService.findUserByEmail(email);
            
        //     if (!user) {
        //         res.status(404).json({ message: "User does not exist" });
        //     }

        //     // Create token
        //     const token = jwt.sign(
        //         { userId: user.id },
        //         process.env.JWT_ACCESS_TOKEN,
        //         { expiresIn: "15m" }
        //     );
        //     res.cookie("access_fk", token, {
        //         maxAge: 15 * 60 * 1000,
        //         httpOnly: true,
        //         sameSite: "strict",
        //         secure: process.env.NODE_ENV !== "development"
        //     });

        //     res.status(200).json({
        //         message: `${process.env.FRONTEND_URL}?token=${token}&email=${user.email}`
        //     });
        // } else {
        //     res.status(409).json({ message: "Check email payload" })
        // }
    } catch (error) {
        next(error)
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
        // if (email && token && newPassword) {
        //     // Check if user exists
        //     const user = await userService.findUserByEmail(email);
            
        //     if (!user) {
        //         res.status(404).json({ message: "User does not exist" });
        //     }

        //     // Verify token
        //     const verifiedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

        //     // Handle error if token is invalid
        //     if (!verifiedToken) {
        //         res.status(401).json({ message: "Invalid token" });
        //     }

        //     // Compare both passwords
        //     const isEquallyMatched = await userService.comparePassword(user.password, newPassword);
            
        //     if (isEquallyMatched) {
        //         res.status(409).json({ 
        //             message: "Use a different password"
        //         });
        //     }

        //     // Hash new password
        //     const hashedPassword = await userService.hashPassword(newPassword);

        //     // Update password
        //     const response = await userService.updateUserPassword(user.id, hashedPassword);

        //     res.status(200).json({
        //         message: response
        //     });
        // } else {
        //     res.status(409).json({ message: "Check payload" })
        // }
    } catch (error) {
        next(error)
    }
};

/**
 * @dev logs out user. Only authorized user can log out
 */
const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.cookies?.jwt) {
            res.clearCookie("jwt");
            res.setHeader("Location", "/auth/login");
            res.end();
        }
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