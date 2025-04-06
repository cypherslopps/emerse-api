"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logger(req, res, next) {
    const today = new Date(Date.now());
    console.log(`|----[${today.toISOString()}] ROUTE[${req.originalUrl}]`);
    next();
}
exports.default = logger;
//# sourceMappingURL=logger.middleware.js.map