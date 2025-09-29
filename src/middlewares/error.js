import { logger } from '../setup/logger.js';

 /**
 * Common HTTP error class for standardized error handling
 */
export class HttpError extends Error {
	constructor(status, message, code = null, details = null) {
		super(message);
		this.name = this.constructor.name;
		this.status = status;
		this.code = code || this.getDefaultCode(status);
		this.details = details;
		Error.captureStackTrace(this, this.constructor);
	}

	getDefaultCode(status) {
		const codes = {
			400: 'BAD_REQUEST',
			401: 'UNAUTHORIZED',
			403: 'FORBIDDEN',
			404: 'NOT_FOUND',
			409: 'CONFLICT',
			422: 'VALIDATION_ERROR',
			429: 'TOO_MANY_REQUESTS',
			500: 'INTERNAL_ERROR',
			502: 'BAD_GATEWAY',
			503: 'SERVICE_UNAVAILABLE',
		};
		return codes[status] || 'ERROR';
	}
}

/**
 * 404 Not Found handler
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
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
	// Default to 500 server error
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
		}
	}

	// Log error details
	const logData = {
		error: {
			name: err.name,
			message: err.message,
			code,
			status,
			stack: err.stack,
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

	// Log based on error severity
	if (status >= 500) {
		logger.error('Server error occurred', logData);
	} else if (status >= 400) {
		logger.warn('Client error occurred', logData);
	}

	// Don't leak error details in production for 5xx errors
	if (process.env.NODE_ENV === 'production' && status >= 500) {
		message = 'An error occurred while processing your request';
		details = null;
	}

	// Send error response
	const response = {
		success: false,
		error: {
			code,
			message,
			...(details && { details }),
			...(process.env.NODE_ENV !== 'production' && status >= 500 && { stack: err.stack })
		}
	};

	// Add request ID if available
	if (req.id || req.headers['x-request-id']) {
		response.error.requestId = req.id || req.headers['x-request-id'];
	}

	res.status(status).json(response);
}

/**
 * Async error wrapper for route handlers
 */
export function asyncHandler(fn) {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

/**
 * Create common HTTP errors
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
	
	conflict: (message = 'Conflict', details = null) => 
		new HttpError(409, message, 'CONFLICT', details),
	
	validation: (message = 'Validation error', details = null) => 
		new HttpError(422, message, 'VALIDATION_ERROR', details),
	
	tooManyRequests: (message = 'Too many requests', details = null) => 
		new HttpError(429, message, 'TOO_MANY_REQUESTS', details),
	
	internal: (message = 'Internal server error', details = null) => 
		new HttpError(500, message, 'INTERNAL_ERROR', details),
};


