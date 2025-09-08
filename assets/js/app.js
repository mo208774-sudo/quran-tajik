;(function(){
  const searchInput = document.getElementById('searchInput')
  const grid = document.getElementById('surahGrid')
  const totalCount = document.getElementById('totalCount')

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
    { n:32, a:'As-Sajdah', ru:'Ас-Саджда', tg:'Ас-Саҷда' },
    { n:33, a:'Al-Ahzab', ru:'Аль-Ахзаб', tg:'Ал-Аҳзоб' },
    { n:34, a:'Saba', ru:'Саба', tg:'Саба' },
    { n:35, a:'Fatir', ru:'Фатыр', tg:'Фотир' },
    { n:36, a:'Ya-Sin', ru:'Йа-Син', tg:'Ёсин' },
    { n:37, a:'As-Saffat', ru:'Ас-Саффат', tg:'Ас-Саффот' },
    { n:38, a:'Sad', ru:'Сад', tg:'Сод' },
    { n:39, a:'Az-Zumar', ru:'Аз-Зумар', tg:'Аз-Зумар' },
    { n:40, a:'Ghafir', ru:'Гафир', tg:'Ғофир' },
    { n:41, a:'Fussilat', ru:'Фуссилат', tg:'Фуссилат' },
    { n:42, a:'Ash-Shura', ru:'Аш-Шура', tg:'Аш-Шуро' },
    { n:43, a:'Az-Zukhruf', ru:'Аз-Зухруф', tg:'Аз-Зухруф' },
    { n:44, a:'Ad-Dukhan', ru:'Ад-Духан', tg:'Ад-Духон' },
    { n:45, a:'Al-Jathiyah', ru:'Аль-Джасия', tg:'Ал-Ҷосия' },
    { n:46, a:'Al-Ahqaf', ru:'Аль-Ахкаф', tg:'Ал-Аҳқоф' },
    { n:47, a:'Muhammad', ru:'Мухаммад', tg:'Муҳаммад' },
    { n:48, a:'Al-Fath', ru:'Аль-Фатх', tg:'Ал-Фатҳ' },
    { n:49, a:'Al-Hujurat', ru:'Аль-Худжурат', tg:'Ал-Ҳуҷурот' },
    { n:50, a:'Qaf', ru:'Каф', tg:'Қоф' },
    { n:51, a:'Adh-Dhariyat', ru:'Аз-Зарийат', tg:'Аз-Зориёт' },
    { n:52, a:'At-Tur', ru:'Ат-Тур', tg:'Ат-Тур' },
    { n:53, a:'An-Najm', ru:'Ан-Наджм', tg:'Ан-Нажм' },
    { n:54, a:'Al-Qamar', ru:'Аль-Камар', tg:'Ал-Қамар' },
    { n:55, a:'Ar-Rahman', ru:'Ар-Рахман', tg:'Ар-Раҳмон' },
    { n:56, a:'Al-Waqi`ah', ru:'Аль-Вакиа', tg:'Ал-Воқиа' },
    { n:57, a:'Al-Hadid', ru:'Аль-Хадид', tg:'Ал-Ҳадид' },
    { n:58, a:'Al-Mujadila', ru:'Аль-Муджадиля', tg:'Ал-Муҷодила' },
    { n:59, a:'Al-Hashr', ru:'Аль-Хашр', tg:'Ал-Ҳашр' },
    { n:60, a:'Al-Mumtahanah', ru:'Аль-Мумтахина', tg:'Ал-Мумтаҳина' },
    { n:61, a:'As-Saff', ru:'Ас-Сафф', tg:'Ас-Саф' },
    { n:62, a:'Al-Jumu`ah', ru:'Аль-Джумуа', tg:'Ал-Ҷумъа' },
    { n:63, a:'Al-Munafiqun', ru:'Аль-Мунафикун', tg:'Ал-Мунафиқун' },
    { n:64, a:'At-Taghabun', ru:'Ат-Тагабун', tg:'Ат-Тагабун' },
    { n:65, a:'At-Talaq', ru:'Ат-Талак', tg:'Ат-Талоқ' },
    { n:66, a:'At-Tahrim', ru:'Ат-Тахрим', tg:'Ат-Таҳрим' },
    { n:67, a:'Al-Mulk', ru:'Аль-Мульк', tg:'Ал-Мулк' },
    { n:68, a:'Al-Qalam', ru:'Аль-Калям', tg:'Ал-Қалам' },
    { n:69, a:'Al-Haqqah', ru:'Аль-Хакка', tg:'Ал-Ҳаққа' },
    { n:70, a:"Al-Ma'arij", ru:'Аль-Маариж', tg:'Ал-Маориҷ' },
    { n:71, a:'Nuh', ru:'Нух', tg:'Нӯҳ' },
    { n:72, a:'Al-Jinn', ru:'Аль-Джинн', tg:'Ал-Ҷинн' },
    { n:73, a:'Al-Muzzammil', ru:'Аль-Муззаммиль', tg:'Ал-Муззаммил' },
    { n:74, a:'Al-Muddaththir', ru:'Аль-Муддассир', tg:'Ал-Муддассир' },
    { n:75, a:'Al-Qiyamah', ru:'Аль-Кияма', tg:'Ал-Қиёмат' },
    { n:76, a:'Al-Insan', ru:'Аль-Инсан', tg:'Ал-Инсон' },
    { n:77, a:'Al-Mursalat', ru:'Аль-Мурсалат', tg:'Ал-Мурсалот' },
    { n:78, a:'An-Naba', ru:'Ан-Наба', tg:'Ан-Набо' },
    { n:79, a:'An-Nazi`at', ru:'Ан-Назиат', tg:'Ан-Нозиот' },
    { n:80, a:'Abasa', ru:'Абаса', tg:'Абаса' },
    { n:81, a:'At-Takwir', ru:'Ат-Таквир', tg:'Ат-Таквир' },
    { n:82, a:'Al-Infitar', ru:'Аль-Инфитар', tg:'Ал-Инфитор' },
    { n:83, a:'Al-Mutaffifin', ru:'Аль-Мутаффифин', tg:'Ал-Мутаффифин' },
    { n:84, a:'Al-Inshiqaq', ru:'Аль-Иншикак', tg:'Ал-Иншиқоқ' },
    { n:85, a:'Al-Buruj', ru:'Аль-Бурудж', tg:'Ал-Бурудж' },
    { n:86, a:'At-Tariq', ru:'Ат-Тарик', tg:'Ат-Ториқ' },
    { n:87, a:'Al-A`la', ru:'Аль-Аъля', tg:'Ал-Аъло' },
    { n:88, a:'Al-Ghashiyah', ru:'Аль-Гашийа', tg:'Ал-Ғошия' },
    { n:89, a:'Al-Fajr', ru:'Аль-Фаджр', tg:'Ал-Фажр' },
    { n:90, a:'Al-Balad', ru:'Аль-Балад', tg:'Ал-Балад' },
    { n:91, a:'Ash-Shams', ru:'Аш-Шамс', tg:'Аш-Шамс' },
    { n:92, a:'Al-Layl', ru:'Аль-Лайл', tg:'Ал-Лайл' },
    { n:93, a:'Ad-Duha', ru:'Ад-Духа', tg:'Ад-Дуҳо' },
    { n:94, a:'Ash-Sharh', ru:'Аш-Шарх', tg:'Аш-Шарх' },
    { n:95, a:'At-Tin', ru:'Ат-Тин', tg:'Ат-Тин' },
    { n:96, a:'Al-Alaq', ru:'Аль-Алак', tg:'Ал-Алак' },
    { n:97, a:'Al-Qadr', ru:'Аль-Кадр', tg:'Ал-Қадр' },
    { n:98, a:'Al-Bayyinah', ru:'Аль-Баийин', tg:'Ал-Баййина' },
    { n:99, a:'Az-Zalzalah', ru:'Аз-Залзаля', tg:'Аз-Залзала' },
    { n:100, a:'Al-Adiyat', ru:'Аль-Адиат', tg:'Ал-Одиёт' },
    { n:101, a:'Al-Qari`ah', ru:'Аль-Кариа', tg:'Ал-Қория' },
    { n:102, a:'At-Takathur', ru:'Ат-Такясур', tg:'Ат-Такосур' },
    { n:103, a:'Al-Asr', ru:'Аль-Аср', tg:'Ал-Аср' },
    { n:104, a:'Al-Humazah', ru:'Аль-Хумаза', tg:'Ал-Ҳумаза' },
    { n:105, a:'Al-Fil', ru:'Аль-Филь', tg:'Ал-Фил' },
    { n:106, a:'Quraysh', ru:'Курайш', tg:'Қурайш' },
    { n:107, a:'Al-Ma`un', ru:'Аль-Маун', tg:'Ал-Маъун' },
    { n:108, a:'Al-Kawthar', ru:'Аль-Каусар', tg:'Ал-Кавсар' },
    { n:109, a:'Al-Kafirun', ru:'Аль-Кяфирун', tg:'Ал-Кофирун' },
    { n:110, a:'An-Nasr', ru:'Ан-Наср', tg:'Ан-Наср' },
    { n:111, a:'Al-Masad', ru:'Аль-Масад', tg:'Ал-Масад' },
    { n:112, a:'Al-Ikhlas', ru:'Аль-Ихлас', tg:'Ал-Ихлос' },
    { n:113, a:'Al-Falaq', ru:'Аль-Фаляк', tg:'Ал-Фалақ' },
    { n:114, a:'An-Nas', ru:'Ан-Нас', tg:'Ан-Нос' }
  ]

  function currentLang(){ return localStorage.getItem('lang') || 'ru' }

  function titleFor(surah){
    const lang = currentLang()
    if (lang === 'tg') return `${surah.n}. ${surah.tg}`
    if (lang === 'en') return `${surah.n}. ${surah.a}`
    return `${surah.n}. ${surah.ru}`
  }

  function render(list){
    if (!grid) return
    grid.innerHTML = ''
    list.forEach(s => {
      const a = document.createElement('a')
      a.href = `surah.html?num=${s.n}`
      a.className = 'card'
      a.setAttribute('data-num', s.n)
      a.innerHTML = `<span class="badge">${s.n}</span><div><div>${titleFor(s)}</div><div class="meta">${s.a}</div></div>`
      grid.appendChild(a)
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
    render(data)
  }

  function init(){
    render(SURAHS)
    if (searchInput){
      document.addEventListener('keydown', e=>{ if (e.key === '/' && document.activeElement !== searchInput){ e.preventDefault(); searchInput.focus() }})
      searchInput.addEventListener('input', filter)
    }
    window.addEventListener('lang:change', filter)
  }

  document.addEventListener('DOMContentLoaded', init)
})()


