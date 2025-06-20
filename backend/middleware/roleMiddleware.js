// Middleware to check user role (e.g., 'admin')
const roleMiddleware = (requiredRole) => {
    return (req,res,next) => {
       if (req.user && req.user.role === requiredRole){//the user is logged in and their details were stored in the request and the role matches
        next();// user has correct role, continue
       }
       else{
        return res.status(403).send('Forbidden: You do not have access')
       }
    };
};

module.exports = roleMiddleware;