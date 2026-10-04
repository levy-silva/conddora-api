import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}
