const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({
    urlencoded: {
        extended: true
    }
}));


app.get("/desc", (req, res) => {
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
module.exports = app;
