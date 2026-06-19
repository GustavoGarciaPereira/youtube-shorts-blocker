# 🚫 YouTube Shorts Blocker

Bloqueia os YouTube Shorts com uma carinha feliz — sem redirecionamento, sem som de fundo, sem coleta de dados.

<p align="center">
  <img src="youtube-shorts-blocker/icons/iconP.png" alt="logo" width="128">
</p>

## ✨ Funcionalidades

- 🛑 **Bloqueio total** — Substitui os Shorts na home, sidebar, busca e na própria página `/shorts/` por uma carinha feliz
- 🔇 **Som pausado** — O overlay pausa e muta todos os `<video>` da página pra não tocar escondido
- 🎛️ **Toggle liga/desliga** — Popup com switch para ativar/desativar na hora, sem recarregar a página
- 🔒 **Zero coleta de dados** — Tudo roda local no navegador. Sem servidor externo, sem telemetria, sem analytics
- ⚡ **SPA-ready** — Observa mudanças de DOM e navegação interna do YouTube (que é uma SPA)

## 📦 Instalação

### Chrome / Brave / Edge

1. Clone ou baixe este repositório
   ```bash
   git clone https://github.com/GustavoGarciaPereira/youtube-shorts-blocker.git
   ```
2. Acesse `chrome://extensions` no navegador
3. Ative o **Modo do desenvolvedor** (canto superior direito)
4. Clique em **Carregar sem compactação**
5. Selecione a pasta do projeto
6. Pronto! Abra o YouTube e os Shorts sumiram 🎉

## 🧠 Como funciona

| Arquivo | Papel |
|---------|-------|
| `manifest.json` | Configuração da extensão (MV3), permissões, content scripts |
| `content.js` | Lógica principal: detecta Shorts, cria overlay, pausa vídeos, observa SPA |
| `content.css` | Estilos do placeholder (home/busca) e do overlay full-page (`/shorts/`) |
| `popup.html` | Interface do popup com o toggle liga/desliga |
| `popup.js` | Comunicação popup ↔ content script via `chrome.tabs.sendMessage` |

### Fluxo

```
Usuário acessa youtube.com
        │
        ▼
content.js carrega
        │
        ├─▶ Está em /shorts/?
        │      └─▶ Sim → overlay full-page + pausa vídeos
        │
        └─▶ Está na home/busca?
               └─▶ Sim → varre thumbnails de Shorts e substitui pela carinha
```

## 🛡️ Privacidade

Essa extensão **não coleta, armazena ou transmite nenhum dado**. As permissões são mínimas:

- `activeTab` — para o popup saber qual aba está ativa e enviar o toggle
- `storage` — para salvar sua preferência (ligado/desligado) entre sessões
- `host_permissions: youtube.com` — para o content script rodar nas páginas do YouTube

Nada sai do seu navegador. Nada vai pra nuvem.

## 🛠️ Tech Stack

- Vanilla JavaScript (sem frameworks)
- Chrome Extension Manifest V3
- CSS com animações SVG inline

## 📄 Licença

MIT — faça o que quiser, só não me responsabilize 😄

---

Feito com ❤️ (e um pouco de raiva dos Shorts) por [@GustavoGarciaPereira](https://github.com/GustavoGarciaPereira)
