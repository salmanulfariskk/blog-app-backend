const User = require("../models/userModel");
const catchError = require("../utils/catchError");
const AppError = require("../utils/error");
const securePassword = require("../utils/securePassword");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = catchError(async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await securePassword(password);
  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    throw new AppError(400, "Email has already been taken.");
  }
  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
  });

  const { password: abortPassword, ...userData } = user.toObject();

  return res
    .status(201)
    .json({ message: "successfully registered", status: true, userData });
});

const login = catchError(async (req, res) => {
  const { email, password } = req.body;
  const emailExist = await User.findOne({ email: email });
  if (!emailExist) {
    throw new AppError(401, "Account not found!");
  }
  const passCheck = await bcrypt.compare(password, emailExist.password);
  if (!passCheck) {
    throw new AppError(401, "Incorrect password.");
  }
  const userToken = jwt.sign(
    { userId: emailExist._id },
    process.env.JWT_USER_SECRET_KEY,
    { expiresIn: "7d" }
  );

  const userDataToSend = {
    _id: emailExist.id,
    name: emailExist.name,
    email: emailExist.email,
  };

  res
    .cookie("user_token", userToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    .status(200)
    .json({
      userData: userDataToSend,
      message: `Welcome ${emailExist.name}`,
    });
});

const logout = async (req, res) => {
  try {
    res.clearCookie("user_token");
    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
  logout,
};
