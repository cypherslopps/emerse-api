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
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_1 = __importDefault(require("../repository/user.repository"));
class UserService {
    constructor() {
        this._userRepository = new user_repository_1.default();
    }
    /**
     * @dev This method checks if a user exists. Returns either the user or (null | throw an error)
     * @param email
     */
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByEmail(email);
            return user;
        });
    }
    /**
     * @dev Hash user password
     * @param password
     */
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            return hashedPassword;
        });
    }
    /**
     * @dev Compare user password
     * @param password
     */
    comparePassword(userPassword, payloadPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPasswordEquallyMatched = yield bcrypt_1.default.compare(payloadPassword, userPassword);
            return isPasswordEquallyMatched;
        });
    }
    /**
     * @dev Creates a user if user doesn't exist
     * @param email
     * @param username
     * @param password
     */
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Hash password if user doesn't exist
            const hashedPassword = yield this.hashPassword(data.password);
            const newUser = Object.assign(Object.assign({}, data), { password: hashedPassword });
            // Store user in database
            this._userRepository.create(newUser);
            // Return message after successfully adding user
            return "Successfully added user";
        });
    }
    /**
     * @dev Update user password
     * @param userId - UserDTO["id"]
     * @param oldPassword - UserDTO["password"]
     * @param newPassword - UserDTO["password"]
     */
    updateUserPassword(userId, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._userRepository.updatePassword(userId, newPassword);
            return "Password successfully updated";
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map