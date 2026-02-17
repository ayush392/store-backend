export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, { statusCode = 500, code = 'INTERNAL_ERROR' }) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, { statusCode: 400, code: 'BAD_REQUEST' });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, { statusCode: 401, code: 'UNAUTHORIZED' });
  }
}
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, { statusCode: 403, code: 'FORBIDDEN' });
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, { statusCode: 404, code: 'NOT_FOUND' });
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, { statusCode: 429, code: 'TOO_MANY_REQUESTS' });
  }
}

// export class ValidationError extends AppError {
//   errors?: { field: string; message: string }[];

//   constructor(
//     message = 'Validation failed',
//     errors?: { field: string; message: string }[]
//   ) {
//     super(message, { statusCode: 400, code: 'VALIDATION_ERROR' });
//     this.errors = errors;
//   }
// }
