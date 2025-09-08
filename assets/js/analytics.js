// Analytics and SEO tracking for Tafsiri Osonbayon

// Google Analytics 4 (replace with your tracking ID)
const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 tracking ID

// Initialize Google Analytics
function initGoogleAnalytics() {
  if (!GA_TRACKING_ID || GA_TRACKING_ID === 'G-XXXXXXXXXX') return;
  
  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);
  
  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
    custom_map: {
      'custom_parameter_1': 'language',
      'custom_parameter_2': 'surah_number'
    }
  });
  
  window.gtag = gtag;
}

// Track page views
function trackPageView(pageTitle, pagePath) {
  if (typeof gtag !== 'undefined') {
    gtag('config', GA_TRACKING_ID, {
      page_title: pageTitle,
      page_location: window.location.origin + pagePath
    });
  }
}

// Track surah reading events
function trackSurahRead(surahNumber, surahName, pageNumber) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'surah_read', {
      event_category: 'Quran Reading',
      event_label: `Surah ${surahNumber}: ${surahName}`,
      custom_parameter_1: localStorage.getItem('lang') || 'ru',
      custom_parameter_2: surahNumber,
      page_number: pageNumber
    });
  }
}

// Track search events
function trackSearch(searchTerm, resultsCount) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'search', {
      event_category: 'Site Search',
      event_label: searchTerm,
      value: resultsCount
    });
  }
}

// Track language changes
function trackLanguageChange(newLanguage) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'language_change', {
      event_category: 'User Interaction',
      event_label: newLanguage
    });
  }
}

// Track theme changes
function trackThemeChange(newTheme) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'theme_change', {
      event_category: 'User Interaction',
      event_label: newTheme
    });
  }
}

// Track PDF page saves
function trackPageSave(surahNumber, surahName, pageNumber) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_save', {
      event_category: 'Quran Reading',
      event_label: `Surah ${surahNumber}: ${surahName} - Page ${pageNumber}`,
      custom_parameter_1: localStorage.getItem('lang') || 'ru',
      custom_parameter_2: surahNumber,
      page_number: pageNumber
    });
  }
}

// Track continue reading clicks
function trackContinueReading(surahNumber, surahName, pageNumber) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'continue_reading', {
      event_category: 'Quran Reading',
      event_label: `Surah ${surahNumber}: ${surahName} - Page ${pageNumber}`,
      custom_parameter_1: localStorage.getItem('lang') || 'ru',
      custom_parameter_2: surahNumber,
      page_number: pageNumber
    });
  }
}

// Track performance metrics
function trackPerformance() {
  if (typeof gtag !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          gtag('event', 'timing_complete', {
            name: 'load',
            value: Math.round(perfData.loadEventEnd - perfData.loadEventStart)
          });
        }
      }, 0);
    });
  }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initGoogleAnalytics();
  trackPerformance();
});

// Export functions for use in other scripts
window.analytics = {
  trackPageView,
  trackSurahRead,
  trackSearch,
  trackLanguageChange,
  trackThemeChange,
  trackPageSave,
  trackContinueReading
};
