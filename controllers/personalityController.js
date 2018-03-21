let PersonalityInsights = require("watson-developer-cloud/personality-insights/v3");
const { key } = require("../config/twitter");
const Twit = require("twit");
const fs = require("fs");
let traits, need;

const {
  personalityConfig: { username, password }
} = require("../config/bluemix");

const pi = new PersonalityInsights({
  username,
  password,
  version_date: "2017-12-12"
});

var T = new Twit({
  consumer_key: key.consumerKey,
  consumer_secret: key.consumerSecret,
  access_token: key.accessToken,
  access_token_secret: key.accessTokenSecret,
  timeout_ms: 60 * 1000
});

function getTweets(handle) {
  return T.get("statuses/user_timeline", {
    screen_name: handle,
    count: 200
  }).then(tweets => {
    for (let key in tweets) {
      if (key === "data") {
        return (tweets[key].map(tweet => tweet.text))
      }
    }
  })
}

function getPersonalityInsight(content) {
  return new Promise((resolve, reject) => {
    pi.profile(
      {
        content,
        content_type: "text/plain"
      },
      (err, insight) => {
        if (err) reject(err);
        return resolve(insight);
      }
    )
  })
}

function getCharacterInfo(req, res, next) {
  let tweets;
  let { twit_name } = req.params;
  getTweets(twit_name)
    .then(tweetTexts => {
      if(tweetTexts.join('').split(' ').length < 1000) return null;
      else return getPersonalityInsight(JSON.stringify(tweetTexts))
    })
    .then(i => {q
      if (i === null) return getCharacter(7, res);
      if (i.personality[2].children[1].percentile > 0.9) {
        return getCharacter(0, res)
      } else if (i.personality[3].children[5].percentile > 0.8) {
        return getCharacter(1, res)
      } else if (i.personality[4].children[0].percentile > 0.83) {
        return getCharacter(2, res)
      } else if (i.needs[2].percentile > 0.8) {
        return getCharacter(3, res)
      } else if (i.personality[2].children[2].percentile < 0.3) {
        return getCharacter(4, res)
      } else if (i.personality[3].children[2].percentile < 0.3) {
        return getCharacter(5, res)
      } else if (i.personality[3].children[3].percentile > 0.8) {
        return getCharacter(6, res)
      } else {
        return getCharacter(8, res);
      }
    })
    .catch(next);
}

function getCharacter(int, res) {
  fs.readFile(`${process.cwd()}/db/characters.json`, "utf-8", (err, data) => {
    if (err) {
      console.log({ error: err })
    } else {
      data = JSON.parse(data)
      res.send(data[int])
    }
  });
}

module.exports = {
  getCharacterInfo
};
