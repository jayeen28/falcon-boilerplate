const { demoApi, demoSocket } = require("./demo/demo");
const { errorMiddleware } = require("./middlewares");
const { userApi, userSocket } = require("./user/user");

function apiServices() {
  demoApi.call(this);
  userApi.call(this);
  this.router.use(errorMiddleware(this))
};

function socketServices() {
  userSocket.call(this);
  demoSocket.call(this);
};

module.exports = { apiServices, socketServices };