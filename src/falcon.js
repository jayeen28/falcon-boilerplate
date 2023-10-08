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
const startupMiddlewares = require('./startupMiddlewares');
const hooksCaller = require('./hooksCaller');
const EventEmitter = require('events');

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
     * The absolute path for saving api error logs.
     * @member {string}
     */
    this.apiErrorPath = path.join(this.appPath, 'apiError.log');

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

    /**
     * An EventEmitter instance used for inter-component communication within the application.
     * This emitter allows various parts of the application to communicate and emit events.
     *
     * @member {EventEmitter}
     */
    this.emitter = new EventEmitter();
  }

  /**
   * Wake up the falcon and make it ready to fly
   */
  wake() {
    try {
      /**
       * Create an HTTP or HTTPS server based on the environment.
       */
      this.server = protocol.createServer({
        ...process.env.NODE_ENV === 'production' && {
          key: fs.readFileSync(path.join(this.appPath, 'ssl', 'key.key')),
          cert: fs.readFileSync(path.join(this.appPath, 'ssl', 'cert.crt')),
        }
      }, this.app);

      this.io = new Server(this.server, {
        cors: {
          origin: this.config.origin,
          methods: ['GET', 'POST'],
          credentials: true
        }
      });

      // Call hooks setup
      hooksCaller.call(this);

      // Call middleware setup
      startupMiddlewares.call(this);

      // Call services setup
      services.apiServices.call(this);
      return true;
    }
    catch (e) {
      console.log(e);
      return false
    }
  }

  /**
   * Starts the server and handles incoming connections.
   */
  fly() {
    /**
     * Handle GET requests by serving the client's index.html.
     * This ensures that the client-side application loads correctly.
     */
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(this.appPath, 'client', 'index.html'));
    });

    /**
     * Listen for incoming connections on the specified port.
     * If a custom port is provided in the configuration, it will be used;
     * otherwise, the default port 4000 will be used.
     * A log message is printed to the console to indicate that the server is running.
     */
    this.server.listen(this.config.port || 4000, () => console.info(`Server is up on port ${this.config.port}`));

    /**
     * Register socket services for every connection.
     * This allows Socket.IO-based services to be available to clients
     * as soon as they connect to the server.
     */
    this.io.on('connection', (socket) => {
      console.log(`Connected with socket. ID: ${socket.id}`);
      services.socketServices.call({ ...this, socket });
      socket.on('disconnect', () => console.log(`Disconnected from socket. ID: ${socket.id}`))
    });
  }
};
