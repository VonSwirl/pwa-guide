const express = require('express')
const app = express()
const webPush = require('web-push')
const bodyParser = require('body-parser')
var testSub = false

const vapid = {
  subject: "<ADD>",
  publicKey: "<ADD>",
  privateKey: "<ADD>"
}

app.use(bodyParser.json())
app.use(express.static(__dirname));

webPush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey)

app.post('/subscribe', (req, res) => {
  console.log('ADDING Subscription to DB')
  // console.log('ADD to BB', req.body)
  const subs = req.body
  testSub = subs
  res.status(201).json({});
  const options = {
    icon: 'public/images/notification-flat.png',
    requireInteraction: true,
    silent: false,
    tag: 12,
    actions: [
      { action: 'explore', title: 'Go To...' },
      { action: 'close', title: 'Close the notification' },
    ]
  }
  var payload = JSON.stringify(options)
  webPush.sendNotification(subs, payload).catch(e => console.log(e))
})

app.post('/unsubscribe', (req, res) => {
  // console.log('REMOVE From DB', req.body)
  console.log('REMOVING Subscription from DB')
  // const subs = req.body
  testSub = false
  res.status(201).json({});
})

setInterval(() => {
  if (testSub !== false) {
    const options = {
      icon: 'public/images/notification-flat.png',
      requireInteraction: true,
      silent: false,
      tag: 1,
      actions: [
        { action: 'explore', title: 'Go To...' },
        { action: 'close', title: 'Close the notification' },
      ]
    }
    var payload = JSON.stringify(options)
    webPush.sendNotification(testSub, payload).catch(e => console.log(e))
  } else console.log('NOT SENDING')
}, 5000)

app.listen(3000, () => {
  console.log('\nApp listening at http://localhost:3000')
});

// https://github.com/google-developer-training/pwa-training-labs