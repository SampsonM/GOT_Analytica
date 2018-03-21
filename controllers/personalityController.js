let PersonalityInsights = require('watson-developer-cloud/personality-insights/v3')
const {
  personalityConfig: { username, password }
} = require('../config/bluemix')
const fs = require('fs')
let personalityRes;

const pi = new PersonalityInsights({
  username,
  password,
  version_date: '2017-12-12'
})

function analysePersonality(req, res, next) {
  const { content } = req.body
  pi.profile(
    {
      content,
      content_type: 'text/plain'
    },
    (err, insight) => {
      let traits = insight.personality;
      let needs = insight.needs;
      compareRes(traits, needs)
      res.json({ insight })
    })
}




function compareRes(traits, needs) {
  console.log(needs[2].percentile)
  if (traits[2].children[1].percentile > 0.9) {
    console.log('Cersei');
  } else
    if (traits[3].children[5].percentile > 0.9) {
      console.log('Jon Snow');
    } else
      if (traits[4].children[0].percentile > 0.9) {
        console.log('Daenerys Targaryen');
      } else
        if (needs[2].percentile > 0.9) {
          console.log('Samwell Tarly');
        } else
          if (traits[2].children[2].percentile < 0.2) {
            console.log('Grey Worm');
          } else
            if (traits[3].children[2].percentile < 0.2) {
              console.log('Tyrion Lannister');
            } else
              if (traits[3].children[3].percentile > 0.9) {
                console.log('Arya Stark');
              } else
                if (traits[4].children[2].percentile > 0.99) {
                  console.log('Hodor');
                }
}


// if (personalityResult > 0.4 && personalityResult < 0.5) {
//   fs.readFile(`${process.cwd()}/db/characters.json`, 'utf8', (err, data) => {
//     if (err) console.log(err);
//     data = (JSON.parse(data));



//     console.log(data[0]);
// JSON.parse(data);

// })
//     // }
//   }
// }



module.exports = {
  analysePersonality
}