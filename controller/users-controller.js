const { selectAllUsers, selectByUsername } = require("../model/users-model");

function getUsers(req, res, next) {
  const { username } = req.params;

  if (username === undefined) {
    selectAllUsers()
      .then((users) => {
        res.status(200).send({ users });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    selectByUsername(username).then((user) => {
      res.status(200).send({ user });
    }).catch((err) => {
      next(err)
    })
  }
}

module.exports = getUsers;
