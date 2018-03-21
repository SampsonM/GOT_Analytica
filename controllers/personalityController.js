let PersonalityInsights = require('watson-developer-cloud/personality-insights/v3')
const {
  personalityConfig: { username, password }
} = require('../config/bluemix')
let personalityRes;

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
      content_type: 'text/plain'
    },
    (err, insight) => {
      let traits = insight.personality
      let totalPercent = traits.reduce((acc, trait) => {
        return acc + trait.percentile
      }, 0)
      personalityRes = totalPercent / traits.length
      compareRes(personalityRes)
      res.json({ insight })
    })
}

function compareRes(personalityResult) {
  
}
  

module.exports = {
  analysePersonality
}