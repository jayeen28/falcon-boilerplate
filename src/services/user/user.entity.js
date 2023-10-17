const TABLE_NAME = 'user';

module.exports.create = ({ db }) => async (req, res, next) => {
  try {
    const user = await db.create({ table: TABLE_NAME, payload: { data: req.body } });
    return res.status(201).send(user);
  } catch (e) { next(e) }
};

module.exports.get = ({ db }) => async (req, res, next) => {
  try {
    const user = await db.findOne({ table: TABLE_NAME, payload: { where: { id: parseInt(req.params.id) } } });
    if (!user) return res.status(404).send({ message: 'Not found' });
    return res.status(200).send(user);
  } catch (e) { next(e) }
};

module.exports.getAll = ({ db }) => async (req, res, next) => {
  try {
    const users = await db.find({ table: TABLE_NAME, payload: { query: req.query } });
    return res.status(200).send(users);
  } catch (e) { next(e) }
};

module.exports.update = ({ db }) => async (req, res, next) => {
  try {
    const user = await db.update({ table: TABLE_NAME, payload: { id: parseInt(req.params.id), data: req.body } });
    return res.status(200).send(user);
  } catch (e) { next(e) }
};

module.exports.remove = ({ db }) => async (req, res, next) => {
  try {
    const user = await db.softDelete({ table: TABLE_NAME, payload: { id: parseInt(req.params.id) } });
    return res.status(200).send(user);
  } catch (e) { next(e) }
};