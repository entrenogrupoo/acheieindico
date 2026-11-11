'use strict';
const settings = window.ACHEI_CONFIG || {};
const pixelId = String(settings.metaPixelId || '').trim();
if (/^\d+$/.test(pixelId)) {
  (function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=true;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=true;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init',pixelId);
  window.fbq('track','PageView');
}
let groupUrl = null;
try {
  const parsed = new URL(settings.groupUrl);
  if (parsed.protocol === 'https:' && parsed.hostname === 'chat.whatsapp.com') groupUrl = parsed.href;
} catch (_) {}
for (const link of document.querySelectorAll('[data-group]')) {
  if (groupUrl) { link.href = groupUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  link.addEventListener('click', event => {
    if (!groupUrl) {
      event.preventDefault();
      const status = document.getElementById('group-status');
      status.textContent = 'O link do grupo ainda não está disponível.';
      status.hidden = false;
      return;
    }
    // Evento padrão (nativo) Meta Lead ao clicar: não comprova entrada no grupo.
    if (typeof window.fbq === 'function') window.fbq('track','Lead');
  });
}
const policies = {
  terms: ['Termos de uso', 'Achei e Indico divulga links de ofertas de lojas externas. A participação no grupo é gratuita. Valores, cupons, frete, disponibilidade e condições de compra são de responsabilidade das respectivas lojas e podem mudar sem aviso. Verifique as informações no site da loja antes de comprar. Alguns links podem gerar comissão para o projeto.'],
  privacy: ['Privacidade', 'Esta página não pede cadastro nem recolhe dados por formulário. Utiliza o Pixel da Meta para registrar PageView (visita à página) e Lead (clique para acessar o grupo do WhatsApp), conforme as configurações do navegador e da plataforma. A abertura do link não garante a efetiva entrada no grupo. No WhatsApp, aplicam-se os termos e a política de privacidade do serviço.']
};
const dialog = document.getElementById('policy-dialog');
for (const button of document.querySelectorAll('[data-policy]')) button.addEventListener('click', () => {
  const item = policies[button.dataset.policy];
  if (!item) return;
  document.getElementById('policy-title').textContent = item[0];
  document.getElementById('policy-text').textContent = item[1];
  dialog.showModal();
});
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
