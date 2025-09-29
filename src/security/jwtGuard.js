import jwt from 'jsonwebtoken';

export function jwtGuard(req, res, next) {
	const header = req.headers.authorization || '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : null;
	if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED' } });
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = payload;
		return next();
	} catch (e) {
		return res.status(401).json({ error: { code: 'INVALID_TOKEN' } });
	}
}


