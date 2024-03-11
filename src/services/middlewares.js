// Required modules
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dayMonthYear = require('../utils/dayMonthYear');

// Middleware function to handle errors
function errorMiddleware({ dataPath, config }) {
  return async (err, req, res, next) => {
    // Extract year, month, and day from current date
    const [year, month, day] = dayMonthYear().map((n) => n.toString());

    // Create directory for storing server error logs
    const apiErrorDir = path.join(dataPath, 'server_error', year, month);
    if (!fs.existsSync(apiErrorDir)) await fs.mkdirAsync(apiErrorDir, { recursive: true });

    // Define path for error log file
    const apiErrorPath = path.join(apiErrorDir, `${day}.log`);

    // Log the error if running in development mode
    if (config.running === 'dev') console.log(err);

    // Generate unique reference ID
    const reference = `${uuidv4()}|${year}-${month}-${day}`;

    // Extract relevant request information
    const { method, originalUrl, query, body } = req;

    // Construct log message
    const logMessage = `\n${new Date().toISOString()} - ${reference} - ${err.message}\n` +
      `Route: ${method} ${originalUrl}\n` +
      `Query: ${JSON.stringify(query)}\n` +
      `Body: ${JSON.stringify(body)}\n` +
      `${err.stack}\n`;

    // Asynchronously read existing content of the error log file
    const done = new Promise((resolve, reject) => {
      fs.readFile(apiErrorPath, 'utf8', (fileErr, data = '') => {
        if (fileErr && fileErr.code !== 'ENOENT') {
          reject(`Error reading API error file:\n${fileErr}`);
        } else {
          // Prepend new log message to existing content
          const updatedContent = logMessage + data;

          // Write updated content back to the file
          fs.writeFile(apiErrorPath, updatedContent, (writeErr) => {
            if (writeErr) {
              reject(`Error writing to API error file:\n${writeErr}`);
            } else resolve('Error saved.');
          });
        }
      });
    });

    // Handle promise resolution
    done
      .then(() => res.status(500).send({ message: 'Something went wrong', reference }))
      .catch((fileErr) => {
        res.status(500).send({ message: 'Something went wrong' });
        console.log(fileErr);
        if (config.running === 'prod') console.log('Internal server error:\n', err);
      });
  };
}

module.exports = { errorMiddleware };
