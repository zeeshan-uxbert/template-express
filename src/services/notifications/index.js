export class NotificationService {
	async notify(input) {
		throw new Error('Not implemented');
	}
}

export class LogNotificationService extends NotificationService {
	async notify(input) {
		// eslint-disable-next-line no-console
		console.log('Notification', input);
		return { success: true };
	}
}


