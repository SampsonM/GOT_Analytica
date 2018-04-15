let PersonalityInsights = require("watson-developer-cloud/personality-insights/v3");
const Twit = require("twit");
const fs = require("fs");
let TWITTER_key = {};
let username, password;

if (process.env.NODE_ENV === 'production') {
  TWITTER_key.consumerKey = process.env.twitter__consumer_key;
  TWITTER_key.consumerSecret = process.env.twitter_consumerSecret;
  TWITTER_key.accessToken = process.env.twitter_accessToken;
  TWITTER_key.accessTokenSecret = process.env.twitter_accessTokenSecret;
  username = process.env.WATSON_USERNAME;
  password = process.env.WATSON_PASS;
} else {
  TWITTER_key =  require("../config/twitter").key;
  username = require("../config/bluemix").personalityConfig.username;
  password = require("../config/bluemix").personalityConfig.password;
}
const pi = new PersonalityInsights({
  username,
  password,
  version_date: "2017-12-12"
})

var T = new Twit({
  consumer_key: TWITTER_key.consumerKey,
  consumer_secret: TWITTER_key.consumerSecret,
  access_token: TWITTER_key.accessToken,
  access_token_secret: TWITTER_key.accessTokenSecret,
  timeout_ms: 60 * 1000
})

function getTweets(handle) {
  return T.get("statuses/user_timeline", {
    screen_name: handle,
    count: 500
  }).then(tweets => {
    for (let key in tweets) {
      if (key === "data") {
        return (tweets[key].map(tweet => tweet.text));
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
  let tweets
  let twit_name  = req.query.twitter_name
  getTweets(twit_name)
    .then(tweetTexts => {
      if(tweetTexts.join('').split(' ').length < 1000) return null;
      return getPersonalityInsight(JSON.stringify(tweetTexts));
    })
    .then(i => {
      if (i === null) return getCharacter(7, res);
      if (i.personality[2].children[1].percentile > 0.9) {
        return getCharacter(0, res);
      } else if (i.personality[3].children[5].percentile > 0.99) {
        return getCharacter(1, res);
      } else if (i.personality[4].children[0].percentile > 0.93) {
        return getCharacter(2, res);
      } else if (i.needs[2].percentile > 0.8) {
        return getCharacter(3, res);
      } else if (i.personality[2].children[2].percentile < 0.2) {
        return getCharacter(4, res);
      } else if (i.personality[3].children[2].percentile < 0.75) {
        return getCharacter(6, res);
      } else if (i.personality[3].children[3].percentile > 0.7) {
        return getCharacter(5, res);
      } else {
        return getCharacter(8, res);
      }
    })
    .catch(next)
}

function getCharacter(int, res) {
  fs.readFile(`${process.cwd()}/db/characters.json`, "utf-8", (err, data) => {
    if (err) {
      console.log({ error: err + 'in get CHAR Func'});
    } else {
      data = JSON.parse(data);
      res.render('player', { data: data[int] });
    }
  })
}

module.exports = {
  getCharacterInfo
}
