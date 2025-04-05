const {
    createPost,
    deletePost,
    getPost,
    getPosts,
    getPostsByCategory,
    getPostsByLocation,
    getPostsByUser,
    getValidPost,
    getPostByDateBefore,
    getCategories
} = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/fileUploadStorage");
const router = require("express").Router();

router.post('/create', authMiddleware ,upload.array('images'), createPost);
router.get('/', getPosts);
router.get('/category/:id', getPostsByCategory);
router.get('/categories', getCategories);
router.get('/location', getPostsByLocation);
router.get('/user/:id', getPostsByUser);
router.get('/valid', getValidPost);
router.get('/ordered', getPostByDateBefore);





module.exports = router;