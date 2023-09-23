const { demo } = require("./demo.entity")

module.exports = function () {
    this.router.get('/demo', demo(this))
}