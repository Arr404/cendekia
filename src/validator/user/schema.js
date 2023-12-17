const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
  token: Joi.string().required(),
});

module.exports = { UserPayloadSchema };
