/**
 * On met en place un gestionnaire d'erreur, sous forme de middleware,
 * qui sera chargé de répondre à l'utilisateur
 * en cas de passage d'erreur à la function next()
 */
const ApiError = require('../errors/apiErrors');

/**
  * Middleware that respond to a next method with an error as argument
  * @param {object} err Error class
  * @param {object} res Express response object
  */
const errorHandler = (err, res) => {
  let { statusCode, message } = err;

  if (Number.isNaN(Number(statusCode))) {
    statusCode = 500;
  }

  if (statusCode === 500) {
    console.log(err);
  }

  // Si l'application n'est pas en développement on reste vague sur l'erreur serveur
  if (statusCode === 500 && res.app.get('env') !== 'development') {
    message = 'Internal Server Error';
  }
};

module.exports = {
  ApiError,
  errorHandler,
};
