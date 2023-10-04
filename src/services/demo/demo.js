const { errorMiddleware } = require("../middlewares");
const { demo, demoHit } = require("./demo.entity")

function api() {
    this.router.get('/demo', demo(this), errorMiddleware(this));
}

function socket() {
    this.socket.on('hit', demoHit(this));
}

module.exports = { api, socket };