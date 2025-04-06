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
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
const user = {
    id: 3,
    email: "josephibok@gmail.com",
    username: "username",
    password: "password"
};
class UserRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return [user];
        });
    }
    findById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield dbConfig_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
            return response.rows.length ? response.rows[0] : null;
        });
    }
    updatePassword(id, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield dbConfig_1.default.query("UPDATE users SET password = $1 WHERE id = $2;", [newPassword, id]);
            return response.rowCount === 1;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield dbConfig_1.default.query("INSERT INTO users (email, username, password) VALUES ($1, $2, $3)", [
                    data.email,
                    data.username,
                    data.password
                ]);
                const done = (response === null || response === void 0 ? void 0 : response.rowCount) === 1;
                return done;
            }
            catch (err) {
                throw new Error("An error occurred when registering user.");
            }
        });
    }
    update(data, email) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = UserRepository;
//# sourceMappingURL=user.repository.js.map