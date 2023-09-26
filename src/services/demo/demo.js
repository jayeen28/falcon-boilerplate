const { demo } = require("./demo.entity")

module.exports = function () {
    this.router.get('/demo', demo(this));
    this.io.on('connection', (socket) => console.log('socket connected1', socket.id))
    this.io.on('connection', (socket) => console.log('socket connected2', socket.id))
}