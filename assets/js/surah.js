;(function(){
  const params = new URLSearchParams(location.search)
  const num = Number(params.get('num') || '1')
  const nameEl = document.getElementById('surahName')
  const metaEl = document.getElementById('surahMeta')
  const container = document.getElementById('pdfContainer')
  const prevBtn = document.getElementById('prevPage')
  const nextBtn = document.getElementById('nextPage')
  const fullscreenBtn = document.getElementById('fullscreenBtn')
  const savePageBtn = document.getElementById('savePageBtn')
  const toast = document.getElementById('toast')
  const loader = document.getElementById('loader')
  
  // Audio player elements - Desktop
  const compactAudioPlayer = document.getElementById('compactAudioPlayer')
  const playPauseBtn = document.getElementById('playPauseBtn')
  const reciterSelect = document.getElementById('reciterSelect')
  const audioProgress = document.getElementById('audioProgress')
  const currentTime = document.getElementById('currentTime')
  const duration = document.getElementById('duration')
  
  // Audio player elements - Mobile
  const compactAudioPlayerMobile = document.getElementById('compactAudioPlayerMobile')
  const playPauseBtnMobile = document.getElementById('playPauseBtnMobile')
  const reciterSelectMobile = document.getElementById('reciterSelectMobile')
  const audioProgressMobile = document.getElementById('audioProgressMobile')
  const currentTimeMobile = document.getElementById('currentTimeMobile')
  const durationMobile = document.getElementById('durationMobile')
  
  // Common elements
  const progressFill = document.getElementById('progressFill')
  const progressText = document.getElementById('progressText')
  
  // Info menu elements
  const infoToggle = document.getElementById('infoToggle')
  const infoDropdown = document.getElementById('infoDropdown')

  const SURAHS = window.SURAHS || []

  function currentLang(){ return localStorage.getItem('lang') || 'tg' }

  function getName(s){
    const lang = currentLang()
    if (lang === 'tg') return s.tg
    if (lang === 'en') return s.a
    return s.ru
  }

  const FALLBACK = { n:num, a:`Surah ${num}`, ru:`Сура ${num}`, tg:`Сура ${num}` }
  // lightweight names for the detail page (basic)
  const minimal = {
    1: {a:'Al-Fatiha',ru:'Аль-Фатиха',tg:'Ал-Фотиҳа'},
    2: {a:'Al-Baqarah',ru:'Аль-Бакара',tg:'Ал-Бақара'},
    3: {a:"Ali 'Imran",ru:'Али Имран',tg:"Оли Имрон"},
    4: {a:'An-Nisa',ru:'Ан-Ниса',tg:'Ан-Нисо'},
    5: {a:"Al-Ma'idah",ru:'Аль-Маида',tg:'Ал-Моида'},
    6: {a:"Al-An'am",ru:'Аль-Анам',tg:'Ал-Анам'},
    7: {a:'Al-A`raf',ru:'Аль-Араф',tg:'Ал-Аъроф'},
    8: {a:'Al-Anfal',ru:'Аль-Анфаль',tg:'Ал-Анфол'},
    9: {a:'At-Tawbah',ru:'Ат-Тауба',tg:'Ат-Тавба'},
    10: {a:'Yunus',ru:'Юнус',tg:'Юнус'},
    11: {a:'Hud',ru:'Худ',tg:'Ҳуд'},
    12: {a:'Yusuf',ru:'Юсуф',tg:'Юсуф'},
    13: {a:'Ar-Ra`d',ru:'Ар-Раад',tg:'Ар-Раъд'},
    14: {a:'Ibrahim',ru:'Ибрахим',tg:'Иброҳим'},
    15: {a:'Al-Hijr',ru:'Аль-Хиджр',tg:'Ал-Ҳижр'},
    16: {a:'An-Nahl',ru:'Ан-Нахль',tg:'Ан-Нахл'},
    17: {a:'Al-Isra',ru:'Аль-Исра',tg:'Ал-Исро'},
    18: {a:'Al-Kahf',ru:'Аль-Кахф',tg:'Ал-Каҳф'},
    19: {a:'Maryam',ru:'Марьям',tg:'Марям'},
    20: {a:'Ta-Ha',ru:'Та Ха',tg:'То Ҳо'},
    21: {a:'Al-Anbiya',ru:'Аль-Анбия',tg:'Ал-Анбиё'},
    22: {a:'Al-Hajj',ru:'Аль-Хадж',tg:'Ал-Ҳаҷ'},
    23: {a:'Al-Mu minun',ru:'Аль-Муминиун',tg:'Ал-Муъминун'},
    24: {a:'An-Nur',ru:'Ан-Нур',tg:'Ан-Нур'},
    25: {a:'Al-Furqan',ru:'Аль-Фуркан',tg:'Ал-Фурқон'},
    26: {a:"Ash-Shu'ara'",ru:'Аш-Шуара',tg:'Аш-Шуъаро'},
    27: {a:'An-Naml',ru:'Ан-Намль',tg:'Ан-Намл'},
    28: {a:'Al-Qasas',ru:'Аль-Касас',tg:'Ал-Қасас'},
    29: {a:'Al-Ankabut',ru:'Аль-Анкабут',tg:'Ал-Анкабут'},
    30: {a:'Ar-Rum',ru:'Ар-Рум',tg:'Ар-Рум'},
    31: {a:'Luqman',ru:'Лукман',tg:'Луқмон'},
    32: {a:'As-Sajdah',ru:'Ас-Саджда',tg:'Ас-Саджда'},
    33: {a:'Al-Ahzab',ru:'Аль-Ахзаб',tg:'Ал-Аҳзоб'},
    34: {a:'Saba',ru:'Саба',tg:'Саба'},
    35: {a:'Fatir',ru:'Фатыр',tg:'Фотир'},
    36: {a:'Ya-Sin',ru:'Йа Син',tg:'Ё Син'},
    37: {a:'As-Saffat',ru:'Ас-Саффат',tg:'Ас-Саффат'},
    38: {a:'Sad',ru:'Сад',tg:'Сод'},
    39: {a:'Az-Zumar',ru:'Аз-Зумар',tg:'Аз-Зумар'},
    40: {a:'Ghafir',ru:'Гафир',tg:'Ғофир'},
    41: {a:'Fussilat',ru:'Фуссилат',tg:'Фуссилат'},
    42: {a:'Ash-Shura',ru:'Аш-Шура',tg:'Аш-Шуро'},
    43: {a:'Az-Zukhruf',ru:'Аз-Зухруф',tg:'Аз-Зухруф'},
    44: {a:'Ad-Dukhan',ru:'Ад-Духан',tg:'Ад-Духон'},
    45: {a:'Al-Jathiyah',ru:'Аль-Джасия',tg:'Ал-Ҷасия'},
    46: {a:'Al-Ahqaf',ru:'Аль-Ахкаф',tg:'Ал-Аҳқаф'},
    47: {a:'Muhammad',ru:'Мухаммад',tg:'Муҳаммад'},
    48: {a:'Al-Fath',ru:'Аль-Фатх',tg:'Ал-Фатҳ'},
    49: {a:'Al-Hujurat',ru:'Аль-Худжурат',tg:'Ал-Ҳуҷурот'},
    50: {a:'Qaf',ru:'Каф',tg:'Қоф'},
    51: {a:'Adh-Dhariyat',ru:'Аз-Зарият',tg:'Аз-Зариёт'},
    52: {a:'At-Tur',ru:'Ат-Тур',tg:'Ат-Тур'},
    53: {a:'An-Najm',ru:'Ан-Наджм',tg:'Ан-Наҷм'},
    54: {a:'Al-Qamar',ru:'Аль-Камар',tg:'Ал-Қамар'},
    55: {a:'Ar-Rahman',ru:'Ар-Рахман',tg:'Ар-Раҳмон'},
    56: {a:'Al-Waqi`ah',ru:'Аль-Вакиа',tg:'Ал-Воқиа'},
    57: {a:'Al-Hadid',ru:'Аль-Хадид',tg:'Ал-Ҳадид'},
    58: {a:'Al-Mujadilah',ru:'Аль-Муджадила',tg:'Ал-Муҷадила'},
    59: {a:'Al-Hashr',ru:'Аль-Хашр',tg:'Ал-Ҳашр'},
    60: {a:'Al-Mumtahanah',ru:'Аль-Мумтахана',tg:'Ал-Мумтаҳана'},
    61: {a:'As-Saff',ru:'Ас-Сафф',tg:'Ас-Сафф'},
    62: {a:'Al-Jumu`ah',ru:'Аль-Джума',tg:'Ал-Ҷума'},
    63: {a:'Al-Munafiqun',ru:'Аль-Мунафикун',tg:'Ал-Мунафиқун'},
    64: {a:'At-Taghabun',ru:'Ат-Тагабун',tg:'Ат-Тағабун'},
    65: {a:'At-Talaq',ru:'Ат-Таляк',tg:'Ат-Талақ'},
    66: {a:'At-Tahrim',ru:'Ат-Тахрим',tg:'Ат-Таҳрим'},
    67: {a:'Al-Mulk',ru:'Аль-Мульк',tg:'Ал-Мулк'},
    68: {a:'Al-Qalam',ru:'Аль-Калям',tg:'Ал-Қалам'},
    69: {a:'Al-Haqqah',ru:'Аль-Хакка',tg:'Ал-Ҳаққа'},
    70: {a:'Al-Ma`arij',ru:'Аль-Мааридж',tg:'Ал-Маориҷ'},
    71: {a:'Nuh',ru:'Нух',tg:'Нуҳ'},
    72: {a:'Al-Jinn',ru:'Аль-Джинн',tg:'Ал-Ҷинн'},
    73: {a:'Al-Muzzammil',ru:'Аль-Муззаммиль',tg:'Ал-Муззаммил'},
    74: {a:'Al-Muddaththir',ru:'Аль-Муддассир',tg:'Ал-Муддассир'},
    75: {a:'Al-Qiyamah',ru:'Аль-Кияма',tg:'Ал-Қияма'},
    76: {a:'Al-Insan',ru:'Аль-Инсан',tg:'Ал-Инсон'},
    77: {a:'Al-Mursalat',ru:'Аль-Мурсалят',tg:'Ал-Мурсалят'},
    78: {a:'An-Naba',ru:'Ан-Наба',tg:'Ан-Наба'},
    79: {a:'An-Nazi`at',ru:'Ан-Назиат',tg:'Ан-Назиот'},
    80: {a:'`Abasa',ru:'Абаса',tg:'Абаса'},
    81: {a:'At-Takwir',ru:'Ат-Таквир',tg:'Ат-Таквир'},
    82: {a:'Al-Infitar',ru:'Аль-Инфитар',tg:'Ал-Инфитар'},
    83: {a:'Al-Mutaffifin',ru:'Аль-Мутаффифин',tg:'Ал-Мутаффифин'},
    84: {a:'Al-Inshiqaq',ru:'Аль-Иншикак',tg:'Ал-Иншиқоқ'},
    85: {a:'Al-Buruj',ru:'Аль-Бурудж',tg:'Ал-Буруҷ'},
    86: {a:'At-Tariq',ru:'Ат-Тарик',tg:'Ат-Тариқ'},
    87: {a:'Al-A`la',ru:'Аль-Аля',tg:'Ал-Аъло'},
    88: {a:'Al-Ghashiyah',ru:'Аль-Гашия',tg:'Ал-Ғошия'},
    89: {a:'Al-Fajr',ru:'Аль-Фаджр',tg:'Ал-Фаҷр'},
    90: {a:'Al-Balad',ru:'Аль-Баляд',tg:'Ал-Баляд'},
    91: {a:'Ash-Shams',ru:'Аш-Шамс',tg:'Аш-Шамс'},
    92: {a:'Al-Layl',ru:'Аль-Лайль',tg:'Ал-Лайл'},
    93: {a:'Ad-Duha',ru:'Ад-Духа',tg:'Ад-Дуҳо'},
    94: {a:'Ash-Sharh',ru:'Аш-Шарх',tg:'Аш-Шарҳ'},
    95: {a:'At-Tin',ru:'Ат-Тин',tg:'Ат-Тин'},
    96: {a:'Al-`Alaq',ru:'Аль-Аляк',tg:'Ал-Аляқ'},
    97: {a:'Al-Qadr',ru:'Аль-Кадр',tg:'Ал-Қадр'},
    98: {a:'Al-Bayyinah',ru:'Аль-Баййина',tg:'Ал-Баййина'},
    99: {a:'Az-Zalzalah',ru:'Аз-Зальзаля',tg:'Аз-Залзала'},
    100: {a:'Al-`Adiyat',ru:'Аль-Адия',tg:'Ал-Адия'},
    101: {a:'Al-Qari`ah',ru:'Аль-Кариа',tg:'Ал-Қориа'},
    102: {a:'At-Takathur',ru:'Ат-Такасур',tg:'Ат-Такасур'},
    103: {a:'Al-`Asr',ru:'Аль-Аср',tg:'Ал-Аср'},
    104: {a:'Al-Humazah',ru:'Аль-Хумаза',tg:'Ал-Ҳумаза'},
    105: {a:'Al-Fil',ru:'Аль-Филь',tg:'Ал-Фил'},
    106: {a:'Quraysh',ru:'Курайш',tg:'Қурайш'},
    107: {a:'Al-Ma`un',ru:'Аль-Маун',tg:'Ал-Маун'},
    108: {a:'Al-Kawthar',ru:'Аль-Каусар',tg:'Ал-Кавсар'},
    109: {a:'Al-Kafirun',ru:'Аль-Кафирун',tg:'Ал-Кафирун'},
    110: {a:'An-Nasr',ru:'Ан-Наср',tg:'Ан-Наср'},
    111: {a:'Al-Masad',ru:'Аль-Масад',tg:'Ал-Масод'},
    112: {a:'Al-Ikhlas',ru:'Аль-Ихлас',tg:'Ал-Ихлос'},
    113: {a:'Al-Falaq',ru:'Аль-Фаляк',tg:'Ал-Фалақ'},
    114: {a:'An-Nas',ru:'Ан-Нас',tg:'Ан-Нас'}
  }

  const s = minimal[num] ? { n:num, ...minimal[num] } : FALLBACK

  // Audio player state
  let audio = null
  let audioData = null
  let isPlaying = false
  let currentReciter = null
  let defaultReciter = '1' // Mishary Rashid Al Afasy

  function pdfPath(){
    const lang = currentLang()
    const dir = lang === 'en' ? 'tg' : (lang === 'tg' ? 'tg' : 'tg')
    // PDF files are organized by language: assets/pdfs/{lang}/{num}.pdf
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
    if (metaEl) metaEl.textContent = ''
    
    // Update SEO meta tags dynamically
    updateSEOMeta(s, name)
    
    // Track surah view
    if (window.analytics) {
      window.analytics.trackSurahRead(num, name, 1)
    }
    
    // Debug info
    console.log('Rendering surah:', num, 'PDF path:', pdfPath())
    console.log('PDF.js available:', !!window['pdfjsLib'])
    
    // Render PDF
    if (window['pdfjsLib']) {
      console.log('Using PDF.js for rendering')
      renderWithPdfJs()
    } else {
      console.log('Using iframe for rendering')
      renderWithIframe()
    }
  }

  function updateSEOMeta(surah, name){
    const lang = currentLang()
    const surahNum = surah.n || num
    
    // Generate SEO-optimized content
    const titleRu = `Сура ${name} - Коран на таджикском языке | Тафсири Осонбаён`
    const titleTg = `Сура ${name} - Қуръон бо забони тоҷикӣ | Тафсири Осонбаён`
    const titleEn = `Surah ${surah.a} - Quran in Tajik Language | Tafsiri Osonbayon`
    
    const descRu = `Читайте суру ${name} на таджикском языке с тафсиром. Сура ${surahNum} Корана с переводом и толкованием на точики.`
    const descTg = `Сура ${name}-ро бо забони тоҷикӣ бо тафсир хонед. Сура ${surahNum} Қуръон бо тарҷума ва тафсир.`
    const descEn = `Read Surah ${surah.a} in Tajik language with tafsir. Surah ${surahNum} of Quran with translation and commentary.`
    
    const keywordsRu = `сура ${name.toLowerCase()}, коран на таджикском, куръон бо забони точики, тафсири Осонбаён, сура ${surahNum}, коран суры, коран аяты, коран тафсир, коран толкование`
    const keywordsTg = `сура ${name.toLowerCase()}, қуръон бо забони тоҷикӣ, тафсири Осонбаён, сура ${surahNum}, қуръон сураҳо, қуръон оятҳо, қуръон тафсир`
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
        "name": "Тафсири Осонбаён"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Тафсири Осонбаён",
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
    console.log('savePage called with page:', page, 'type:', typeof page)
    if (!Number.isFinite(page) || page < 1) {
      console.log('savePage: invalid page number, not saving')
      return
    }
    const key = storageKey()
    console.log('savePage: saving page', page, 'with key', key)
    localStorage.setItem(key, String(page))
    localStorage.setItem(`${key}:ts`, String(Date.now()))
    
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

  // Audio player functions
  async function loadAudioData() {
    try {
      const response = await fetch(`https://quranapi.pages.dev/api/audio/${num}.json`)
      if (!response.ok) throw new Error('Failed to load audio data')
      audioData = await response.json()
      populateReciterSelect()
    } catch (error) {
      console.error('Error loading audio data:', error)
      showToast('Ошибка загрузки аудио')
    }
  }

  function populateReciterSelect() {
    if (!audioData) return
    
    // Populate desktop selector
    if (reciterSelect) {
      reciterSelect.innerHTML = '<option value="" data-i18n="select_reciter">Выберите хафиза</option>'
      
      Object.keys(audioData).forEach(key => {
        const reciter = audioData[key]
        const option = document.createElement('option')
        option.value = key
        option.textContent = reciter.reciter
        if (key === defaultReciter) {
          option.selected = true
        }
        reciterSelect.appendChild(option)
      })
    }
    
    // Populate mobile selector
    if (reciterSelectMobile) {
      reciterSelectMobile.innerHTML = '<option value="" data-i18n="select_reciter">Выберите хафиза</option>'
      
      Object.keys(audioData).forEach(key => {
        const reciter = audioData[key]
        const option = document.createElement('option')
        option.value = key
        option.textContent = reciter.reciter
        if (key === defaultReciter) {
          option.selected = true
        }
        reciterSelectMobile.appendChild(option)
      })
    }
    
    // Auto-select default reciter
    if (defaultReciter && audioData[defaultReciter]) {
      selectReciter(defaultReciter)
    }
  }

  function initAudioPlayer() {
    if (!audio) {
      audio = new Audio()
      setupAudioEventListeners()
    }
  }

  function setupAudioEventListeners() {
    if (!audio) return

    audio.addEventListener('loadedmetadata', () => {
      if (duration) duration.textContent = formatTime(audio.duration)
      if (durationMobile) durationMobile.textContent = formatTime(audio.duration)
    })

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100
        if (audioProgress) audioProgress.style.width = `${progress}%`
        if (audioProgressMobile) audioProgressMobile.style.width = `${progress}%`
        if (currentTime) currentTime.textContent = formatTime(audio.currentTime)
        if (currentTimeMobile) currentTimeMobile.textContent = formatTime(audio.currentTime)
      }
    })

    audio.addEventListener('ended', () => {
      isPlaying = false
      updatePlayPauseButton()
    })

    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e)
      showToast('Ошибка воспроизведения аудио')
    })
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function updatePlayPauseButton() {
    // Update desktop button
    if (playPauseBtn) {
      const playIcon = playPauseBtn.querySelector('.play-icon')
      const pauseIcon = playPauseBtn.querySelector('.pause-icon')
      
      if (isPlaying) {
        if (playIcon) playIcon.style.display = 'none'
        if (pauseIcon) pauseIcon.style.display = 'inline'
      } else {
        if (playIcon) playIcon.style.display = 'inline'
        if (pauseIcon) pauseIcon.style.display = 'none'
      }
    }
    
    // Update mobile button
    if (playPauseBtnMobile) {
      const playIcon = playPauseBtnMobile.querySelector('.play-icon')
      const pauseIcon = playPauseBtnMobile.querySelector('.pause-icon')
      
      if (isPlaying) {
        if (playIcon) playIcon.style.display = 'none'
        if (pauseIcon) pauseIcon.style.display = 'inline'
      } else {
        if (playIcon) playIcon.style.display = 'inline'
        if (pauseIcon) pauseIcon.style.display = 'none'
      }
    }
  }

  function togglePlayPause() {
    if (!audio || !currentReciter) return

    if (isPlaying) {
      audio.pause()
      isPlaying = false
    } else {
      audio.play()
      isPlaying = true
    }
    updatePlayPauseButton()
  }

  function selectReciter(reciterId) {
    if (!audioData || !reciterId) return

    const reciter = audioData[reciterId]
    if (!reciter) return

    currentReciter = reciter
    audio.src = reciter.url
    
    // Show compact audio player - Desktop
    if (compactAudioPlayer) {
      compactAudioPlayer.style.display = 'flex'
    }
    
    // Show compact audio player - Mobile
    if (compactAudioPlayerMobile) {
      compactAudioPlayerMobile.style.display = 'flex'
    }
    
    // Reset player state
    isPlaying = false
    updatePlayPauseButton()
    if (audioProgress) audioProgress.style.width = '0%'
    if (audioProgressMobile) audioProgressMobile.style.width = '0%'
    if (currentTime) currentTime.textContent = '0:00'
    if (currentTimeMobile) currentTimeMobile.textContent = '0:00'
    if (duration) duration.textContent = '0:00'
    if (durationMobile) durationMobile.textContent = '0:00'
  }


  function initControls(){
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', openFullscreen)
    if (savePageBtn) savePageBtn.addEventListener('click', ()=>{
      console.log('Save page button clicked')
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
            try {
              const hash = f.contentWindow?.location?.hash || ''
              console.log('Iframe hash:', hash)
              const m = /page=(\d+)/.exec(hash)
              if (m) {
                current = Number(m[1])
                console.log('Current page from hash:', current)
              } else {
                // If no hash, try to get from iframe URL
                const iframeSrc = f.src || ''
                console.log('Iframe src:', iframeSrc)
                const urlMatch = /page=(\d+)/.exec(iframeSrc)
                if (urlMatch) {
                  current = Number(urlMatch[1])
                  console.log('Current page from URL:', current)
                } else {
                  console.log('No page found in iframe, using default 1')
                }
              }
            } catch (e) {
              console.log('Cannot access iframe content due to CORS, using default 1')
            }
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
            if (!el || el.offsetHeight === 0) {
              console.log(`Page ${i+1}: not ready yet`)
              continue
            }
            
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
    
    // Audio player event listeners - Desktop
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', togglePlayPause)
    }
    
    if (reciterSelect) {
      reciterSelect.addEventListener('change', (e) => {
        selectReciter(e.target.value)
      })
    }
    
    // Audio player event listeners - Mobile
    if (playPauseBtnMobile) {
      playPauseBtnMobile.addEventListener('click', togglePlayPause)
    }
    
    if (reciterSelectMobile) {
      reciterSelectMobile.addEventListener('change', (e) => {
        selectReciter(e.target.value)
      })
    }
    
    // Progress bar click to seek - Desktop
    if (audioProgress) {
      audioProgress.addEventListener('click', (e) => {
        if (!audio || !audio.duration) return
        
        const rect = e.target.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const width = rect.width
        const seekTime = (clickX / width) * audio.duration
        
        audio.currentTime = seekTime
      })
    }
    
    // Progress bar click to seek - Mobile
    if (audioProgressMobile) {
      audioProgressMobile.addEventListener('click', (e) => {
        if (!audio || !audio.duration) return
        
        const rect = e.target.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const width = rect.width
        const seekTime = (clickX / width) * audio.duration
        
        audio.currentTime = seekTime
      })
    }
    
    // Initialize audio player
    initAudioPlayer()
    
    // Load audio data on page load
    loadAudioData()
    
    // also persist on lang change (page number kept)
    window.addEventListener('lang:change', render)
  }

  // Use iframe native viewer and poll current page via hash
  function renderWithIframe(){
    const src = pdfPath()
    const page = pageFromHash() || getSavedPage()
    console.log('Iframe rendering - src:', src, 'page:', page)
    
    const frame = document.createElement('iframe')
    frame.className = 'pdf-frame'
    frame.loading = 'lazy'
    frame.title = 'PDF'
    frame.src = `${src}#page=${page}&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0&view=FitH`
    
    // Add error handling
    frame.onerror = function() {
      console.error('Error loading PDF:', src)
    }
    
    frame.onload = function() {
      console.log('PDF iframe loaded successfully')
      
      // Start polling for page changes in iframe
      startIframePagePolling(frame)
    }
    
    container.innerHTML = ''
    container.appendChild(frame)
  }
  
  // Poll iframe for page changes
  function startIframePagePolling(frame) {
    let lastPage = 1
    let pollCount = 0
    const maxPolls = 100 // Stop after 100 attempts (about 10 seconds)
    
    const pollInterval = setInterval(() => {
      pollCount++
      if (pollCount > maxPolls) {
        clearInterval(pollInterval)
        console.log('Stopped iframe polling after max attempts')
        return
      }
      
      try {
        const hash = frame.contentWindow?.location?.hash || ''
        const urlMatch = /page=(\d+)/.exec(hash)
        const currentPage = urlMatch ? Number(urlMatch[1]) : 1
        
        if (currentPage !== lastPage) {
          console.log('Iframe page changed from', lastPage, 'to', currentPage)
          lastPage = currentPage
          savePage(currentPage)
          window.dispatchEvent(new CustomEvent('reading:updated', { detail: { num, page: currentPage } }))
        }
      } catch (e) {
        // CORS error, stop polling
        console.log('CORS error in iframe polling, stopping')
        clearInterval(pollInterval)
      }
    }, 100) // Poll every 100ms
  }

  // Render via PDF.js, capture current page on scroll
  async function renderWithPdfJs(){
    showLoader(true)
    try {
      const src = pdfPath()
      console.log('PDF.js rendering - src:', src)
      
      const pdfjsLib = window['pdfjsLib']
      if (!pdfjsLib) {
        throw new Error('PDF.js library not loaded')
      }
      
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
      console.log('Loading PDF document...')
      
      // Disable PDF.js toolbar and page numbers
      const loadingTask = pdfjsLib.getDocument({
        url: src,
        disableAutoFetch: true,
        disableStream: true,
        disableRange: true,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true
      })
      const pdf = await loadingTask.promise
      const numPages = pdf.numPages
      
      console.log('PDF loaded successfully, pages:', numPages)
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
        // Check if canvases are ready
        if (!canvases || canvases.length === 0) {
          console.log('Detect: canvases not ready yet')
          return
        }
        
        const scrollTop = container.scrollTop
        const containerHeight = container.clientHeight
        const viewportTop = scrollTop
        const viewportBottom = scrollTop + containerHeight
        
        console.log('Detect: scrollTop=', scrollTop, 'containerHeight=', containerHeight, 'canvases=', canvases.length)
        
        // Find the page that is most visible in the viewport
        let bestPage = 1
        let maxVisibleArea = 0
        
        for (let i = 0; i < canvases.length; i++){
          const el = canvases[i]
          if (!el || el.offsetHeight === 0) {
            console.log(`Page ${i+1}: not ready yet`)
            continue
          }
          
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
        
        console.log('Auto-detected page:', bestPage, 'with visible area:', maxVisibleArea)
        savePage(bestPage)
        window.dispatchEvent(new CustomEvent('reading:updated', { detail: { num, page: bestPage } }))
      }
      
      // Add scroll listener after a delay to ensure pages are rendered
      setTimeout(() => {
        container.addEventListener('scroll', throttle(detect, 250))
        console.log('Scroll listener added')
      }, 1000)
      
      // Now scroll to the target page after all rendering is complete
      const target = canvases[initial - 1]
      if (target){ 
        console.log('Scrolling to page', initial, 'at position', target.offsetTop)
        container.scrollTop = target.offsetTop - 8
      } else {
        console.log('No target found for page', initial)
      }
      
      // Wait a bit for scroll to complete, then detect current page
      setTimeout(() => {
        console.log('Running initial detect after scroll')
        detect()
      }, 500)
      
      // initial save
      savePage(initial)
      window.dispatchEvent(new CustomEvent('reading:updated', { detail: { num, page: initial } }))
    } catch (error) {
      console.error('Error rendering PDF:', error)
      
      // Fallback to iframe if PDF.js fails
      console.log('Falling back to iframe rendering')
      renderWithIframe()
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

  // Info menu functionality
  function toggleInfoMenu() {
    if (infoDropdown) {
      infoDropdown.classList.toggle('show')
    }
  }

  function closeInfoMenu() {
    if (infoDropdown) {
      infoDropdown.classList.remove('show')
    }
  }

  // Event listeners for info menu
  if (infoToggle) {
    infoToggle.addEventListener('click', toggleInfoMenu)
  }

  if (infoDropdown) {
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!infoToggle.contains(e.target) && !infoDropdown.contains(e.target)) {
        closeInfoMenu()
      }
    })
  }

  // Wait for PDF.js to load before rendering
  let pdfJsTimeout = 0
  function waitForPdfJs() {
    if (window['pdfjsLib']) {
      console.log('PDF.js loaded, starting render')
      render()
      initControls()
    } else {
      pdfJsTimeout += 100
      if (pdfJsTimeout > 5000) {
        console.log('PDF.js failed to load after 5s, using iframe fallback')
        render()
        initControls()
      } else {
        console.log('PDF.js not loaded yet, retrying in 100ms')
        setTimeout(waitForPdfJs, 100)
      }
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{ 
    console.log('DOM loaded, waiting for PDF.js...')
    waitForPdfJs()
  })
})()



