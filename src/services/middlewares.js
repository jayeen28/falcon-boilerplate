const fs = require('fs');
const path = require('path');

function errorMiddleware({ appPath }) {
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

        fs.appendFile(path.join(appPath, 'error.log'), logMessage, (fileErr) => {
            if (fileErr) {
                console.error('Error logging to file:', fileErr);
            }
        });

        // Send a generic error response to the client
        return res.status(500).send({ message: 'Something went wrong' });
    }
}

module.exports = { errorMiddleware };