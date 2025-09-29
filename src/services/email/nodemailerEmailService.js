import nodemailer from 'nodemailer';

import { EmailService } from './index.js';

export class NodemailerEmailService extends EmailService {
	constructor() {
		super();
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT || 587),
			secure: false,
			auth: process.env.SMTP_USER
				? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
				: undefined,
		});
	}

	async send({ to, subject, html, text, from }) {
		const sender = from || process.env.EMAIL_FROM;
		await this.transporter.sendMail({ from: sender, to, subject, html, text });
		return { success: true };
	}
}


