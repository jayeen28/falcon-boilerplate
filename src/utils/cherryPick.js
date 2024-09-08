/**
 * Create an object composed of the cherry picked object properties
 * @param object
 * @param keys
 * @returns
 */
module.exports = function (object, keys) {
  return keys.reduce((obj, key) => {
    if (obj && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
}