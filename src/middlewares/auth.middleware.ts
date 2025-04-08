import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    let token;
    const cookieToken = req.cookies?.jwt ?? null;

    if ((req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) && cookieToken) {
        token = req.headers.authorization?.split(" ")[1];
    }

    if (token === null || cookieToken === null) return res.sendStatus(401);

    try {
        req.user = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
}


export {
    authenticate
};