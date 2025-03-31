const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/auth.route");
const authMiddleware = require("./middlewares/auth.middleware");
const  upload = require("./middlewares/fileUploadStorage");
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use("/api/auth", userRoute);

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
