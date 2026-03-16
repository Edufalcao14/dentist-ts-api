import { ErrorCode } from './error-code.js';

export class BusinessError extends Error {
  code: ErrorCode;
  status: number;
  args: object | undefined;

  constructor(
    message: string,
    code: ErrorCode,
    status: number = 500,
    args?: object,
    stack?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.args = args;
    if (stack) {
      this.stack = stack;
    }
  }
}
