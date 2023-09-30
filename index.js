require('dotenv').config();
const settings = require(`./settings/${process.env.NODE_ENV === 'production' ? 'prod.js' : 'dev.js'}`);
const express = require('express');
const Falcon = require('./src/falcon');

function main() {
    new Falcon(settings, express).wake();
}
main();