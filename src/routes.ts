import roleRoute from './route/roleRoute';
import utilisateurRoute from './route/utilisateurRoute';

/**
 * Return an array containing all routes.
 */
export const Routes = (): Array<Record<string, string | any>> => [].concat(roleRoute, utilisateurRoute);
