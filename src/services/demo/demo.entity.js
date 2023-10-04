const demo = ({ db }) => async (req, res, next) => {
    try {
        // await db.create({ table: 'user', payload: { body: { email: 'md.jayeen@gmail.com' } } })
        // res.status(200).send({ message: 'demo success' });
        throw new Error('Hey')
    }
    catch (e) { next(e) }
}

const demoHit = ({ db, socket }) => (data) => {
    return socket.emit('hitBack', data);
};

module.exports = { demo, demoHit };