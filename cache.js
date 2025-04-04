// === content.js ===
// Step 1: 監聽 Netflix 字幕 DOM 變化

const observer = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === 1 && node.innerText) {
        const text = node.innerText.trim();
        if (text && !text.includes("[翻譯中]")) {
          handleSubtitle(text, node);
        }
      }
    }
  }
});

function observeSubtitles() {
  const subtitleContainer = document.querySelector('.player-timedtext');
  if (subtitleContainer) {
    observer.observe(subtitleContainer, { childList: true, subtree: true });
  } else {
    setTimeout(observeSubtitles, 1000); // Retry if not found yet
  }
}

observeSubtitles();

async function handleSubtitle(text, node) {
  const translated = await getCachedTranslation(text);
  const translatedNode = document.createElement('div');
  translatedNode.innerText = translated;
  translatedNode.style.fontSize = '90%';
  translatedNode.style.color = '#00ffcc';
  translatedNode.style.marginTop = '4px';
  node.appendChild(translatedNode);
}

// === translate.js ===
// Step 2: Google Translate API 串接

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

// === cache.js ===
// Step 3: 快取翻譯結果，節省 API 額度

const translationCache = new Map();

function getCachedTranslation(text) {
  if (translationCache.has(text)) {
    return translationCache.get(text);
  }
  return fetchAndCacheTranslation(text);
}

async function fetchAndCacheTranslation(text) {
  const translated = await translateText(text);
  translationCache.set(text, translated);
  return translated;
}
