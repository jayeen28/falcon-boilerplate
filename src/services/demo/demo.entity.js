const demo = ({ db }) => (req, res) => {
    try {
        res.status(200).send({ message: 'demo success' });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: 'something went wrong' });
    }
}

module.exports = { demo };