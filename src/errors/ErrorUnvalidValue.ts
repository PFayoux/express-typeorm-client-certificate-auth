import ErrorWithCode from './ErrorWithCode';

export default class ErrorUnvalidValue extends ErrorWithCode {
  constructor(methodName: string, undefinedArgument: string | string[]) {
    const message = `${methodName} has been called with an unvalid value for : ${undefinedArgument}`;
    super(message, 'APP.UNVALID_VALUE');
  }
}
