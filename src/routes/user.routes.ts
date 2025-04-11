import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizedRoles } from "../middlewares/roles.middlewares";

// Controllers
import {
    getAllUsers,
    getUser
} from "../controllers/user.controller";

const userRouter = express.Router();

/**
 * @dev Get all users
 * @returns UserDTO[]
 */
userRouter.get("/", authenticate, authorizedRoles("admin"), getAllUsers);

/**
 * @dev Get authenticated user
 * @returns UserDTO[]
 */
userRouter.get("/me", authenticate, authorizedRoles("customer", "admin"), getUser);



export default userRouter;