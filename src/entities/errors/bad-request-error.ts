import { BusinessError } from './business-error.js';
import { ErrorCode } from './error-code.js';

export class BadRequestError extends BusinessError {
  constructor(message: string, args?: object, stack?: string) {
    super(message, ErrorCode.BAD_REQUEST, 400, args, stack);
    this.name = this.constructor.name;
  }
}
