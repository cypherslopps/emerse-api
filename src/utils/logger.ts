import { NextFunction, Request, Response } from "express";

function logger(req: Request, res: Response, next: NextFunction) {
    const today = new Date(Date.now());
    console.log(`|----[${today.toISOString()}] ROUTE[${req.originalUrl}]`);
    next()
}

export default logger;