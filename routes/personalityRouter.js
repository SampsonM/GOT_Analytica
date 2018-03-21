const personalityRouter = require('express').Router()
const {
  getCharacterInfo
} = require('../controllers/personalityController')

personalityRouter.get('/:twit_name', getCharacterInfo)

module.exports = personalityRouter