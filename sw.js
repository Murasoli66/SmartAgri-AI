
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { 
    title: 'IADSS Agri AI', 
    body: 'You have a new notification.' 
  };
  
  const options = {
    body: data.body,
    icon: '/vite.svg',
    badge: '/vite.svg',
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});