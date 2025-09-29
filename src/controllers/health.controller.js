export const HealthController = {
	status(req, res) {
		res.json({ status: 'ok', uptime: process.uptime(), version: '1.0.0' });
	},
};


