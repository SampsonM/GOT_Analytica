const personalityRouter = require('express').Router()
const {
  analysePersonality
} = require('../controllers/personalityController')

personalityRouter.post('/', analysePersonality)

module.exports = personalityRouter;