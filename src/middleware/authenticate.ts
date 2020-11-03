import { Response, Request, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import UtilisateurControllerEntity from '../controllerEntity/UtilisateurControllerEntity';
import returnJson from '../utils/returnJson';
import ErrorCertificateUnvalid from '../errors/ErrorCertificateUnvalid';
import ErrorNoCertificate from '../errors/ErrorNoCertificate';
import ErrorInsecureConnection from '../errors/ErrorInsecureConnection';
import CustomLog from '../utils/CustomLog';

export default async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  CustomLog.info(`Request authenticate middleware triggered on %s`, req.url);

  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    CustomLog.info(`Environnement set as preproduction`);
  }

  // if the request use TLS
  if (req.secure || isDev) {
    // get the client certificate
    const cert = req.socket.getPeerCertificate();

    if (req.client.authorized || isDev) {
      // if the client certificate has been authorized

      // if isDev is set use admin user otherwise use the CN as username
      const username = isDev ? 'admin' : cert.subject.CN;

      // get the repository from UtilisateurControllerEntity
      const utilisateurRepository = getCustomRepository(UtilisateurControllerEntity);
      // get the utilisateur that match the username
      const utilisateur = (
        await utilisateurRepository.getUtilisateurs(undefined, undefined, undefined, undefined, username)
      )[0];

      if (utilisateur || isDev) {
        // if isDev is true , then use a fake user that has admin role
        // set the utilisateur inside the request to pass it to authorization
        req.user = isDev ? { username, role: { name: 'admin' } } : utilisateur;

        next();
      } else {
        console.info(`No user have a username matching ${username}, this user doesn't exist.
          Will use user 'anonymous' with role 'read_only'.`);
        req.user = {
          username: 'anonymous',
        };
        next();
      }
    } else if (cert && cert.subject) {
      const clientCN = cert.subject.CN;
      CustomLog.error(`Sorry ${clientCN}, certificates from ${cert.issuer.CN} are not authorized here.`);
      returnJson(res, undefined, new ErrorCertificateUnvalid(clientCN, cert.issuer.CN), 403);
    } else {
      CustomLog.error('Sorry, but you need to provide a client certificate to continue.');
      returnJson(res, undefined, new ErrorNoCertificate(), 403);
    }
  } else {
    CustomLog.error(`Your connection is unsecure you can't access to the api.`);
    returnJson(res, undefined, new ErrorInsecureConnection(), 403);
  }
}
