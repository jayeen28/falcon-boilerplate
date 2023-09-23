require('dotenv').config();
const { NODE_ENV } = process.env;
const protocol = require(NODE_ENV === 'production' ? 'https' : 'http');
const settings = require(`../settings/${NODE_ENV === 'production' ? 'prod.js' : 'dev.js'}`);
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

class Api {
    constructor() {
        this.app = express();
        this.router = new express.Router();
        this.appPath = path.resolve();
        this.config = settings;
    }
    start() {
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
            standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        })

        this.app.use(cors({
            origin: this.config.origin,
            methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
            credentials: true
        }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use('/api', limiter, this.router);

        const server = protocol.createServer({
            key: fs.readFileSync(path.join(this.appPath, 'ssl', 'key.key')),
            cert: fs.readFileSync(path.join(this.appPath, 'ssl', 'cert.crt')),
        }, this.express);

        this.app.get('*', (req, res) => {
            res.sendFile(path.join(this.appPath, 'client', 'index.html'));
        });

        server.listen(this.config.port || 4000, () => console.info(`server is up on port ${this.config.port}`));
    }
};

(new Api()).start();