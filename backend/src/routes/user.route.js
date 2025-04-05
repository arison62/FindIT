const {getUserByEmail} = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();
router.get('/user/:id', getUserByEmail);

module.exports = router;