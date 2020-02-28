


const pushSubscription = YOUR_SUBSCRIPTION_OBJECT;

const payload = 'Here is a payload!';

const options = {
  // gcmAPIKey: 'YOUR_SERVER_KEY',
  TTL: 60,
  vapidDetails: {
    subject: 'mailto:YOUR_EMAIL_ADDRESS',
    publicKey: kk.publicKey,
    privateKey: kk.privateKey
  }
};

webPush.sendNotification(
  pushSubscription,
  payload,
  options
);
