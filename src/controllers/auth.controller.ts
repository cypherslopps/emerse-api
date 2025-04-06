import { Request, Response } from "express";
import  asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import UserService from "../services/user.service";
import { CreateNewUserDTO } from "../dto/auth/createNewUser.dto";
import { LoginUserDTO } from "../dto/auth/loginUser.dto";

const userService = new UserService();

/**
 * #dev registerUser controller create a new user if user doesn't already exist
 * @payload { email, username, password }
 */
const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, username, password }: CreateNewUserDTO = req.body;

    try {
        if (email && username && password) {
            // Check if user already exists
            const user = await userService.findUserByEmail(email);

            // Throw an error if user exists
            if (user) {
                res.status(400).json({ message: "User already exists" });
            }

            // Create new user
            const response = await userService.createUser({
                email,
                username,
                password
            });
            
            res.status(201).json({ message: response });
        } else {
            res.status(409).send("Check payloads");
        }
    } catch (err) {
        res.status(500).json({ message: err?.message ?? "An error occured"});
    }
});

/**
 * @dev loginUser controller signs in user. 
 * @payload { username, password }
 */
const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password }: LoginUserDTO = req.body;
    
    try {
        if (email && password) {
            // Check if user exists
            const user = await userService.findUserByEmail(email);

            // Throw error if user doesn't exists
            if (!user) {
                res.status(404).json({ message: "User does not exist!" });
            }

            // Compare payload password to hashed password
            const isPasswordEquallyMatched = await userService.comparePassword(user.password, password);
            
            if (!isPasswordEquallyMatched) {
                res.status(400).json({
                    message: "Invalid Credentials"
                });
            }

            // Create access token & Session
            const token = await jwt.sign(
                { userId: user.id },
                process.env.JWT_ACCESS_TOKEN,
                { expiresIn: "1w" }
            );
            const refreshToken = await jwt.sign(
                { userId: user.id },
                process.env.JWT_ACCESS_TOKEN
            );

            res.cookie("jwt", token, {
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV !== "development"
            });
            
            // Send successful message & code
            res.status(200).json({ token, refreshToken });
        } else {
            res.status(409).send("Check payloads");
        }
    } catch (err) {
        res.status(500).json({ message: err?.message || "An error occured" });
    }
});

/**
 * @dev Forgot Password - Sends link to user for changing password
 * @param email
 */
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
        if (email) {
            // Check if user exists
            const user = await userService.findUserByEmail(email);
            
            if (!user) {
                res.status(404).json({ message: "User does not exist" });
            }

            // Create token
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_ACCESS_TOKEN,
                { expiresIn: "15m" }
            );
            res.cookie("access_fk", token, {
                maxAge: 15 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV !== "development"
            });

            res.status(200).json({
                message: `${process.env.FRONTEND_URL}?token=${token}&email=${user.email}`
            });
        } else {
            res.status(409).json({ message: "Check email payload" })
        }
    } catch (err) {
        res.status(500).json({ message: err?.message ?? "An error occured" });
    }
});

/**
 * @dev Forgot Password - Sends link to user for changing password
 * @param email - User email
 * @param token - Valid token for verification
 * @param newPassword - New password
 */
const resetPassword = asyncHandler(async (req, res) => {
    const { token, email, newPassword } = req.body;

    try {
        if (email && token && newPassword) {
            // Check if user exists
            const user = await userService.findUserByEmail(email);
            
            if (!user) {
                res.status(404).json({ message: "User does not exist" });
            }

            // Verify token
            const verifiedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

            // Handle error if token is invalid
            if (!verifiedToken) {
                res.status(401).json({ message: "Invalid token" });
            }

            // Compare both passwords
            const isEquallyMatched = await userService.comparePassword(user.password, newPassword);
            
            if (isEquallyMatched) {
                res.status(409).json({ 
                    message: "Use a different password"
                });
            }

            // Hash new password
            const hashedPassword = await userService.hashPassword(newPassword);

            // Update password
            const response = await userService.updateUserPassword(user.id, hashedPassword);

            res.status(200).json({
                message: response
            });
        } else {
            res.status(409).json({ message: "Check payload" })
        }
    } catch (err) {
        res.status(500).json({ message: err?.message ?? "An error occured" });
    }
});


export {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
}