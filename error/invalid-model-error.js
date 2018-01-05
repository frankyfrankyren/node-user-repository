var InvalidModelError = function (model) {
  var message = "Invalid model detected '" + model + "'";
  Error.call(this, message);
  this.message = message;
};

InvalidModelError.prototype = new Error();
InvalidModelError.prototype.constructor = InvalidModelError;

module.exports = InvalidModelError;