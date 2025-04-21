const {getUser} = require("../controllers/user.controller");
const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
router.get('/users/:id', authMiddleware ,getUser);

module.exports = router;