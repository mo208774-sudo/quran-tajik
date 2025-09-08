;(function(){
  const params = new URLSearchParams(location.search)
  const num = Number(params.get('num') || '1')
  const nameEl = document.getElementById('surahName')
  const titleEl = document.getElementById('surahTitle')
  const metaEl = document.getElementById('surahMeta')
  const frame = document.getElementById('pdfFrame')
  const downloadLink = document.getElementById('downloadLink')

  const SURAHS = window.SURAHS || []

  function currentLang(){ return localStorage.getItem('lang') || 'ru' }

  function getName(s){
    const lang = currentLang()
    if (lang === 'tg') return s.tg
    if (lang === 'en') return s.a
    return s.ru
  }

  const FALLBACK = { n:num, a:`Surah ${num}`, ru:`Сура ${num}`, tg:`Сура ${num}` }
  // lightweight names for the detail page (basic)
  const minimal = {
    1: {a:'Al-Fatiha',ru:'Аль-Фатиха',tg:'Ал-Фотиҳа'}, 2:{a:'Al-Baqarah',ru:'Аль-Бакара',tg:'Ал-Бақара'}
  }

  const s = minimal[num] ? { n:num, ...minimal[num] } : FALLBACK

  function pdfPath(){
    const lang = currentLang()
    const dir = lang === 'en' ? 'en' : (lang === 'tg' ? 'tg' : 'ru')
    // Expect files like assets/pdfs/ru/1.pdf
    return `assets/pdfs/${dir}/${num}.pdf`
  }

  function render(){
    const name = getName(s)
    if (nameEl) nameEl.textContent = `${s.n || num}. ${name}`
    if (titleEl) titleEl.textContent = `${s.n || num}. ${name}`
    if (metaEl) metaEl.textContent = pdfPath().split('/').slice(-1)[0]
    const src = pdfPath()
    frame.setAttribute('src', src)
    downloadLink.setAttribute('href', src)
  }

  window.addEventListener('lang:change', render)
  document.addEventListener('DOMContentLoaded', render)
})()


