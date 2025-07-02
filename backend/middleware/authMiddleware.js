const jwt = require('jsonwebtoken');

const Middleware = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookie (not header)

    if (!token) {
     return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);// Verify token using secret key
        req.user = verified; // store user info in request
        next(); // move to next middleware/route
    
   
    } catch (err) {
        return res.status(402).json({ message: "Unauthorized: Invalid token" });

    }

};

module.exports = Middleware;