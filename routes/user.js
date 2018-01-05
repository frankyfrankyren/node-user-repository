var express = require('express');
var router = express.Router();
var validate = require('express-validation');
var validation = require('../validation/user');

var DomainError = require('../error/domain-error');
var IdAlreadyExistError = require('../error/id-already-exist-error');
var IdNotFoundError = require('../error/id-not-found-error');
var InvalidModelError = require('../error/invalid-model-error');

var User = require('../domain/user');

var UserController = function createUserController(userRepository) {
  /* create new user */
  router.post('/create', validate(validation.create), function (req, res, next) {
    userRepository.createUser(new User(req.body), function (err, domainUser) {
      if (err) {
        console.error(err.message);

        switch (err.constructor) {
          case IdAlreadyExistError:
            return res.sendStatus(409);
          case InvalidModelError:
          case DomainError:
          default:
            return res.sendStatus(500);
        }
      }

      res.sendStatus(201);
    })
  });

  /* get user by id */
  router.get('/:id', validate(validation.get), function (req, res, next) {
    userRepository.getUserById(req.params.id, function (err, domainUser) {
      if (err) {
        console.error(err.message);

        switch (err.constructor) {
          case IdNotFoundError:
            return res.sendStatus(404);
          case DomainError:
          default:
            return res.sendStatus(500);
        }
      }

      res.send(domainUser.data);
    })
  });

  /* update user by id */
  router.post('/update/:id', validate(validation.update), function (req, res, next) {
    userRepository.updateUser(req.params.id, req.body, function (err, numUpdated) {
      if (err) {
        console.error(err.message);

        switch (err.constructor) {
          case IdNotFoundError:
            return res.sendStatus(404);
          case DomainError:
            return res.sendStatus(500);
        }
      }

      res.sendStatus(204);
    });
  });

  /* delete user by id */
  router.delete("/:id", validate(validation.delete), function (req, res, next) {
    userRepository.removeUser(req.params.id, function (err, numRemoved) {
      if (err) {
        console.error(err.message);

        switch (err.constructor) {
          case IdNotFoundError:
            return res.sendStatus(404);
          case DomainError:
            return res.sendStatus(500);
        }
      }

      res.sendStatus(204);
    });
  });

  return router;
};

module.exports = UserController;
