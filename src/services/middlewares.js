const fs = require('fs');

function errorMiddleware({ apiErrorPath }) {
  return (err, req, res, next) => {
    // Extract relevant request information
    const { method, originalUrl, params, query, body } = req;

    // Log the error and request details to a file
    const logMessage = `\n${new Date().toISOString()} - ${err.message}\n` +
      `Route: ${method} ${originalUrl}\n` +
      `Params: ${JSON.stringify(params)}\n` +
      `Query: ${JSON.stringify(query)}\n` +
      `Body: ${JSON.stringify(body)}\n` +
      `${err.stack}\n`;

    // Read the existing content of the file
    fs.readFile(apiErrorPath, 'utf8', (fileErr, data) => {
      if (fileErr) {
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
    return res.status(500).send({ message: 'Something went wrong' });
  };
}

module.exports = { errorMiddleware };