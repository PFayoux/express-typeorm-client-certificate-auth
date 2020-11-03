import ErrorWithCode from './ErrorWithCode';

export default class ErrorEntityDoesNotExist extends ErrorWithCode {
  constructor(entityClass: string, id: number | number[]) {
    const message = `${entityClass} with provided id ${id} does not exist.`;
    super(message, 'APP.ENTITY_DOES_NOT_EXIST');
  }
}
