const { createCommentHandler } = require('../controllers/commentController')
const authenticate = require('../middlewares/authenticate')

const router = require('express').Router()

router.post('/', authenticate, createCommentHandler)

module.exports = router