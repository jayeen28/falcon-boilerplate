const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

function errorMiddleware({ apiErrorPath, config }) {
  return (err, req, res, next) => {
    // Log the error if it is running on dev mode.
    if (config.running === 'dev') console.log(err);

    //reference id
    const reference = uuidv4();

    // Extract relevant request information
    const { method, originalUrl, query, body } = req;
    // Log the error and request details to a file
    const logMessage = `\n${new Date().toISOString()} - ${reference} -${err.message}\n` +
      `Route: ${method} ${originalUrl}\n` +
      `Query: ${JSON.stringify(query)}\n` +
      `Body: ${JSON.stringify(body)}\n` +
      `${err.stack}\n`;

    // Read the existing content of the file
    fs.readFile(apiErrorPath, 'utf8', (fileErr, data = '') => {
      if (fileErr && fileErr.code !== 'ENOENT') {
        console.error('Error reading api error file:', fileErr);
      } else {
        // Prepend the new log message to the existing content
        const updatedContent = logMessage + data;

        // Write the updated content back to the file
        fs.writeFile(apiErrorPath, updatedContent, (writeErr) => {
          if (writeErr) {
            console.error('Error writing to api error file:', writeErr);
          }
        });
      }
    });

    // Send a generic error response to the client
    return res.status(500).send({ message: 'Something went wrong', reference });
  };
}

module.exports = { errorMiddleware };