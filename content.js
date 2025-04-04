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
  const translated = await translateText(text);
  const translatedNode = document.createElement('div');
  translatedNode.innerText = translated;
  translatedNode.style.fontSize = '90%';
  translatedNode.style.color = '#00ffcc';
  translatedNode.style.marginTop = '4px';
  node.appendChild(translatedNode);
}

// === translate.js ===
// Step 2: Google Translate API 串接（這裡先放 mock function）

async function translateText(text) {
  // TODO: 換成正式 API 串接
  return "[翻譯中] " + text;
}
