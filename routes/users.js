var express = require('express');
var router = express.Router();

var UserListController = function createUserListController(userRepository) {
  /* gets user details for all users */
  router.get('/', function (req, res, next) {
    userRepository.getUsers(function (err, domainUsers) {
      if (err) {
        console.error(err.message);
        res.sendStatus(500);
        return
      }

      res.send(domainUsers.map(function (domainUser) {
        return domainUser.data;
      }));
    });
  });

  return router;
};

module.exports = UserListController;
