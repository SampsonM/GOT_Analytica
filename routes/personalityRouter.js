const personalityRouter = require('express').Router()
const {
  getTweets
} = require('../controllers/personalityController')

personalityRouter.get('/:twit_name', getTweets)

module.exports = personalityRouter;