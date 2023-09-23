const demo = ({ db }) => async (req, res) => {
    try {
        await db.create({ table: 'user', payload: { body: { email: 'md.jayeen@gmail.com' } } })
        res.status(200).send({ message: 'demo success' });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: 'something went wrong' });
    }
}

module.exports = { demo };