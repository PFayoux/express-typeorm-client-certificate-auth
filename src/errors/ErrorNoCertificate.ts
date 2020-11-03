import ErrorWithCode from './ErrorWithCode';

export default class ErrorNoCertificate extends ErrorWithCode {
  constructor() {
    const message = 'Sorry, but you need to provide a client certificate to continue.';
    super(message, 'AUTH.NO_CERTIFICATE');
  }
}
