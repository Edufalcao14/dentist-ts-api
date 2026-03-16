import { BusinessError } from './business-error.js';
import { ErrorCode } from './error-code.js';

export class NotFoundError extends BusinessError {
  constructor(message: string, args?: object, stack?: string) {
    super(message, ErrorCode.NOT_FOUND, 404, args, stack);
  }
}
