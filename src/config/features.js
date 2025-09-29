function envFlag(name, fallback = 'false') {
	const v = (process.env[name] ?? fallback).toString().toLowerCase();
	return v === 'true' || v === '1' || v === 'yes' || v === 'on';
}

export const features = {
	auth: envFlag('FEATURE_AUTH', 'true'),
	logging: envFlag('FEATURE_LOGGING', 'true'),
	i18n: envFlag('FEATURE_I18N', 'true'),
	s3: envFlag('FEATURE_S3', 'false'),
	redis: envFlag('FEATURE_REDIS', 'false'),
	bullmq: envFlag('FEATURE_BULLMQ', 'false'),
	email: envFlag('FEATURE_EMAIL', 'false'),
	notifications: envFlag('FEATURE_NOTIFICATIONS', 'false'),
	typeorm: envFlag('FEATURE_TYPEORM', 'false'),
	mongoose: envFlag('FEATURE_MONGOOSE', 'false'),
	strapi: envFlag('FEATURE_STRAPI', 'false'),
};


