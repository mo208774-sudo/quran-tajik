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
  const savePageBtn = document.getElementById('savePageBtn')
  const toast = document.getElementById('toast')
  const loader = document.getElementById('loader')
  const progressFill = document.getElementById('progressFill')
  const progressText = document.getElementById('progressText')

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

  function pageFromHash(){
    const m = /page=(\d+)/.exec(location.hash || '')
    const p = m ? Number(m[1]) : NaN
    const result = Number.isFinite(p) && p >= 1 ? p : null
    console.log('Page from hash:', location.hash, '->', result)
    return result
  }

  function render(){
    const name = getName(s)
    if (nameEl) nameEl.textContent = `${s.n || num}. ${name}`
    if (titleEl) titleEl.textContent = `${s.n || num}. ${name}`
    if (metaEl) metaEl.textContent = pdfPath().split('/').slice(-1)[0]
    
    // Update SEO meta tags dynamically
    updateSEOMeta(s, name)
    
    // Track surah view
    if (window.analytics) {
      window.analytics.trackSurahRead(num, name, 1)
    }
    
    if (window['pdfjsLib']) renderWithPdfJs()
    else renderWithIframe()
  }

  function updateSEOMeta(surah, name){
    const lang = currentLang()
    const surahNum = surah.n || num
    
    // Generate SEO-optimized content
    const titleRu = `Сура ${name} - Коран на таджикском языке | Тафсири осонбаён`
    const titleTg = `Сура ${name} - Қуръон бо забони тоҷикӣ | Тафсири осонбаён`
    const titleEn = `Surah ${surah.a} - Quran in Tajik Language | Tafsiri Osonbayon`
    
    const descRu = `Читайте суру ${name} на таджикском языке с тафсиром. Сура ${surahNum} Корана с переводом и толкованием на точики.`
    const descTg = `Сура ${name}-ро бо забони тоҷикӣ бо тафсир хонед. Сура ${surahNum} Қуръон бо тарҷума ва тафсир.`
    const descEn = `Read Surah ${surah.a} in Tajik language with tafsir. Surah ${surahNum} of Quran with translation and commentary.`
    
    const keywordsRu = `сура ${name.toLowerCase()}, коран на таджикском, куръон бо забони точики, тафсири осонбаён, сура ${surahNum}, коран суры, коран аяты, коран тафсир, коран толкование`
    const keywordsTg = `сура ${name.toLowerCase()}, қуръон бо забони тоҷикӣ, тафсири осонбаён, сура ${surahNum}, қуръон сураҳо, қуръон оятҳо, қуръон тафсир`
    const keywordsEn = `surah ${surah.a.toLowerCase()}, quran in tajik, tafsiri osonbayon, surah ${surahNum}, quran surahs, quran verses, quran tafsir`
    
    // Update title
    const title = lang === 'tg' ? titleTg : (lang === 'en' ? titleEn : titleRu)
    document.title = title
    if (document.getElementById('pageTitle')) document.getElementById('pageTitle').content = title
    
    // Update description
    const description = lang === 'tg' ? descTg : (lang === 'en' ? descEn : descRu)
    const descMeta = document.querySelector('meta[name="description"]')
    if (descMeta) descMeta.content = description
    if (document.getElementById('pageDescription')) document.getElementById('pageDescription').content = description
    
    // Update keywords
    const keywords = lang === 'tg' ? keywordsTg : (lang === 'en' ? keywordsEn : keywordsRu)
    const keywordsMeta = document.querySelector('meta[name="keywords"]')
    if (keywordsMeta) keywordsMeta.content = keywords
    if (document.getElementById('pageKeywords')) document.getElementById('pageKeywords').content = keywords
    
    // Update Open Graph
    if (document.getElementById('ogTitle')) document.getElementById('ogTitle').content = title
    if (document.getElementById('ogDescription')) document.getElementById('ogDescription').content = description
    
    // Update canonical URL
    const canonicalUrl = `https://tafsiri-osonbayon.com/surah.html?num=${surahNum}`
    if (document.getElementById('canonicalUrl')) document.getElementById('canonicalUrl').href = canonicalUrl
    if (document.getElementById('ogUrl')) document.getElementById('ogUrl').content = canonicalUrl
    
    // Update structured data
    updateStructuredData(surah, name, title, description)
  }

  function updateStructuredData(surah, name, title, description){
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "author": {
        "@type": "Organization",
        "name": "Тафсири осонбаён"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Тафсири осонбаён",
        "url": "https://tafsiri-osonbayon.com"
      },
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://tafsiri-osonbayon.com/surah.html?num=${surah.n || num}`
      },
      "about": {
        "@type": "Thing",
        "name": `Сура ${name}`,
        "description": `Сура ${surah.n || num} Священного Корана`
      },
      "inLanguage": ["ru", "tg", "en"]
    }
    
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) existingScript.remove()
    
    // Add new structured data
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)
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
    
    // Track page save event
    if (window.analytics) {
      const surahName = getName(s)
      window.analytics.trackPageSave(num, surahName, page)
    }
  }

  function openFullscreen(){
    if (!container) return
    if (container.requestFullscreen) container.requestFullscreen()
    else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen()
  }

  function initControls(){
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', openFullscreen)
    if (savePageBtn) savePageBtn.addEventListener('click', ()=>{
      // determine current page based on PDF.js scroll or iframe hash
      let current = 1 // default fallback
      try {
        const cont = document.getElementById('pdfContainer')
        console.log('Container:', cont)
        console.log('Container children:', cont?.children?.length)
        
        if (cont && cont.firstChild && cont.firstChild.tagName === 'IFRAME'){
          console.log('Using iframe mode')
          // Try to get current page from global function first
          if (typeof window.currentSurahPage === 'function') {
            current = window.currentSurahPage()
            console.log('Current page from function:', current)
          } else {
            const f = cont.firstChild
            const hash = f.contentWindow?.location?.hash || ''
            console.log('Iframe hash:', hash)
            const m = /page=(\d+)/.exec(hash)
            if (m) current = Number(m[1])
          }
        } else if (cont && cont.children.length > 0){
          console.log('Using PDF.js mode')
          console.log('Scroll position:', cont.scrollTop, 'Container height:', cont.clientHeight)
          const scrollTop = cont.scrollTop
          const containerHeight = cont.clientHeight
          const viewportTop = scrollTop
          const viewportBottom = scrollTop + containerHeight
          console.log('Viewport:', viewportTop, 'to', viewportBottom)
          
          // Find the page that is most visible in the viewport
          let bestPage = 1
          let maxVisibleArea = 0
          
          for (let i = 0; i < cont.children.length; i++){
            const el = cont.children[i]
            const pageTop = el.offsetTop
            const pageBottom = pageTop + el.offsetHeight
            
            // Calculate visible area of this page
            const visibleTop = Math.max(viewportTop, pageTop)
            const visibleBottom = Math.min(viewportBottom, pageBottom)
            const visibleArea = Math.max(0, visibleBottom - visibleTop)
            
            console.log(`Page ${i+1}: top=${pageTop}, bottom=${pageBottom}, visible=${visibleArea}`)
            
            if (visibleArea > maxVisibleArea) {
              maxVisibleArea = visibleArea
              bestPage = i + 1
            }
          }
          
          current = bestPage
          console.log('Found current page:', current, 'with visible area:', maxVisibleArea)
        } else {
          console.log('No container or no children found')
        }
      } catch(e) {
        console.error('Error detecting page:', e)
      }
      
      console.log('Final current page:', current)
      
      // Only save if we found a valid page number
      if (current >= 1) {
        savePage(current)
        window.dispatchEvent(new CustomEvent('reading:updated', { detail: { num, page: current } }))
        showToast(current)
      }
    })
    // also persist on lang change (page number kept)
    window.addEventListener('lang:change', render)
  }

  // Use iframe native viewer and poll current page via hash
  function renderWithIframe(){
    const src = pdfPath()
    const page = pageFromHash() || getSavedPage()
    const frame = document.createElement('iframe')
    frame.className = 'pdf-frame'
    frame.loading = 'lazy'
    frame.title = 'PDF'
    frame.src = `${src}#page=${page}`
    container.innerHTML = ''
    container.appendChild(frame)

    // Store current page for manual save
    let currentPage = page
    
    // Simple approach: let user manually set page via input
    const pageInput = document.createElement('div')
    pageInput.style.cssText = 'position:fixed;top:10px;right:10px;z-index:1000;background:var(--panel);padding:8px;border-radius:8px;border:1px solid var(--border);'
    pageInput.innerHTML = `
      <input type="number" id="manualPage" value="${page}" min="1" style="width:60px;padding:4px;margin-right:8px;border-radius:4px;border:1px solid var(--border);background:var(--bg);color:var(--text);">
      <button onclick="goToPage()" style="padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--brand);color:white;cursor:pointer;">Go</button>
    `
    document.body.appendChild(pageInput)
    
    // Global function to go to page
    window.goToPage = () => {
      const input = document.getElementById('manualPage')
      const newPage = Number(input.value)
      if (newPage >= 1) {
        currentPage = newPage
        frame.src = `${src}#page=${newPage}`
        savePage(newPage)
        window.dispatchEvent(new CustomEvent('reading:updated', { detail: { num, page: newPage } }))
      }
    }
    
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
            currentPage = p
            const input = document.getElementById('manualPage')
            if (input) input.value = p
            savePage(p)
            // notify homepage to update banner instantly
            window.dispatchEvent(new CustomEvent('reading:updated', { detail: { num, page: p } }))
          }
        }
      } catch(e) { /* cross-origin or not accessible yet: ignore */ }
    }, 1000)

    // Store current page in global variable for manual save
    window.currentSurahPage = () => currentPage

    // cleanup on unload
    window.addEventListener('beforeunload', ()=> {
      clearInterval(timer)
      if (pageInput.parentNode) pageInput.parentNode.removeChild(pageInput)
    })
  }

  // Render via PDF.js, capture current page on scroll
  async function renderWithPdfJs(){
    showLoader(true)
    try {
      const src = pdfPath()
      const pdfjsLib = window['pdfjsLib']
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
      const loadingTask = pdfjsLib.getDocument(src)
      const pdf = await loadingTask.promise
      const numPages = pdf.numPages
      container.innerHTML = ''
      const canvases = []

      // Get target page first
      const initial = pageFromHash() || getSavedPage()
      console.log('Initial page to scroll to:', initial)

      // Render all pages with progress tracking
      const renderPromises = []
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
        const renderPromise = page.render({ canvasContext: ctx, viewport: scaledViewport }).promise.then(() => {
          // Update progress after each page renders
          const progress = ((i / numPages) * 100)
          updateProgress(progress)
        })
        renderPromises.push(renderPromise)
      }

      // Wait for all pages to render
      await Promise.all(renderPromises)
      updateProgress(100)
      console.log('All pages rendered')

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
      
      // Now scroll to the target page after all rendering is complete
      const target = canvases[initial - 1]
      if (target){ 
        console.log('Scrolling to page', initial, 'at position', target.offsetTop)
        container.scrollTop = target.offsetTop - 8
      } else {
        console.log('No target found for page', initial)
      }
      
      // initial save
      savePage(initial)
      window.dispatchEvent(new CustomEvent('reading:updated', { detail: { num, page: initial } }))
    } catch (error) {
      console.error('Error rendering PDF:', error)
    } finally {
      showLoader(false)
    }
  }

  function throttle(fn, wait){
    let t = 0
    return function(){
      const now = Date.now()
      if (now - t > wait){ t = now; fn() }
    }
  }

  function showLoader(show = true){
    if (!loader) return
    if (show) {
      loader.classList.remove('hidden')
      updateProgress(0)
    } else {
      loader.classList.add('hidden')
    }
  }

  function updateProgress(percent){
    if (progressFill) progressFill.style.width = `${percent}%`
    if (progressText) progressText.textContent = `${Math.round(percent)}%`
  }

  function showToast(page){
    if (!toast) return
    const lang = currentLang()
    const name = getName(s)
    const surahName = `${s.n || num}. ${name}`
    const ayahLabel = lang==='tg' ? 'Сахифа' : (lang==='en' ? 'Page' : 'Cтраница')
    const savedLabel = lang==='tg' ? 'нигоҳ дошта шуд' : (lang==='en' ? 'saved' : 'сохранена')
    const msg = `${surahName} - ${ayahLabel} ${page} ${savedLabel}`
    toast.textContent = msg
    toast.classList.add('show')
    setTimeout(()=> toast.classList.remove('show'), 2000)
  }

  document.addEventListener('DOMContentLoaded', ()=>{ render(); initControls(); })
})()


