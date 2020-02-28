let count = 0
self.addEventListener('notificationclose', event => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;
  console.log('Closed notification: ' + primaryKey);
});

self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const url = notification.data.url
  // console.log('\n999999999',notification.data,'\n9999999999999')

  if (event.action === 'close') notification.close();
  else {
    event.waitUntil(
      clients.matchAll().then(clis => {
        const client = clis.find(c => { return c.visibilityState === 'visible' })
        if (client !== undefined) {
          // Navigate to IF site pages are open
          client.navigate(url);
          client.focus();
        } else {
          // Else open new tab.
          clients.openWindow(url);
          notification.close();
        }
      })
    )
  }
  self.registration.getNotifications().then(notifications => {
    notifications.forEach(notification => {
      notification.close();
    });
  });
});

self.addEventListener('push', event => {
  if (event.data.text()) {
    var dataIn = JSON.parse(event.data.text())
    const pk = dataIn.tag
    let uniqueBody = ''
    let url = ''

    //a(href='#full-load-enquiries')
    //a(href='#groupage-enquiries')
    //a(href='#new-dates-request')

    // Decide what notification to display depending on primaryKey
    switch (pk) {
      case 1: // NEW FULL LOAD ENQUIRY
        uniqueBody = `New (Full-Load) Enquiry Received.
Check your inbox.`
        url = '../admin/admin-enquiries-page#full-load-enquiries'
        break

      case 2: // NEW GRPG ENQUIRY
        uniqueBody = `New (Groupage) Enquiry Received.
Check your inbox.`
        url = '../admin/admin-enquiries-page#groupage-enquiries'
        break

      case 3: // SEND HAULIER BOOKING COMFIRMATION
        uniqueBody = `Send booking confirmation to haulier asap.
Check your inbox.`
        url = '../admin/live-bookings-page'
        break

      case 4: // CONTACT US RECIEVED
        uniqueBody = `An unknown customer has used the contact us page.
Check your inbox.`
        url = '../admin/'
        break

      case 5: // RESERVATION REQUESTED FL
        uniqueBody = `New (Full-Load) Reservation has been requested.
Check your inbox.`
        url = '../admin/active-quotes'
        break

      case 6: // RESERVATION REQUESTED GRPG
        uniqueBody = `New (Groupage) Reservation has been requested.
Check your inbox.`
        url = '../admin/active-quotes'
        break

      case 7: // NEW CUSTOMER DATE REQUEST
        uniqueBody = `A customer has requested new dates.
Check your inbox.`
        url = '../admin/active-quotes#new-dates-request'
        break

      case 8: // NEW ACCOUNT CREATED
        uniqueBody = `We have a new customer!.
Check your inbox.`
        url = '../admin/customers'
        break

      case 9:
        uniqueBody = ``
        url = '../admin/'
        break
      case 10:
        uniqueBody = ``
        url = '../admin/'
        break
      case 11:
        uniqueBody = ``
        url = '../admin/'
        break
      case 12:
        uniqueBody = `Notifications Enabled`
        url = '#'
        break
      default:
        uniqueBody = `Error`
        url = '../admin/#notification-error'
        break
    }

    const options = {
      body: uniqueBody,
      icon: 'public/images/phx-notif-icon.png',
      badge: 'public/images/push-notif-badge.png',
      requireInteraction: dataIn.requireInteraction,
      silent: dataIn.silent,
      tag: dataIn.tag,
      sound: 'public/audio/notify.mp3',
      data: { url: url, dateOfArrival: Date.now(), primaryKey: dataIn.tag },
      actions: [
        { action: 'explore', title: 'Go to..', icon: 'public/images/checkmark.png' },
        { action: 'close', title: 'Close', icon: 'public/images/xmark.png' },
      ]
    }

    event.waitUntil(clients.matchAll()
      .then(c => {
        self.registration.getNotifications()
          .then(notifications => {
            let currentNotification
            for (let i = 0; i < notifications.length; i++) {
              if (notifications[i].data && notifications[i].data.url === url) {
                currentNotification = notifications[i];
              }
            }
            return currentNotification;
          })
          .then((currentNotification) => {
            let title
            if (currentNotification) {
              // We have an open notification, let's do something with it.
              const messageCount = currentNotification.data.newMessageCount + 1
              options.body = `${uniqueBody}`
              options.data = { url: url, newMessageCount: messageCount }
              title = `${messageCount}x New Messages`
              // Remember to close the old notification.
              currentNotification.close();
            } else {
              options.body = `${uniqueBody}`
              options.data = { url: url, newMessageCount: 1 }
              title = `New Message`
            }
            registration.showNotification(title, options)
          })
      }))
  }
})
