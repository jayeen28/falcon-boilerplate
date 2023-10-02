const { demo, demoHit } = require("./demo.entity")

function api() {
    this.router.get('/demo', demo(this));
}

function socket() {
    this.socket.on('hit', demoHit(this));
}

module.exports = { api, socket };