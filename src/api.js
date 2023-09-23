const protocol = require(process.env.NODE_ENV === 'production' ? 'https' : 'http');
const path = require('path');
const fs = require('fs');
const appMiddlewares = require('./appMiddlewares');
const services = require('./services');
const dboperations = require('./db/prisma/dboperations');

module.exports = class Api {
    constructor(_settings, _express) {
        this.express = _express;
        this.app = this.express();
        this.router = new this.express.Router();
        this.appPath = path.resolve();
        this.config = _settings;
        this.db = dboperations;
    }
    start() {
        const server = protocol.createServer({
            key: fs.readFileSync(path.join(this.appPath, 'ssl', 'key.key')),
            cert: fs.readFileSync(path.join(this.appPath, 'ssl', 'cert.crt')),
        }, this.app);

        appMiddlewares.call(this);
        services.call(this);

        this.app.get('*', (req, res) => {
            res.sendFile(path.join(this.appPath, 'client', 'index.html'));
        });

        server.listen(this.config.port || 4000, () => console.info(`server is up on port ${this.config.port}`));
    }
};