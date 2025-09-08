// Performance optimization utilities
(function() {
  'use strict';

  // Debounce function for performance
  function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // Throttle function for scroll events
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Intersection Observer for lazy loading
  function createIntersectionObserver(callback, options = {}) {
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      return {
        observe: () => {},
        unobserve: () => {},
        disconnect: () => {}
      };
    }

    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };

    return new IntersectionObserver(callback, defaultOptions);
  }

  // Preload critical resources
  function preloadCriticalResources() {
    const criticalResources = [
      'assets/css/styles.css',
      'assets/js/app.js',
      'assets/js/i18n.js'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }

  // Optimize images
  function optimizeImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = createIntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Service Worker registration for caching
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }

  // Critical resource hints
  function addResourceHints() {
    const hints = [
      { rel: 'dns-prefetch', href: 'https://quranapi.pages.dev' },
      { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      Object.assign(link, hint);
      document.head.appendChild(link);
    });
  }

  // Performance monitoring
  function initPerformanceMonitoring() {
    // Core Web Vitals monitoring
    if ('web-vitals' in window) {
      import('https://unpkg.com/web-vitals@3/dist/web-vitals.attribution.js')
        .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS(console.log);
          getFID(console.log);
          getFCP(console.log);
          getLCP(console.log);
          getTTFB(console.log);
        });
    }

    // Performance observer for long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry);
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  // Initialize performance optimizations
  function init() {
    // Add resource hints immediately
    addResourceHints();
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Register service worker
    registerServiceWorker();
    
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Optimize images when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizeImages);
    } else {
      optimizeImages();
    }
  }

  // Export utilities
  window.PerformanceUtils = {
    debounce,
    throttle,
    createIntersectionObserver,
    init
  };

  // Auto-initialize
  init();
})();
