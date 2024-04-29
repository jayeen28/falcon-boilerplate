const { errorMiddleware } = require("./middlewares");
const { userApi, userSocket } = require("./user/user");

function apiServices() {
  userApi.call(this);
  this.router.use(errorMiddleware(this))
};

function socketServices() {
  userSocket.call(this);
};

module.exports = { apiServices, socketServices };