import { BaseException } from './base.exception';

export class InternalServerException extends BaseException {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}
