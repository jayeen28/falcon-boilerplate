const jwt = require('jsonwebtoken');
const cookie = require('cookie');

module.exports = function ({ config, db }) {
  return () => {
    return async function (req, res, next) {
      try {
        const token = cookie.parse(req.headers.cookie || '')[config.AUTH_COOKIE_KEY];
        if (!token) return res.status(401).send({ message: 'Unauthorized' });
        const data = jwt.verify(token, config.JWT_SECRET);
        // NOTE: //might need some fixes here.
        const [[user] = []] = await db.execute(`CALL find_user(?,)`, [data.user_id]);
        if (!user) return res.status(401).send({ message: 'Unauthorized' });
        req.user = user;
        next();
      }
      catch (e) {
        next(e);
      }
    }
  }
}