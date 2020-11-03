import ErrorWithCode from './ErrorWithCode';

export default class ErrorUnvalidUsername extends ErrorWithCode {
  constructor(username: string) {
    const message = `Sorry no user have a username matching ${username}. This user doesn't exist.`;
    super(message, 'AUTH.UNVALID_USERNAME');
  }
}
