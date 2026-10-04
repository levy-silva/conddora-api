import { BaseException } from './base.exception';

export class UnauthorizedException extends BaseException {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}
