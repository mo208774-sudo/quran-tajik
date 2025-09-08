;(function(){
  const params = new URLSearchParams(location.search)
  const num = Number(params.get('num') || '1')
  const nameEl = document.getElementById('surahName')
  const titleEl = document.getElementById('surahTitle')
  const metaEl = document.getElementById('surahMeta')
  const container = document.getElementById('pdfContainer')
  const prevBtn = document.getElementById('prevPage')
  const nextBtn = document.getElementById('nextPage')
  const fullscreenBtn = document.getElementById('fullscreenBtn')

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
    if (window['pdfjsLib']) renderWithPdfJs()
    else renderWithIframe()
  }

  function storageKey(){
    const lang = currentLang()
    return `lastRead:${lang}:${num}`
  }

  function getSavedPage(){
    const raw = localStorage.getItem(storageKey())
    const v = Number(raw || '1')
    return Number.isFinite(v) && v >= 1 ? v : 1
  }

  function savePage(page){
    if (!Number.isFinite(page) || page < 1) return
    localStorage.setItem(storageKey(), String(page))
    localStorage.setItem(`${storageKey()}:ts`, String(Date.now()))
  }

  function openFullscreen(){
    if (!container) return
    if (container.requestFullscreen) container.requestFullscreen()
    else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen()
  }

  function initControls(){
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', openFullscreen)
    // also persist on lang change (page number kept)
    window.addEventListener('lang:change', render)
  }

  // Use iframe native viewer and poll current page via hash
  function renderWithIframe(){
    const src = pdfPath()
    const page = getSavedPage()
    const frame = document.createElement('iframe')
    frame.className = 'pdf-frame'
    frame.loading = 'lazy'
    frame.title = 'PDF'
    frame.src = `${src}#page=${page}`
    container.innerHTML = ''
    container.appendChild(frame)

    // Observe hash changes (when user uses built-in viewer next/prev, hash updates in some browsers)
    // Poll location hash inside iframe as a pragmatic approach
    let lastPage = page
    const timer = setInterval(()=>{
      try {
        const hash = frame.contentWindow?.location?.hash || ''
        const match = /page=(\d+)/.exec(hash)
        if (match){
          const p = Number(match[1])
          if (Number.isFinite(p) && p !== lastPage){
            lastPage = p
            savePage(p)
            // notify homepage to update banner instantly
            window.dispatchEvent(new CustomEvent('reading:updated', { detail: { num, page: p } }))
          }
        }
      } catch(e) { /* cross-origin or not accessible yet: ignore */ }
    }, 1000)

    // cleanup on unload
    window.addEventListener('beforeunload', ()=> clearInterval(timer))
  }

  // Render via PDF.js, capture current page on scroll
  async function renderWithPdfJs(){
    const src = pdfPath()
    const pdfjsLib = window['pdfjsLib']
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js`
    const loadingTask = pdfjsLib.getDocument(src)
    const pdf = await loadingTask.promise
    const numPages = pdf.numPages
    container.innerHTML = ''
    const canvases = []

    for (let i = 1; i <= numPages; i++){
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 1 })
      const targetWidth = Math.min(980, container.clientWidth - 20)
      const scale = targetWidth / viewport.width
      const scaledViewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      canvas.width = scaledViewport.width
      canvas.height = scaledViewport.height
      canvas.className = 'pdf-page'
      container.appendChild(canvas)
      canvases.push(canvas)

      const ctx = canvas.getContext('2d')
      await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise
    }

    // scroll tracking
    function detect(){
      const mid = container.scrollTop + container.clientHeight / 2
      let current = 1
      for (let i = 0; i < canvases.length; i++){
        const el = canvases[i]
        const top = el.offsetTop
        const bottom = top + el.offsetHeight
        if (mid >= top && mid <= bottom){ current = i+1; break }
      }
      savePage(current)
      window.dispatchEvent(new CustomEvent('reading:updated', { detail: { num, page: current } }))
    }
    container.addEventListener('scroll', throttle(detect, 250))
    // initial save
    detect()
  }

  function throttle(fn, wait){
    let t = 0
    return function(){
      const now = Date.now()
      if (now - t > wait){ t = now; fn() }
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{ render(); initControls(); })
})()


