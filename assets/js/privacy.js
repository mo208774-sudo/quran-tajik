;(function(){
  const shareBtn = document.getElementById('shareBtn')
  const addToHomeBtn = document.getElementById('addToHomeBtn')
  const themeToggle = document.getElementById('themeToggle')
  const languageSelect = document.getElementById('languageSelect')

  // Share functionality
  function shareSite() {
    const shareData = {
      title: 'Аввалин сайти Тафсири Куръон бо забони точики',
      text: 'Читайте Священный Коран на таджикском языке с простым тафсиром',
      url: window.location.href
    }
    
    if (navigator.share) {
      navigator.share(shareData)
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Ссылка скопирована в буфер обмена')
      })
    }
  }

  // Add to home screen
  function addToHome() {
    if ('serviceWorker' in navigator) {
      // PWA installation
      showToast('Функция добавления на главный экран будет доступна в PWA версии')
    } else {
      showToast('Ваш браузер не поддерживает эту функцию')
    }
  }

  // Toast notification
  function showToast(message) {
    const toast = document.getElementById('toast')
    if (toast) {
      toast.textContent = message
      toast.classList.add('show')
      setTimeout(() => {
        toast.classList.remove('show')
      }, 3000)
    }
  }

  // Theme toggle
  function toggleTheme() {
    const html = document.documentElement
    const currentTheme = html.getAttribute('data-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    html.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // Language change
  function changeLanguage() {
    const lang = languageSelect.value
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang === 'tg' ? 'tg' : (lang === 'en' ? 'en' : 'ru')
    if (window.applyI18n) {
      window.applyI18n(lang)
    }
  }

  // Event listeners
  if (shareBtn) {
    shareBtn.addEventListener('click', shareSite)
  }

  if (addToHomeBtn) {
    addToHomeBtn.addEventListener('click', addToHome)
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme)
  }

  if (languageSelect) {
    languageSelect.addEventListener('change', changeLanguage)
  }

  // Initialize
  function init() {
    // Set current year
    const yearElement = document.getElementById('year')
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear()
    }

    // Set theme
    const savedTheme = localStorage.getItem('theme') || 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)

    // Set language
    const savedLang = localStorage.getItem('lang') || 'tg'
    languageSelect.value = savedLang
    document.documentElement.lang = savedLang === 'tg' ? 'tg' : (savedLang === 'en' ? 'en' : 'ru')
    if (window.applyI18n) {
      window.applyI18n(savedLang)
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
