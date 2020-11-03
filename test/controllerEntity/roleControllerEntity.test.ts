import connection from '../test_utils/connection';
import { getManager, getCustomRepository } from 'typeorm';
import RoleControllerEntity from '../../src/controllerEntity/RoleControllerEntity';
import { Role } from '../../src/entity/Role';
describe('Test RoleControllerEntity ', () => {
  beforeAll(async () => {
    await connection.create();
  });
  afterAll(async () => {
    await connection.clear();
    await connection.close();
  });

  it('Get the list of roles', async () => {
    // create a uniq identifier to create a role specific to our test execution
    const uniqIdentifier = new Date().getTime();

    // create two role for the test, each will have for role '*_roleXXXX' where XXXX is the id of the previous role,
    // that way we ensure only those role will have this uniq name at execution time
    const role1: Role = new Role(`1_role${uniqIdentifier}`);
    const role2: Role = new Role(`2_role${uniqIdentifier}`);

    const createdRoles = await getManager().save([role1, role2]);

    // get the repository to test
    const roleCustomRepository = getCustomRepository(RoleControllerEntity);

    // call the method to query roles finishing by _roleXXXX,
    // we order the result by role.id for result comparison
    let rolesResult = await roleCustomRepository.getRoles(
      undefined,
      undefined,
      'role.id',
      'ASC',
      `%_role${uniqIdentifier}%`,
    );

    // verify that the result contain the correct informations
    expect(rolesResult).toEqual(createdRoles);

    // call the method to query the role 1_roleXXXX
    rolesResult = await roleCustomRepository.getRoles(
      undefined,
      undefined,
      undefined,
      undefined,
      `%1_role${uniqIdentifier}%`,
    );

    expect(rolesResult[0]).toEqual(role1);

    // call the method without params to query the all the roles
    rolesResult = await roleCustomRepository.getRoles();

    // verify that the results contains our new created roles
    expect(rolesResult).toEqual(expect.arrayContaining(createdRoles));
  });

  it('Get the number of roles', async () => {
    // create a uniq identifier to create a role specific to our test execution
    const uniqIdentifier = new Date().getTime();

    // create two role for the test, each will have for role '*_roleXXXX' where XXXX is the id of the previous role,
    // that way we ensure only those role will have this uniq name at execution time
    const role1: Role = new Role(`1_role${uniqIdentifier}`);
    const role2: Role = new Role(`2_role${uniqIdentifier}`);

    await getManager().save([role1, role2]);

    // get the repository to test
    const roleCustomRepository = getCustomRepository(RoleControllerEntity);

    // request the number of roles having the given role name *_roleXXXX where XXXX is the uniq identifier for this test
    let rolesCountResult = await roleCustomRepository.countRoles(`%_role${uniqIdentifier}%`);

    // since we just created two role, the result should be 2
    expect(rolesCountResult).toEqual(2);

    // request the number of roles having the given role name 2_roleXXXX where XXXX is the uniq identifier for this test
    rolesCountResult = await roleCustomRepository.countRoles(`%2_role${uniqIdentifier}%`);

    // only one role should correspond
    expect(rolesCountResult).toEqual(1);

    // call the method without params to query the all the roles
    rolesCountResult = await roleCustomRepository.countRoles();

    // verify that the results contains our new created roles
    expect(rolesCountResult).toBeGreaterThanOrEqual(2);
  });
});
