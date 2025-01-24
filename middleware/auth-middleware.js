
const jwt = require('jsonwebtoken');

const authmiddleware = (req, res, next) => {
    console.log('Auth middleware is called');
    
    const authheader = req.headers['authorization'];
    console.log(`Authorization Header: ${authheader}`);

    if (!authheader) {
        return res.status(401).json({
            success: false,
            message: "Access denied. Authorization header missing.",
        });
    }

    const token = authheader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. Token missing from header.",
        });
    }

    // Decode and verify the token
    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Decoded Token Info:", decodedTokenInfo);

        // Attach user info to the request object for later use
        req.userInfo = decodedTokenInfo;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid token.",
            error: error.message,
        });
    }
};

module.exports = authmiddleware;
