Quran Translate — static site

How to run
- Use any static server or just open `index.html` in a browser.
- For local dev, you can run: `python3 -m http.server 8080` in this folder and open `http://localhost:8080`.

Add PDFs
- Put your PDF files into `assets/pdfs/{ru|tg|en}/` named `1.pdf` … `114.pdf`.
- Example: `assets/pdfs/ru/1.pdf` will be opened for Surah 1 in Russian.

Features
- Responsive, light/dark themes, language switcher (RU, TG, EN).
- Search field on home page filters surahs.
- Surah page uses an `<iframe>` to display the PDF and provides direct download.


