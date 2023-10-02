const gracefulShutdown = require("./hooks/gracefulShutdown");

module.exports = function () {
    gracefulShutdown.call(this);
}