import { BaseException } from './base.exception';

export class ForbiddenException extends BaseException {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}
