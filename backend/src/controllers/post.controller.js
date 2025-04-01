const fs = require("fs");
const {Types: {ObjectId}} = require("mongoose");
const path = require("path");

const {User, Post, Category} = require("../models/models");
/**
   body {
      "title": "Post Title",
       "category": "Category ID",
     "description": "Post Description",
     "location": {
            "type": "Point",  
          "coordinates": [123, 456]
         },
    }

  
 */
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

module.exports = {createCategory, createPost}