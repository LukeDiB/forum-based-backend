const getUsers = require("../controller/users-controller");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers);

userRouter.route('/:username').get(getUsers)

module.exports = userRouter;
