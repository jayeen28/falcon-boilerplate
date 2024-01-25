/**
 * Represents the API server configuration and initialization.
 * @class
 */
import EventEmitter from 'events';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { Server, Socket } from 'socket.io';
import * as fileCtrl from './controllers/fileCtrl';
// import { FileCtrl } from './controllers/fileCtrl';
import dboperations from './db/prisma/dboperations';
import hooks from './hooks';
import services from './services';
import startupMiddlewares from './startupMiddlewares';
import express, { Express, Router } from 'express';

const protocol: any = process.env.NODE_ENV === 'production' ? https : http;

export default class Falcon {
  app: Express;
  express: typeof express;
  router: Router;
  appPath: string;
  config: any;
  apiErrorPath: string;
  db: any;
  fileCtrl: fileCtrl.FileCtrl;
  emitter: EventEmitter;
  server?: http.Server | https.Server;
  io?: Server;
  /**
   * Create an instance of the Api class.
   * @constructor
   * @param {object} _settings - Configuration settings for the API.
   * @param {object} _express - Express.js instance.
   */
  constructor(_settings: any, _express: typeof express) {
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
    this.router = this.express.Router();

    /**
     * The absolute path to the application.
     * @type {string}
     */
    this.appPath = path.resolve();

    /**
     * Configuration settings for the API.
     * @member {object}
     */
    this.config = _settings;

    /**
     * The absolute path for saving api error logs.
     * @member {string}
     */
    this.apiErrorPath = path.join(this.appPath, 'apiError.log');

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
      let serverOptions: any;

      if (process.env.NODE_ENV === 'production') {
        serverOptions = {
          key: fs.readFileSync(path.join(this.appPath, 'ssl', 'key.key')),
          cert: fs.readFileSync(path.join(this.appPath, 'ssl', 'cert.crt')),
        } as https.ServerOptions;
      }
      this.server = protocol.createServer(serverOptions, this.app);

      this.io = new Server(this.server, {
        cors: {
          origin: this.config.origin,
          methods: ['GET', 'POST'],
          credentials: true
        }
      });

      // Call hooks setup
      hooks.call(this);

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
    this.server?.listen(this.config.port || 4000, () => console.info(`Server is up on port ${this.config.port}`));

    /**
     * Register socket services for every connection.
     * This allows Socket.IO-based services to be available to clients
     * as soon as they connect to the server.
     */
    this.io?.on('connection', (socket) => {
      console.log(`Connected with socket. ID: ${socket.id}`);
      services.socketServices.call({ ...this, socket });
      socket.on('disconnect', () => console.log(`Disconnected from socket. ID: ${socket.id}`))
    });
  }
};
