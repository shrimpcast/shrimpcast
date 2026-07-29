// Lightweight service worker for push notifications
// Caching is disabled

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("push", (event) => {
  console.log("Received push event.");
  const options = {
    body: "Come join the stream!",
    icon: "favicon.ico",
  };

  event.waitUntil(self.registration.showNotification("Stream is on!", options));
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification clicked:", event.notification.tag);

  event.notification.close();
  event.waitUntil(self.clients.openWindow("/"));
});
