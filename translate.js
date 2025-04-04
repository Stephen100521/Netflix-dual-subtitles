// === translate.js ===
const API_KEY = 'YOUR_GOOGLE_API_KEY_HERE';

async function translateText(text) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      q: text,
      target: 'zh-TW',
      format: 'text',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (data && data.data && data.data.translations) {
    return data.data.translations[0].translatedText;
  } else {
    console.error("翻譯錯誤", data);
    return "[翻譯失敗]";
  }
}
