const jsonwebtoken = require("jsonwebtoken");

module.exports = {
    generateToken: (user) => {
        return jsonwebtoken.sign({user}, process.env.JWT_SECRET, {expiresIn: "1d"});
    },
    verifyToken: (token) => {
        return jsonwebtoken.verify(token, process.env.JWT_SECRET);
    }
}