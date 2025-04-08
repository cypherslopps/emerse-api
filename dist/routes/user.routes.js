"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const roles_middlewares_1 = require("../middlewares/roles.middlewares");
// Controllers
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
/**
 * @dev Get all users
 * @returns UserDTO[]
 */
userRouter.get("/", auth_middleware_1.authenticate, (0, roles_middlewares_1.authorizedRoles)("admin"), (req, res) => { res.json({ title: "ALL USERS" }); });
/**
 * @dev Get authenticated user
 * @returns UserDTO[]
 */
userRouter.get("/me", auth_middleware_1.authenticate, (0, roles_middlewares_1.authorizedRoles)("customer", "admin"), user_controller_1.getUser);
/**
 * @dev Get all users
 * @returns UserDTO[]
 */
userRouter.get("/users", (req, res) => { });
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map