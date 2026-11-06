/* © 2026 Ignasi Martí Palet — enrutador d'Esfer@
   El bookmarklet només carrega aquest fitxer. Aquest detecta la pàgina i carrega el mòdul que toca.
   Mòduls: tutoria.js · tutor-final.js · batx-final.js · notes.js · optatives.js */
(function(){
var VERSIO='2.5';
if(window.esferaLoaded)return;
window.esferaLoaded=true;
window.ESFERA_VERSIO=VERSIO;
Element.prototype.ap=Element.prototype.appendChild;
var _c=(...a)=>document.createElement(...a);
var _q=(...a)=>document.querySelector(...a);
var _qa=(...a)=>document.querySelectorAll(...a);
var _id=(...a)=>document.getElementById(...a);
var _rm=(...a)=>document.body.removeChild(...a);
var _ba=(...a)=>document.body.appendChild(...a);
var _st=(...a)=>setTimeout(...a);

// ── Carpeta d'on es carreguen els mòduls (la mateixa que aquest fitxer) ──
var cs=document.currentScript;
var base=(cs&&cs.src)?cs.src.replace(/[^\/]*$/,''):'https://ignasimartipalet.github.io/Bookmarklet_Esfera/';
window.__esferaBase=base;

// ── Mode beta: a la consola, localStorage.esferaBeta=1 → carrega nom-beta.js (si no existeix, el normal) ──
var beta=false;try{beta=!!localStorage.getItem('esferaBeta');}catch(e){}

function carrega(nom,estable){
  var fitxer=nom+((beta&&!estable)?'-beta':'')+'.js';
  var sc=document.createElement('script');
  sc.src=base+fitxer+'?v='+Date.now();
  sc.onerror=function(){
    if(beta&&!estable){carrega(nom,true);return;}
    window.esferaLoaded=false;
    alert("No s'ha pogut carregar "+fitxer+". Comprova la connexió i torna-ho a provar.");
  };
  document.head.appendChild(sc);
}
window.__esferaCarrega=function(nom){carrega(nom);};

// ── DETECCIÓ DE PÀGINA ──
var isA=!!_q("select[data-ng-model='contingut.qualitativa']");
var isM=!!_q('#my-tab-content');
var isBATX=(function(){
  if(!_q('table[data-st-table="dummyStudents"]'))return false;
  var links=_qa('ol.breadcrumb a');
  for(var i=0;i<links.length;i++){
    var href=(links[i].getAttribute('href')||'').toLowerCase();
    var txt=(links[i].textContent||'').toLowerCase();
    if(href.includes('batx')||txt.includes('batx')||txt.includes('bat '))return true;
  }
  return false;
})();
var isLIT=(function(){
  var url=window.location.href;
  return url.includes('RES_P_COM_GENERAL_LIT')||url.includes('RES_P_CONSELL_LIT');
})();
var isGRUPS=(function(){
  var ts=_qa('table');
  for(var i=0;i<ts.length;i++){var h=ts[i].querySelector('thead');if(h&&/codi del grup/i.test(h.innerText))return true;}
  return false;
})();

// ── PÀGINA NO RECONEGUDA: ajuda ──
function ajuda(){
(function(){var ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;background:rgba(10,10,20,0.5);backdrop-filter:blur(6px);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif';var box=document.createElement('div');box.style.cssText='background:#fff;border-radius:20px;padding:32px;width:420px;max-width:92vw;max-height:85vh;overflow-y:auto;box-shadow:0 32px 80px rgba(0,0,0,0.18)';function row(icon,title,sub){var d=document.createElement('div');d.style.cssText='display:flex;gap:12px;margin-bottom:16px;align-items:flex-start';var ic=document.createElement('div');ic.textContent=icon;ic.style.cssText='font-size:26px;flex-shrink:0;margin-top:1px';var tx=document.createElement('div');var t=document.createElement('div');t.textContent=title;t.style.cssText='font-size:18px;font-weight:600;color:#0f0f1a;margin-bottom:5px';tx.appendChild(t);if(sub){var s=document.createElement('div');s.innerHTML=sub;s.style.cssText='font-size:15px;color:#6b7280;line-height:1.6';tx.appendChild(s);}d.appendChild(ic);d.appendChild(tx);box.appendChild(d);}var hd=document.createElement('div');hd.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:20px';var ht=document.createElement('div');var h1=document.createElement('div');h1.textContent='⚠️ Pàgina no reconeguda';h1.style.cssText='font-size:22px;font-weight:700;color:#0f0f1a';var h2=document.createElement('div');h2.textContent='Aquest bookmarklet només funciona a:';h2.style.cssText='font-size:15px;color:#9ca3af;margin-top:3px';ht.appendChild(h1);ht.appendChild(h2);var cl=document.createElement('button');cl.textContent='×';cl.style.cssText='width:32px;height:32px;border-radius:50%;border:none;background:#f3f4f6;color:#6b7280;font-size:18px;cursor:pointer;flex-shrink:0';cl.onclick=function(){document.body.removeChild(ov);};hd.appendChild(ht);hd.appendChild(cl);box.appendChild(hd);var sep=document.createElement('div');sep.style.cssText='height:1px;background:#f3f4f6;margin-bottom:16px';box.appendChild(sep);row('📊','Qualificacions per grup i matèria','Entra a la <strong>matèria específica</strong> abans d\'executar');row('👤','Qualificacions per grup i alumne/a','Entra al <strong>primer alumne</strong> abans d\'executar');row('📝','Avaluacions finals d\'ESO o batxillerat','→ Per grup i alumne: entra al <strong>primer alumne</strong><br>→ Per grup i matèria: entra a la <strong>matèria específica</strong>');row('🎓','Avaluació final — Qualificacions per al tutor de grup','Comentaris de tutor / Consell orientador');row('🗂️','Optatives: notes i comentaris per grups','Entra a la <strong>llista de grups</strong> de Qualificacions per grup i matèria');var cr=document.createElement('div');cr.textContent='© 2026 Ignasi Martí Palet · v'+VERSIO;cr.style.cssText='font-size:11px;color:#9ca3af;text-align:center;margin-top:8px';box.appendChild(cr);ov.appendChild(box);ov.addEventListener('click',function(e){if(e.target===ov)document.body.removeChild(ov);});document.body.appendChild(ov);})()
}

// ── ENRUTAMENT (l'ordre importa: el primer que coincideix guanya) ──
if(isA)carrega('tutoria');
else if(isLIT)carrega('tutor-final');
else if(isGRUPS)carrega('optatives');
else if(isBATX)carrega('batx-final');
else if(isM)carrega('notes');
else ajuda();
})();
