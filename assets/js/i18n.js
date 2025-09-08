;(function(){
  const DEFAULT_LANG = localStorage.getItem('lang') || 'ru'
  const html = document.documentElement
  const select = document.getElementById('languageSelect')
  if (select) select.value = DEFAULT_LANG

  const dict = {
    en: {
      brand: '',
      title: '',
      subtitle: 'Browse surahs, read translations, and discover more.',
      cta: 'Start',
      surah_list: 'List of Surahs',
      total: 'Total: ',
      footer_note: 'Open educational project.',
      home: 'Home',
      download: 'Download PDF',
      verse_98_7: 'Indeed, those who believe and do righteous deeds—they are the best of creation (98:7)'
    },
    ru: {
      brand: 'Тафсири осонбаён',
      title: 'Священный Коран',
      subtitle: 'Изучайте су́ры, читайте переводы и открывайте для себя больше.',
      cta: 'Начать',
      surah_list: 'Список сур',
      total: 'Всего: ',
      footer_note: 'Открытый учебный проект.',
      home: 'Главная',
      download: 'Скачать PDF',
      verse_98_7: '«Поистине, те, которые уверовали и совершали праведные деяния, они – лучшие творения» (98:7)',
      continue: 'Продолжить чтение'
    },
    tg: {
      brand: 'Тафсири осонбаён',
      title: 'Тафсири осонбаён',
      subtitle: 'Сураҳоро бинед, тарҷумаҳо хонед ва бештар кашф кунед.',
      cta: 'Оғоз',
      surah_list: 'Рӯйхати сураҳо',
      total: 'Ҳамагӣ: ',
      footer_note: 'Лоиҳаи таълимии кушода.',
      home: 'Саҳифаи асосӣ',
      download: 'Боргирии PDF',
      verse_98_7: ' Касоне, ки имон овардаанд ва корҳои шоиста мекунанд, беҳтарини офаридагонанд. (98:7)',
      continue: 'Идома додани қироат'
    }
  }

  function applyI18n(lang){
    const strings = dict[lang] || dict[DEFAULT_LANG]
    document.querySelectorAll('[data-i18n]').forEach(node => {
      const key = node.getAttribute('data-i18n')
      const value = strings[key]
      if (!value) return
      if (key === 'total') {
        // Keep number inside element if present
        const countEl = node.querySelector('b')
        node.firstChild.nodeValue = value
        if (countEl) node.appendChild(countEl)
      } else {
        node.textContent = value
      }
    })
    html.setAttribute('lang', lang)
  }

  function initLang(){
    applyI18n(DEFAULT_LANG)
    document.addEventListener('change', (e)=>{
      const t = e.target
      if (t && t.id === 'languageSelect'){
        const lang = t.value
        localStorage.setItem('lang', lang)
        applyI18n(lang)
        // propagate event for other scripts
        window.dispatchEvent(new CustomEvent('lang:change', { detail: { lang } }))
      }
    })
  }

  function initTheme(){
    const saved = localStorage.getItem('theme') || 'dark'
    document.documentElement.setAttribute('data-theme', saved)
    const btn = document.getElementById('themeToggle')
    if (!btn) return
    btn.addEventListener('click', ()=>{
      const current = document.documentElement.getAttribute('data-theme')
      const next = current === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('theme', next)
    })
  }

  function initCommon(){
    const y = document.getElementById('year')
    if (y) y.textContent = new Date().getFullYear()
  }

  initLang()
  initTheme()
  initCommon()
})()


