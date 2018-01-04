var nedb = require('nedb');
var User = require('../domain/user');

var NedbUserRepository = function createNedbUserRepository() {
  // Improvement: will create domain errors for Controllers to handle
  function transformToDomainError(nedbError) {
    return nedbError;
  }

  function transformToDomainUsers(dbModels) {
    if (!dbModels) {
      return null;
    }

    return dbModels.map(transformToDomainUser);
  }

  function transformToDomainUser(dbModel) {
    if (!dbModel) {
      return null;
    }

    var user = new User(dbModel);
    user.set("id", dbModel._id);
    return user;
  }

  function transformToDbModel(domainUser) {
    var data = Object.assign({}, domainUser.data);
    data.created = new Date();
    data._id = data.id;
    delete data.id;
    return data;
  }

  this.database = new nedb();

  this.createUser = function createUser(domainUser, handleResponse) {

    var dbModel = transformToDbModel(domainUser);

    this.database.insert(dbModel, function (err, newDoc) {
      if (err) {
        console.log(err)
      }

      handleResponse(transformToDomainError(err), transformToDomainUser(newDoc))
    })
  };

  this.getUserById = function getUserById(id, handleResponse) {

    this.database.findOne({_id: id}, function (err, doc) {
      if (err) {
        console.log(err)
      }

      handleResponse(transformToDomainError(err), transformToDomainUser(doc))
    })
  };

  this.getUsers = function getUsers(responseCallback) {

    this.database.find({}, function (err, docs) {
      if (err) {
        console.log(err)
      }

      responseCallback(transformToDomainError(err), transformToDomainUsers(docs))
    })
  };

  this.updateUser = function updateUser(id, updates, responseCallback) {

    this.database.update({_id: id}, {$set: updates}, {}, function (err, numReplaced) {
      if (err) {
        console.log(err)
      }

      responseCallback(transformToDomainError(err), numReplaced)
    })
  };

  this.removeUser = function removeUser(id, responseCallback) {

    this.database.remove({_id: id}, {}, function (err, numRemoved) {
      if (err) {
        console.log(err)
      }

      responseCallback(transformToDomainError(err), numRemoved)
    })
  };

  return this;
};

module.exports = NedbUserRepository;
