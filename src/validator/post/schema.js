const Joi = require('joi');

const PostPayloadSchema = Joi.object({
  userId: Joi.string().required(),
  description: Joi.string().required(),
  kategori: Joi.string().required(),
  subCategory: Joi.string().required(),
  picture: Joi.string().required()
});

module.exports = { PostPayloadSchema };
