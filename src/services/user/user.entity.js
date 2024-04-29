const bcrypt = require('bcrypt');

module.exports.register = ({ db }) => async (req, res, next) => {
  try {
    const { role } = req.params;
    let { first_name, last_name, phone, email, password } = req.body;
    password = await bcrypt.hash(password, 8);
    await db.execute(`CALL register(?, ?, ?, ?, ?, ?)`, [first_name, last_name, phone, email, password, role]);
    res.status(201).send({ message: 'User registration successful' });
  } catch (e) { next(e) }
};