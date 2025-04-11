"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getUser = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
const userService = new user_service_1.default();
/**
 * @dev Get all users - Admin
 */
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userService.findAllUsers();
        res.status(200).json({
            status: true,
            users
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
/**
 * @dev Get authenticated users
 */
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield userService.findUserById((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        res.status(200).json({
            status: true,
            user
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
//# sourceMappingURL=user.controller.js.map