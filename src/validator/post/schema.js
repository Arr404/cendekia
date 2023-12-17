const Joi = require('joi');

const PostPayloadSchema = Joi.object({
  description: Joi.string().required(),
  kategori: Joi.string().required(),
  subCategory: Joi.string().required(),
  picture: Joi.string().required()
});

module.exports = { PostPayloadSchema };
