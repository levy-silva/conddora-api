export class BaseException extends Error {
  public readonly status: number;

  constructor(message = 'Server Error', status = 500) {
    super(message);
    this.status = status;
  }
}
