import { logger } from '../setup/logger.js';

/**
 * Express.js Error Handling Middleware - Production Ready Boilerplate
 * 
 * USAGE:
 * - Throw errors in controllers: throw new HttpError(404, 'Not found')
 * - Use factory functions: throw createError.notFound('Resource not found')
 * - Wrap async routes: router.get('/path', asyncHandler(async (req, res) => {...}))
 * 
 * FEATURES:
 * - HttpError: Base error class with status codes and error codes
 * - Specialized errors: ValidationError, RateLimitError, AuthenticationError, AuthorizationError
 * - createError: Factory functions for all common HTTP errors
 * - formatValidationErrors: Universal validation error formatter (express-validator, Joi, Yup)
 * - asyncHandler: Async error wrapper for route handlers
 * - isOperationalError: Distinguish expected errors from programming errors
 * - Production-safe error responses (no stack traces or sensitive data)
 * 
 * INTEGRATION:
 * - Add to Express app after all routes: app.use(notFoundHandler); app.use(errorHandler);
 * - Wrap async routes: router.get('/path', asyncHandler(yourAsyncFunction))
 */

/**
 * Common HTTP error class for standardized error handling
 * @extends Error
 * @param {number} status - HTTP status code (e.g., 404, 500)
 * @param {string} message - Human-readable error message
 * @param {string|null} code - Machine-readable error code (e.g., 'NOT_FOUND')
 * @param {*} details - Additional error details or context
 */
export class HttpError extends Error {
	constructor(status, message, code = null, details = null) {
		super(message);
		this.name = this.constructor.name;
		this.status = status;
		this.code = code || this.getDefaultCode(status);
		this.details = details;
		this.isOperational = true; // Distinguishes operational errors from programming errors
		Error.captureStackTrace(this, this.constructor);
	}

	getDefaultCode(status) {
		const codes = {
			400: 'BAD_REQUEST',
			401: 'UNAUTHORIZED',
			403: 'FORBIDDEN',
			404: 'NOT_FOUND',
			405: 'METHOD_NOT_ALLOWED',
			408: 'REQUEST_TIMEOUT',
			409: 'CONFLICT',
			410: 'GONE',
			413: 'PAYLOAD_TOO_LARGE',
			415: 'UNSUPPORTED_MEDIA_TYPE',
			422: 'VALIDATION_ERROR',
			429: 'TOO_MANY_REQUESTS',
			500: 'INTERNAL_ERROR',
			501: 'NOT_IMPLEMENTED',
			502: 'BAD_GATEWAY',
			503: 'SERVICE_UNAVAILABLE',
			504: 'GATEWAY_TIMEOUT',
		};
		return codes[status] || 'ERROR';
	}

	toJSON() {
		return {
			name: this.name,
			message: this.message,
			status: this.status,
			code: this.code,
			details: this.details,
			isOperational: this.isOperational
		};
	}
}

/**
 * Validation error class for handling field validation errors
 * @extends HttpError
 * @param {Array|Object} errors - Validation errors from express-validator, Joi, Yup, etc.
 * @example
 * throw new ValidationError([{ field: 'email', message: 'Invalid email' }]);
 */
export class ValidationError extends HttpError {
	constructor(errors) {
		const details = Array.isArray(errors) ? errors : [errors];
		super(422, 'Validation failed', 'VALIDATION_ERROR', details);
		this.name = 'ValidationError';
	}
}

/**
 * Rate limit error class for API rate limiting
 * @extends HttpError
 * @param {number|null} retryAfter - Seconds until the client can retry
 * @example
 * throw new RateLimitError(60); // Retry after 60 seconds
 */
export class RateLimitError extends HttpError {
	constructor(retryAfter = null) {
		const details = retryAfter ? { retryAfter } : null;
		super(429, 'Too many requests', 'TOO_MANY_REQUESTS', details);
		this.name = 'RateLimitError';
		this.retryAfter = retryAfter;
	}
}

/**
 * Authentication error class for missing or invalid credentials
 * @extends HttpError
 * @param {string} message - Error message
 * @param {*} details - Additional error details
 * @example
 * throw new AuthenticationError('Invalid credentials');
 */
export class AuthenticationError extends HttpError {
	constructor(message = 'Authentication required', details = null) {
		super(401, message, 'UNAUTHORIZED', details);
		this.name = 'AuthenticationError';
	}
}

/**
 * Authorization error class for insufficient permissions
 * @extends HttpError
 * @param {string} message - Error message
 * @param {*} details - Additional error details
 * @example
 * throw new AuthorizationError('Admin access required');
 */
export class AuthorizationError extends HttpError {
	constructor(message = 'Insufficient permissions', details = null) {
		super(403, message, 'FORBIDDEN', details);
		this.name = 'AuthorizationError';
	}
}

