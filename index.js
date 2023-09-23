require('dotenv').config();
const settings = require(`./settings/${process.env.NODE_ENV === 'production' ? 'prod.js' : 'dev.js'}`);
const express = require('express');
const Api = require('./src/api');

function main() {
    new Api(settings, express).start();
}
main();