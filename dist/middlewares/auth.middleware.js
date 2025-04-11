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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = __importDefault(require("../services/user.service"));
const userService = new user_service_1.default();
// Verify Google Access token
const verifyGoogleToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
    if (response.ok) {
        const payload = yield response.json();
        return payload;
    }
    return null;
});
// Authenticate Requests
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let token;
    const cookieToken = (_b = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt) !== null && _b !== void 0 ? _b : null;
    if ((req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) || cookieToken) {
        token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[1];
    }
    if (token === null)
        return res.sendStatus(401);
    try {
        // Check if token is Google Oauth Token
        const payload = yield verifyGoogleToken(token);
        if (payload) {
            const authUser = yield userService.findUserByEmail(payload.email);
            // Throw error if user doesn't exist
            if (!authUser) {
                res.sendStatus(401);
            }
            req.user = {
                userId: authUser.id,
                role: authUser.role
            };
            next();
        }
        else {
            // Verify JWT token if Auth Token is invalid
            const user = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_TOKEN);
            req.user = user;
            next();
        }
    }
    catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
});
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map