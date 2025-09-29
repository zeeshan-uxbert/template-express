import winston from 'winston';

const { combine, timestamp, errors, json, colorize, printf, splat } = winston.format;

const devFormat = combine(
	colorize(),
	splat(),
	timestamp(),
	errors({ stack: true }),
	printf(({ level, message, timestamp: ts, stack, ...meta }) => {
		const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
		return stack ? `${ts} ${level}: ${message}\n${stack}${rest}` : `${ts} ${level}: ${message}${rest}`;
	}),
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
	transports: [new winston.transports.Console()],
});


