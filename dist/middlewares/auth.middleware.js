"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    var _a, _b, _c;
    let token;
    const cookieToken = (_b = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt) !== null && _b !== void 0 ? _b : null;
    if ((req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) && cookieToken) {
        token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[1];
    }
    if (token === null || cookieToken === null)
        return res.sendStatus(401);
    try {
        req.user = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_TOKEN);
        next();
    }
    catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map