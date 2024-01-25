import dotenv from 'dotenv';
import express from 'express';
import devSettings from './settings/dev';
import prodSettings from './settings/prod';
import Falcon from './src/falcon';
dotenv.config();
const settings = process.env.NODE_ENV === 'production' ? prodSettings : devSettings;

function main() {
  const falcon = new Falcon(settings, express);
  const isWokeUp = falcon.wake();
  if (isWokeUp) falcon.fly();
  else console.log('Failed to fly');
}
main();