const express = require('express');
const cors = require('cors');

const router = require('./routers');

const app = express();
require('./helpers/apiDocs')(app);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors('*'));

app.use(router);

module.exports = app;
