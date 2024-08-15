const AppError = require("../utils/error");
const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
  const token = req.cookies?.user_token;
  console.log(token)
  if (!token) return next(new AppError(401, 'Unauthentcated'))

  jwt.verify(token, process.env.JWT_USER_SECRET_KEY, (err, data) => {
    if (err) return next(new AppError(403, "Token is not valid!"));
    req.user = data.userId;
    next();
  });
};

module.exports = authenticate
