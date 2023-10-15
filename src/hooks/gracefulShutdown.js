/**
 * gracefulShutdown handles graceful shutdown of a Node.js application by registering event listeners
 * for specific signals and errors.
 *
 * @module gracefulShutdown
 */

/**
 * List of events that trigger a graceful shutdown of the application.
 * @constant {string[]}
 */
const shutdownEvents = ['SIGTERM', 'SIGINT', 'unhandledRejection', 'uncaughtException', 'SIGUSR2'];

/**
 * Register event handlers for graceful shutdown.
 */
module.exports = function () {
  /**
   * Event handler function for graceful shutdown events.
   *
   * @param {Error} orgErr - The original error or event object.
   */
  async function handleShutdownEvent(orgErr) {
    try {
      // Log the original error or event object.
      console.log(orgErr);

      //****** Perform any necessary cleanup or finalization here. ******/

      // Exit the process gracefully.
      process.exit(0);
    } catch (e) {
      console.error(e);

      // Exit the process gracefully.
      process.exit(1);
    }
  }

  // Register event handlers for graceful shutdown events.
  shutdownEvents.forEach((e) => process.on(e, handleShutdownEvent.bind(this)));
};
