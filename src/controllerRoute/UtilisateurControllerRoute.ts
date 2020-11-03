import { Request, Response } from 'express';
import UtilisateurControllerEntity from '../controllerEntity/UtilisateurControllerEntity';
import returnJson from '../utils/returnJson';
import { getCustomRepository } from 'typeorm';
import CustomLog from '../utils/CustomLog';

/**
 * return the utilisateur to given params id
 * @params {Request} request
 * @params {Response} response
 * @params {NextFunction} next
 * @throws ErrorUndefinedMandatoryArgument if the id doesn't exist
 * @returns {object}
 */
export async function getUtilisateur(request: Request, response: Response): Promise<void> {
  try {
    const utilisateurRepository = getCustomRepository(UtilisateurControllerEntity);
    const utilisateur = await utilisateurRepository.getUtilisateur(request.params.id);
    returnJson(response, utilisateur);
  } catch (error) {
    CustomLog.error(error.message, error);
    throw error;
  }
}

/**
 * return the list of utilisateurs according to given query properties
 * @params {Request} request
 * @params {Response} response
 * @params {NextFunction} next
 * @returns {object}
 */
export async function getUtilisateurs(request: Request, response: Response): Promise<void> {
  try {
    const queryProps = request.body;
    const utilisateursRepository = getCustomRepository(UtilisateurControllerEntity);
    const utilisateurs = await utilisateursRepository.getUtilisateurs(
      queryProps.limit,
      queryProps.offset,
      queryProps.orderField,
      queryProps.orderType,
      queryProps.username,
      queryProps.email,
      queryProps.role_name,
    );
    returnJson(response, utilisateurs);
  } catch (error) {
    CustomLog.error(error.message, error);
    throw error;
  }
}

/**
 * return the number of utilisateurs according to given query properties
 * @params {Request} request
 * @params {Response} response
 * @params {NextFunction} next
 * @returns {JSON}
 */
export async function countUtilisateurs(request: Request, response: Response): Promise<void> {
  try {
    const queryProps = request.body;
    const countRepository = getCustomRepository(UtilisateurControllerEntity);
    const count = await countRepository.countUtilisateurs(queryProps.username, queryProps.email, queryProps.role_name);
    returnJson(response, count);
  } catch (error) {
    CustomLog.error(error.message, error);
    throw error;
  }
}

/**
 * create an utilisateur with the given properties
 * @params {Request} request
 * @params {Response} response
 * @params {NextFunction} next
 * @throws ErrorEntityDoesNotExist if the role id (role_id) doesn't exists
 * @throws ErrorUndefinedMandatoryArgument if mandatory params
 */
export async function createUtilisateur(request: Request, response: Response): Promise<void> {
  try {
    const utilisateurProps = request.body;
    const utilisateurRepository = getCustomRepository(UtilisateurControllerEntity);
    const utilisateur = await utilisateurRepository.saveUtilisateur(
      utilisateurProps.username,
      utilisateurProps.email,
      utilisateurProps.role_id,
    );
    returnJson(response, utilisateur);
  } catch (error) {
    CustomLog.error(error.message, error);
    throw error;
  }
}

/**
 * update an utilisateur with the given properties
 * @params {Request} request
 * @params {Response} response
 * @params {NextFunction} next
 * @throws ErrorEntityDoesNotExist if the utilisateur id doesn't exist
 * @throws ErrorEntityDoesNotExist if the role id (role_id) doesn't exists
 * @throws ErrorUndefinedMandatoryArgument if mandatory params
 */
export async function updateUtilisateur(request: Request, response: Response): Promise<void> {
  try {
    const utilisateurProps = request.body;
    const utilisateurRepository = getCustomRepository(UtilisateurControllerEntity);
    const utilisateur = await utilisateurRepository.saveUtilisateur(
      utilisateurProps.username,
      utilisateurProps.email,
      utilisateurProps.role_id,
      parseInt(request.params.id),
    );
    returnJson(response, utilisateur);
  } catch (error) {
    CustomLog.error(error.message, error);
    throw error;
  }
}

/**
 * delete many utilisateurs with the given ids
 * @params {Request} request
 * @params {Response} response
 * @params {NextFunction} next
 * @throws ErrorUndefinedMandatoryArgument if mandatory params (ids) are not provided
 */
export async function deleteUtilisateurs(request: Request, response: Response): Promise<void> {
  try {
    const utilisateurRepository = getCustomRepository(UtilisateurControllerEntity);
    const utilisateurs = await utilisateurRepository.deleteUtilisateurs(request.body.ids);
    returnJson(response, utilisateurs);
  } catch (error) {
    CustomLog.error(error.message, error);
    throw error;
  }
}

/**
 * delete an utilisateur with the given id
 * @params {Request} request
 * @params {Response} response
 * @params {NextFunction} next
 * @throws ErrorUndefinedMandatoryArgument if mandatory params (id) are not provided
 */
export async function deleteUtilisateur(request: Request, response: Response): Promise<void> {
  try {
    const utilisateurRepository = getCustomRepository(UtilisateurControllerEntity);
    const utilisateur = await utilisateurRepository.deleteUtilisateur(request.params.id);
    returnJson(response, utilisateur);
  } catch (error) {
    CustomLog.error(error.message, error);
    throw error;
  }
}
