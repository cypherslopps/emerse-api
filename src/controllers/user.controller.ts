import { NextFunction } from "express"
import UserService from "../services/user.service";

const userService = new UserService();

/**
 * @dev Get all users - Admin
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.findAllUsers();
        res.status(200).json({
            status: true,
            users
        });
    } catch (error) {
        next(error);
    }
}

/**
 * @dev Get authenticated users
 */
const getUser = async (req, res, next) => {
    try {
        const user = await userService.findUserById(req.user?.userId);
        res.status(200).json({
            status: true,
            user
        });
    } catch (error) {
        next(error);
    }
}

export {
    getUser,
    getAllUsers
}