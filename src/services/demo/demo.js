const { create, get, getAll, update, remove } = require('./demo.entity');

/**
 * INSTRUCTIONS:
 * 1. Call api and socket handler functions from entity file (ex: demo.entity.js).
 */

/**
 * Define API routes for demo management.
 */
function demoApi() {

  /**
   * POST /demo
   * @description This route is used to create a demo.
   * @response {Object} 201 - The new demo.
   * @body {Object} - The data to create a demo.
  */
  this.router.post('/demo', create(this));

  /**
   * GET /demo
   * @description This route is used to get all demos.
   * @response {Object} 200 - The paginated demos.
   * @response {Array} 200 - The demos without paginations.
  */
  this.router.get('/demo', getAll(this));

  /**
   * GET /demo/:id
   * @description This route is used to get a demo.
   * @response {Object} 200 - The demo.
  */
  this.router.get('/demo/:id', get(this));

  /**
   * PATCH /demo/:id
   * @description This route is used to update a demo.
   * @response {Object} 200 - The updated demo.
   * @body {Object} - The data to update a demo.
  */
  this.router.patch('/demo/:id', update(this));

  /**
   * DELETE /demo/:id
   * @description This route is used to remove a demo.
   * @response {Object} 200 - The removed demo.
  */
  this.router.delete('/demo/:id', remove(this));
}

/**
 * Register event handlers for demo related events.
 */
function demoSocket() {

  // this.socket.on('demo', demoHandlerFromEntity(this));
}

module.exports = { demoApi, demoSocket };