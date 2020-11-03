import { Request, Response, NextFunction } from 'express';
import authenticate from '../../src/middleware/authenticate';

import UtilisateurControllerEntity from '../../src/controllerEntity/UtilisateurControllerEntity';
import { getCustomRepository } from 'typeorm';
import returnJson from '../../src/utils/returnJson';
import ErrorInsecureConnection from '../../src/errors/ErrorInsecureConnection';
import ErrorCertificateUnvalid from '../../src/errors/ErrorCertificateUnvalid';
import ErrorNoCertificate from '../../src/errors/ErrorNoCertificate';

jest.mock('../../src/utils/returnJson');
jest.mock('../../src/controllerEntity/UtilisateurControllerEntity');
// mock typeorm library
jest.mock('typeorm', () => ({
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  OneToMany: jest.fn(),
  Entity: jest.fn(),
  Unique: jest.fn(),
  ManyToOne: jest.fn(),
  JoinColumn: jest.fn(),
  EntityRepository: jest.fn(),
  Repository: jest.fn(),
  getCustomRepository: () => ({
    // mock the getUtilisateurs
    getUtilisateurs: jest.fn(() => []),
  }),
}));

describe('authentication middleware', () => {
  test('test the certificate authentication', async () => {
    const request = {
      socket: {
        getPeerCertificate: jest.fn(),
      },
      headers: {
        ssl_client_s_dn: undefined,
      },
      client: {
        authorized: false,
      },
      url: undefined,
    } as Request;
    const response = {} as Response;
    const next = jest.fn() as NextFunction;

    /**
     * Test with preproduction NODE_ENV
     */

    process.env.NODE_ENV = 'preproduction';

    await authenticate(request, response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(request.user).toEqual({
      username: 'admin',
      role: {
        name: 'admin',
      },
    });

    /**
     * Test with production NODE_ENV
     */

    process.env.NODE_ENV = 'production';

    // test that it return ErrorInsecureConnection if connection is not secure
    await authenticate(request, response, next);

    expect(returnJson).toHaveBeenCalledWith(response, undefined, new ErrorInsecureConnection(), 403);

    request.secure = true;

    // test that it return ErrorCertificateUnvalid if the certificate is not valid
    request.headers.ssl_client_s_dn = 'CN=username, OU=BAP, O=ANSSI, L=PARIS, ST=FR, C=FR';
    request.socket.getPeerCertificate = jest.fn(() => ({ subject: { CN: 'username' }, issuer: { CN: 'issuerCN' } }));

    await authenticate(request, response, next);

    expect(returnJson).toHaveBeenCalledWith(
      response,
      undefined,
      new ErrorCertificateUnvalid('username', 'issuerCN'),
      403,
    );

    // test that it return ErrorNoCertificate if no certificate is given
    request.socket.getPeerCertificate = jest.fn(() => ({}));

    await authenticate(request, response, next);

    expect(returnJson).toHaveBeenCalledWith(response, undefined, new ErrorNoCertificate(), 403);

    // test that it return a user 'anonymous'
    request.client.authorized = true;
    request.socket.getPeerCertificate = jest.fn(() => ({ subject: { CN: 'test' } }));

    await authenticate(request, response, next);

    expect(next).toHaveBeenCalledTimes(2);

    expect(request.user).toEqual({
      username: 'anonymous',
    });

    //TODO Test with an existing user
  });
});
