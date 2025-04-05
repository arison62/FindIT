const fs = require("fs");
const {Types: {ObjectId}} = require("mongoose");
const path = require("path");

const {User, Post, Category} = require("../models/models");

const createPost = async (req, res)=> {

    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({error: true, message: "Unauthorized"});
        }
        const {title, description, category, location, address} = req.body;
        if (!title || !description || !category) {
            return res.status(400).json({error: true, message: "All fields are required"});
        }
        if((!location || !location.coordinates || location.coordinates.length !== 2) && !address){
            return res.status(400).json({error: true, message: "Location is required"});
        }
        console.log("createPost");
        const newPost = new Post({
            user_id: new ObjectId(user.id),
            title,
            description,
            location,
            category: new ObjectId(category),
            date_found: req.body.date_found || null,
            is_anonymous: req.body.is_anonymous || false,
            status: req.body.status || "found",
            images: req.images.map((image) => {
                return {
                    image_url: image,
                    uploaded_at: new Date()
                }
            }
            )
        });
       
        const savedPost = await newPost.save();
        if (!savedPost) {
            return res.status(500).json({error: true, message: "Post not created"});
        }else{
            // rename tmp name folder to post id
            const dirname = process.cwd();
            const tmpPath = path.join(dirname, "public", "uploads", "posts", "tmp");
            const postPath = path.join(dirname, "public", "uploads", "posts", savedPost._id.toString());
            fs.renameSync(tmpPath, postPath);
        }

        return res.status(201).json({
            error: false,
            message: "Post created successfully",
            data: newPost
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal server error"});
    }
}

const deletePost = async (req, res)=> {
    try {
        const postId = req.params.id;
        if (!postId) {
            return res.status(400).json({error: true, message: "Post ID is required"});
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({error: true, message: "Post not found"});
        }
        await Post.deleteOne({_id: postId});
        return res.status(200).json({
            error: false,
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal server error"});
    }
}

const getPost = async (req, res)=> {
    try {
        const postId = req.params.id;
        if (!postId) {
            return res.status(400).json({error: true, message: "Post ID is required"});
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({error: true, message: "Post not found"});
        }
        return res.status(200).json({
            error: false,
            message: "Post found successfully",
            data: post
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal server error"});
    }
}
// with pagination max 100 posts
const getPosts = async (req, res)=> {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 100;
        const skip = (page - 1) * limit;
        const posts = await Post.find().skip(skip).limit(limit);
        return res.status(200).json({
            error: false,
            message: "Posts found successfully",
            data: posts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal server error"});
    }
}
// get posts by category
const getPostsByCategory = async (req, res)=> {
    try {
        const categoryId = req.params.id;
        if (!categoryId) {
            return res.status(400).json({error: true, message: "Category ID is required"});
        }
        const posts = await Post.find({category: categoryId});
        if (!posts) {
            return res.status(404).json({error: true, message: "Posts not found"});
        }
        return res.status(200).json({
            error: false,
            message: "Posts found successfully",
            data: posts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal server error"});
    }
}
// get posts location nearby or same address
// GeoJSON
const getPostsByLocation = async (req, res)=> {
    try {
        const location = req.body.location;
        const address = req.body.address;
        if (!location && !address) {
            return res.status(400).json({error: true, message: "Location or address is required"});
        }
        const query = {};
        if (location) {
            query.location = {
                $near: {
                    $geometry: location,
                    $maxDistance: 10000
                }
            };
        }
        if (address) {
            query.address = address;
        }
        const posts = await Post.find(query);
        if (!posts) {
            return res.status(404).json({error: true, message: "Posts not found"});
        }
        return res.status(200).json({
            error: false,
            message: "Posts found successfully",
            data: posts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal server error"});
    }
}

// get posts by user
const getPostsByUser = async (req, res)=> {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({error: true, message: "User ID is required"});
        }
        const posts = await Post.find({
            user_id: userId
        });
        if(!posts){
            return res.status(404).json({error: true, message: "Post not found"});
        }else{
            return res.status(200).json({
                error: false,
                message: "Post found successfully",
                data: posts
            });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: true,
            message: "Internal server error"
        })
    }
}

// valid post #status: lost or found

const getValidPost = (req, res)=>{
    const page = req.query.page || 1;
    const limit = req.query.limit || 100;
    const skip = (page - 1) * limit;

    Post.find({$or: [{status: "found"}, {status: "lost"}]})
        .skip(skip)
        .limit(limit)
        .then((posts) => {
            if (!posts) {
                return res.status(404).json({error: true, message: "Posts not found"});
            }
            return res.status(200).json({
                error: false,
                message: "Posts found successfully",
                data: posts
            });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({error: true, message: "Internal server error"});
        });
}

const getPostByDateBefore = (req, res)=>{
    const page = req.query.page || 1;
    const limit = req.query.limit || 100;
    const skip = (page - 1) * limit;

    const date = req.query.date;
    const status = req.query.status;
    const query = []
    if(status){
        query.push({status: status})
    }else{
        query.push({status: "lost"});
        query.push({status: "found"});
    }
    Post.find({
        created_at: {
            $lt: new Date(date)
        },
        $or : query
    }).skip(skip)
    .limit(limit)
    .then((posts) => {
        if (!posts) {
            return res.status(404).json({error: true, message: "Posts not found"});
        }
        return res.status(200).json({
            error: false,
            message: "Posts found successfully",
            data: posts
        });
    })
    .catch((error) => {
        console.error(error);
        return res.status(500).json({error: true, message: "Internal server error"});
    })

}


const createCategory = async (req, res)=> {
    try {
        const newCategory = new Category({
            name: req.body.name
        });
        await newCategory.save();
        return res.status(201).json({
            error: false,
            message: "Category created successfully",
            data: newCategory
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}

const getCategories = async (req, res)=> {
 
    try {
        const categories = await Category.find();
        return res.status(200).json({
            error: false,
            message: "Categories found successfully",
            data: categories
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}

module.exports = {
    createCategory, 
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
}