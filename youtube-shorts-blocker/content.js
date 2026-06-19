// YouTube Shorts Blocker - content.js

let enabled = true;

// Carrega a preferência salva
chrome.storage.sync.get(['shortsBlockerEnabled'], (result) => {
  enabled = result.shortsBlockerEnabled !== false;
  if (enabled) blockShorts();
});

// Escuta mensagens do popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'toggle') {
    enabled = msg.enabled;
    if (enabled) {
      blockShorts();
    } else {
      removeBlocks();
    }
  }
});

// Bloqueia o player na página /shorts/
function blockShortsPage() {
  if (!enabled) return;
  if (!window.location.pathname.startsWith('/shorts/')) return;

  // Pausa todos os vídeos/áudios da página (sempre, mesmo se overlay já existe)
  document.querySelectorAll('video, audio').forEach(el => {
    el.pause();
    el.muted = true;
  });

  if (document.getElementById('shorts-blocked-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'shorts-blocked-overlay';
  overlay.className = 'shorts-blocked-overlay';
  overlay.innerHTML = `
    <div class="shorts-blocked-overlay-content">
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="shorts-blocked-svg">
        <circle cx="60" cy="60" r="54" fill="#FFD93D" stroke="#F4A914" stroke-width="3"/>
        <ellipse cx="42" cy="48" rx="7" ry="8" fill="#222"/>
        <circle cx="44" cy="45" r="2.5" fill="white"/>
        <ellipse cx="78" cy="48" rx="7" ry="8" fill="#222"/>
        <circle cx="80" cy="45" r="2.5" fill="white"/>
        <path d="M38 72 Q60 92 82 72" stroke="#222" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="30" cy="68" r="9" fill="#FF8FAB" opacity="0.5"/>
        <circle cx="90" cy="68" r="9" fill="#FF8FAB" opacity="0.5"/>
      </svg>
      <span class="shorts-blocked-text">Shorts bloqueado! 🚫📱</span>
    </div>
  `;
  document.body.appendChild(overlay);
}

function removeBlocksPage() {
  const overlay = document.getElementById('shorts-blocked-overlay');
  if (overlay) overlay.remove();
}

// Bloqueia os Shorts na página
function blockShorts() {
  blockShortsPage();

  const selectors = [
    // Seção Shorts na home/sidebar
    'ytd-rich-section-renderer',
    'ytd-reel-shelf-renderer',
    // Links diretos para Shorts
    'a[href*="/shorts/"]',
    // Chip/filtro Shorts
    'yt-chip-cloud-chip-renderer',
  ];

  document.querySelectorAll('ytd-rich-section-renderer, ytd-reel-shelf-renderer').forEach(el => {
    const text = el.innerText || '';
    if (
      el.querySelector('a[href*="/shorts/"]') ||
      text.toLowerCase().includes('shorts') ||
      el.tagName.toLowerCase().includes('reel')
    ) {
      wrapWithSmiley(el);
    }
  });

  // Bloqueia thumbnails individuais de Shorts
  document.querySelectorAll('a[href*="/shorts/"]').forEach(el => {
    const card = el.closest('ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-video-renderer') || el;
    wrapWithSmiley(card);
  });
}

// Troca o elemento por uma carinha feliz
function wrapWithSmiley(el) {
  if (el.dataset.shortsBlocked === 'true') return;
  el.dataset.shortsBlocked = 'true';

  const wrapper = document.createElement('div');
  wrapper.className = 'shorts-blocked-wrapper';

  const face = document.createElement('div');
  face.className = 'shorts-blocked-face';
  face.innerHTML = `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="shorts-blocked-svg">
      <!-- Rosto -->
      <circle cx="60" cy="60" r="54" fill="#FFD93D" stroke="#F4A914" stroke-width="3"/>
      <!-- Olho esquerdo -->
      <ellipse cx="42" cy="48" rx="7" ry="8" fill="#222"/>
      <circle cx="44" cy="45" r="2.5" fill="white"/>
      <!-- Olho direito -->
      <ellipse cx="78" cy="48" rx="7" ry="8" fill="#222"/>
      <circle cx="80" cy="45" r="2.5" fill="white"/>
      <!-- Sorriso -->
      <path d="M38 72 Q60 92 82 72" stroke="#222" stroke-width="4" fill="none" stroke-linecap="round"/>
      <!-- Bochechas -->
      <circle cx="30" cy="68" r="9" fill="#FF8FAB" opacity="0.5"/>
      <circle cx="90" cy="68" r="9" fill="#FF8FAB" opacity="0.5"/>
    </svg>
    <span class="shorts-blocked-text">Shorts bloqueado! 🚫📱</span>
  `;

  el.style.position = 'relative';

  // Substitui visualmente
  const placeholder = document.createElement('div');
  placeholder.className = 'shorts-blocked-placeholder';
  placeholder.appendChild(face);
  placeholder.dataset.shortsBlock = 'placeholder';

  el.parentNode.insertBefore(placeholder, el);
  el.style.display = 'none';
}

// Remove todos os bloqueios
function removeBlocks() {
  document.querySelectorAll('[data-shorts-blocked="true"]').forEach(el => {
    el.style.display = '';
    delete el.dataset.shortsBlocked;
  });
  document.querySelectorAll('[data-shorts-block="placeholder"]').forEach(el => el.remove());
  removeBlocksPage();
}

// Observa mudanças na página (YouTube é SPA)
const observer = new MutationObserver(() => {
  if (enabled) {
    blockShorts();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Verifica navegação em SPA
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    if (enabled) {
      setTimeout(() => {
        if (window.location.pathname.startsWith('/shorts/')) {
          blockShortsPage();
        } else {
          removeBlocksPage();
          blockShorts();
        }
      }, 100);
    }
  }
}).observe(document, { subtree: true, childList: true });
