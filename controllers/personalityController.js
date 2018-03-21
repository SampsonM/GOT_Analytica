const PersonalityInsights = require('watson-developer-cloud/personalityInsights/v3')
const {
  personalityConfig: { username, password }
} = require('../config/bluemix')

const pi = new PersonalityInsights({
  username,
  password,
  version_date: '2017-12-12'
})

function analysePersonality (req, res, next) {
  const { content } = req.body
  pi.profile(
    {
      content,
      content_type: 'text/plan'
    },
    (err, insight) => {
      res.json({ insight })
    })
}

module.exports = {
  analysePersonality
}