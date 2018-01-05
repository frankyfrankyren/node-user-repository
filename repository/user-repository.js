var UserRepository = function() {
  // if (this.constructor === UserRepository) {
  //   throw new Error("Can't instantiate abstract class!");
  // }
};

UserRepository.prototype.createUser = function (domainUser, handleResponse) {
  throw new Error("Abstract method!");
};

UserRepository.prototype.updateUser = function (id, updates, handleResponse) {
  throw new Error("Abstract method!");
};

UserRepository.prototype.getUserById = function (id, handleResponse) {
  throw new Error("Abstract method!");
};

UserRepository.prototype.getUsers = function (handleResponse) {
  throw new Error("Abstract method!");
};

UserRepository.prototype.removeUser = function (id, handleResponse) {
  throw new Error("Abstract method!");
};

module.exports = UserRepository;