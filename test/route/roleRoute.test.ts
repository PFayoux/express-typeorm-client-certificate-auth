import * as request from 'supertest';
import app from '../test_utils/server';
import connection from '../test_utils/connection';
import { Role } from '../../src/entity/Role';
import { getManager } from 'typeorm';

describe('/roles', () => {
  beforeAll(async () => {
    await connection.create();
    await connection.clear();
  });

  afterAll(async () => {
    await connection.close();
  });

  test('POST: /roles should return a list of roles', async () => {
    try {
      // create a uniq identifier to create a role specific to our test execution
      const uniqIdentifier = new Date().getTime();

      // create two role for the test, each will have for role '*_roleXXXX' where XXXX is the id of the previous role,
      // that way we ensure only those role will have this uniq name at execution time
      const role1: Role = new Role(`1_role${uniqIdentifier}`);
      const role2: Role = new Role(`2_role${uniqIdentifier}`);

      const createdRoles = await getManager().save([role1, role2]);

      const roleFilter = {
        name: `%${uniqIdentifier}%`,
      };

      const expectedJson = {
        success: true,
        data: createdRoles,
        error: null,
      };

      const response = await request(app)
        .post('/roles')
        .send(roleFilter)
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
  test('POST: /roles/count should return the number of roles', async () => {
    try {
      // create a uniq identifier to create a role specific to our test execution
      const uniqIdentifier = new Date().getTime();

      // create two role for the test, each will have for role '*_roleXXXX' where XXXX is the id of the previous role,
      // that way we ensure only those role will have this uniq name at execution time
      const role1: Role = new Role(`1_role${uniqIdentifier}`);
      const role2: Role = new Role(`2_role${uniqIdentifier}`);

      await getManager().save([role1, role2]);

      const roleFilter = {
        name: `%${uniqIdentifier}%`,
      };

      const expectedJson = {
        success: true,
        data: 2,
        error: null,
      };

      const response = await request(app)
        .post('/roles/count')
        .send(roleFilter)
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
