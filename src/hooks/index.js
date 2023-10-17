const gracefulShutdown = require("./gracefulShutdown");

module.exports = function () {
  gracefulShutdown.call(this);
}