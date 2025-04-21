const { default: mongoose } = require("mongoose");
const { User } = require("../models/models");
const { comparePassword, hashPassword } = require("../utils/password_utils");
const { generateToken, parseExpiration } = require("../utils/token_utils");

const signIn = async (req, res) => {

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    const isPasswordValid = await comparePassword(
      req.body.password,
      user.password_hash
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: true, message: "Invalid password" });
    }
    const token = generateToken({
      id: user._id,
      email: user.email,
    });

    return res
      .status(200)
      .json({
        error: false,
        message: "Login successful",
        data: {
          token: token,
          expire_in: Date.now() + parseExpiration(process.env.JWT_EXPIRATION),
        },
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const signUp = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(409)
        .json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await hashPassword(req.body.password);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password_hash: hashedPassword,
      is_anonymous: req.body.is_anonymous,
    });
    await newUser.save();
    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
    });
    return res.status(201).json({
      error: false,
      message: "User created successfully",
      data: {
        token: token,
        expire_in: Date.now() + parseExpiration(process.env.JWT_EXPIRATION),
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {

    const id = req.params.id;
    if(id == "me"){
      const {id} = req.user.user;
      console.log("me : ", id)
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          error: true,
          message: "Invalid user ID",
          data: null,
        });
      }
      const user = await User.findById(id).select("-password_hash");
      if (!user) {
        return res.status(404).json({
          error: true,
          message: "User not found",
          data: null,
        });
      }
      return res.status(200).json({
        error: false,
        message: "User retrieved successfully",
        data: user,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: true,
        message: "Invalid user ID",
        data: null,
      });
    }
    const user = await User.findById(id).select("-password_hash");
    console.log(id)
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
        data: null,
      });
    }
    return res.status(200).json({
      error: false,
      message: "User retrieved successfully",
      data: user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
      data: null,
    });
  }
};

module.exports = {
  signIn,
  signUp,
  getUser,
};
