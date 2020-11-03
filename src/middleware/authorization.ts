import { Response, Request, NextFunction } from 'express';
import returnJson from '../utils/returnJson';
import ErrorPermissionDenied from '../errors/ErrorPermissionDenied';
import CustomLog from '../utils/CustomLog';

export default function permit(permittedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { user } = req;

    // get the role name, if the user has no role then use 'read_only'
    const nameRole = user.role ? user.role.name : 'read_only';

    // if permittedRoles is empty then anyone have access
    // if permittedRoles is not empty then only those roles have access
    if (permittedRoles.includes(nameRole) || permittedRoles.length === 0) {
      // set the cookie for the client to get the username and role
      res.cookie('username', user.username);
      res.cookie('role', nameRole);
      next();
    } else {
      CustomLog.error(`Sorry your account doesn't have enough right to access this route.`);
      returnJson(res, undefined, new ErrorPermissionDenied(), 403);
    }
  };
}
