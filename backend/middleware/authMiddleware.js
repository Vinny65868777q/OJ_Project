const jwt = require('jsonwebtoken');

const Middleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({msg:"Access Denied: No Token provided"});
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);// Verify token using secret key
        req.user = verified; // store user info in request
        next(); // move to next middleware/route

    } catch (error) {
        return res.status(400).json({msg:'Invalid Token'});
    }

};

module.exports = Middleware;