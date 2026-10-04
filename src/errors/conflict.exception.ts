import { BaseException } from './base.exception';

export class ConflictException extends BaseException {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}
