import { Request, Response } from 'express';
import RoleControllerEntity from '../controllerEntity/RoleControllerEntity';
import returnJson from '../utils/returnJson';
import { getCustomRepository } from 'typeorm';
import CustomLog from '../utils/CustomLog';

/**
 * return the list of roles according to given query properties
 * @params {Request} request
 * @params {Response} response
 * @params {NextFunction} next
 * @returns {object}
 */
export async function getRoles(request: Request, response: Response): Promise<void> {
  try {
    const rolesRepository = getCustomRepository(RoleControllerEntity);
    const queryProps = request.body;
    const roles = await rolesRepository.getRoles(
      queryProps.limite,
      queryProps.offset,
      queryProps.orderField,
      queryProps.orderType,
      queryProps.name,
    );
    returnJson(response, roles);
  } catch (error) {
    CustomLog.error(error.message, error);
    throw error;
  }
}

/**
 * return the number of roles according to given query properties
 * @params {Request} request
 * @params {Response} response
 * @params {NextFunction} next
 * @returns {number}
 */
export async function countRoles(request: Request, response: Response): Promise<void> {
  try {
    const countRepository = getCustomRepository(RoleControllerEntity);
    const count = await countRepository.countRoles(request.body.name);
    returnJson(response, count);
  } catch (error) {
    CustomLog.error(error.message, error);
    throw error;
  }
}
