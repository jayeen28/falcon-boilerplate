const { demo } = require("./demo.entity")

module.exports = function () {
    this.router.get('/demo', demo(this));
    this.io.on('connection', (socket) => {
        socket.on('hello', () => console.log('hi'))
    });
    this.io.on('connection', (socket) => socket.disconnect())
}