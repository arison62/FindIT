const {
    createPost,
    deletePost,
    getPost,
    getPosts,
    getPostsByCategory,
    getPostsByLocation,
    getPostsByUser,
    getValidPost,
    getPostByDateBefore
} = require("../controllers/post.controller");
const upload = require("../middlewares/fileUploadStorage");
const router = require("express").Router();

router.post('/create', upload.single('images'), createPost);
router.get('/:id', getPost);
router.get('/', getPosts);
router.get('/category/:id', getPostsByCategory);
router.get('/location', getPostsByLocation);
router.get('/user/:id', getPostsByUser);
router.get('/valid', getValidPost);
router.get('/ordered', getPostByDateBefore)

module.exports = router;