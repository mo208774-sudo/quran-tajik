;(function(){
  const searchInput = document.getElementById('searchInput')
  const grid = document.getElementById('surahGrid')
  const totalCount = document.getElementById('totalCount')
  const cont = document.getElementById('continueBanner')
  const contLink = document.getElementById('continueLink')
  const contGo = document.getElementById('continueGo')
  const clearContinue = document.getElementById('clearContinue')
  const contMeta = document.getElementById('continueMeta')
  const loader = document.getElementById('loader')
  const progressFill = document.getElementById('progressFill')
  const progressText = document.getElementById('progressText')

  const SURAHS = [
    { n:1,  a:'Al-Fatiha', ru:'Аль-Фатиха', tg:'Ал-Фотиҳа' },
    { n:2,  a:'Al-Baqarah', ru:'Аль-Бакара', tg:'Ал-Бақара' },
    { n:3,  a:"Ali 'Imran", ru:'Али Имран', tg:"Оли Имрон" },
    { n:4,  a:'An-Nisa', ru:'Ан-Ниса', tg:'Ан-Нисо' },
    { n:5,  a:"Al-Ma'idah", ru:'Аль-Маида', tg:'Ал-Моида' },
    { n:6,  a:"Al-An'am", ru:'Аль-Анам', tg:'Ал-Анам' },
    { n:7,  a:'Al-A`raf', ru:'Аль-Араф', tg:'Ал-Аъроф' },
    { n:8,  a:'Al-Anfal', ru:'Аль-Анфаль', tg:'Ал-Анфол' },
    { n:9,  a:'At-Tawbah', ru:'Ат-Тауба', tg:'Ат-Тавба' },
    { n:10, a:'Yunus', ru:'Юнус', tg:'Юнус' },
    { n:11, a:'Hud', ru:'Худ', tg:'Ҳуд' },
    { n:12, a:'Yusuf', ru:'Юсуф', tg:'Юсуф' },
    { n:13, a:'Ar-Ra`d', ru:'Ар-Раад', tg:'Ар-Раъд' },
    { n:14, a:'Ibrahim', ru:'Ибрахим', tg:'Иброҳим' },
    { n:15, a:'Al-Hijr', ru:'Аль-Хиджр', tg:'Ал-Ҳижр' },
    { n:16, a:'An-Nahl', ru:'Ан-Нахль', tg:'Ан-Нахл' },
    { n:17, a:'Al-Isra', ru:'Аль-Исра', tg:'Ал-Исро' },
    { n:18, a:'Al-Kahf', ru:'Аль-Кахф', tg:'Ал-Каҳф' },
    { n:19, a:'Maryam', ru:'Марьям', tg:'Марям' },
    { n:20, a:'Ta-Ha', ru:'Та Ха', tg:'То Ҳо' },
    { n:21, a:'Al-Anbiya', ru:'Аль-Анбия', tg:'Ал-Анбиё' },
    { n:22, a:'Al-Hajj', ru:'Аль-Хадж', tg:'Ал-Ҳаҷ' },
    { n:23, a:'Al-Mu minun', ru:'Аль-Муминиун', tg:'Ал-Муъминун' },
    { n:24, a:'An-Nur', ru:'Ан-Нур', tg:'Ан-Нур' },
    { n:25, a:'Al-Furqan', ru:'Аль-Фуркан', tg:'Ал-Фурқон' },
    { n:26, a:"Ash-Shu'ara'", ru:'Аш-Шуара', tg:'Аш-Шуъаро' },
    { n:27, a:'An-Naml', ru:'Ан-Намль', tg:'Ан-Намл' },
    { n:28, a:'Al-Qasas', ru:'Аль-Касас', tg:'Ал-Қасас' },
    { n:29, a:'Al-Ankabut', ru:'Аль-Анкабут', tg:'Ал-Анкабут' },
    { n:30, a:'Ar-Rum', ru:'Ар-Рум', tg:'Ар-Рум' },
    { n:31, a:'Luqman', ru:'Лукман', tg:'Луқмон' },
    { n:32, a:'As-Sajdah', ru:'Ас-Саджда', tg:'Ас-Саджда' },
    { n:33, a:'Al-Ahzab', ru:'Аль-Ахзаб', tg:'Ал-Аҳзоб' },
    { n:34, a:'Saba', ru:'Саба', tg:'Саба' },
    { n:35, a:'Fatir', ru:'Фатыр', tg:'Фотир' },
    { n:36, a:'Ya-Sin', ru:'Йа Син', tg:'Ё Син' },
    { n:37, a:'As-Saffat', ru:'Ас-Саффат', tg:'Ас-Саффат' },
    { n:38, a:'Sad', ru:'Сад', tg:'Сод' },
    { n:39, a:'Az-Zumar', ru:'Аз-Зумар', tg:'Аз-Зумар' },
    { n:40, a:'Ghafir', ru:'Гафир', tg:'Ғофир' },
    { n:41, a:'Fussilat', ru:'Фуссилат', tg:'Фуссилат' },
    { n:42, a:'Ash-Shura', ru:'Аш-Шура', tg:'Аш-Шуро' },
    { n:43, a:'Az-Zukhruf', ru:'Аз-Зухруф', tg:'Аз-Зухруф' },
    { n:44, a:'Ad-Dukhan', ru:'Ад-Духан', tg:'Ад-Духон' },
    { n:45, a:'Al-Jathiyah', ru:'Аль-Джасия', tg:'Ал-Ҷасия' },
    { n:46, a:'Al-Ahqaf', ru:'Аль-Ахкаф', tg:'Ал-Аҳқаф' },
    { n:47, a:'Muhammad', ru:'Мухаммад', tg:'Муҳаммад' },
    { n:48, a:'Al-Fath', ru:'Аль-Фатх', tg:'Ал-Фатҳ' },
    { n:49, a:'Al-Hujurat', ru:'Аль-Худжурат', tg:'Ал-Ҳуҷурот' },
    { n:50, a:'Qaf', ru:'Каф', tg:'Қоф' },
    { n:51, a:'Adh-Dhariyat', ru:'Аз-Зарият', tg:'Аз-Зариёт' },
    { n:52, a:'At-Tur', ru:'Ат-Тур', tg:'Ат-Тур' },
    { n:53, a:'An-Najm', ru:'Ан-Наджм', tg:'Ан-Наҷм' },
    { n:54, a:'Al-Qamar', ru:'Аль-Камар', tg:'Ал-Қамар' },
    { n:55, a:'Ar-Rahman', ru:'Ар-Рахман', tg:'Ар-Раҳмон' },
    { n:56, a:'Al-Waqi`ah', ru:'Аль-Вакиа', tg:'Ал-Воқиа' },
    { n:57, a:'Al-Hadid', ru:'Аль-Хадид', tg:'Ал-Ҳадид' },
    { n:58, a:'Al-Mujadilah', ru:'Аль-Муджадила', tg:'Ал-Муҷадила' },
    { n:59, a:'Al-Hashr', ru:'Аль-Хашр', tg:'Ал-Ҳашр' },
    { n:60, a:'Al-Mumtahanah', ru:'Аль-Мумтахана', tg:'Ал-Мумтаҳана' },
    { n:61, a:'As-Saff', ru:'Ас-Сафф', tg:'Ас-Сафф' },
    { n:62, a:'Al-Jumu`ah', ru:'Аль-Джума', tg:'Ал-Ҷума' },
    { n:63, a:'Al-Munafiqun', ru:'Аль-Мунафикун', tg:'Ал-Мунафиқун' },
    { n:64, a:'At-Taghabun', ru:'Ат-Тагабун', tg:'Ат-Тағабун' },
    { n:65, a:'At-Talaq', ru:'Ат-Таляк', tg:'Ат-Талақ' },
    { n:66, a:'At-Tahrim', ru:'Ат-Тахрим', tg:'Ат-Таҳрим' },
    { n:67, a:'Al-Mulk', ru:'Аль-Мульк', tg:'Ал-Мулк' },
    { n:68, a:'Al-Qalam', ru:'Аль-Калям', tg:'Ал-Қалам' },
    { n:69, a:'Al-Haqqah', ru:'Аль-Хакка', tg:'Ал-Ҳаққа' },
    { n:70, a:'Al-Ma`arij', ru:'Аль-Мааридж', tg:'Ал-Маориҷ' },
    { n:71, a:'Nuh', ru:'Нух', tg:'Нуҳ' },
    { n:72, a:'Al-Jinn', ru:'Аль-Джинн', tg:'Ал-Ҷинн' },
    { n:73, a:'Al-Muzzammil', ru:'Аль-Муззаммиль', tg:'Ал-Муззаммил' },
    { n:74, a:'Al-Muddaththir', ru:'Аль-Муддассир', tg:'Ал-Муддассир' },
    { n:75, a:'Al-Qiyamah', ru:'Аль-Кияма', tg:'Ал-Қияма' },
    { n:76, a:'Al-Insan', ru:'Аль-Инсан', tg:'Ал-Инсон' },
    { n:77, a:'Al-Mursalat', ru:'Аль-Мурсалят', tg:'Ал-Мурсалят' },
    { n:78, a:'An-Naba', ru:'Ан-Наба', tg:'Ан-Наба' },
    { n:79, a:'An-Nazi`at', ru:'Ан-Назиат', tg:'Ан-Назиот' },
    { n:80, a:'`Abasa', ru:'Абаса', tg:'Абаса' },
    { n:81, a:'At-Takwir', ru:'Ат-Таквир', tg:'Ат-Таквир' },
    { n:82, a:'Al-Infitar', ru:'Аль-Инфитар', tg:'Ал-Инфитар' },
    { n:83, a:'Al-Mutaffifin', ru:'Аль-Мутаффифин', tg:'Ал-Мутаффифин' },
    { n:84, a:'Al-Inshiqaq', ru:'Аль-Иншикак', tg:'Ал-Иншиқоқ' },
    { n:85, a:'Al-Buruj', ru:'Аль-Бурудж', tg:'Ал-Буруҷ' },
    { n:86, a:'At-Tariq', ru:'Ат-Тарик', tg:'Ат-Тариқ' },
    { n:87, a:'Al-A`la', ru:'Аль-Аля', tg:'Ал-Аъло' },
    { n:88, a:'Al-Ghashiyah', ru:'Аль-Гашия', tg:'Ал-Ғошия' },
    { n:89, a:'Al-Fajr', ru:'Аль-Фаджр', tg:'Ал-Фаҷр' },
    { n:90, a:'Al-Balad', ru:'Аль-Баляд', tg:'Ал-Баляд' },
    { n:91, a:'Ash-Shams', ru:'Аш-Шамс', tg:'Аш-Шамс' },
    { n:92, a:'Al-Layl', ru:'Аль-Лайль', tg:'Ал-Лайл' },
    { n:93, a:'Ad-Duha', ru:'Ад-Духа', tg:'Ад-Дуҳо' },
    { n:94, a:'Ash-Sharh', ru:'Аш-Шарх', tg:'Аш-Шарҳ' },
    { n:95, a:'At-Tin', ru:'Ат-Тин', tg:'Ат-Тин' },
    { n:96, a:'Al-`Alaq', ru:'Аль-Аляк', tg:'Ал-Аляқ' },
    { n:97, a:'Al-Qadr', ru:'Аль-Кадр', tg:'Ал-Қадр' },
    { n:98, a:'Al-Bayyinah', ru:'Аль-Баййина', tg:'Ал-Баййина' },
    { n:99, a:'Az-Zalzalah', ru:'Аз-Зальзаля', tg:'Аз-Залзала' },
    { n:100, a:'Al-`Adiyat', ru:'Аль-Адия', tg:'Ал-Адия' },
    { n:101, a:'Al-Qari`ah', ru:'Аль-Кариа', tg:'Ал-Қориа' },
    { n:102, a:'At-Takathur', ru:'Ат-Такасур', tg:'Ат-Такасур' },
    { n:103, a:'Al-`Asr', ru:'Аль-Аср', tg:'Ал-Аср' },
    { n:104, a:'Al-Humazah', ru:'Аль-Хумаза', tg:'Ал-Ҳумаза' },
    { n:105, a:'Al-Fil', ru:'Аль-Филь', tg:'Ал-Фил' },
    { n:106, a:'Quraysh', ru:'Курайш', tg:'Қурайш' },
    { n:107, a:'Al-Ma`un', ru:'Аль-Маун', tg:'Ал-Маун' },
    { n:108, a:'Al-Kawthar', ru:'Аль-Каусар', tg:'Ал-Кавсар' },
    { n:109, a:'Al-Kafirun', ru:'Аль-Кафирун', tg:'Ал-Кафирун' },
    { n:110, a:'An-Nasr', ru:'Ан-Наср', tg:'Ан-Наср' },
    { n:111, a:'Al-Masad', ru:'Аль-Масад', tg:'Ал-Масод' },
    { n:112, a:'Al-Ikhlas', ru:'Аль-Ихлас', tg:'Ал-Ихлос' },
    { n:113, a:'Al-Falaq', ru:'Аль-Фаляк', tg:'Ал-Фалақ' },
    { n:114, a:'An-Nas', ru:'Ан-Нас', tg:'Ан-Нас' }
  ]

  function currentLang(){ return localStorage.getItem('lang') || 'tg' }

  function titleFor(surah){
    const lang = currentLang()
    if (lang === 'tg') return `${surah.n}. ${surah.tg}`
    if (lang === 'en') return `${surah.n}. ${surah.a}`
    return `${surah.n}. ${surah.ru}`
  }

  function render(list){
    if (!grid) return
    grid.innerHTML = ''
    list.forEach((s, index) => {
      const wrapper = document.createElement('div')
      wrapper.className = 'surah-card-wrapper'
      wrapper.setAttribute('itemscope', '')
      wrapper.setAttribute('itemtype', 'https://schema.org/ListItem')
      
      const position = document.createElement('meta')
      position.setAttribute('itemprop', 'position')
      position.content = index + 1
      wrapper.appendChild(position)
      
      const a = document.createElement('a')
      a.href = `surah.html?num=${s.n}`
      a.className = 'card'
      a.setAttribute('data-num', s.n)
      a.setAttribute('itemscope', '')
      a.setAttribute('itemtype', 'https://schema.org/Article')
      a.setAttribute('aria-label', `Читать суру ${titleFor(s)} на таджикском языке`)
      
      const title = titleFor(s)
      a.innerHTML = `
        <span class="badge" itemprop="articleSection">${s.n}</span>
        <div>
          <div itemprop="headline">${title}</div>
          <div class="meta" itemprop="alternativeHeadline">${s.a}</div>
        </div>
        <meta itemprop="description" content="Читайте суру ${title} на таджикском языке с тафсиром">
        <meta itemprop="author" content="Тафсири осонбаён">
        <meta itemprop="publisher" content="Тафсири осонбаён">
        <meta itemprop="inLanguage" content="${currentLang()}">
      `
      
      wrapper.appendChild(a)
      grid.appendChild(wrapper)
    })
    if (totalCount) totalCount.textContent = String(list.length)
  }

  function filter(){
    const q = (searchInput?.value || '').toLowerCase().trim()
    const lang = currentLang()
    const data = SURAHS.filter(s => {
      const fields = [String(s.n), s.a, s.ru, s.tg]
      const hay = fields.join(' ').toLowerCase()
      return hay.includes(q)
    }).map(s => ({...s}))
    
    // Track search if query is not empty
    if (q && window.analytics) {
      window.analytics.trackSearch(q, data.length)
    }
    
    render(data)
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

  function init(){
    // Show loader initially
    showLoader(true)
    
    // Simulate loading with progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress > 90) progress = 90
      updateProgress(progress)
    }, 50)
    
    // Complete loading after 500ms
    setTimeout(() => {
      clearInterval(interval)
      updateProgress(100)
      
      render(SURAHS)
      if (searchInput){
        document.addEventListener('keydown', e=>{ if (e.key === '/' && document.activeElement !== searchInput){ e.preventDefault(); searchInput.focus() }})
        searchInput.addEventListener('input', filter)
      }
      window.addEventListener('lang:change', ()=>{ filter(); updateContinue() })

      // Initial render of continue banner and live updates
      updateContinue()
      window.addEventListener('storage', (e)=>{ if (!e.key) return; if (e.key.startsWith(`lastRead:${currentLang()}:`)) updateContinue() })
      window.addEventListener('pageshow', updateContinue)
      document.addEventListener('visibilitychange', ()=>{ if (!document.hidden) updateContinue() })
      
      // Hide loader after everything is ready
      setTimeout(() => showLoader(false), 200)
    }, 500)
  }

  function findLatestSaved(){
    const lang = currentLang()
    const prefix = `lastRead:${lang}:`
    let latest = null
    let latestTime = 0
    for (let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i)
      if (!key || !key.startsWith(prefix)) continue
      const tsKey = `${key}:ts`
      const ts = Number(localStorage.getItem(tsKey) || '0')
      if (ts > latestTime){
        latestTime = ts
        latest = key
      }
    }
    return latest
  }

  function updateContinue(){
    if (!cont || !contLink || !contGo || !contMeta) return
    const latest = findLatestSaved()
    if (!latest){
      cont.hidden = true
      return
    }
    const parts = latest.split(':')
    const surahNum = Number(parts[2])
    const page = localStorage.getItem(latest)
    const ts = localStorage.getItem(`${latest}:ts`)
    const surah = SURAHS.find(s => s.n === surahNum)
    if (!surah) return
    const name = titleFor(surah)
    const time = new Date(Number(ts)).toLocaleString()
    contLink.href = `surah.html?num=${surahNum}#page=${page}`
    contGo.href = `surah.html?num=${surahNum}#page=${page}`
    contMeta.innerHTML = `
      <span class="surah">${name}</span>
      <span class="page">Страница ${page}</span>
      <span class="time">${time}</span>
    `
    cont.hidden = false
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()