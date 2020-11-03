import connection from '../test_utils/connection';
import { getManager, getCustomRepository } from 'typeorm';
import UtilisateurControllerEntity from '../../src/controllerEntity/UtilisateurControllerEntity';
import { Utilisateur } from '../../src/entity/Utilisateur';
import { Role } from '../../src/entity/Role';
import ErrorEntityDoesNotExist from '../../src/errors/ErrorEntityDoesNotExist';
import ErrorUndefinedMandatoryArgument from '../../src/errors/ErrorUndefinedMandatoryArgument';

describe('Test UtilisateurControllerEntity ', () => {
  beforeAll(async () => {
    await connection.create();
  });
  afterAll(async () => {
    await connection.clear();
    await connection.close();
  });

  it('Get the list of utilisateurs', async () => {
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
    const ut2: Utilisateur = new Utilisateur(`hgomez-adm${uniqIdentifier}`, `hgomez-${uniqIdentifier}@hapy.fr`, role2);

    const createdUtilisateurs = await getManager().save([ut1, ut2]);

    // get the repository to test
    const utilisateurCustomRepository = getCustomRepository(UtilisateurControllerEntity);

    // call the method to query the utilisateur **-admXXXX
    let utilisateursResult = await utilisateurCustomRepository.getUtilisateurs(
      undefined,
      undefined,
      'utilisateur.id',
      'ASC',
      `%-adm${uniqIdentifier}%`,
    );

    // verify that the result contain the correct informations
    expect(utilisateursResult).toEqual(createdUtilisateurs);

    // call the method to query the utilisateur pfayoux-admXXXX
    utilisateursResult = await utilisateurCustomRepository.getUtilisateurs(
      undefined,
      undefined,
      undefined,
      undefined,
      `%pfayoux-adm${uniqIdentifier}%`,
    );

    // verify that the result contain the correct informations
    expect(utilisateursResult[0]).toEqual(ut1);

    // call method to query utilisateurs having :
    // * the given username *-admXXXX where XXXX is the uniq identifier for this test
    // * the given email `hgomez-${uniqIdentifier}@hapy.fr`
    utilisateursResult = await utilisateurCustomRepository.getUtilisateurs(
      undefined,
      undefined,
      undefined,
      undefined,
      `%-adm${uniqIdentifier}%`,
      `%hgomez-${uniqIdentifier}@hapy.fr%`,
    );

    // verify that the result contain the correct informations
    expect(utilisateursResult[0]).toEqual(ut2);

    // call method to query utilisateurs having :
    // * the given username *-admXXXX where XXXX is the uniq identifier for this test
    // * the role name `superadmin${uniqIdentifier}`
    utilisateursResult = await utilisateurCustomRepository.getUtilisateurs(
      undefined,
      undefined,
      undefined,
      undefined,
      `%-adm${uniqIdentifier}%`,
      undefined,
      '%superadmin%',
    );

    // verify that the result contain the correct informations
    expect(utilisateursResult[0]).toEqual(ut1);

    // call the method without params to query the all the utilisateurs
    utilisateursResult = await utilisateurCustomRepository.getUtilisateurs();

    // verify that the results contains our new created utilisateurs
    expect(utilisateursResult).toEqual(expect.arrayContaining(createdUtilisateurs));
  });

  it('Get a utilisateur object from the API given an id', async () => {
    // create a uniq identifier for the test
    const uniqIdentifier = new Date().getTime();

    // create a new role
    const role = await getManager().save(new Role(`admin-${uniqIdentifier}`));

    // create a new utilisateur and save it in the db
    const createdUtilisateur = await getManager().save(
      new Utilisateur(`hgomez${uniqIdentifier}`, `hgomez-${uniqIdentifier}@hapy.fr`, role),
    );

    // get the repository to test
    const utilisateurCustomRepository = getCustomRepository(UtilisateurControllerEntity);

    // call the method to query the utilisateur by its id
    const utilisateurResult = await utilisateurCustomRepository.getUtilisateur(createdUtilisateur.id);

    // verify that the result match the created utilisateur
    expect(utilisateurResult).toEqual(createdUtilisateur);

    // Disable console.error to hide the log that will be provocated by the test that verify that error are throwed
    console.error = jest.fn();

    // call the method to query the utilisateur by its id with a wrong utilisateur id
    await expect(utilisateurCustomRepository.getUtilisateur(999999)).rejects.toThrow(
      new ErrorEntityDoesNotExist('Utilisateur', 999999),
    );

    // call the method to query the utilisateur by its id with a undefined utilisateur id
    await expect(utilisateurCustomRepository.getUtilisateur(undefined)).rejects.toThrow(
      new ErrorUndefinedMandatoryArgument('getUtilisateur', 'id'),
    );
  });

  it('Get the number of utilisateurs', async () => {
    // create a uniq identifier to create a utilisateur specific to our test execution
    const uniqIdentifier = new Date().getTime();

    // create two roles and save it to the db
    const role1 = await getManager().save(new Role(`superadmin${uniqIdentifier}`));
    const role2 = await getManager().save(new Role(`admin-${uniqIdentifier}`));

    // create two utilisateur for the test, each will have for username '**-admXXXX' where XXXX is an uniq sequence generated for the test,
    // that way we ensure only those utilisateur will have this uniq name at execution time
    const ut1: Utilisateur = new Utilisateur(
      `pfayoux-adm${uniqIdentifier}`,
      `pfayoux-${uniqIdentifier}@hapy.fr`,
      role1,
    );
    const ut2: Utilisateur = new Utilisateur(`hgomez-adm${uniqIdentifier}`, `hgomez-${uniqIdentifier}@hapy.fr`, role2);

    await getManager().save([ut1, ut2]);

    // get the repository to test
    const utilisateurCustomRepository = getCustomRepository(UtilisateurControllerEntity);

    // call the method to query the utilisateur **-admXXXX
    let utilisateursCountResult = await utilisateurCustomRepository.countUtilisateurs(`%-adm${uniqIdentifier}%`);

    // verify that the result contain the correct informations
    expect(utilisateursCountResult).toEqual(2);

    // call the method to query the utilisateur pfayoux-admXXXX
    utilisateursCountResult = await utilisateurCustomRepository.countUtilisateurs(`%pfayoux-adm${uniqIdentifier}%`);

    // verify that the result contain the correct informations
    expect(utilisateursCountResult).toEqual(1);

    // call method to query utilisateurs having :
    // * the given username *-admXXXX where XXXX is the uniq identifier for this test
    // * the given email `hgomez-${uniqIdentifier}@hapy.fr`
    utilisateursCountResult = await utilisateurCustomRepository.countUtilisateurs(
      `%-adm${uniqIdentifier}%`,
      `%hgomez-${uniqIdentifier}@hapy.fr%`,
    );

    // verify that the result contain the correct informations
    expect(utilisateursCountResult).toEqual(1);

    // call method to query utilisateurs having :
    // * the given username *-admXXXX where XXXX is the uniq identifier for this test
    // * the role name `superadmin${uniqIdentifier}`
    utilisateursCountResult = await utilisateurCustomRepository.countUtilisateurs(
      `%-adm${uniqIdentifier}%`,
      undefined,
      `%superadmin${uniqIdentifier}%`,
    );

    // verify that the result contain the correct informations
    expect(utilisateursCountResult).toEqual(1);

    // call the method without params to query the all the utilisateurs
    utilisateursCountResult = await utilisateurCustomRepository.countUtilisateurs();

    // verify that the results contains our new created utilisateurs
    expect(utilisateursCountResult).toBeGreaterThanOrEqual(2);
  });

  it('Send the form to the API and create a utilisateur', async () => {
    // create a uniq identifier for the test
    const uniqIdentifier = new Date().getTime();

    // create the role and save it to the db
    const role = await getManager().save(new Role(`admin-${uniqIdentifier}`));

    // create expected utilisateur
    const utilisateurExpected = new Utilisateur(`hgomez${uniqIdentifier}`, `hgomez-${uniqIdentifier}@hapy.fr`, role);

    // get repository
    const utilisateurCustomRepository = getCustomRepository(UtilisateurControllerEntity);

    // create a new utilisateur
    const utilisateurResult = await utilisateurCustomRepository.saveUtilisateur(
      utilisateurExpected.username,
      utilisateurExpected.email,
      role.id,
    );
    utilisateurExpected.id = utilisateurResult.id;
    // get utilisateur by id to check if utilisateur has been successfully created
    expect(utilisateurResult).toEqual(utilisateurExpected);

    // Disable console.error to hide the log that will be provocated by the test that verify that error are throwed
    console.error = jest.fn();

    // call the method to create a new utilisateur with an empty utilisateur username
    await expect(
      utilisateurCustomRepository.saveUtilisateur(undefined, utilisateurExpected.email, role.id),
    ).rejects.toThrow(new ErrorUndefinedMandatoryArgument('saveUtilisateur', 'username'));

    // call the method to create a new utilisateur with an empty utilisateur email
    await expect(
      utilisateurCustomRepository.saveUtilisateur(utilisateurExpected.username, undefined, role.id),
    ).rejects.toThrow(new ErrorUndefinedMandatoryArgument('saveUtilisateur', 'email'));

    // call the method to create a new utilisateur with an empty utilisateur role_id
    await expect(
      utilisateurCustomRepository.saveUtilisateur(utilisateurExpected.username, utilisateurExpected.email, undefined),
    ).rejects.toThrow(new ErrorUndefinedMandatoryArgument('saveUtilisateur', 'role_id'));

    // call the method to create a new utilisateur with a wrong lan_id
    await expect(
      utilisateurCustomRepository.saveUtilisateur(utilisateurExpected.username, utilisateurExpected.email, 99999999),
    ).rejects.toThrow(new ErrorEntityDoesNotExist('Role', 99999999));
  });

  it('Send the form to the API to update a utilisateur', async () => {
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

    // get repository
    const utilisateurCustomRepository = getCustomRepository(UtilisateurControllerEntity);

    // update utilisateur with a new utilisateur and a new role
    const utilisateurResult = await utilisateurCustomRepository.saveUtilisateur(
      utilisateurExpected.username,
      utilisateurExpected.email,
      newRole.id,
      utilisateurExpected.id,
    );
    utilisateurExpected.id = utilisateurResult.id;
    expect(utilisateurResult).toEqual(utilisateurExpected);

    // Disable console.error to hide the log that will be provocated by the test that verify that error are throwed
    console.error = jest.fn();

    // call the method to update a utilisateur with a wrong id
    await expect(
      utilisateurCustomRepository.saveUtilisateur(
        utilisateurCreated.username,
        utilisateurCreated.email,
        newRole.id,
        99999999,
      ),
    ).rejects.toThrow(new ErrorEntityDoesNotExist('Utilisateur', 99999999));
  });

  it('Delete a utilisateur', async () => {
    // create a uniq identifier for the test
    const uniqIdentifier = new Date().getTime();

    // create role and utilisateur for the test
    const role = await getManager().save(new Role(`admin-${uniqIdentifier}`));
    const createdUtilisateur = await getManager().save(
      new Utilisateur(`hgomez${uniqIdentifier}`, `hgomez-${uniqIdentifier}@hapy.fr`, role),
    );

    // get repository
    const utilisateurCustomRepository = getCustomRepository(UtilisateurControllerEntity);

    // call the method to delete the utilisateur
    const utilisateurResult = await utilisateurCustomRepository.deleteUtilisateur(createdUtilisateur.id);

    expect(utilisateurResult).toEqual(createdUtilisateur);

    // check if the utilisateur has been successfully deleted
    const result = await getManager().findOne('utilisateur', createdUtilisateur.id);
    expect(result).toEqual(undefined);

    // Disable console.error to hide the log that will be provocated by the test that verify that error are throwed
    console.error = jest.fn();

    // call the method to delete a utilisateur with a wrong utilisateur id
    await expect(utilisateurCustomRepository.deleteUtilisateur(99999999)).rejects.toThrow(
      new ErrorEntityDoesNotExist('Utilisateur', 99999999),
    );

    // call the method to delete a utilisateur with an undefined utilisateur id
    await expect(utilisateurCustomRepository.deleteUtilisateur(undefined)).rejects.toThrow(
      new ErrorUndefinedMandatoryArgument('deleteUtilisateur', 'id'),
    );
  });

  it('Delete several utilisateurs,', async () => {
    // create a uniq identifier for the test
    const uniqIdentifier = new Date().getTime();

    // create role and utilisateur for the test
    const role = await getManager().save(new Role(`admin-${uniqIdentifier}`));
    const createdUtilisateur = await getManager().save(
      new Utilisateur(`hgomez${uniqIdentifier}`, `hgomez-${uniqIdentifier}@hapy.fr`, role),
    );

    // get the repository
    const utilisateurCustomRepository = getCustomRepository(UtilisateurControllerEntity);

    // call the method to delete an utilisateur
    const utilisateurResult = await utilisateurCustomRepository.deleteUtilisateurs([createdUtilisateur.id]);

    // verify that the utilisateur has been correctly returned
    expect(utilisateurResult[0]).toEqual(createdUtilisateur);

    // verify that the utilisateur has been correctly deleted
    const result = await getManager().findOne('utilisateur', createdUtilisateur.id);
    expect(result).toEqual(undefined);

    // Disable console.error to hide the log that will be provocated by the test that verify that error are throwed
    console.error = jest.fn();

    // call the method to delete many utilisateurs with wrong ids
    await expect(utilisateurCustomRepository.deleteUtilisateurs([99999999])).rejects.toThrow(
      new ErrorEntityDoesNotExist('Utilisateur', 99999999),
    );

    // call the method to delete many utilisateurs with undefined ids
    await expect(utilisateurCustomRepository.deleteUtilisateurs(undefined)).rejects.toThrow(
      new ErrorUndefinedMandatoryArgument('deleteUtilisateurs', 'ids'),
    );
  });
});
