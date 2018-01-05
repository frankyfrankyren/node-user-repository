var DomainError = function (msg) {
  Error.call(this, msg);
  this.message = msg;
};

DomainError.prototype = new Error();
DomainError.prototype.constructor = DomainError;

module.exports = DomainError;