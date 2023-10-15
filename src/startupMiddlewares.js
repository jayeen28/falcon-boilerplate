const rateLimit = require("express-rate-limit");
const cors = require('cors');
const morgan = require('morgan');

module.exports = function () {
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
  this.app.use(morgan('common'));
  this.app.use(this.express.json());
  this.app.use(this.express.urlencoded({ extended: false }));
  this.app.use('/api', limiter, this.router);
}