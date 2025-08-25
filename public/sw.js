// Service Worker for Push Notifications
const CACHE_NAME = "push-test-v1";
const urlsToCache = ["/"];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Push event - handle incoming push notifications
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);
  console.log("Push data:", event.data ? event.data.text() : "No data");

  let notificationData = {};

  if (event.data) {
    try {
      notificationData = event.data.json();
      console.log("Parsed notification data:", notificationData);
    } catch (e) {
      console.warn("Failed to parse push data as JSON:", e);
      notificationData = {
        title: "Push Test Alert",
        body: event.data.text() || "Test notification",
        icon: "/favicon.ico",
      };
    }
  }

  const options = {
    body: notificationData.body || "Test notification from Astro app",
    icon: notificationData.icon || "/favicon.ico",
    tag: notificationData.tag || "test-alert",
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200],
    data: {
      url: notificationData.url || "/",
      timestamp: Date.now(),
      ...notificationData.data,
    },
    actions: [
      {
        action: "view",
        title: "View",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
  };

  console.log("Showing notification with options:", options);
  const title = notificationData.title || "Push Test";
  
  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => {
        console.log("Notification shown successfully");
      })
      .catch((error) => {
        console.error("Error showing notification:", error);
        return self.registration.showNotification(title, {
          body: notificationData.body || "Test notification",
          icon: "/favicon.ico",
        });
      })
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification click received:", event);

  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});