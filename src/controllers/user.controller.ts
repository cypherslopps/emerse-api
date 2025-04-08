import { NextFunction } from "express"
import UserService from "../services/user.service";

const userService = new UserService();

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
    getUser
}