import * as UtilisateurControllerRoute from '../controllerRoute/UtilisateurControllerRoute';

/**
 * ### Utilisateurs

- GET /utilisateurs/:id | Get an Utilisateur object from the API given an id
- GET /getUtilisateurs [req.query.queryProps = (limit, skip, order, ..)] | get the list of utilisateurs
- GET /utilisateurs/count [req.query.queryProps = queryProps.where] | get the number of utilisateurs
- PATCH /utilisateurs | send the form to the API and create a utilisateur
- PATCH /utilisateurs/:id | send the form to the API to update an utilisateur
- DELETE /utilisateurs/:id | delete a utilisateur
 */

export default [
  // Get the list of utilisateurs
  {
    method: 'post',
    route: '/utilisateurs',
    controller: UtilisateurControllerRoute.getUtilisateurs,
    acls: ['admin'],
  },
  // get the number of utilisateurs
  {
    method: 'post',
    route: '/utilisateurs/count',
    controller: UtilisateurControllerRoute.countUtilisateurs,
    acls: ['admin'],
  },
  // Get an utilisateur object from the API given an id
  {
    method: 'get',
    route: '/utilisateurs/:id',
    controller: UtilisateurControllerRoute.getUtilisateur,
    acls: ['admin'],
  },
  // send the form to the API and create an utilisateur
  {
    method: 'patch',
    route: '/utilisateurs',
    controller: UtilisateurControllerRoute.createUtilisateur,
    acls: ['admin'],
  },
  // send the form to the API to update an utilisateur
  {
    method: 'patch',
    route: '/utilisateurs/:id',
    controller: UtilisateurControllerRoute.updateUtilisateur,
    acls: ['admin'],
  },
  // delete many utilisateurs
  {
    method: 'delete',
    route: '/utilisateurs',
    controller: UtilisateurControllerRoute.deleteUtilisateurs,
    acls: ['admin'],
  },
  // delete a utilisateur
  {
    method: 'delete',
    route: '/utilisateurs/:id',
    controller: UtilisateurControllerRoute.deleteUtilisateur,
    acls: ['admin'],
  },
];
