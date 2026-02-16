const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please add all fields (name,email,password)");
  }
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }
  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    avatarURL: "",
  });

  if (user) {
    const accessToken = generateAccessToken(user._id);
    setCookie(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarURL: "",
      createdAt: user.createdAt,
      token: accessToken,
    });
  } else {
    res.status(400);
    throw new Error("invalid user data");
  }
});
const loginUser = asyncHandler(async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email) {
    res.status(400);
    throw new Error("please add all fields (password,email)");
  }
  const user = await User.findOne({ email: email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = generateAccessToken(user._id);
    setCookie(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      createdAt: user.createdAt,
      token: accessToken,
    });
  } else {
    res.status(400);
    throw new Error("invalid email/password");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax", // or whatever you used during setting
    path: "/", // Make sure to match the path used when setting the cookie
  });

  res.status(200).json({ message: "Logged out" });
});

const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatarURL: user.avatarURL,
    createdAt: user.createdAt,
  });
});

const editProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const { name } = req.body;
  if (req.file) {
    user.avatarURL = `/uploads/${req.file.filename}`;
  }
  const updatedFields = {
    name: name,
    avatarURL: user.avatarURL,
  };
  user.name = name || user.name;
  await User.findByIdAndUpdate(user._id, updatedFields);
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatarURL: user.avatarURL,
    createdAt: user.createdAt,
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error("No refresh token found");
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt_secret);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User no longer exists");
    }

    const accessToken = generateAccessToken(user._id);
    res.status(200);
    res.json({ accessToken });
  } catch (err) {
    res.status(401);
    throw new Error("Invalid or expired refresh token");
  }
});

//generate jwt

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.jwt_secret, {
    expiresIn: "15m",
  });
};
const setCookie = (res, id) => {
  const token = jwt.sign({ id }, process.env.jwt_secret, {
    expiresIn: "30d",
  });
  res.cookie("refreshToken", token, {
    httpOnly: true,
    //secure: process.env.NODE_ENV !== development,
    secure: false, // ✅ must be false for localhost (dev)
    sameSite: "Lax", // ✅ must be "Lax" or "None" ONLY IF secure is true
    maxAge: 7 * 24 * 3600 * 1000, // 7 days
    path: "/",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  editProfile,
  refreshAccessToken,
  logoutUser,
};