/**
 * 404 Not Found handler middleware
 * Catches all unmatched routes and passes a 404 error to the error handler
 * Place this middleware after all other routes
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export function notFoundHandler(req, res, next) {
	const error = new HttpError(
		404,
		`Resource not found: ${req.originalUrl}`,
		'NOT_FOUND',
		{ path: req.originalUrl, method: req.method }
	);
	next(error);
}

/**
 * Global error handler middleware
 * Must be placed after all routes and other middleware
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
	// If response was already sent, delegate to default Express error handler
	if (res.headersSent) {
		return next(err);
	}

	// Extract error properties with safe defaults
	let status = err.status || err.statusCode || 500;
	let code = err.code || 'INTERNAL_ERROR';
	let message = err.message || 'Internal server error';
	let details = err.details || null;

	// Handle different error types
	if (err.name === 'ValidationError') {
		// Mongoose validation error
		status = 422;
		code = 'VALIDATION_ERROR';
		message = 'Validation failed';
		details = Object.values(err.errors).map(e => ({
			field: e.path,
			message: e.message,
			value: e.value
		}));
	} else if (err.name === 'CastError') {
		// Mongoose cast error
		status = 400;
		code = 'INVALID_ID';
		message = 'Invalid ID format';
		details = { field: err.path, value: err.value };
	} else if (err.name === 'MongoServerError' && err.code === 11000) {
		// MongoDB duplicate key error
		status = 409;
		code = 'DUPLICATE_ENTRY';
		const field = Object.keys(err.keyPattern)[0];
		message = `Duplicate value for field: ${field}`;
		details = { field, value: err.keyValue[field] };
	} else if (err.name === 'JsonWebTokenError') {
		// JWT errors
		status = 401;
		code = 'INVALID_TOKEN';
		message = 'Invalid authentication token';
	} else if (err.name === 'TokenExpiredError') {
		// JWT expired
		status = 401;
		code = 'TOKEN_EXPIRED';
		message = 'Authentication token has expired';
	} else if (err.type === 'entity.parse.failed') {
		// Body parser error
		status = 400;
		code = 'INVALID_JSON';
		message = 'Invalid JSON in request body';
	} else if (err.name === 'MulterError') {
		// File upload errors
		status = 400;
		code = 'FILE_UPLOAD_ERROR';
		message = err.message;
		if (err.code === 'LIMIT_FILE_SIZE') {
			code = 'FILE_TOO_LARGE';
			message = 'File size exceeds the maximum allowed limit';
		} else if (err.code === 'LIMIT_FILE_COUNT') {
			code = 'TOO_MANY_FILES';
			message = 'Too many files uploaded';
		} else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
			code = 'UNEXPECTED_FIELD';
			message = `Unexpected field: ${err.field}`;
		}
	} else if (err.name === 'PayloadTooLargeError') {
		// Express body parser limit error
		status = 413;
		code = 'PAYLOAD_TOO_LARGE';
		message = 'Request payload is too large';
	} else if (err.name === 'SyntaxError' && err.status === 400) {
		// JSON parse error
		status = 400;
		code = 'INVALID_JSON';
		message = 'Invalid JSON syntax in request body';
	} else if (err.code === 'ECONNREFUSED') {
		// Database/service connection error
		status = 503;
		code = 'SERVICE_UNAVAILABLE';
		message = 'Service temporarily unavailable';
	} else if (err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED') {
		// Timeout errors
		status = 504;
		code = 'GATEWAY_TIMEOUT';
		message = 'Request timeout';
	}

	// Log error details for debugging
	const logData = {
		error: {
			name: err.name,
			message: err.message,
			code,
			status,
			stack: err.stack || 'No stack trace available',
			details
		},
		request: {
			id: req.id || req.headers['x-request-id'],
			method: req.method,
			url: req.originalUrl,
			ip: req.ip,
			userAgent: req.get('user-agent')
		}
	};

	// Log based on error severity (5xx = error, 4xx = warn)
	if (status >= 500) {
		logger.error('Server error occurred', logData);
	} else if (status >= 400) {
		logger.warn('Client error occurred', logData);
	}

	// Sanitize error response for production
	const isProduction = process.env.NODE_ENV === 'production';
	if (isProduction && status >= 500) {
		// Don't leak internal error details in production
		message = 'An error occurred while processing your request';
		details = null;
	}

	// Build standardized error response
	const response = {
		success: false,
		error: {
			code,
			message,
			...(details && { details })
		}
	};

	// Add request ID for traceability
	const requestId = req.id || req.headers['x-request-id'];
	if (requestId) {
		response.error.requestId = requestId;
	}

	// Include stack trace only in development for 5xx errors
	if (!isProduction && status >= 500 && err.stack) {
		response.error.stack = err.stack;
	}

	// Set rate limit headers if applicable
	if (err instanceof RateLimitError && err.retryAfter) {
		res.set('Retry-After', String(err.retryAfter));
	}

	// Send error response
	res.status(status).json(response);
}

/**
 * Async error wrapper for route handlers
 * Catches async errors and passes them to Express error handler
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.json(users);
 * }));
 */
