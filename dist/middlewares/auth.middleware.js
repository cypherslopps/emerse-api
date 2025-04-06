"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a, _b;
    const jwtCookieToken = (_b = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt) !== null && _b !== void 0 ? _b : null;
    if (jwtCookieToken === null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(jwtCookieToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
        if (err)
            return res.sendStatus(401);
        req.user = user;
        next();
    });
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.middleware.js.map