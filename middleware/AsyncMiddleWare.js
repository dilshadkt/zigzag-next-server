module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      if (err.code === "ERR_SOCKET_CONNECTION_TIMEOUT") {
        // Handle the timeout error
        console.error("Socket connection timed out. Please try again later.");
        res.status(400).send(err);
      } else {
        // Handle other types of errors
        console.error("An error occurred:", err);
        res.status(400).send(err);
      }
    }
  };
};
