var IdAlreadyExistError = function (id) {
  var message = "Id '" + id + "' already exists";
  Error.call(this, message);
  this.message = message;
};

IdAlreadyExistError.prototype = new Error();
IdAlreadyExistError.prototype.constructor = IdAlreadyExistError;

module.exports = IdAlreadyExistError;