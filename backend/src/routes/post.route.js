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
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/fileUploadStorage");
const router = require("express").Router();

router.post('/create', authMiddleware ,upload.single('images'), createPost);
router.get('/:id', getPost);
router.get('/', getPosts);
router.get('/category/:id', getPostsByCategory);
router.get('/location', getPostsByLocation);
router.get('/user/:id', getPostsByUser);
router.get('/valid', getValidPost);
router.get('/ordered', getPostByDateBefore);
router.get('/user/:id', getUserByEmail);



module.exports = router;