var UserRepository = require('./user-repository');
var Nedb = require('nedb');
var User = require('../domain/user');
var DomainError = require('../error/domain-error');
var InvalidModelError = require('../error/invalid-model-error');
var IdAlreadyExistError = require('../error/id-already-exist-error');
var IdNotFoundError = require('../error/id-not-found-error');

var transformToDomainUsers = function transformToDomainUsers(dbModels) {
  if (!dbModels) {
    return null;
  }

  return dbModels.map(transformToDomainUser);
};

var transformToDomainUser = function transformToDomainUser(dbModel) {
  if (!dbModel) {
    return null;
  }

  var user = new User(dbModel);
  user.set("id", dbModel._id);
  return user;
};

var transformToDbModel = function transformToDbModel(domainUser) {
  if (!(domainUser instanceof User)) {
    throw new InvalidModelError(domainUser);
  }

  var data = Object.assign({}, domainUser.data);
  data.created = new Date();
  data._id = data.id;
  delete data.id;
  return data;
};

var NedbUserRepository = function createNedbUserRepository() {
  if (!(this instanceof NedbUserRepository)) return new NedbUserRepository();

  this.database = new Nedb();
};

NedbUserRepository.prototype = new UserRepository();
NedbUserRepository.prototype.constructor = NedbUserRepository;

NedbUserRepository.prototype.getUserById = function getUserById(id, handleResponse) {
  this.database.findOne({_id: id}, function (err, doc) {
    if (err) {
      console.error(err);
      handleResponse(new DomainError(err.message), doc);
      return;
    }

    if (!doc) {
      handleResponse(new IdNotFoundError(id), doc);
      return;
    }

    handleResponse(err, transformToDomainUser(doc));
  })
};

NedbUserRepository.prototype.createUser = function createUser(domainUser, handleResponse) {

  var dbModel;

  try {
    dbModel = transformToDbModel(domainUser);
  } catch (invalidModelErr) {
    handleResponse(invalidModelErr, null);
    return;
  }

  this.database.insert(dbModel, function (err, newDoc) {
    if (err) {
      console.error(err);

      if (err.errorType === 'uniqueViolated') {
        handleResponse(new IdAlreadyExistError(domainUser.id), null);
      } else {
        handleResponse(new DomainError(err.message));
      }

      return;
    }

    handleResponse(err, transformToDomainUser(newDoc));
  })
};

NedbUserRepository.prototype.getUsers = function getUsers(handleResponse) {

  this.database.find({}, function (err, docs) {
    if (err) {
      console.log(err);
      handleResponse(new DomainError(err.message), docs);
      return;
    }

    handleResponse(err, transformToDomainUsers(docs));
  })
};

NedbUserRepository.prototype.updateUser = function updateUser(id, updates, handleResponse) {

  this.database.update({_id: id}, {$set: updates}, {}, function (err, numReplaced) {
    if (err) {
      console.log(err);
      handleResponse(new DomainError(err.message), numReplaced === 1);
      return;
    }

    if (numReplaced === 0) {
      handleResponse(new IdNotFoundError(id), numReplaced === 1);
      return;
    }

    handleResponse(err, numReplaced === 1);
  })
};

NedbUserRepository.prototype.removeUser = function removeUser(id, handleResponse) {

  this.database.remove({_id: id}, {}, function (err, numRemoved) {
    if (err) {
      console.log(err);
      handleResponse(new DomainError(err.message), numRemoved === 1);
      return;
    }

    if (numRemoved === 0) {
      handleResponse(new IdNotFoundError(id), numRemoved === 1);
      return;
    }

    handleResponse(err, numRemoved === 1)
  })
};

module.exports = NedbUserRepository;
