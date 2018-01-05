var IdNotFoundError = function (id) {
  var message = "Id '" + id + "' not found";
  Error.call(this, message);
  this.message = message;
};

IdNotFoundError.prototype = new Error();
IdNotFoundError.prototype.constructor = IdNotFoundError;

module.exports = IdNotFoundError;