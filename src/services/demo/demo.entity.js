const demo = ({ db }) => async (req, res, next) => {
    try {
        await db.create({ table: 'user', payload: { body: { email: 'md.jayeen@gmail.com' } } })
        return res.status(200).send({ message: 'demo success' });
    }
    catch (e) { next(e) }
}

const demoHit = ({ db, socket, io }) => (data) => {
    //do your stuffs and send event with socket or io.
};

module.exports = { demo, demoHit };