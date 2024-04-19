const getTopics = require("../controller/topics-controller");

const topicsRouter = require("express").Router();

topicsRouter.route('/').get(getTopics);

module.exports = topicsRouter