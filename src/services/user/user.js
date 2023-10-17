const { create, get, getAll, update, remove } = require('./user.entity');

/**
 * INSTRUCTIONS:
 * 1. Call api and socket handler functions from entity file (ex: user.entity.js).
 */

/**
 * Define API routes for user management.
 */
function userApi() {

  /**
   * POST /user
   * @description This route is used to create a user.
   * @response {Object} 201 - The new user.
   * @body {Object} - The data to create a user.
  */
  this.router.post('/user', create(this));

  /**
   * GET /user
   * @description This route is used to get all users.
   * @response {Object} 200 - The paginated users.
   * @response {Array} 200 - The users without paginations.
  */
  this.router.get('/user', getAll(this));

  /**
   * GET /user/:id
   * @description This route is used to get a user.
   * @response {Object} 200 - The user.
  */
  this.router.get('/user/:id', get(this));

  /**
   * PATCH /user/:id
   * @description This route is used to update a user.
   * @response {Object} 200 - The updated user.
   * @body {Object} - The data to update a user.
  */
  this.router.patch('/user/:id', update(this));

  /**
   * DELETE /user/:id
   * @description This route is used to remove a user.
   * @response {Object} 200 - The removed user.
  */
  this.router.delete('/user/:id', remove(this));
}

/**
 * Register event handlers for user related events.
 */
function userSocket() {

  // this.socket.on('demo', demoHandlerFromEntity(this));
}

module.exports = { userApi, userSocket };