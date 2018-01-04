var express = require('express');
var router = express.Router();

var User = require('../domain/user');

/* GET users listing. */
var UserListController = function createUserListController(userRepository) {
  router.get('/', function (req, res, next) {
    userRepository.getUsers(function (err, domainUsers) {
      if (err) {
        console.log(err);
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
