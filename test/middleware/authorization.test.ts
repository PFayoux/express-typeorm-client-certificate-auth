import { Response, Request, NextFunction } from 'express';
import permit from '../../src/middleware/authorization';

import returnJson from '../../src/utils/returnJson';
import ErrorPermissionDenied from '../../src/errors/ErrorPermissionDenied';
jest.mock('../../src/utils/returnJson');

describe('authorization middleware', () => {
  test('test permission', () => {
    const request = {
      user: {
        username: 'anonymous',
      },
    } as Request;
    const response = {
      cookie: jest.fn(),
    } as Response;

    // test that with a user with no role, and no required role it set the cookie and call next
    const permittedRole = [];

    const next = jest.fn() as NextFunction;

    let askPermission = permit(permittedRole);

    askPermission(request, response, next);

    expect(response.cookie).toHaveBeenCalledTimes(2);
    expect(response.cookie).toHaveBeenCalledWith('username', 'anonymous');
    expect(response.cookie).toHaveBeenCalledWith('role', 'read_only');
    expect(next).toHaveBeenCalledTimes(1);

    // test that with a user lacking permission it return an error ErrorPermissionDenied
    permittedRole.push('admin');

    askPermission = permit(permittedRole);

    askPermission(request, response, next);

    expect(returnJson).toHaveBeenCalledWith(response, undefined, new ErrorPermissionDenied(), 403);

    // test that with a user with role it have access
    request.user.username = 'admin_name';
    request.user.role = { name: 'admin' };

    console.log(request);

    askPermission(request, response, next);

    expect(response.cookie).toHaveBeenCalledTimes(4);
    expect(response.cookie).toHaveBeenCalledWith('username', 'admin_name');
    expect(response.cookie).toHaveBeenCalledWith('role', 'admin');
    expect(next).toHaveBeenCalledTimes(2);
  });
});
