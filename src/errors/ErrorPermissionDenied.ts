import ErrorWithCode from './ErrorWithCode';

export default class ErrorPermissionDenied extends ErrorWithCode {
  constructor() {
    const message = `Sorry your account doesn't have enough right to access this route.`;
    super(message, 'AUTH.PERMISSION_DENIED');
  }
}
