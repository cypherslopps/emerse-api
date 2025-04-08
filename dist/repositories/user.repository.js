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
class UserRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield dbConfig_1.default.query("SELECT * FROM users");
            return response.rows.length ? response.rows[0] : null;
        });
    }
    findById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield dbConfig_1.default.query("SELECT id, email, username, role FROM users WHERE id = $1", [_id]);
            return response.rows.length ? response.rows[0] : null;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield dbConfig_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
            return response.rows.length ? response.rows[0] : null;
        });
    }
    validateUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield dbConfig_1.default.query("UPDATE users SET valid = $1 WHERE email = $2", [
                true,
                email
            ]);
            return response.rowCount === 1;
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
            var _a;
            try {
                const response = yield dbConfig_1.default.query("INSERT INTO users (email, username, role, password) VALUES ($1, $2, $3, $4)", [
                    data.email,
                    data.username,
                    (_a = data.role) !== null && _a !== void 0 ? _a : "customer",
                    data.password
                ]);
                const done = (response === null || response === void 0 ? void 0 : response.rowCount) === 1;
                return done;
            }
            catch (err) {
                console.log(err);
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