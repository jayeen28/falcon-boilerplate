require('dotenv').config();
const settings = require(`./settings/${process.env.NODE_ENV === 'production' ? 'prod.js' : 'dev.js'}`);
const express = require('express');
const Falcon = require('./src/falcon');

function main() {
    const falcon = new Falcon(settings, express);
    const isWokeUp = falcon.wake();
    if (isWokeUp) falcon.fly();
    else console.log('Failed to fly');
}
main();