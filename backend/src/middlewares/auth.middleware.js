const jsonwebtoken = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({error: true, message: "Unauthorized"});
    }else{
       
        try {
            const token = authorization.split(" ")[1];
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            
        } catch (error) {
            console.error(error);
            return res.status(401).json({error: true, message: "Unauthorized"});
        }
    }
    next();
}

module.exports = authMiddleware;