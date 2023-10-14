const createStartupFiles = require("./createStartupFiles");
const gracefulShutdown = require("./gracefulShutdown");

module.exports = function () {
  createStartupFiles.call(this);
  gracefulShutdown.call(this);
}