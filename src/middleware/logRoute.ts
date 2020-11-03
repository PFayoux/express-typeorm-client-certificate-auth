import { Response, Request, NextFunction } from 'express';
import CustomLog from '../utils/CustomLog';

export default function logRoute(methodRoute: string, routeRoute: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { user } = req;
    CustomLog.info(`${user.username} use methode "${methodRoute}" and take the route "${routeRoute}.`);
    CustomLog.debug(`${JSON.stringify(req.body)}`);
    next();
  };
}
