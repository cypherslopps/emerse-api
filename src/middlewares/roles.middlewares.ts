export const authorizedRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: false,
                message: "Access denied"
            });
        }

        next();
    }
}