const jsonwebtoken = require("jsonwebtoken");

module.exports = {
    generateToken: (user) => {
        return jsonwebtoken.sign({user}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});
    },
    verifyToken: (token) => {
        return jsonwebtoken.verify(token, process.env.JWT_SECRET);
    },
    parseExpiration: (expiration) => {
        const duration = parseInt(expiration); 
        const unit = expiration.slice(-1); 
        if (unit === 'd') {
            return duration * 24 * 60 * 60 * 1000; 
        }
        throw new Error('Unsupported expiration format');
    }
    
}