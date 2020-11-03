import { EntityRepository, Repository, getManager } from 'typeorm';
import { Utilisateur } from '../entity/Utilisateur';
import { Role } from '../entity/Role';
import ErrorEntityDoesNotExist from '../errors/ErrorEntityDoesNotExist';
import ErrorUndefinedMandatoryArgument from '../errors/ErrorUndefinedMandatoryArgument';
import CustomLog from '../utils/CustomLog';

@EntityRepository(Utilisateur)
export default class UtilisateurControllerEntity extends Repository<Utilisateur> {
  /**
   * return an utilisateur
   * @param {number} id - The id of the utilisateur
   * @throws ErrorEntityDoesNotExist if the utilisateur id doesn't exist
   * @throws ErrorUndefinedMandatoryArgument if mandatory params (id) are not provided
   * @returns {Promise<Utilisateur>} return the Utilisateur
   */
  public async getUtilisateur(id: number): Promise<Utilisateur> {
    try {
      if (id === undefined) {
        throw new ErrorUndefinedMandatoryArgument('getUtilisateur', 'id');
      }

      const query = this.createQueryBuilder('utilisateur')
        .innerJoinAndSelect('utilisateur.role', 'role')
        .where('utilisateur.id = :id', { id });

      // return the result of the query
      const utilisateur = await query.getOne();

      if (utilisateur === undefined) {
        throw new ErrorEntityDoesNotExist('Utilisateur', id);
      }

      return utilisateur;
    } catch (error) {
      CustomLog.error(error.message, error);
      throw error;
    }
  }

  /**
   * return the list of utilisateurs
   * @param {number} [limit] - number of utilisateurs that will be returned
   * @param {number} [skip] - number of utilisateurs skipped at the beginning of the result array
   * @param {string} [orderField] - the field used to order the result
   * @param {string} [orderType] - the type of order, ASC or DSC
   * @param {string} [username] - if set add a condition to query utilisateurs by their username
   * @param {string} [email] - if set add a condition to query utilisateurs by their email
   * @param {string} [role_name] - if set add a condition to query utilisateurs role by their name
   * @returns {Promise<Array<Utilisateur>>} return the list of Utilisateurs
   */
  public async getUtilisateurs(
    limit?: number,
    skip?: number,
    orderField?: string,
    orderType?: string,
    username?: string,
    email?: string,
    role_name?: string,
  ): Promise<Array<Utilisateur>> {
    try {
      let subQuery = this.createQueryBuilder('utilisateur')
        .innerJoinAndSelect('utilisateur.role', 'role')
        .select('utilisateur.id');

      // variable that will tell if a condition has been applyed yet or not
      let firstWhere = true;

      // get the correct where method, on first where will return 'where'
      // on the following will return 'andWhere'
      const whereMethod = () => {
        const whereMethod = firstWhere ? 'where' : 'andWhere';
        firstWhere = false;
        return whereMethod;
      };

      // apply condition only if the parameters are set
      if (username) {
        subQuery = subQuery[whereMethod()]('utilisateur.username LIKE :username', { username });
      }

      if (email) {
        subQuery = subQuery[whereMethod()]('utilisateur.email LIKE :email', { email });
      }

      if (role_name !== undefined) {
        subQuery = subQuery[whereMethod()]('role.name LIKE :role_name', { role_name });
      }

      let query = this.createQueryBuilder('utilisateur')
        .innerJoinAndSelect('utilisateur.role', 'role')
        .where(`utilisateur.id IN (${subQuery.getQuery()})`)
        .setParameters(subQuery.getParameters());

      if (skip) {
        query = query.skip(skip);
      }

      if (limit) {
        query = query.take(limit);
      }

      if (orderField) {
        query = query.orderBy(orderField, orderType === 'ASC' ? 'ASC' : 'DESC');
      }

      // return the result of the query
      const utilisateurs = await query.getMany();

      return utilisateurs;
    } catch (error) {
      CustomLog.error(error.message, error);
      throw error;
    }
  }

  /**
   * return the number of Utilisateur
   * @param {string} [username] - if set add a condition to query utilisateurs by their username
   * @param {string} [email] - if set add a condition to query utilisateurs by their email
   * @param {string} [role_name] - if set add a condition to query utilisateurs by their role name
   * @returns {Promise<number>} return the number of Utilisateurs
   */
  public async countUtilisateurs(username?: string, email?: string, role_name?: string): Promise<number> {
    try {
      let subQuery = this.createQueryBuilder('utilisateur')
        .innerJoinAndSelect('utilisateur.role', 'role')
        .select('utilisateur.id');

      // variable that will tell if a condition has been applyed yet or not
      let firstWhere = true;

      // get the correct where method, on first where will return 'where'
      // on the following will return 'andWhere'
      const whereMethod = () => {
        const whereMethod = firstWhere ? 'where' : 'andWhere';
        firstWhere = false;
        return whereMethod;
      };

      // apply condition only if the parameters are set
      if (username) {
        subQuery = subQuery[whereMethod()]('utilisateur.username LIKE :username', { username });
      }

      if (email) {
        subQuery = subQuery[whereMethod()]('utilisateur.email LIKE :email', { email });
      }

      if (role_name !== undefined) {
        subQuery = subQuery[whereMethod()]('role.name LIKE :role_name', { role_name });
      }

      const query = this.createQueryBuilder('utilisateur')
        .innerJoinAndSelect('utilisateur.role', 'role')
        .where(`utilisateur.id IN (${subQuery.getQuery()})`)
        .setParameters(subQuery.getParameters());

      // return the result of the query
      const count = await query.getCount();
      return count;
    } catch (error) {
      CustomLog.error(error.message, error);
      throw error;
    }
  }

