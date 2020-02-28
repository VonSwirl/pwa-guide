let reg
const key = urlB64ToUint8Array
var enableButton = document.getElementById('enable-push')
var disableButton = document.getElementById('disable-push')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    navigator.serviceWorker.ready
      .then(reg => { console.log('ServiceWorker: READY'); return reg })
      .then(registration => {
        reg = registration
        reg.pushManager.permissionState({ userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(key) })
          .then(PushMessagingState => console.log('Push Permission:', PushMessagingState.toUpperCase()));
        reg.pushManager.getSubscription()
          .then(exists => {
            if (exists) {
              disableButton.style.display = 'block'
              console.log('Subscribed:', 'YES')
            } else {
              enableButton.style.display = 'block'
              console.log('Subscribed:', 'NO')
            }
          })
          .catch(e => console.error(e))
      })
  })
} else console.warn('Push messaging is not supported')

// 
// TODO
function subscribeUser() {
  if (Notification.permission === 'denied') console.warn('Permission for notifications was denied')
  else {
    console.log('Subscription Update: ATTEMPING SUBSCRIPTION');
    reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(key) })
      .then(async newSub => {
        if (newSub) {
          console.log('Subscription Update: SUBSCRIBED');
          await fetch("/subscribe", { method: "POST", body: JSON.stringify(newSub), headers: { "content-type": "application/json" } })
            .then(() => console.log('Subscription Update: SERVER UPDATED'))
            .catch(e => console.error('Subscription Update: SERVER UPDATE FAILED', e))
            .finally(() => {
              disableButton.style.display = 'block'
              enableButton.style.display = 'none'
              return
            })
        } else {
          console.warn('Cant create new subscription when subscription exists', newSub)
          return
        }
      }).catch(e => console.error(e))
  }
}

function unsubscribeUser() {
  reg.pushManager.getSubscription()
    .then(async deleteSub => {
      if (deleteSub) {
        console.log('Subscription Update: ATTEMPING UN-SUBSCRIBE');
        await fetch("/unsubscribe", {
          method: "POST",
          body: JSON.stringify(deleteSub),
          headers: { "content-type": "application/json" }
        })
          .then(() => console.log('Subscription Update: SERVER UPDATED'))
          .catch(e => console.error('Subscription Update: SERVER UPDATE FAILED', e))
          .finally(() => {
            deleteSub.unsubscribe()
            console.log('Subscription Update: UNSUBSCRIBED')
            disableButton.style.display = 'none'
            enableButton.style.display = 'block'
            return
          })
      }
    }).catch(e => console.error(e))
}

// TODO
function urlB64ToUint8Array() {
  var base64String = "BKj1jexkKmwp1lqEhHcOIXroatXveWk8h3kajpeQbAPa3_Oj2FuMnMuTQzAkqD0xIYYoa860M8q4LrK4YlHcKYI"
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) { outputArray[i] = rawData.charCodeAt(i) }
  return outputArray;
}
