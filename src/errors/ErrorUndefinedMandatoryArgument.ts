import ErrorWithCode from './ErrorWithCode';

export default class ErrorUndefinedMandatoryArgument extends ErrorWithCode {
  constructor(methodName: string, undefinedArgument: string | string[]) {
    const message = `${methodName} has been called with undefined mandatory arguments : ${undefinedArgument}`;
    super(message, 'APP.UNDEFINED_MANDATORY_ARGUMENT');
  }
}