export function asyncHandler(fn) {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

/**
 * Factory functions for creating common HTTP errors
 * Provides convenient shortcuts for throwing standardized errors
 * @example
 * throw createError.notFound('User not found');
 * throw createError.unauthorized('Invalid token');
 * throw createError.badRequest('Missing required field', { field: 'email' });
 */
export const createError = {
	badRequest: (message = 'Bad request', details = null) => 
		new HttpError(400, message, 'BAD_REQUEST', details),
	
	unauthorized: (message = 'Unauthorized', details = null) => 
		new HttpError(401, message, 'UNAUTHORIZED', details),
	
	forbidden: (message = 'Forbidden', details = null) => 
		new HttpError(403, message, 'FORBIDDEN', details),
	
	notFound: (message = 'Resource not found', details = null) => 
		new HttpError(404, message, 'NOT_FOUND', details),
	
	methodNotAllowed: (message = 'Method not allowed', details = null) =>
		new HttpError(405, message, 'METHOD_NOT_ALLOWED', details),
	
	timeout: (message = 'Request timeout', details = null) =>
		new HttpError(408, message, 'REQUEST_TIMEOUT', details),
	
	conflict: (message = 'Conflict', details = null) => 
		new HttpError(409, message, 'CONFLICT', details),
	
	gone: (message = 'Resource no longer available', details = null) =>
		new HttpError(410, message, 'GONE', details),
	
	payloadTooLarge: (message = 'Payload too large', details = null) =>
		new HttpError(413, message, 'PAYLOAD_TOO_LARGE', details),
	
	unsupportedMediaType: (message = 'Unsupported media type', details = null) =>
		new HttpError(415, message, 'UNSUPPORTED_MEDIA_TYPE', details),
	
	validation: (message = 'Validation error', details = null) => 
		new HttpError(422, message, 'VALIDATION_ERROR', details),
	
	tooManyRequests: (message = 'Too many requests', details = null) => 
		new HttpError(429, message, 'TOO_MANY_REQUESTS', details),
	
	internal: (message = 'Internal server error', details = null) => 
		new HttpError(500, message, 'INTERNAL_ERROR', details),
	
	notImplemented: (message = 'Not implemented', details = null) =>
		new HttpError(501, message, 'NOT_IMPLEMENTED', details),
	
	badGateway: (message = 'Bad gateway', details = null) =>
		new HttpError(502, message, 'BAD_GATEWAY', details),
	
	serviceUnavailable: (message = 'Service unavailable', details = null) =>
		new HttpError(503, message, 'SERVICE_UNAVAILABLE', details),
	
	gatewayTimeout: (message = 'Gateway timeout', details = null) =>
		new HttpError(504, message, 'GATEWAY_TIMEOUT', details),
};

/**
 * Utility to check if error is operational (expected) vs programming error
 * Operational errors are expected errors (404, validation, etc.)
 * Programming errors are unexpected bugs (undefined variables, etc.)
 * @param {Error} error - Error object to check
 * @returns {boolean} True if operational error, false otherwise
 */
export function isOperationalError(error) {
	if (error instanceof HttpError) {
		return error.isOperational;
	}
	return false;
}

/**
 * Utility to format validation errors from various validation libraries
 * Supports express-validator, Joi, Yup, and generic error objects
 * @param {*} errors - Validation errors from any validation library
 * @returns {Array} Normalized array of validation errors
 * @example
 * const formatted = formatValidationErrors(joiError);
 * // Returns: [{ field: 'email', message: 'Email is required' }]
 */
export function formatValidationErrors(errors) {
	if (!errors) return [];
	
	// Handle express-validator errors
	if (Array.isArray(errors) && errors.length > 0 && errors[0].param) {
		return errors.map(err => ({
			field: err.param,
			message: err.msg,
			value: err.value
		}));
	}
	
	// Handle Joi validation errors
	if (errors.details && Array.isArray(errors.details)) {
		return errors.details.map(err => ({
			field: err.path.join('.'),
			message: err.message,
			type: err.type
		}));
	}
	
	// Handle Yup validation errors
	if (errors.inner && Array.isArray(errors.inner)) {
		return errors.inner.map(err => ({
			field: err.path,
			message: err.message,
			type: err.type
		}));
	}
	
	// Handle generic object with field errors
	if (typeof errors === 'object' && !Array.isArray(errors)) {
		return Object.entries(errors).map(([field, message]) => ({
			field,
			message: typeof message === 'string' ? message : message.message || String(message)
		}));
	}
	
	// Default: return as is if already formatted correctly
	return Array.isArray(errors) ? errors : [errors];
}
