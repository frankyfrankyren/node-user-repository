'use strict';

var Joi = require('joi');
var user = {};

user.create = {
  options: {allowUnknownBody: false},
  body: {
    id: Joi.string().required(),
    email: Joi.string().email().required(),
    forename: Joi.string().required(),
    surname: Joi.string().required()
  }
};

user.update = {
  options: {allowUnknownBody: false},
  params: {id: Joi.string().required()},
  body: {
    email: Joi.string(),
    forename: Joi.string(),
    surname: Joi.string()
  }
};

user.get = {
  params: {
    id: Joi.string().required()
  }
};

user.delete = {
  options: {allowUnknownBody: false},
  params: {id: Joi.string().required()},
  body: undefined
};

module.exports = user;