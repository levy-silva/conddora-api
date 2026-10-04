import { Response } from 'express';

export class BaseException extends Error {
  public readonly status: number;

  constructor(message = 'Server Error', status = 500) {
    super(message);
    this.status = status;
  }

  send(res: Response) {
    return res.status(this.status).json({
      staus: this.status,
      message: this.message,
    });
  }
}
