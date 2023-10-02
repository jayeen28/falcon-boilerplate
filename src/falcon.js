/**
 * Represents the API server configuration and initialization.
 * @class
 */
const protocol = require(process.env.NODE_ENV === 'production' ? 'https' : 'http');
const path = require('path');
const fs = require('fs');
const services = require('./services');
const dboperations = require('./db/prisma/dboperations');
const fileCtrl = require('./controllers/fileCtrl');
const { Server } = require('socket.io');
const registerMiddlewares = require('./registerMiddlewares');
const registerHooks = require('./registerHooks');

module.exports = class Falcon {
    /**
     * Create an instance of the Api class.
     * @constructor
     * @param {object} _settings - Configuration settings for the API.
     * @param {object} _express - Express.js instance.
     */
    constructor(_settings, _express) {
        /**
         * The Express.js instance.
         * @member {object}
         */
        this.express = _express;

        /**
         * The Express.js application instance.
         * @member {object}
         */
        this.app = this.express();

        /**
         * The Express.js router instance.
         * @member {object}
         */
        this.router = new this.express.Router();

        /**
         * The absolute path to the application.
         * @member {string}
         */
        this.appPath = path.resolve();

        /**
         * Configuration settings for the API.
         * @member {object}
         */
        this.config = _settings;

        /**
         * Database operations module.
         * @member {object}
         */
        this.db = dboperations;

        /**
         * Necessary file operations.
         * @member {object}
         */
        this.fileCtrl = fileCtrl;
    }

    /**
     * Wake up the falcon and make it ready to fly
     */
    wake() {
        /**
         * Create an HTTP or HTTPS server based on the environment.
         */
        this.server = protocol.createServer({
            key: fs.readFileSync(path.join(this.appPath, 'ssl', 'key.key')),
            cert: fs.readFileSync(path.join(this.appPath, 'ssl', 'cert.crt')),
        }, this.app);

        this.io = new Server(this.server, {
            cors: {
                origin: this.config.origin,
                methods: ['GET', 'POST'],
                credentials: true
            }
        });

        // Call hooks setup
        registerHooks.call(this);

        // Call middleware setup
        registerMiddlewares.call(this);

        // Call services setup
        services.apiServices.call(this);
        this.io.on('connection', (socket) => services.socketServices.call({ ...this, socket }));//register socket services for every connection

        /**
         * Handle GET requests by serving the client's index.html.
         */
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(this.appPath, 'client', 'index.html'));
        });

        /**
         * Listen for incoming connections on the specified port.
         */
        this.server.listen(this.config.port || 4000, () => console.info(`Server is up on port ${this.config.port}`));
    }
};
