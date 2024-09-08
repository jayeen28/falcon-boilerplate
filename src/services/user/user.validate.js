const joi = require('joi');

module.exports.validateUserRegister = {
  body: joi.object().keys({
    first_name: joi.string().required().max(255),
    last_name: joi.string().required().max(255),
    phone: joi.string().max(20),
    email: joi.string().email().required().max(52),
    password: joi.string().required().min(5).max(50),
    role: joi.string().required().max(10),
  }),
};