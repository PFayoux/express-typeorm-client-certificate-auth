import ErrorWithCode from './ErrorWithCode';

export default class ErrorInsecureConnection extends ErrorWithCode {
  constructor() {
    const message = "Your connection is unsecure you can't access to the api.";
    super(message, 'APP.INSECURE_CONNECTION');
  }
}
