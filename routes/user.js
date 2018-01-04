var express = require('express');
var router = express.Router();
var validate = require('express-validation');
var validation = require('../validation/user');

var User = require('../domain/user');

var UserController = function createUserController(userRepository) {
  /* create new user */
  router.post('/create', validate(validation.create), function (req, res, next) {
    userRepository.createUser(new User(req.body), function (err, domainUser) {
      if (err) {
        console.log(err);
        res.sendStatus(409);
        return
      }

      res.sendStatus(201);
    })
  });

  /* get user by id */
  router.get('/:id', validate(validation.get), function (req, res, next) {
    userRepository.getUserById(req.params.id, function (err, domainUser) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return
      }

      if (!domainUser) {
        res.sendStatus(404);
        return
      }

      res.send(domainUser.data);
    })
  });

  /* update user by id */
  router.post('/update/:id', validate(validation.update), function (req, res, next) {
    userRepository.updateUser(req.params.id, req.body, function (err, numUpdated) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      if (numUpdated === 0) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(204);
    });
  });

  /* delete user by id */
  router.delete("/:id", validate(validation.delete), function (req, res, next) {
    userRepository.removeUser(req.params.id, function (err, numRemoved) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return
      }

      if (numRemoved === 0) {
        res.sendStatus(404);
        return
      }

      res.sendStatus(204);
    });
  });

  return router;
};

module.exports = UserController;
