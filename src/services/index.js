const { demoApi, demoSocket } = require("./demo/demo");
const { errorMiddleware } = require("./middlewares");

function apiServices() {
  demoApi.call(this);
  this.router.use(errorMiddleware(this))
};

function socketServices() {
  demoSocket.call(this);
};

module.exports = { apiServices, socketServices };