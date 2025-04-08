import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizedRoles } from "../middlewares/roles.middlewares";

// Controllers
import {
    getUser
} from "../controllers/user.controller";

const userRouter = express.Router();

/**
 * @dev Get all users
 * @returns UserDTO[]
 */
userRouter.get("/", authenticate, authorizedRoles("admin"), (req, res) => { res.json({ title: "ALL USERS" }) });

/**
 * @dev Get authenticated user
 * @returns UserDTO[]
 */
userRouter.get("/me", authenticate, authorizedRoles("customer", "admin"), getUser);

/**
 * @dev Get all users
 * @returns UserDTO[]
 */
userRouter.get("/users", (req, res) => {});

export default userRouter;