  /**
   * create (or update) an utilisateur
   * @param {string} username - username of the utilisateur
   * @param {string} email - email of the utilisateur
   * @param {number} role_id - id of the role associated to the utilisateur
   * @param {number} [id] - id of the utilisateur (if set will update the utilisateur)
   * @throws ErrorEntityDoesNotExist if the utilisateur id doesn't exist
   * @throws ErrorEntityDoesNotExist if the role id (role_id) doesn't exists
   * @throws ErrorUndefinedMandatoryArgument if mandatory params (username, email, role_id) are not provided
   * @returns {Promise<Utilisateur>} return the newly created utilisateur
   */
  public async saveUtilisateur(username: string, email: string, role_id: number, id?: number): Promise<Utilisateur> {
    try {
      if (id) {
        const utilisateurToUpdate = await this.getUtilisateur(id);
        if (!utilisateurToUpdate) {
          throw new ErrorEntityDoesNotExist('Utilisateur', id);
        }
      }

      if (username === undefined) {
        throw new ErrorUndefinedMandatoryArgument('saveUtilisateur', 'username');
      }

      if (email === undefined) {
        throw new ErrorUndefinedMandatoryArgument('saveUtilisateur', 'email');
      }

      // get the role by its id
      let role = undefined;

      if (role_id === undefined) {
        throw new ErrorUndefinedMandatoryArgument('saveUtilisateur', 'role_id');
      }
      role = await getManager().findOne<Role>('role', role_id);

      if (role === undefined) {
        throw new ErrorEntityDoesNotExist('Role', role_id);
      }

      // create a new utilisateur
      const utilisateur = new Utilisateur(username, email, role, id);

      // save the utilisateur in the database
      const createdUtilisateur = await this.save(utilisateur);

      // return the created utilisateur
      return await this.getUtilisateur(createdUtilisateur.id);
    } catch (error) {
      CustomLog.error(error.message, error);
      throw error;
    }
  }

  /**
   * delete an utilisateur
   * @param {number} id - The id of the utilisateur
   * @throws Will throw an error if the utilisateur id doesn't exist
   * @throws ErrorUndefinedMandatoryArgument if mandatory params (id) are not provided
   * @returns {Promise<Utilisateur>} return the deleted Utilisateur
   */
  public async deleteUtilisateur(id: number): Promise<Utilisateur> {
    try {
      if (id === undefined) {
        throw new ErrorUndefinedMandatoryArgument('deleteUtilisateur', 'id');
      }

      const utilisateur = await this.getUtilisateur(id);
      await this.delete(id);
      return utilisateur;
    } catch (error) {
      CustomLog.error(error.message, error);
      throw error;
    }
  }

  /**
   * delete many utilisateurs
   * @param {number[]} ids - The ids of the utilisateurs
   * @throws ErrorEntityDoesNotExist if an utilisateur id doesn't exist
   * @throws ErrorUndefinedMandatoryArgument if mandatory params (ids) are not provided
   * @returns {Promise<Utilisateur>} return the deleted Utilisateurs
   */
  public async deleteUtilisateurs(ids: number[]): Promise<Array<Utilisateur>> {
    try {
      if (ids === undefined) {
        throw new ErrorUndefinedMandatoryArgument('deleteUtilisateurs', 'ids');
      }

      const utilisateursPromises: Array<Promise<Utilisateur>> = [];
      for (const id of ids) {
        utilisateursPromises.push(this.getUtilisateur(id));
      }
      const utilisateurs = await Promise.all(utilisateursPromises);
      if (utilisateurs.includes(undefined)) {
        const utilisateurIds = utilisateurs.map((utilisateur) =>
          utilisateur !== undefined ? utilisateur.id : undefined,
        );
        const notFoundIds = ids.filter((id) => !utilisateurIds.includes(id));
        throw new ErrorEntityDoesNotExist('Utilisateur', notFoundIds);
      }
      await this.delete(ids);
      return utilisateurs;
    } catch (error) {
      CustomLog.error(error.message, error);
      throw error;
    }
  }
}
