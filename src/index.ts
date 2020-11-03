import 'reflect-metadata';
import * as helmet from 'helmet';
import { createConnection } from 'typeorm';
import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import { Routes } from './routes';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as https from 'https';
import authenticate from './middleware/authenticate';
import logRoute from './middleware/logRoute';
import permit from './middleware/authorization';
import CustomLog from './utils/CustomLog';
import UtilisateurControllerEntity from './controllerEntity/UtilisateurControllerEntity';
import { Role } from './entity/Role';

createConnection()
  .then(async (connection) => {
    // query utilisateur named alice
    const utilisateurRepository = connection.getCustomRepository(UtilisateurControllerEntity);
    const existingUtilisateur = await utilisateurRepository.getUtilisateurs(
      undefined,
      undefined,
      undefined,
      undefined,
      'Alice',
    );

    // if there is no utilisateur create one
    if (existingUtilisateur.length === 0) {
      const role = await connection.manager.save(new Role('admin'));
      await utilisateurRepository.saveUtilisateur('Alice', 'alice@alice.com', role.id);
    }

    // create express app
    const app = express();

    // add hemlet middleware for security purpose
    app.use(helmet());

    app.use(bodyParser.json());

    app.use(authenticate);

    app.get('/', permit([]), (req: Request, res: Response) => res.send('<h1>Connection is successful</h1>'));

    app.get('/account', permit([]), (req: Request, res: Response) => res.json({ currentUSer: req.user }));

    // register express routes from defined application routes
    Routes().forEach((route) => {
      app[route.method](route.route, logRoute(route.method, route.route), permit(route.acls), route.controller);
    });

    // setup ssl config
    const sslConfig = {
      requestCert: true,
      rejectUnauthorized: false,
      key: readFileSync(join(__dirname, '../key/server/server_key.pem')),
      cert: readFileSync(join(__dirname, '../key/server/server_cert.pem')),
      ca: [readFileSync(join(__dirname, '../key/server/server_cert.pem'))],
    };

    app.start = function () {
      // initialize a server listening to https
      const server = https.createServer(sslConfig, app);

      // start the server on port 3000
      server.listen(3000, 'localhost', () => {
        const baseUrl = 'https://localhost:' + server.address().port;
        app.emit('started', baseUrl);

        console.log(`Express server listening at : %s%s`, baseUrl, '/');
      });
    };

    app.start();
  })
  .catch((error) => CustomLog.error(error));
