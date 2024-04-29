const { register } = require('./user.entity');

/**
 * INSTRUCTIONS:
 * 1. Call api and socket handler functions from entity file (ex: user.entity.js).
 */

/**
 * Define API routes for user management.
 */
function userApi() {

  /**
   * POST /user/register/:role
   * @description This route is used to create a user.
   * @response {Object} 201 - The new user.
   * @body {Object} - The data to create a user.
  */
  this.router.post('/user/register/:role', register(this));
}

/**
 * Register event handlers for user related events.
 */
function userSocket() {

  // this.socket.on('demo', demoHandlerFromEntity(this));
}

module.exports = { userApi, userSocket };