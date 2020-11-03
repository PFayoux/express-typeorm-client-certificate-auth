import * as RoleControllerRoute from '../controllerRoute/RoleControllerRoute';

/**
 * ### Roles

- GET /roles/:id | Get an Role object from the API given an id
- GET /roles | Get a list of roles
- PATCH /roles | send the form to the API and create a role
- PATCH /roles/:id | send the form to the API to update a role
- DELETE /roles/:id | delete a role
 */

export default [
  // Get the list of roles
  {
    method: 'post',
    route: '/roles',
    controller: RoleControllerRoute.getRoles,
    acls: ['admin'],
  },
  // Get an role object from the API given an id
  {
    method: 'post',
    route: '/roles/count',
    controller: RoleControllerRoute.countRoles,
    acls: ['admin'],
  },
];
