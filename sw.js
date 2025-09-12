// Service Worker for caching and performance
const CACHE_NAME = 'tafsiri-osonbayon-v2.0.0';
const STATIC_CACHE = 'static-v2.0.0';
const DYNAMIC_CACHE = 'dynamic-v2.0.0';
const PAGES_CACHE = 'pages-v2.0.0';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/surah.html',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/license.html',
  '/glossary.html',
  '/author-preface.html',
  '/editor-preface.html',
  '/istiaza-basmala.html',
  '/quran-collection.html',
  '/attention.html',
  '/assets/css/styles.css',
  '/assets/css/critical.css',
  '/assets/js/app.js',
  '/assets/js/i18n.js',
  '/assets/js/performance.js',
  '/assets/js/surah.js',
  '/assets/js/about.js',
  '/assets/js/contact.js',
  '/assets/js/privacy.js',
  '/assets/js/license.js',
  '/assets/js/attention.js',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.svg',
  '/logo.svg'
];

// Resources to cache on demand
const CACHE_PATTERNS = [
  /^https:\/\/cdnjs\.cloudflare\.com/,
  /^https:\/\/quranapi\.pages\.dev/,
  /\.(?:css|js|png|jpg|jpeg|gif|svg|woff2?|ttf|eot)$/
];

// Pages that should be cached when visited
const CACHEABLE_PAGES = [
  '/',
  '/index.html',
  '/surah.html',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/license.html',
  '/glossary.html',
  '/author-preface.html',
  '/editor-preface.html',
  '/istiaza-basmala.html',
  '/quran-collection.html',
  '/attention.html'
];

// Maximum number of pages to cache
const MAX_PAGES_CACHE = 50;

// Install event - cache critical resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(STATIC_CACHE)
        .then(cache => {
          console.log('Caching critical resources...');
          return cache.addAll(CRITICAL_RESOURCES);
        }),
      // Initialize pages cache
      caches.open(PAGES_CACHE)
        .then(cache => {
          console.log('Pages cache initialized');
          return cache;
        })
    ])
    .then(() => {
      console.log('All resources cached successfully');
      return self.skipWaiting();
    })
    .catch(error => {
      console.error('Failed to cache resources:', error);
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
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== PAGES_CACHE
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

// Helper function to check if URL is a page
function isPageRequest(url) {
  return CACHEABLE_PAGES.some(page => url.pathname === page || url.pathname === page.replace('.html', ''));
}

// Helper function to manage cache size
async function manageCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    // Remove oldest items (first in array)
    const itemsToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(itemsToDelete.map(key => cache.delete(key)));
    console.log(`Cleaned up ${itemsToDelete.length} old items from ${cacheName}`);
  }
}

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
          
          // For page requests, also try to update cache in background
          if (request.mode === 'navigate' && isPageRequest(url)) {
            fetch(request)
              .then(response => {
                if (response && response.status === 200) {
                  caches.open(PAGES_CACHE)
                    .then(cache => {
                      cache.put(request, response.clone());
                      manageCacheSize(PAGES_CACHE, MAX_PAGES_CACHE);
                    });
                }
              })
              .catch(() => {
                // Ignore background update errors
              });
          }
          
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
            
            // Determine which cache to use
            let targetCache = DYNAMIC_CACHE;
            
            if (request.mode === 'navigate' && isPageRequest(url)) {
              targetCache = PAGES_CACHE;
              console.log('Caching page:', request.url);
            } else if (CRITICAL_RESOURCES.includes(request.url) || 
                      CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
              targetCache = DYNAMIC_CACHE;
              console.log('Caching resource:', request.url);
            }
            
            // Cache the response
            caches.open(targetCache)
              .then(cache => {
                cache.put(request, responseToCache);
                
                // Manage cache size for pages
                if (targetCache === PAGES_CACHE) {
                  manageCacheSize(PAGES_CACHE, MAX_PAGES_CACHE);
                }
              });
            
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

// Message handler for cache management
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_PAGE') {
    const url = event.data.url;
    if (url) {
      cachePage(url);
    }
  } else if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearAllCaches();
  } else if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    getCacheStatus().then(status => {
      event.ports[0].postMessage(status);
    });
  }
});

// Function to cache a specific page
async function cachePage(url) {
  try {
    const response = await fetch(url);
    if (response && response.status === 200) {
      const cache = await caches.open(PAGES_CACHE);
      await cache.put(url, response);
      console.log('Page cached successfully:', url);
      return true;
    }
  } catch (error) {
    console.error('Failed to cache page:', url, error);
  }
  return false;
}

// Function to clear all caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('All caches cleared');
    return true;
  } catch (error) {
    console.error('Failed to clear caches:', error);
    return false;
  }
}

// Function to get cache status
async function getCacheStatus() {
  try {
    const cacheNames = await caches.keys();
    const status = {};
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      status[cacheName] = {
        size: keys.length,
        urls: keys.map(key => key.url)
      };
    }
    
    return status;
  } catch (error) {
    console.error('Failed to get cache status:', error);
    return {};
  }
}
