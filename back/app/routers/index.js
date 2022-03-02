const express = require('express');

const controller = require('../controllers');
const controllerHandler = require('../helpers/apiControllerHandler');
const employeeRouter = require('./employeeRouter');
const { errorHandler } = require('../helpers/errorHandler');
const adminAuth = require('../helpers/adminAuth');
const auth = require('../helpers/auth');

const router = express.Router();

/**
 * @typedef {object} loginBody
 * @property {string} regNumber.required - reg_number of the user
 * @property {string} password.required - password of the user
 */

/**
 * Redirect the main route on the api-docs route
 */
router.all('/', controller.home);

/**
 * Redirection to the employeeRouter all the routes start with /employee
 */
router.use('/employee', employeeRouter);

/**
 * POST /login
 * @summary Login of the user
 * @tags Login
 * @param {loginBody} request.body.required - JSON include reg_number and password of the employee
 * @return {Employee} 200 - sucess response - application/json
 */
router.post('/login', controllerHandler(controller.login));

/**
 * Using the errorHanlder to manage the specific error messages
 */
router.use((err, _, response, next) => {
  errorHandler(err, response, next);
});

module.exports = router;
