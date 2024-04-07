module.exports = function (timeZone = 'Asia/Dhaka') {
  const today = new Date();
  const options = { timeZone };
  const bdDate = new Date(today.toLocaleString('en-US', options));

  return [bdDate.getFullYear(), bdDate.getMonth() + 1, bdDate.getDate(), bdDate.getHours(), bdDate.getMinutes(), bdDate.getSeconds()];
}