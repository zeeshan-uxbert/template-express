export class NotificationService {
  async notify(_input) {
    throw new Error('Not implemented');
  }
}

export class LogNotificationService extends NotificationService {
  async notify(input) {
    console.log('Notification', input);
    return { success: true };
  }
}
