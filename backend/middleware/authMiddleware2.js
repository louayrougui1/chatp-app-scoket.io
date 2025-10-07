const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const protect2 = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.refreshToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.jwt_secret);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(401);
        throw new Error("User no longer exists");
      }

      next();
    } catch (err) {
      res.status(401);
      throw new Error("not authorized,invalid token");
    }
  } else {
    res.status(401);
    throw new Error("not authorized,no token");
  }
});

module.exports = protect2;
