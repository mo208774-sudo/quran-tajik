// Cache Manager for offline functionality
class CacheManager {
  constructor() {
    this.swRegistration = null;
    this.isOnline = navigator.onLine;
    this.init();
  }

  async init() {
    // Register service worker if supported
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
        
        // Listen for service worker updates
        this.swRegistration.addEventListener('updatefound', () => {
          const newWorker = this.swRegistration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.hideOfflineIndicator();
      this.syncCachedData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showOfflineIndicator();
    });

    // Initial offline check
    if (!this.isOnline) {
      this.showOfflineIndicator();
    }

    // Cache current page on load
    this.cacheCurrentPage();
  }

  // Cache the current page
  async cacheCurrentPage() {
    if (!this.swRegistration || !this.swRegistration.active) {
      return;
    }

    const currentUrl = window.location.href;
    try {
      await this.sendMessageToSW({
        type: 'CACHE_PAGE',
        url: currentUrl
      });
      console.log('Current page cached:', currentUrl);
    } catch (error) {
      console.error('Failed to cache current page:', error);
    }
  }

  // Cache a specific page
  async cachePage(url) {
    if (!this.swRegistration || !this.swRegistration.active) {
      return false;
    }

    try {
      await this.sendMessageToSW({
        type: 'CACHE_PAGE',
        url: url
      });
      console.log('Page cached:', url);
      return true;
    } catch (error) {
      console.error('Failed to cache page:', error);
      return false;
    }
  }

  // Pre-cache important pages
  async preCachePages() {
    const importantPages = [
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

    console.log('Pre-caching important pages...');
    
    for (const page of importantPages) {
      await this.cachePage(page);
      // Small delay to prevent overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('Pre-caching completed');
  }

  // Clear all caches
  async clearAllCaches() {
    if (!this.swRegistration || !this.swRegistration.active) {
      return false;
    }

    try {
      await this.sendMessageToSW({
        type: 'CLEAR_CACHE'
      });
      console.log('All caches cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear caches:', error);
      return false;
    }
  }

  // Get cache status
  async getCacheStatus() {
    if (!this.swRegistration || !this.swRegistration.active) {
      return null;
    }

    try {
      const status = await this.sendMessageToSW({
        type: 'GET_CACHE_STATUS'
      });
      return status;
    } catch (error) {
      console.error('Failed to get cache status:', error);
      return null;
    }
  }

  // Send message to service worker
  sendMessageToSW(message) {
    return new Promise((resolve, reject) => {
      if (!this.swRegistration || !this.swRegistration.active) {
        reject(new Error('Service Worker not available'));
        return;
      }

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      this.swRegistration.active.postMessage(message, [messageChannel.port2]);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        reject(new Error('Message timeout'));
      }, 5000);
    });
  }

  // Show offline indicator
  showOfflineIndicator() {
    let indicator = document.getElementById('offline-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'offline-indicator';
      indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ff6b6b;
        color: white;
        text-align: center;
        padding: 8px;
        font-size: 14px;
        z-index: 10000;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
      `;
      indicator.textContent = 'Вы работаете в офлайн режиме. Некоторые функции могут быть ограничены.';
      document.body.appendChild(indicator);
    }
    
    // Show indicator
    setTimeout(() => {
      indicator.style.transform = 'translateY(0)';
    }, 100);
  }

  // Hide offline indicator
  hideOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      }, 300);
    }
  }

  // Show update notification
  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--brand);
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: var(--shadow);
      z-index: 10000;
      max-width: 300px;
    `;
    
    notification.innerHTML = `
      <div style="margin-bottom: 12px; font-weight: 600;">
        Доступно обновление
      </div>
      <div style="margin-bottom: 12px; font-size: 14px;">
        Новая версия сайта загружена. Обновите страницу для получения последних изменений.
      </div>
      <div style="display: flex; gap: 8px;">
        <button id="update-btn" style="
          background: white;
          color: var(--brand);
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
        ">Обновить</button>
        <button id="dismiss-btn" style="
          background: transparent;
          color: white;
          border: 1px solid white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        ">Позже</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Handle update button
    document.getElementById('update-btn').addEventListener('click', () => {
      window.location.reload();
    });
    
    // Handle dismiss button
    document.getElementById('dismiss-btn').addEventListener('click', () => {
      notification.remove();
    });
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }

  // Sync cached data when coming back online
  async syncCachedData() {
    console.log('Syncing cached data...');
    // This is where you would sync any offline data
    // For now, we'll just log it
  }

  // Check if page is cached
  async isPageCached(url) {
    const status = await this.getCacheStatus();
    if (!status) return false;
    
    for (const cacheName in status) {
      if (status[cacheName].urls.includes(url)) {
        return true;
      }
    }
    return false;
  }

  // Get cache size info
  async getCacheInfo() {
    const status = await this.getCacheStatus();
    if (!status) return null;
    
    let totalItems = 0;
    let totalSize = 0;
    
    for (const cacheName in status) {
      totalItems += status[cacheName].size;
    }
    
    return {
      totalItems,
      caches: status
    };
  }
}

// Initialize cache manager when DOM is ready
let cacheManager;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    cacheManager = new CacheManager();
  });
} else {
  cacheManager = new CacheManager();
}

// Export for global access
window.cacheManager = cacheManager;
