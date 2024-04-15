const selectTopics = require("../model/topics-model");

function getTopics(req, res, next) {
  selectTopics().then((topics) => {
    // console.log({ topics });
    res.status(200).send({ topics });
  }).catch((err) => {
    next(err)
  })
}

module.exports = getTopics;