const express = require("express");
const multer = require("multer");
const cors = require("cors");
const userAuthRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const userRoute = require("./routes/user.route");
const chatRoute = require("./routes/chat.route");
const authMiddleware = require("./middlewares/auth.middleware");
const upload = require("./middlewares/fileUploadStorage");
const app = express();


const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true, // Autorise les cookies/sessions
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  };

app.use(cors(corsOptions));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));



app.use("/api/auth", upload.none() ,userAuthRoute);
app.use("/api", userRoute);
app.use("/api/posts", postRoute)
app.use("/api/chat", chatRoute);  
app.get("/desc", authMiddleware ,(req, res) => {
    console.log(req.images);
    res.status(200).json({
        error: false,
        message: "",
        data: {
            titre: "FindIT",
            description: "Plateforme de retrouvailles d'objets",
            version: "1.0.0"
        }

    })
})

app.use("*", (req, res) => {
    res.status(404).json({
        error: true,
        message: "Route not found"
    })
})
module.exports = app;
