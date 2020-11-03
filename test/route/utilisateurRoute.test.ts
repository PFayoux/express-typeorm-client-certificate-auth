import * as request from 'supertest';
import app from '../test_utils/server';
import connection from '../test_utils/connection';
import { Utilisateur } from '../../src/entity/Utilisateur';
import { getManager } from 'typeorm';
import { Role } from '../../src/entity/Role';

describe('/utilisateurs', () => {
  beforeAll(async () => {
    await connection.create();
    await connection.clear();
  });

  afterAll(async () => {
    await connection.close();
  });

  test('POST: /utilisateurs should return a list of utilisateurs', async () => {
    try {
      // create a uniq identifier to create a utilisateur specific to our test execution
      const uniqIdentifier = new Date().getTime();

      // create two roles and save it to the db
      const role1 = await getManager().save(new Role(`superadmin-${uniqIdentifier}`));
      const role2 = await getManager().save(new Role(`admin-${uniqIdentifier}`));

      // create two utilisateur for the test, each will have for username '**-admXXXX' where XXXX is an uniq sequence generated for the test,
      // that way we ensure only those utilisateur will have this uniq name at execution time
      const ut1: Utilisateur = new Utilisateur(
        `pfayoux-adm${uniqIdentifier}`,
        `pfayoux-${uniqIdentifier}@hapy.fr`,
        role1,
      );
      const ut2: Utilisateur = new Utilisateur(
        `hgomez-adm${uniqIdentifier}`,
        `hgomez-${uniqIdentifier}@hapy.fr`,
        role2,
      );

      const createdUtilisateurs = await getManager().save([ut1, ut2]);

      const expectedJson = {
        success: true,
        data: createdUtilisateurs,
        error: null,
      };
      const utilisateurFilters = {
        limit: 0,
        skip: 0,
        orderField: 'utilisateur.id',
        orderType: 'ASC',
        email: `%${uniqIdentifier}%`,
      };
      const response = await request(app)
        .post('/utilisateurs')
        .send(utilisateurFilters)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .catch((err: Error) => {
          console.error(err);
          throw err;
        });
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedJson));
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  test('GET: /utilisateurs/:id should return the utilisateur corresponding to the id', async () => {
    try {
      // create a uniq identifier to create a utilisateur specific to our test execution
      const uniqIdentifier = new Date().getTime();

      // create two roles and save it to the db
      const role1 = await getManager().save(new Role(`superadmin-${uniqIdentifier}`));

      // create one utilisateur for the test, it will have for username '**-admXXXX' where XXXX is an uniq sequence generated for the test,
      // that way we ensure only those utilisateur will have this uniq name at execution time
      const user: Utilisateur = new Utilisateur(
        `pfayoux-adm${uniqIdentifier}`,
        `pfayoux-${uniqIdentifier}@hapy.fr`,
        role1,
      );

      const createdUtilisateur = await getManager().save(user);

      const expectedJson = {
        success: true,
        data: createdUtilisateur,
        error: null,
      };
      const response = await request(app)
        .get(`/utilisateurs/${createdUtilisateur.id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .catch((err: Error) => {
          console.error(err);
          throw err;
        });
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedJson));
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  test('POST: /utilisateurs/count should return the number of utilisateurs', async () => {
    try {
      // create a uniq identifier to create a utilisateur specific to our test execution
      const uniqIdentifier = new Date().getTime();

      // create two roles and save it to the db
      const role1 = await getManager().save(new Role(`superadmin-${uniqIdentifier}`));
      const role2 = await getManager().save(new Role(`admin-${uniqIdentifier}`));

      // create two utilisateur for the test, each will have for username '**-admXXXX' where XXXX is an uniq sequence generated for the test,
      // that way we ensure only those utilisateur will have this uniq name at execution time
      const ut1: Utilisateur = new Utilisateur(
        `pfayoux-adm${uniqIdentifier}`,
        `pfayoux-${uniqIdentifier}@hapy.fr`,
        role1,
      );
      const ut2: Utilisateur = new Utilisateur(
        `hgomez-adm${uniqIdentifier}`,
        `hgomez-${uniqIdentifier}@hapy.fr`,
        role2,
      );

      await getManager().save([ut1, ut2]);

      const expectedJson = {
        success: true,
        data: 2,
        error: null,
      };
      const utilisateurFilters = {
        email: `%${uniqIdentifier}%`,
      };
      const response = await request(app)
        .post('/utilisateurs/count')
        .send(utilisateurFilters)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .catch((err: Error) => {
          console.error(err);
          throw err;
        });
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedJson));
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  test('PATCH: /utilisateurs should create a utilisateur', async () => {
    try {
      // create a uniq identifier for the test
      const uniqIdentifier = new Date().getTime();

      // create the role and save it to the db
      const role = await getManager().save(new Role(`admin-${uniqIdentifier}`));

      // create expected utilisateur
      const utilisateurExpected = new Utilisateur(`hgomez${uniqIdentifier}`, `hgomez-${uniqIdentifier}@hapy.fr`, role);
      const utilisateurData = {
        username: utilisateurExpected.username,
        email: utilisateurExpected.email,
        role_id: utilisateurExpected.role.id,
      };
      const expectedJson = {
        success: true,
        data: utilisateurExpected,
        error: null,
      };
      const response = await request(app)
        .patch('/utilisateurs')
        .send(utilisateurData)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .catch((err: Error) => {
          console.error(err);
          throw err;
        });
      // copy id in expected datas
      expectedJson.data.id = response.body.data.id;
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedJson));
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  test('PATCH: /utilisateurs/:id should update the utilisateur', async () => {
    try {
      // create a uniq identifier for the test
      const uniqIdentifier = new Date().getTime();

      // create the first role and save it to the db
      const oldRole = await getManager().save(new Role(`admin-${uniqIdentifier}`));

      // create the second role and save it to the db
      const newRole = await getManager().save(new Role(`superadmin${uniqIdentifier}`));

      // create expected utilisateur
      const utilisateurCreated = await getManager().save(
        new Utilisateur(`hgomez${uniqIdentifier}`, `hgomez-${uniqIdentifier}@hapy.fr`, oldRole),
      );

      const utilisateurExpected = utilisateurCreated;
      // changing utilisateur's username
      utilisateurExpected.username = 'pfayoux';
      // changing utilisateur's email
      utilisateurExpected.username = 'pfayoux@hapy.fr';
      // changing utilisateur's role
      utilisateurExpected.role = newRole;

      const utilisateurData = {
        username: utilisateurExpected.username,
        email: utilisateurExpected.email,
        role_id: utilisateurExpected.role.id,
      };
      const expectedJson = {
        success: true,
        data: utilisateurExpected,
        error: null,
      };
      const response = await request(app)
        .patch(`/utilisateurs/${utilisateurExpected.id}`)
        .send(utilisateurData)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .catch((err: Error) => {
          console.error(err);
          throw err;
        });
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedJson));
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  test('DELETE: /utilisateurs should delete the utilisateurs', async () => {
    try {
      // create a uniq identifier for the test
      const uniqIdentifier = new Date().getTime();

      // create the first role and save it to the db
      const oldRole = await getManager().save(new Role(`admin-${uniqIdentifier}`));

      // create expected utilisateur
      const utilisateurCreated = await getManager().save(
        new Utilisateur(`hgomez${uniqIdentifier}`, `hgomez-${uniqIdentifier}@hapy.fr`, oldRole),
      );

      const expectedJson = {
        success: true,
        data: [utilisateurCreated],
        error: null,
      };
      const response = await request(app)
        .delete(`/utilisateurs/`)
        .send({ ids: [utilisateurCreated.id] })
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .catch((err: Error) => {
          console.error(err);
          throw err;
        });
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedJson));
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  test('DELETE: /utilisateurs/:id should delete the utilisateur', async () => {
    try {
      // create a uniq identifier for the test
      const uniqIdentifier = new Date().getTime();

      // create the first role and save it to the db
      const oldRole = await getManager().save(new Role(`admin-${uniqIdentifier}`));

      // create expected utilisateur
      const utilisateurCreated = await getManager().save(
        new Utilisateur(`hgomez${uniqIdentifier}`, `hgomez-${uniqIdentifier}@hapy.fr`, oldRole),
      );

      const expectedJson = {
        success: true,
        data: utilisateurCreated,
        error: null,
      };
      const response = await request(app)
        .delete(`/utilisateurs/${utilisateurCreated.id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .catch((err: Error) => {
          console.error(err);
          throw err;
        });
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedJson));
    } catch (err) {
      console.error(err);
      throw err;
    }
  });
});
