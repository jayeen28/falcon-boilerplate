/**
 * Represents the API server configuration and initialization.
 * @class
 */
const protocol = require(process.env.NODE_ENV === 'production' ? 'https' : 'http');
const path = require('path');
const fs = require('fs');
const appMiddlewares = require('./appMiddlewares');
const services = require('./services');
const dboperations = require('./db/prisma/dboperations');

module.exports = class Api {
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
    }

    /**
     * Start the API server.
     */
    start() {
        /**
         * Create an HTTP or HTTPS server based on the environment.
         */
        const server = protocol.createServer({
            key: fs.readFileSync(path.join(this.appPath, 'ssl', 'key.key')),
            cert: fs.readFileSync(path.join(this.appPath, 'ssl', 'cert.crt')),
        }, this.app);

        // Call middleware setup
        appMiddlewares.call(this);

        // Call services setup
        services.call(this);

        /**
         * Handle GET requests by serving the client's index.html.
         */
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(this.appPath, 'client', 'index.html'));
        });

        /**
         * Listen for incoming connections on the specified port.
         */
        server.listen(this.config.port || 4000, () => console.info(`Server is up on port ${this.config.port}`));
    }
};
