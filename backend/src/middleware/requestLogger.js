/**
 * HTTP request logger built on morgan.
 * Uses a concise colored format in development, combined format in production.
 */

const morgan = require('morgan');
const config = require('../config/env');

const format = config.isDev ? 'dev' : 'combined';

module.exports = morgan(format);
