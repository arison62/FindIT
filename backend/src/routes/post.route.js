const { createPost } = require("../controllers/post.controller");
const upload = require("../middlewares/fileUploadStorage");
const router = require("express").Router();

router.post('/create', upload.single('images'), createPost)

module.exports = router;