const AppError = require("../utils/error")

const handleAppError = ({ error, res }) =>
  res.status(error.statusCode).json({ success: false, message: error.message })

const errorHandler = (error, req, res, next) => {
  console.log(`PATH ${req.path}:`, error)

  if (error instanceof AppError) {
    return handleAppError({ error, res })
  }

  return res.status(500).json({ success: false, message: 'Internal server error.'})
}

module.exports = errorHandler