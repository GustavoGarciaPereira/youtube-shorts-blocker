// popup.js
const toggle = document.getElementById('toggle');
const status = document.getElementById('status');

// Carrega estado salvo
chrome.storage.sync.get(['shortsBlockerEnabled'], (result) => {
  const enabled = result.shortsBlockerEnabled !== false;
  toggle.checked = enabled;
  updateStatus(enabled);
});

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ shortsBlockerEnabled: enabled });
  updateStatus(enabled);

  // Envia mensagem para a aba ativa do YouTube
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.url?.includes('youtube.com')) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'toggle', enabled });
    }
  });
});

function updateStatus(enabled) {
  if (enabled) {
    status.textContent = '✅ Shorts bloqueados!';
    status.className = 'status on';
  } else {
    status.textContent = '❌ Bloqueio desativado';
    status.className = 'status off';
  }
}
