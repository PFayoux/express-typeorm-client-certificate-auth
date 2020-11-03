import { EntityRepository, Repository } from 'typeorm';
import { Role } from '../entity/Role';
import CustomLog from '../utils/CustomLog';

@EntityRepository(Role)
export default class RoleControllerEntity extends Repository<Role> {
  /**
   * return the list of roles
   * @param {number} [limit] - number of roles that will be returned
   * @param {number} [skip] - number of roles skipped at the beginning of the result array
   * @param {string} [orderField] - the field used to order the result
   * @param {string} [orderType] - the type of order, ASC or DSC
   * @param {string} [name] - if set add a condition to query roles by their name
   * @returns {Promise<Array<Role>>} return the list of Role
   */
  public async getRoles(
    limit?: number,
    skip?: number,
    orderField?: string,
    orderType?: string,
    name?: string,
  ): Promise<Array<Role>> {
    try {
      let subQuery = this.createQueryBuilder('role').select('role.id');

      // variable that will tell if a condition has been applied yet or not
      let firstWhere = true;

      // get the correct where method, on first where will return 'where'
      // on the following will return 'andWhere'
      const whereMethod = () => {
        const whereMethod = firstWhere ? 'where' : 'andWhere';
        firstWhere = false;
        return whereMethod;
      };

      // apply condition only if the parameters are set
      if (name) {
        subQuery = subQuery[whereMethod()]('role.name LIKE :name', { name });
      }

      let query = this.createQueryBuilder('role')
        .where(`role.id IN (${subQuery.getQuery()})`)
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
      const roles = await query.getMany();

      return roles;
    } catch (error) {
      CustomLog.error(error.message, error);
      throw error;
    }
  }

  /**
   * return the amount of roles
   * @param {string} [name] - if set add a condition to query roles by their name
   * @returns {Promise<number>} return the number of Roles
   */
  public async countRoles(name?: string): Promise<number> {
    try {
      let subQuery = this.createQueryBuilder('role').select('role.id');

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
      if (name) {
        subQuery = subQuery[whereMethod()]('role.name LIKE :name', { name });
      }

      const query = this.createQueryBuilder('role')
        .where(`role.id IN (${subQuery.getQuery()})`)
        .setParameters(subQuery.getParameters());

      // return the result of the query
      const count = await query.getCount();
      return count;
    } catch (error) {
      CustomLog.error(error.message, error);
      throw error;
    }
  }
}
