import { BusinessError } from './business-error.js';
import { ErrorCode } from './error-code.js';

export class ForbiddenError extends BusinessError {
  constructor(message: string, args?: object, stack?: string) {
    super(message, ErrorCode.FORBIDDEN, 403, args, stack);
    this.name = this.constructor.name;
  }
}
