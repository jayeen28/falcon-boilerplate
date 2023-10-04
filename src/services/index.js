const demo = require("./demo/demo");
const { errorMiddleware } = require("./middlewares");

function apiServices() {
    demo.api.call(this);
    this.router.use(errorMiddleware(this))
};

function socketServices() {
    demo.socket.call(this);
};

module.exports = { apiServices, socketServices };