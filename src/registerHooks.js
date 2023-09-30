const shutdownCtrl = require("./controllers/shutdownCtrl");

module.exports = function () {
    shutdownCtrl.call(this);
}