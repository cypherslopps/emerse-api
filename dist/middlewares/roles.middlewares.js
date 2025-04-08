"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizedRoles = void 0;
const authorizedRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log(allowedRoles);
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: false,
                message: "Access denied"
            });
        }
        next();
    };
};
exports.authorizedRoles = authorizedRoles;
//# sourceMappingURL=roles.middlewares.js.map