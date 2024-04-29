const localDateTimeParts = require('./localDateTimeParts');
const getLimitOffset = require('./getLimitOffset');

module.exports = function () {
  return {
    localDateTimeParts,
    getLimitOffset
  }
}