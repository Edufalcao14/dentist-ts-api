import { BusinessError } from './business-error.js';
import { ErrorCode } from './error-code.js';

export class BadUserInputError extends BusinessError {
  constructor(message: string, args?: object, stack?: string) {
    super(message, ErrorCode.BAD_USER_INPUT, 400, args, stack);
    this.name = this.constructor.name;
  }
}
