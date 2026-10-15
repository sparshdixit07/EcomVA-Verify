import { ApiError } from '../utils/ApiError.js';

export function validate(schema, source = 'body') {
  return function validator(req, _res, next) {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message
      }));
      return next(ApiError.badRequest('Validation failed', errors));
    }
    req[source] = result.data;
    next();
  };
}

export function validateMulti(schemas) {
  return function multiValidator(req, _res, next) {
    const errors = [];
    for (const [source, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(req[source]);
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push({ field: issue.path.join('.') || source, message: issue.message });
        }
      } else {
        req[source] = result.data;
      }
    }
    if (errors.length) return next(ApiError.badRequest('Validation failed', errors));
    next();
  };
}