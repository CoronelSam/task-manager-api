const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');
const { corsOrigin } = require('./config/env');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '10kb' }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
