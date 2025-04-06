import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const jwtCookieToken = req.cookies?.jwt ?? null;

    if (jwtCookieToken === null) return res.sendStatus(401);

    jwt.verify(jwtCookieToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(401);
        req.user = user;
        next();
    });
}

export {
    verifyToken
};