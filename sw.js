// Service Worker for caching and performance
const CACHE_NAME = 'tafsiri-osonbayon-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/surah.html',
  '/assets/css/styles.css',
  '/assets/css/critical.css',
  '/assets/js/app.js',
  '/assets/js/i18n.js',
  '/assets/js/performance.js',
  '/assets/js/surah.js',
  '/manifest.json',
  '/favicon.ico'
];

// Resources to cache on demand
const CACHE_PATTERNS = [
  /^https:\/\/cdnjs\.cloudflare\.com/,
  /^https:\/\/quranapi\.pages\.dev/,
  /\.(?:css|js|png|jpg|jpeg|gif|svg|woff2?|ttf|eot)$/
];

// Install event - cache critical resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching critical resources...');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        console.log('Critical resources cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Failed to cache critical resources:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE
            )
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Serving from cache:', request.url);
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(request)
          .then(response => {
            // Check if response is valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response for caching
            const responseToCache = response.clone();
            
            // Check if resource should be cached
            const shouldCache = CRITICAL_RESOURCES.includes(request.url) ||
              CACHE_PATTERNS.some(pattern => pattern.test(request.url));
            
            if (shouldCache) {
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  console.log('Caching new resource:', request.url);
                  cache.put(request, responseToCache);
                });
            }
            
            return response;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // Return cached version if available
            return caches.match(request);
          });
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Handle background sync tasks here
  }
});

// Push notifications (if needed in future)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon-32x32.png',
      badge: '/favicon-16x16.png',
      tag: 'tafsiri-notification'
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
