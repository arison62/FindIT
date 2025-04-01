const multer = require("multer");
const path = require("path");
const uuid = require("uuid");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isImage = file.mimetype.startsWith("image/");
        if (!isImage) {
            return cb(new Error("Only image files are allowed!"));
        }
        //Image max size 50MB
        const maxSize = 50 * 1024 * 1024;
        
        if (file.size > maxSize) {
            return cb(new Error("File size is too large!"));
        }
        const dirname = process.cwd();
        fs.mkdirSync(path.join(dirname, "public", "uploads", "posts", "tmp"), { recursive: true });
        const pathDir = path.join(dirname, "public", "uploads", "posts", "tmp");
        
        cb(null, pathDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const fileName = `${uuid.v4()}${ext}`;
        
        if(req.images && req.images.length > 0){
            req.images.push(fileName);
        }else{
            req.images = [fileName];
        }
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

module.exports = upload;