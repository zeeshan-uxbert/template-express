import jwt from 'jsonwebtoken';

export const AuthController = {
	login(req, res) {
		const { userId = 'demo-user' } = req.body || {};
		const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN || '1d',
		});
		res.json({ accessToken: token });
	},

	me(req, res) {
		res.json({ user: { id: req.user.sub } });
	},
};


