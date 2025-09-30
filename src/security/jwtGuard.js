import jwt from 'jsonwebtoken';

// Optional: Import for enhanced error handling
// Uncomment the line below to use error classes instead of direct responses
// import { AuthenticationError } from '../middlewares/error.js';

export function jwtGuard(req, res, next) {
	const header = req.headers.authorization || '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : null;
	
	if (!token) {
		// Option 1: Direct response (default)
		return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'No authentication token provided' } });
		
		// Option 2: Use error classes (uncomment to enable)
		// return next(new AuthenticationError('No authentication token provided'));
	}
	
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = payload;
		return next();
	} catch (error) {
		// Option 1: Direct response (default)
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ error: { code: 'TOKEN_EXPIRED', message: 'Authentication token has expired' } });
		}
		return res.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'Invalid authentication token' } });
		
		// Option 2: Use error classes (uncomment to enable)
		// if (error.name === 'TokenExpiredError') {
		// 	return next(new AuthenticationError('Authentication token has expired'));
		// } else if (error.name === 'JsonWebTokenError') {
		// 	return next(new AuthenticationError('Invalid authentication token'));
		// }
		// return next(new AuthenticationError('Authentication failed'));
	}
}


