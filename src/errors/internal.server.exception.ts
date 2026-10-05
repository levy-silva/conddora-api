import { BaseException } from './base.exception';

export class InternalServerException extends BaseException {
  constructor(error: unknown) {
    super(
      (error instanceof Error && error.message) || 'Iternal Server Error',
      500,
    );
  }
}
