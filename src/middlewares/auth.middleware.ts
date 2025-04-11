import jwt from "jsonwebtoken";
import UserService from "../services/user.service";

const userService = new UserService();

// Verify Google Access token
const verifyGoogleToken = async (token: string) => {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
    
    if (response.ok) {
        const payload = await response.json();
        return payload;
    } 

    return null;
}


// Authenticate Requests
const authenticate = async (req, res, next) => {
    let token;
    const cookieToken = req.cookies?.jwt ?? null;

    if ((req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) || cookieToken) {
        token = req.headers.authorization?.split(" ")[1];
    }

    if (token === null) return res.sendStatus(401);

    try {
        // Check if token is Google Oauth Token
        const payload = await verifyGoogleToken(token);
        
        if (payload) {
            const authUser = await userService.findUserByEmail(payload.email);
            
            // Throw error if user doesn't exist
            if (!authUser) {
                res.sendStatus(401);
            }

            req.user = {
                userId: authUser.id,
                role: authUser.role
            };
            next();
        } else {
            // Verify JWT token if Auth Token is invalid
            const user = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
            req.user = user;
            next(); 
        }
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
}


export {
    authenticate
};