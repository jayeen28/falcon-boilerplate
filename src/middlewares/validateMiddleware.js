// Required modules
const pick = require('../utils/cherryPick');
const joi = require('joi');

/**
 * @module exports.validate
 * @description This module provides a middleware function for request body validation using Joi.
 *
 * @param {Object} schema - A Joi schema object defining expected request data structure and validation rules.
 * @param {boolean} [allowUnknown=false] - (Optional) Whether to allow properties in the request that are not defined in the schema. Defaults to `false`.
 *
 * @returns {Function} A middleware function that validates the request body against the provided schema.
 *
 * @example
 * ```javascript
 * const validateEmail = validate(validVerifyEmailSchema);
 *
 * this.router.get('/user/verifyemail', validateEmail, verifyEmail(this));
 * ```
 *
 * This example validates the request on the `/user/verifyemail` route using the `validVerifyEmailSchema` schema.
 */
module.exports = function validate(schema, allowUnknown = false) {
  return (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body', 'files']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = joi.compile(validSchema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(object, { allowUnknown });

    if (error) {
      // const errorMessage = error.details.map((details) => details.message).join(', ');
      // console.log(errorMessage);
      return res.status(400).send({ message: 'Invalid payload' });
    }

    Object.assign(req, value);
    return next();
  };
}