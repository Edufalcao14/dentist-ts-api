import { BusinessError } from './business-error.js';
import { ErrorCode } from './error-code.js';

export class UnknownError extends BusinessError {
  constructor(message: string, args?: object, stack?: string) {
    super(message, ErrorCode.UNKNOWN, 500, args, stack);
  }
}
