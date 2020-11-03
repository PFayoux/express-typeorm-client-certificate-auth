import { Response } from 'express';
import { Role } from '../entity/Role';
import { Utilisateur } from '../entity/Utilisateur';

/**
 * This method will format a json response and send it back to the client
 * @param response the response object
 * @param data the data to send
 * @param error the error to return
 */
export default function returnJson(
  response: Response,
  data:
    | boolean
    | number
    | string
    | Record<string, string | number | boolean>
    | Role
    | Role[]
    | Utilisateur
    | Utilisateur[] = null,
  error: Error = null,
  status?: number,
): void {
  // if there is an error return success = false
  const success = error ? false : true;

  // create the json to return
  const json = {
    success,
    data,
    error,
  };

  // default status
  let statusFinal = 200;

  // if a status is given
  if (status) {
    statusFinal = status;
  } else if (error) {
    // if there is an error (and no status given)
    statusFinal = 401;
  }

  // send the json response
  response.status(statusFinal).json(json);
}
