const jwt = require('jsonwebtoken');

const Middleware = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookie (not header)

    if (!token) {
        error.statusCode = 401;
        error.message = 'Invalid or expired token';
        return next(error);
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);// Verify token using secret key
        req.user = verified; // store user info in request
        next(); // move to next middleware/route

    } catch (error) {
        error.statusCode = 401;
        error.message = "Invalid or expired token";
        return next(error); //Forward custom error to error handler 

    }

};

module.exports = Middleware;