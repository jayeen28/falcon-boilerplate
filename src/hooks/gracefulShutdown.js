/**
 * gracefulShutdown handles graceful shutdown of a Node.js application by registering event listeners
 * for specific signals and errors.
 *
 * @module gracefulShutdown
 */

/**
 * Register event handlers for graceful shutdown.
 */
module.exports = function () {
  /**
   * Event handler function for graceful shutdown events.
   *
   * @param {Error} signal - The shutdown signal.
   */
  function handleShutdownEvent(signal) {
    try {
      // Log the original error or event object.
      console.log(`Process shutdown signal: ${signal}`);

      //****** Perform any necessary cleanup or finalization here. ******/
      this.db.end(function (err) {
        if (err) console.log(err);
        else console.log('Database disconnected');
      });

      this.server.close(() => {
        console.log('Server closed');
      });

      this.emitter.removeAllListeners();
    } catch (e) {
      console.error(e);

      // Exit the process gracefully.
      process.exit(1);
    }
  }
  process.on('SIGTERM', handleShutdownEvent.bind(this));
  process.on('SIGINT', handleShutdownEvent.bind(this));
  process.on('SIGUSR2', handleShutdownEvent.bind(this));
};
