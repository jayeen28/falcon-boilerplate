const TABLE_NAME = 'demo';

module.exports.create = ({ db }) => async (req, res, next) => {
  try {
    const demo = await db.create({ table: TABLE_NAME, payload: { data: req.body } });
    return res.status(201).send(demo);
  } catch (e) { next(e) }
};

module.exports.get = ({ db }) => async (req, res, next) => {
  try {
    const demo = await db.findOne({ table: TABLE_NAME, payload: { where: { id: parseInt(req.params.id) } } });
    if (!demo) return res.status(404).send({ message: 'Not found' });
    return res.status(200).send(demo);
  } catch (e) { next(e) }
};

module.exports.getAll = ({ db }) => async (req, res, next) => {
  try {
    const demos = await db.find({ table: TABLE_NAME, payload: { query: req.query } });
    return res.status(200).send(demos);
  } catch (e) { next(e) }
};

module.exports.update = ({ db }) => async (req, res, next) => {
  try {
    const demo = await db.update({ table: TABLE_NAME, payload: { id: parseInt(req.params.id), data: req.body } });
    return res.status(200).send(demo);
  } catch (e) { next(e) }
};

module.exports.remove = ({ db }) => async (req, res, next) => {
  try {
    const demo = await db.softDelete({ table: TABLE_NAME, payload: { id: parseInt(req.params.id) } });
    return res.status(200).send(demo);
  } catch (e) { next(e) }
};