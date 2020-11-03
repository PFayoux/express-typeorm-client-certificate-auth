import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Routes } from '../../src/routes';

// create express app
const app = express();

app.use(bodyParser.json());

try {
  // register express routes from defined application routes
  Routes().forEach((route) => {
    app[route.method](route.route, route.controller);
  });
} catch (error) {
  console.error(error);
}

export default app;
