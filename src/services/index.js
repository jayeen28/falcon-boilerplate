const demo = require("./demo/demo");

function apiServices() {
    demo.api.call(this);
};

function socketServices(socket) {
    demo.socket.call(this);
};

module.exports = { apiServices, socketServices };