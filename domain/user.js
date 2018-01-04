var schemas = require('./schemas.js');
var _ = require('lodash');

var User = function (data) {
  if (!(this instanceof User)) return new User(data);

  this.data = this.sanitize(data);
};

User.prototype.data = {};

User.prototype.get = function (name) {
  return this.data[name];
};

User.prototype.set = function (name, value) {
  this.data[name] = value;
};

User.prototype.sanitize = function (data) {
  data = data || {};
  var schema = schemas.user;
  return _.pick(_.defaults(data, schema), _.keys(schema));
};

module.exports = User;