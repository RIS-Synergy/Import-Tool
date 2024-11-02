export type ErrorMessage = {} // TODO: define error message type, e.g. { message: string } or { error: string } ?

export abstract class CustomError {
  abstract status: number;
  errors: Array<ErrorMessage>
  message: string
  constructor(message: string, errors: Array<ErrorMessage> = []) {
    this.message = message
    // super(message)
    Object.setPrototypeOf(this, CustomError.prototype)
    this.errors = errors
  }
  serialize() {
    // console.log(this.errors)
    return {
      error: this.message,
      details: this.errors
    }
  }
}

export class NotFoundError extends CustomError {
  status = 404
  constructor(message = 'Not Found') {
    super(message)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class BadRequestError extends CustomError {
  status = 400
  constructor(message = 'Bad Request', errors: Array<ErrorMessage> = []) {
    super(message)
    Object.setPrototypeOf(this, BadRequestError.prototype)
    this.errors = errors
  }
}

export class AuthenticationError extends CustomError {
  status = 401
  constructor(message = 'Authentication Error') {
    super(message)
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }
}
