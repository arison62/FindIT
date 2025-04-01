const express = require("express");
const multer = require("multer");
const cors = require("cors");
const userRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const authMiddleware = require("./middlewares/auth.middleware");
const app = express();
const updload = multer()

app.use(cors());
// app.use(updload.none());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));


app.use("/api/auth", userRoute);
app.use("/api/post", authMiddleware, postRoute)
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
