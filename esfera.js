javascript:(function(){/* © 2026 Ignasi Martí Palet */
if(window.esferaLoaded) return;
window.esferaLoaded = true;
Element.prototype.ap=Element.prototype.appendChild;
var _c=(...a)=>document.createElement(...a);
var _q=(...a)=>document.querySelector(...a);
var _qa=(...a)=>document.querySelectorAll(...a);
var _id=(...a)=>document.getElementById(...a);
var _rm=(...a)=>document.body.removeChild(...a);
var _ba=(...a)=>document.body.appendChild(...a);
var _st=(...a)=>setTimeout(...a);

var isA=!!_q("select[data-ng-model='contingut.qualitativa']");
var isM=!!_q('#my-tab-content');

// FIX 1: isBATX ara comprova que la taula existeixi I que el breadcrumb indiqui batxillerat.
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

// ── DETECCIÓ PÀGINA COMENTARIS/CONSELL (isLIT) ────────────────────────────────
var isLIT=(function(){
  var url=window.location.href;
  return url.includes('RES_P_COM_GENERAL_LIT')||url.includes('RES_P_CONSELL_LIT');
})();

// ── TUTORIA (isA) ─────────────────────────────────────────────────────────────
if(isA){
  let fontLink=_c('link');fontLink.rel='stylesheet';
  fontLink.href='https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap';
  document.head.ap(fontLink);
  let styleEl=_c('style');
  styleEl.textContent='@keyframes tutorFadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes tutorPulse{0%,100%{opacity:1}50%{opacity:0.3}}';
  document.head.ap(styleEl);
  const F="font-family:'Outfit',system-ui,sans-serif;box-sizing:border-box;";

  function detectarBatxTutoria(){
    const primerSelect=_q("select[data-ng-model='contingut.qualitativa']");
    if(primerSelect&&Array.from(primerSelect.options).some(o=>{
      const v=o.value.replace('string:','');
      return !isNaN(parseFloat(v));
    }))return true;
    if([...document.querySelectorAll('input[name="quantitativa"]')].filter(el=>el.offsetParent!==null).length>0)return true;
    if([...document.querySelectorAll('input[name="qualitativa"][type="number"]')].filter(el=>el.offsetParent!==null).length>0)return true;
    return false;
  }
  const esBatxTutoria=detectarBatxTutoria();

  function usaInputsQuantitatius(){
    if([...document.querySelectorAll('input[name="quantitativa"]')].filter(el=>el.offsetParent!==null).length>0)return true;
    if([...document.querySelectorAll('input[name="qualitativa"][type="number"]')].filter(el=>el.offsetParent!==null).length>0)return true;
    return false;
  }
  const batxAmbInputs=usaInputsQuantitatius();

  function esSuspes(nota){
    if(nota==="NA")return true;
    if(esBatxTutoria){
      const num=parseFloat(nota);
      return !isNaN(num)&&num<5;
    }
    return false;
  }

  // ── DETECCIÓ RESUM D'AVALUACIÓ ──
  function gBotoResumAvaluacio(){
    const titols=_qa('h4.panel-title');
    for(const h4 of titols){
      if((h4.textContent||'').trim().toLowerCase().includes('resum d\'avaluació')||
         (h4.textContent||'').trim().toLowerCase().includes("resum d'avaluacio")||
         (h4.textContent||'').trim().toLowerCase().includes('resum d\u2019avaluaci\u00f3')){
        // Cerca l'element clicable pare (a o div amb ng-click o rol panel-heading)
        let el=h4.parentElement;
        while(el&&el!==document.body){
          if(el.tagName==='A'||el.getAttribute('data-ng-click')||el.getAttribute('ng-click')||el.classList.contains('panel-heading')){return el;}
          el=el.parentElement;
        }
        return h4.parentElement;
      }
    }
    return null;
  }
  const teResumAvaluacio=!!gBotoResumAvaluacio();

  function cO(html,tancarFn){let ov=_c('div');ov.style.cssText='position:fixed;inset:0;background:rgba(10,10,20,0.5);backdrop-filter:blur(6px);z-index:999999;display:flex;align-items:center;justify-content:center';let box=_c('div');box.style.cssText=F+'background:#fff;border-radius:20px;padding:36px;min-width:360px;max-width:min(92vw,520px);box-shadow:0 32px 80px rgba(0,0,0,0.18),0 2px 8px rgba(0,0,0,0.06);animation:tutorFadeIn 0.22s ease';box.innerHTML=html;ov.ap(box);_ba(ov);if(tancarFn)ov.addEventListener('click',e=>{if(e.target===ov)tancarFn(ov);});return ov;}
  function cP(text){let d=_c('div');d.style.cssText=F+'position:fixed;top:20px;right:20px;padding:12px 20px;background:#0f0f1a;color:#fff;font-size:13px;font-weight:500;border-radius:100px;z-index:999998;box-shadow:0 8px 28px rgba(0,0,0,0.22);display:flex;align-items:center;gap:10px';d.innerHTML='<span style="width:8px;height:8px;border-radius:50%;background:#4ade80;display:inline-block;animation:tutorPulse 1.2s infinite"></span><span id="tutorProgressText">'+text+'</span>';_ba(d);return d;}
  function sP(prog,t){let el=prog.querySelector('#tutorProgressText');if(el)el.textContent=t;}
  function cT(id,btn){let taula=_id(id);if(!taula)return;let files=taula.querySelectorAll('tr');let text='';files.forEach(tr=>{let cel=tr.querySelectorAll('th,td');let fila=Array.from(cel).map(c=>c.textContent.trim()).join('\t');text+=fila+'\n';});navigator.clipboard.writeText(text).then(()=>{btn.textContent='✓ Copiat!';btn.style.background='#16a34a';_st(()=>{btn.textContent='📋 Copiar taula';btn.style.background='#0f0f1a';},2000);});}
  function mR(total,mm,sm,al){let html='<div style="'+F+'"><div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px"><div><h2 style="'+F+'margin:0 0 4px;font-size:20px;font-weight:700;color:#0f0f1a">Resum de l\'acta</h2><p style="'+F+'margin:0;font-size:13px;color:#9ca3af">'+total+' alumnes processats</p></div><button id="btnTancarRes" style="'+F+'width:34px;height:34px;border-radius:50%;border:none;background:#f3f4f6;color:#6b7280;font-size:20px;cursor:pointer;line-height:1">×</button></div>';
  html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><p style="'+F+'font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin:0">Per matèria</p><button id="btnCopy1" style="'+F+'padding:6px 12px;font-size:12px;font-weight:600;border:none;border-radius:8px;background:#0f0f1a;color:#fff;cursor:pointer">📋 Copiar taula</button></div>';
  html+='<div style="border-radius:12px;overflow:hidden;border:1px solid #f0f0f0;margin-bottom:20px"><table id="tutorTaula1" style="width:100%;border-collapse:collapse"><thead><tr style="background:#f9fafb"><th style="'+F+'padding:10px 14px;text-align:left;font-size:12px;font-weight:600;color:#6b7280">MATÈRIA</th><th style="'+F+'padding:10px 14px;text-align:center;font-size:12px;font-weight:600;color:#6b7280">SUSPESOS</th><th style="'+F+'padding:10px 14px;text-align:center;font-size:12px;font-weight:600;color:#6b7280">%</th></tr></thead><tbody>';
  for(let m in mm){let pct=(mm[m]/total*100).toFixed(1);let col=mm[m]===0?'#16a34a':mm[m]/total>0.3?'#dc2626':'#d97706';html+='<tr style="border-top:1px solid #f3f4f6"><td style="'+F+'padding:10px 14px;font-size:13px;color:#111">'+m+'</td><td style="'+F+'padding:10px 14px;text-align:center;font-size:14px;font-weight:700;color:'+col+'">'+mm[m]+'</td><td style="'+F+'padding:10px 14px;text-align:center;font-size:13px;color:#9ca3af">'+pct+'%</td></tr>';}
  html+='</tbody></table></div>';
  html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><p style="'+F+'font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin:0">Per nombre de suspesos</p><button id="btnCopy2" style="'+F+'padding:6px 12px;font-size:12px;font-weight:600;border:none;border-radius:8px;background:#0f0f1a;color:#fff;cursor:pointer">📋 Copiar taula</button></div>';
  html+='<div style="border-radius:12px;overflow:hidden;border:1px solid #f0f0f0;margin-bottom:20px"><table id="tutorTaula2" style="width:100%;border-collapse:collapse"><thead><tr style="background:#f9fafb"><th style="'+F+'padding:10px 14px;text-align:center;font-size:12px;font-weight:600;color:#6b7280">MAT. SUSPESES</th><th style="'+F+'padding:10px 14px;text-align:center;font-size:12px;font-weight:600;color:#6b7280">Nº ALUMNES</th><th style="'+F+'padding:10px 14px;text-align:center;font-size:12px;font-weight:600;color:#6b7280">%</th></tr></thead><tbody>';
  for(let i=0;i<=10;i++){let n=Object.values(sm).filter(x=>x===i).length;let pct=total>0?((n/total)*100).toFixed(1):'0.0';let colorN=n===0?'#9ca3af':'#0f0f1a';html+='<tr style="border-top:1px solid #f3f4f6"><td style="'+F+'padding:10px 14px;text-align:center;font-size:13px;color:#111">'+i+'</td><td style="'+F+'padding:10px 14px;text-align:center;font-size:14px;font-weight:700;color:'+colorN+'">'+n+'</td><td style="'+F+'padding:10px 14px;text-align:center;font-size:13px;color:#9ca3af">'+pct+'%</td></tr>';}
  html+='<tr style="background:#f9fafb;border-top:1px solid #e5e7eb"><td style="'+F+'padding:10px 14px;text-align:center;font-size:13px;font-weight:700;color:#0f0f1a">Total</td><td style="'+F+'padding:10px 14px;text-align:center;font-size:14px;font-weight:700;color:#0f0f1a">'+total+'</td><td style="'+F+'padding:10px 14px;text-align:center;font-size:13px;color:#9ca3af">100%</td></tr></tbody></table></div>';
  if(al&&al.length){html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><p style="'+F+'font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin:0">Per alumne</p><button id="btnCopy3" style="'+F+'padding:6px 12px;font-size:12px;font-weight:600;border:none;border-radius:8px;background:#0f0f1a;color:#fff;cursor:pointer">📋 Copiar taula</button></div>';
  html+='<div style="border-radius:12px;overflow:hidden;border:1px solid #f0f0f0;margin-bottom:20px"><table id="tutorTaula3" style="width:100%;border-collapse:collapse"><thead><tr style="background:#f9fafb"><th style="'+F+'padding:10px 14px;text-align:center;font-size:12px;font-weight:600;color:#6b7280">ALUMNE</th><th style="'+F+'padding:10px 14px;text-align:center;font-size:12px;font-weight:600;color:#6b7280">Nº SUSP.</th><th style="'+F+'padding:10px 14px;text-align:left;font-size:12px;font-weight:600;color:#6b7280">MATÈRIES SUSPESES</th></tr></thead><tbody>';
  al.forEach(a=>{let col=a.count===0?'#16a34a':a.count>3?'#dc2626':'#d97706';html+='<tr style="border-top:1px solid #f3f4f6"><td style="'+F+'padding:10px 14px;text-align:center;font-size:13px;color:#111">'+a.num+'</td><td style="'+F+'padding:10px 14px;text-align:center;font-size:14px;font-weight:700;color:'+col+'">'+a.count+'</td><td style="'+F+'padding:10px 14px;font-size:12px;color:#374151;line-height:1.7">'+a.mats.join('<br>')+'</td></tr>';});
  html+='</tbody></table></div>';}
  html+='</div>';
  let ov=cO('<div style="max-height:80vh;overflow-y:auto;padding-right:4px">'+html+'</div>',o=>_rm(o));
  _st(()=>{let b=_id('btnTancarRes');if(b)b.onclick=()=>{if(ov.parentNode)_rm(ov);};let c1=_id('btnCopy1');if(c1)c1.onclick=()=>cT('tutorTaula1',c1);let c2=_id('btnCopy2');if(c2)c2.onclick=()=>cT('tutorTaula2',c2);let c3=_id('btnCopy3');if(c3)c3.onclick=()=>cT('tutorTaula3',c3);},100);}

  function dC(callback){let html='<div style="'+F+'text-align:center"><div style="width:52px;height:52px;background:#0f0f1a;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:16px">💬</div><h2 style="'+F+'margin:0 0 6px;font-size:21px;font-weight:700;color:#0f0f1a">Comentaris</h2><p style="'+F+'margin:0 0 20px;font-size:13px;color:#9ca3af">Enganxa els comentaris (un per alumne)</p><textarea id="tutorTA" placeholder="Comentari alumne 1&#10;Comentari alumne 2&#10;Comentari alumne 3&#10;..." style="'+F+'width:100%;height:160px;border:1.5px solid #e5e7eb;border-radius:12px;padding:14px;font-size:13px;color:#0f0f1a;resize:vertical;outline:none;line-height:1.6"></textarea><div style="display:flex;gap:10px;margin-top:16px"><button id="btnCancelCom" style="'+F+'flex:1;padding:13px;font-size:14px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#9ca3af;cursor:pointer">Cancel·lar</button><button id="btnOkCom" style="'+F+'flex:2;padding:13px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Continuar →</button></div></div>';
  let ov=cO(html,null);_st(()=>{let ta=_id('tutorTA');if(ta)ta.focus();let ok=_id('btnOkCom');if(ok)ok.onclick=()=>{let val=ta?ta.value:'';if(ov.parentNode)_rm(ov);callback(val);};let ca=_id('btnCancelCom');if(ca)ca.onclick=()=>{if(ov.parentNode)_rm(ov);};},100);}

  // ── DETECCIÓ TREBALL DE SÍNTESI ──
  function gTSSelect(){
    const rows=_qa('tr.alturallistat');
    for(const row of rows){
      const tds=row.querySelectorAll('td');
      for(const td of tds){
        const txt=(td.textContent||'').trim().toLowerCase();
        if(txt==='ts1'||txt.includes('treball de síntesi')||txt.includes('treball de sintesi')){
          const sel=row.querySelector("select[data-ng-model='contingut.qualitativa']");
          if(sel)return sel;
        }
      }
    }
    return null;
  }
  const teTS=!!gTSSelect();

  // Normalitza el valor TS acceptant text complet o sigla
  function normalitzaTS(v){
    const s=(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(s==='fa'||s==='fet amb aprofitament')return 'FA';
    if(s==='ft'||s==='fet')return 'FT';
    if(s==='nf'||s==='no fet')return 'NF';
    return null;
  }

  function posarTS(val){
    const sel=gTSSelect();
    if(!sel)return false;
    const v=normalitzaTS(val);
    if(!v)return true;
    const opt=Array.from(sel.options).find(o=>o.value==='string:'+v);
    if(!opt)return false;
    sel.value=opt.value;
    sel.dispatchEvent(new Event('change',{bubbles:true}));
    try{
      const scope=angular.element(sel).scope();
      if(scope){scope.$apply(()=>{
        const contingut=scope.contingut;
        if(contingut){contingut.qualitativa=v;scope.onChangeQualitativa(contingut,false);}
      });}
    }catch(e){}
    return true;
  }

  // Diàleg per demanar notes TS
  function dTS(callback){
    let html='<div style="'+F+'text-align:center">'
      +'<div style="width:52px;height:52px;background:#0f0f1a;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:16px">📝</div>'
      +'<h2 style="'+F+'margin:0 0 6px;font-size:21px;font-weight:700;color:#0f0f1a">Treball de Síntesi</h2>'
      +'<p style="'+F+'margin:0 0 20px;font-size:13px;color:#9ca3af">Enganxa les notes (FA, FT, NF o text complet)</p>'
      +'<textarea id="tutorTAts" placeholder="FA&#10;NF&#10;FT&#10;..." style="'+F+'width:100%;height:160px;border:1.5px solid #e5e7eb;border-radius:12px;padding:14px;font-size:13px;color:#0f0f1a;resize:vertical;outline:none;line-height:1.6"></textarea>'
      +'<div style="display:flex;gap:10px;margin-top:16px">'
      +'<button id="btnCancelTS" style="'+F+'flex:1;padding:13px;font-size:14px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#9ca3af;cursor:pointer">Cancel·lar</button>'
      +'<button id="btnOkTS" style="'+F+'flex:2;padding:13px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Continuar →</button>'
      +'</div></div>';
    let ov=cO(html,null);
    _st(()=>{
      let ta=_id('tutorTAts');if(ta)ta.focus();
      let ok=_id('btnOkTS');if(ok)ok.onclick=()=>{let val=ta?ta.value:'';if(ov.parentNode)_rm(ov);callback(val);};
      let ca=_id('btnCancelTS');if(ca)ca.onclick=()=>{if(ov.parentNode)_rm(ov);};
    },100);
  }

  // Diàleg combinat comentaris + TS
  function dCTS(callback){
    let html='<div style="'+F+'">'
      +'<div style="text-align:center;margin-bottom:20px">'
      +'<div style="width:52px;height:52px;background:#0f0f1a;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:16px">⚡</div>'
      +'<h2 style="'+F+'margin:0 0 6px;font-size:21px;font-weight:700;color:#0f0f1a">Comentaris + Treball de Síntesi</h2>'
      +'<p style="'+F+'margin:0;font-size:13px;color:#9ca3af">Un per línia, en el mateix ordre</p>'
      +'</div>'
      +'<p style="'+F+'font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 6px">Comentaris de tutor</p>'
      +'<textarea id="tutorTAcom2" placeholder="Comentari alumne 1&#10;Comentari alumne 2&#10;..." style="'+F+'width:100%;height:110px;border:1.5px solid #e5e7eb;border-radius:12px;padding:14px;font-size:13px;color:#0f0f1a;resize:vertical;outline:none;line-height:1.6;margin-bottom:14px"></textarea>'
      +'<p style="'+F+'font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 6px">Notes Treball de Síntesi</p>'
      +'<textarea id="tutorTAts2" placeholder="FA&#10;NF&#10;FT&#10;..." style="'+F+'width:100%;height:110px;border:1.5px solid #e5e7eb;border-radius:12px;padding:14px;font-size:13px;color:#0f0f1a;resize:vertical;outline:none;line-height:1.6;margin-bottom:16px"></textarea>'
      +'<div style="display:flex;gap:10px">'
      +'<button id="btnCancelCTS" style="'+F+'flex:1;padding:13px;font-size:14px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#9ca3af;cursor:pointer">Cancel·lar</button>'
      +'<button id="btnOkCTS" style="'+F+'flex:2;padding:13px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Continuar →</button>'
      +'</div></div>';
    let ov=cO(html,null);
    _st(()=>{
      let taC=_id('tutorTAcom2');if(taC)taC.focus();
      let ok=_id('btnOkCTS');if(ok)ok.onclick=()=>{
        let valC=taC?taC.value:'';
        let taT=_id('tutorTAts2');let valT=taT?taT.value:'';
        if(ov.parentNode)_rm(ov);callback(valC,valT);
      };
      let ca=_id('btnCancelCTS');if(ca)ca.onclick=()=>{if(ov.parentNode)_rm(ov);};
    },100);
  }

  // ── DIÀLEG CONSELL ORIENTADOR ──
  function dCO(callback){
    let html='<div style="'+F+'text-align:center">'
      +'<div style="width:52px;height:52px;background:#0f0f1a;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:16px">🧭</div>'
      +'<h2 style="'+F+'margin:0 0 6px;font-size:21px;font-weight:700;color:#0f0f1a">Consell orientador</h2>'
      +'<p style="'+F+'margin:0 0 20px;font-size:13px;color:#9ca3af">Enganxa els consells (un per alumne)</p>'
      +'<textarea id="tutorTAco" placeholder="Consell alumne 1&#10;Consell alumne 2&#10;Consell alumne 3&#10;..." style="'+F+'width:100%;height:160px;border:1.5px solid #e5e7eb;border-radius:12px;padding:14px;font-size:13px;color:#0f0f1a;resize:vertical;outline:none;line-height:1.6"></textarea>'
      +'<div style="display:flex;gap:10px;margin-top:16px">'
      +'<button id="btnCancelCO" style="'+F+'flex:1;padding:13px;font-size:14px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#9ca3af;cursor:pointer">Cancel·lar</button>'
      +'<button id="btnOkCO" style="'+F+'flex:2;padding:13px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Continuar →</button>'
      +'</div></div>';
    let ov=cO(html,null);
    _st(()=>{
      let ta=_id('tutorTAco');if(ta)ta.focus();
      let ok=_id('btnOkCO');if(ok)ok.onclick=()=>{let val=ta?ta.value:'';if(ov.parentNode)_rm(ov);callback(val);};
      let ca=_id('btnCancelCO');if(ca)ca.onclick=()=>{if(ov.parentNode)_rm(ov);};
    },100);
  }

  const btnTSStyle=(teTS
    ?''+F+'padding:14px 20px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer;display:flex;align-items:center;gap:12px'
    :''+F+'padding:14px 20px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#d1d5db;color:#9ca3af;cursor:not-allowed;display:flex;align-items:center;gap:12px');
  const btn4Style=(teTS
    ?''+F+'padding:14px 20px;font-size:14px;font-weight:600;border:2px solid #0f0f1a;border-radius:12px;background:#fff;color:#0f0f1a;cursor:pointer;display:flex;align-items:center;gap:12px'
    :''+F+'padding:14px 20px;font-size:14px;font-weight:600;border:2px solid #d1d5db;border-radius:12px;background:#fff;color:#9ca3af;cursor:not-allowed;display:flex;align-items:center;gap:12px');
  const btnCOStyle=(teResumAvaluacio
    ?''+F+'padding:14px 20px;font-size:14px;font-weight:600;border:2px solid #0f0f1a;border-radius:12px;background:#fff;color:#0f0f1a;cursor:pointer;display:flex;align-items:center;gap:12px'
    :''+F+'padding:14px 20px;font-size:14px;font-weight:600;border:2px solid #d1d5db;border-radius:12px;background:#fff;color:#9ca3af;cursor:not-allowed;display:flex;align-items:center;gap:12px');

  let mH='<div style="'+F+'text-align:center"><div style="width:52px;height:52px;background:#0f0f1a;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:16px">🎓</div><h2 style="'+F+'margin:0 0 6px;font-size:21px;font-weight:700;color:#0f0f1a">Eina de Tutoria'+(batxAmbInputs?' (batxillerat)':'')+'</h2><p style="'+F+'margin:0 0 28px;font-size:13px;color:#9ca3af">Selecciona l\'acció que vols executar</p><div style="display:flex;flex-direction:column;gap:10px"><button id="btn1" style="'+F+'padding:14px 20px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer;display:flex;align-items:center;gap:12px">💬<span>Comentaris de tutor</span></button><button id="btnTS" style="'+btnTSStyle+'">📝<span>Treball de Síntesi</span>'+(teTS?'':'<span style="font-size:11px;margin-left:auto;color:#9ca3af">No disponible</span>')+'</button><button id="btn2" style="'+F+'padding:14px 20px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer;display:flex;align-items:center;gap:12px">📋<span>Acta de tutoria</span></button><button id="btn4" style="'+btn4Style+'">⚡<span>Comentaris + Treball de Síntesi</span>'+(teTS?'':'<span style="font-size:11px;margin-left:auto;color:#9ca3af">No disponible</span>')+'</button><button id="btn3" style="'+F+'padding:14px 20px;font-size:14px;font-weight:600;border:2px solid #0f0f1a;border-radius:12px;background:#fff;color:#0f0f1a;cursor:pointer;display:flex;align-items:center;gap:12px">⚡<span>Comentaris + Acta a la vegada</span></button><button id="btnCO" style="'+btnCOStyle+'">🧭<span>Consell orientador</span>'+(teResumAvaluacio?'':'<span style="font-size:11px;margin-left:auto;color:#9ca3af">No disponible</span>')+'</button><button id="btnInfo" style="'+F+'padding:10px 20px;font-size:13px;font-weight:500;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#6b7280;cursor:pointer;margin-top:2px">ℹ️ Com funciona</button><button id="btnX" style="'+F+'padding:10px 20px;font-size:13px;font-weight:500;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#9ca3af;cursor:pointer;margin-top:2px">Cancel·lar</button><p style="font-size:11px;color:#9ca3af;text-align:center;margin-top:14px;margin-bottom:0">© 2026 Ignasi Martí Palet</p><div></div>';
  let mO=cO(mH,o=>_rm(o));
  function tM(){if(mO.parentNode)_rm(mO);}

  function sInfoA(){
    const box=mO.firstElementChild;
    if(!box)return;
    const sec=(tit,items)=>'<div style="'+F+'margin-bottom:16px"><p style="'+F+'font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px">'+tit+'</p><div style="border-radius:10px;overflow:hidden;border:1px solid #f0f0f0">'+items.map((it,i)=>'<div style="'+F+'padding:9px 14px;font-size:13px;color:#374151;line-height:1.5'+(i>0?';border-top:1px solid #f3f4f6':'')+'">'+it+'</div>').join('')+'</div></div>';
    box.innerHTML='<div style="'+F+'max-height:70vh;overflow-y:auto">'
      +'<button id="btnInfoBack" style="'+F+'background:none;border:none;color:#6b7280;font-size:13px;cursor:pointer;padding:0;margin-bottom:16px;display:block">← Tornar</button>'
      +'<h2 style="'+F+'margin:0 0 18px;font-size:18px;font-weight:700;color:#0f0f1a">ℹ️ Com funciona</h2>'
      +sec('Comentaris de tutor',['💬 Enganxa un comentari per alumne, <strong>un per línia</strong>, en el mateix ordre que apareixen a la pantalla.','↵ Cada comentari ha d\'ocupar exactament una sola línia, <strong>sense salts de línia interns</strong>.','⬜ Per saltar-te un alumne, deixa la línia corresponent en <strong>blanc</strong>.'])
      +sec('Treball de Síntesi',['📝 Enganxa una nota per alumne, <strong>una per línia</strong>.','✅ Formats acceptats: <strong>FA, FT, NF</strong> o el text complet: <strong>Fet amb aprofitament, Fet, No fet</strong>.','⬜ Per saltar-te un alumne, deixa la línia corresponent en <strong>blanc</strong>.','⚠️ Disponible només si la matèria Treball de Síntesi apareix a la pantalla.'])
      +sec('Acta de tutoria',['📋 Recorre tots els alumnes automàticament i genera un resum de suspesos per matèria i per alumne.','▶️ No cal enganxar res: simplement prem el botó i espera que acabi.'])
      +sec('Consell orientador',['🧭 Enganxa un consell per alumne, <strong>un per línia</strong>, en el mateix ordre que apareixen a la pantalla.','↵ Cada consell ha d\'ocupar exactament una sola línia, <strong>sense salts de línia interns</strong>.','⬜ Per saltar-te un alumne, deixa la línia corresponent en <strong>blanc</strong>.','⚠️ Disponible només si apareix el panell <strong>Resum d\'avaluació</strong> a la pantalla.'])
      +'</div>';
    _st(()=>{const b=_id('btnInfoBack');if(b)b.onclick=()=>{box.innerHTML=mH;_st(bindTutoriaButtons,50);};},50);
  }

  function o1(){tM();dC(function(text){if(!text.trim())return;let cm=text.split("\n");let i=0;let prog=cP("Comentaris: 0 / "+cm.length);function run(){if(i>=cm.length){sP(prog,"Tots els comentaris processats! ✓");return;}sP(prog,"Comentaris: "+(i+1)+" / "+cm.length);let oB=_q("a[data-ng-click='showCommentsModal()']");if(!oB){_st(run,500);return;}oB.click();let wM=setInterval(function(){let ta=_q("textarea[data-ng-model='comentariGeneral.comentari']");let sC=_q("a[data-ng-click='saveComentariGeneral()']");if(ta&&sC){clearInterval(wM);let c=(cm[i]||"").trim();if(c!==""){ta.value=c;ta.dispatchEvent(new InputEvent("input",{bubbles:true}));sC.click();}_st(function(){let sG=_q("a[data-ng-click='saveNotesAvaluacio()']");if(sG)sG.click();let wS=setInterval(function(){let alerts=_qa(".alert-success");let found=false;alerts.forEach(function(a){if(a.innerText.toLowerCase().includes("desat"))found=true;});if(found){clearInterval(wS);let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");if(!next||next.disabled){sP(prog,"Tots els comentaris processats! ✓");return;}angular.element(next).triggerHandler('click');i++;_st(run,7000);}},500);},2000);}},200);}run();});}

  // ── FUNCIÓ: NOMÉS TREBALL DE SÍNTESI ──
  function oTS(){tM();dTS(function(text){if(!text.trim())return;let ts=text.split("\n");let i=0;let prog=cP("TS: 0 / "+ts.length);
  function esperaTS(cb){
    let lVal=null,sT=0;
    let int=setInterval(()=>{
      const sel=gTSSelect();
      if(sel){const v=sel.value;if(v===lVal){sT+=100;if(sT>=400){clearInterval(int);cb();}}else{sT=0;lVal=v;}}
      else{sT=0;lVal=null;}
    },100);}
  function run(){if(i>=ts.length){sP(prog,"Treball de Síntesi processat! ✓");return;}sP(prog,"TS: "+(i+1)+" / "+ts.length);
  esperaTS(()=>{posarTS(ts[i]);
  let sG=_q("a[data-ng-click='saveNotesAvaluacio()']");if(sG)sG.click();
  let wS=setInterval(function(){let alerts=_qa(".alert-success");let found=false;alerts.forEach(function(a){if(a.innerText.toLowerCase().includes("desat"))found=true;});if(found){clearInterval(wS);let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");if(!next||next.hasAttribute("disabled")){sP(prog,"Treball de Síntesi processat! ✓");return;}angular.element(next).triggerHandler('click');i++;run();}},500);});}run();});}

  // ── FUNCIÓ: COMENTARIS + TREBALL DE SÍNTESI ──
  function o4(){tM();dCTS(function(textC,textT){if(!textC.trim()&&!textT.trim())return;let cm=textC.split("\n");let ts=textT.split("\n");let i=0;let total=Math.max(cm.length,ts.length);let prog=cP("Processant: 0 / "+total);
  function run(){if(i>=total){sP(prog,"Tot processat! ✓");return;}sP(prog,"Processant: "+(i+1)+" / "+total);
  posarTS(ts[i]||'');
  let c=(cm[i]||"").trim();
  if(c!==""){let oB=_q("a[data-ng-click='showCommentsModal()']");if(!oB){_st(run,500);return;}oB.click();let wM=setInterval(function(){let ta=_q("textarea[data-ng-model='comentariGeneral.comentari']");let sC=_q("a[data-ng-click='saveComentariGeneral()']");if(ta&&sC){clearInterval(wM);ta.value=c;ta.dispatchEvent(new InputEvent("input",{bubbles:true}));sC.click();dP();}},200);}else{dP();}
  function dP(){_st(function(){let sG=_q("a[data-ng-click='saveNotesAvaluacio()']");if(sG)sG.click();let wS=setInterval(function(){let alerts=_qa(".alert-success");let found=false;alerts.forEach(function(a){if(a.innerText.toLowerCase().includes("desat"))found=true;});if(found){clearInterval(wS);let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");if(!next||next.hasAttribute("disabled")){sP(prog,"Tot processat! ✓");return;}angular.element(next).triggerHandler('click');i++;_st(run,7000);}},500);},2000);}}run();});}

  // ── FUNCIÓ: CONSELL ORIENTADOR ──
  function oCO(){
    tM();
    dCO(function(text){
      if(!text.trim())return;
      let co=text.split("\n");
      let i=0;
      let prog=cP("Consell orientador: 0 / "+co.length);

      function esperaResumObert(cb){
        // Espera que el textarea del consell orientador sigui visible
        let intents=0;
        let int=setInterval(()=>{
          const ta=_q("textarea[data-ng-model='qualificacions.lAvaluacions[tabactive].consellOrientador']");
          if(ta&&ta.offsetParent!==null){clearInterval(int);cb(ta);}
          intents++;
          if(intents>40){clearInterval(int);cb(null);}
        },150);
      }

      function asseguraResumObert(cb){
        // Comprova si el textarea ja és visible
        const ta=_q("textarea[data-ng-model='qualificacions.lAvaluacions[tabactive].consellOrientador']");
        if(ta&&ta.offsetParent!==null){cb(ta);return;}
        // Si no, clica el botó Resum d'avaluació per obrir-lo
        const boto=gBotoResumAvaluacio();
        if(!boto){cb(null);return;}
        boto.click();
        esperaResumObert(cb);
      }

      function run(){
        if(i>=co.length){sP(prog,"Consell orientador processat! ✓");return;}
        sP(prog,"Consell orientador: "+(i+1)+" / "+co.length);

        asseguraResumObert(function(ta){
          if(!ta){
            // No s'ha pogut obrir el resum, passem al següent
            i++;
            _st(run,500);
            return;
          }

          const c=(co[i]||"").trim();

          if(c!==""){
            // Escriu el consell via Angular per assegurar el binding
            try{
              const scope=angular.element(ta).scope();
              if(scope){
                scope.$apply(function(){
                  // Navega per l'objecte qualificacions.lAvaluacions[tabactive].consellOrientador
                  if(scope.qualificacions&&scope.qualificacions.lAvaluacions&&scope.tabactive!==undefined){
                    scope.qualificacions.lAvaluacions[scope.tabactive].consellOrientador=c;
                    if(typeof scope.marcarCanviResum==='function')scope.marcarCanviResum();
                  }
                });
              }
            }catch(e){
              // Fallback: escriu directament i dispara esdeveniments
              ta.value=c;
              ta.dispatchEvent(new InputEvent("input",{bubbles:true}));
              ta.dispatchEvent(new Event("change",{bubbles:true}));
            }
          }

          // Desa
          _st(function(){
            let sG=_q("a[data-ng-click='saveNotesAvaluacio()']");
            if(sG)sG.click();
            let wS=setInterval(function(){
              let alerts=_qa(".alert-success");
              let found=false;
              alerts.forEach(function(a){if(a.innerText.toLowerCase().includes("desat"))found=true;});
              if(found){
                clearInterval(wS);
                let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");
                if(!next||next.hasAttribute("disabled")){
                  sP(prog,"Consell orientador processat! ✓");
                  return;
                }
                angular.element(next).triggerHandler('click');
                i++;
                let wC_gone=setInterval(function(){
                  if(!gBotoResumAvaluacio()){
                    clearInterval(wC_gone);
                    let wC_back=setInterval(function(){
                      if(gBotoResumAvaluacio()){clearInterval(wC_back);_st(run,500);}
                    },200);
                  }
                },100);
              }
            },500);
          },1500);
        });
      }
      run();
    });
  }

  function gInpQ(){
    const q=[...document.querySelectorAll('input[name="quantitativa"]')].filter(el=>el.offsetParent!==null);
    if(q.length>0)return q;
    return [...document.querySelectorAll('input[name="qualitativa"][type="number"]')].filter(el=>el.offsetParent!==null);
  }
  function gSelQ(){
    return [...document.querySelectorAll("select[data-ng-model='contingut.qualitativa']")].filter(s=>s.offsetParent!==null);
  }
  function getNomMateria(el){
    const tr=el.closest("tr");
    const td=tr?tr.querySelector("td[data-ng-if*='matPNomVis']"):null;
    return td?td.textContent.trim():'';
  }
  function getNotaEl(el){
    if(el.tagName==='SELECT')return el.value.replace("string:","");
    return el.value?el.value.trim():'';
  }

  function o2(){tM();let total=0,mm={},sm={},al=[];let prog=cP("Alumnes: 0");

  function gElements(){
    if(batxAmbInputs) return gInpQ();
    return gSelQ();
  }

  function pr(){
    let els=gElements();
    if(!els.length)return;
    let susp=0,matsSusp=[];
    els.forEach(el=>{
      const mat=getNomMateria(el);
      if(mat&&!(mat in mm))mm[mat]=0;
      const nota=getNotaEl(el);
      if(nota!==''&&mat){
        if(esSuspes(nota)){mm[mat]++;susp++;matsSusp.push(mat);}
      }
    });
    sm[total]=susp;al.push({num:total+1,count:susp,mats:matsSusp});total++;sP(prog,"Alumnes: "+total);}

  function sg(){let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");if(next&&!next.hasAttribute("disabled")){angular.element(next).triggerHandler('click');return true;}return false;}

  function eE(cb){
    let lC=0,sT=0;
    let int=setInterval(()=>{
      let count=gElements().length;
      let bt=batxAmbInputs?true:_q("a.btn.btn-warning[data-ng-click='showCommentsModal()']");
      if(bt&&count===lC&&count>0){sT+=100;if(sT>=500){clearInterval(int);cb();}}
      else{sT=0;lC=count;}
    },100);}

  function acabar(){sP(prog,"Processament complet! ✓");mR(total,mm,sm,al);}
  function loop(){eE(()=>{pr();if(sg()){_st(loop,150);}else{acabar();}});}loop();}

  function o3(){tM();dC(function(text){if(!text.trim())return;let cm=text.split("\n");let i=0;let total=0,mm={},sm={},al=[];let prog=cP("Processant: 0 / "+cm.length);

  function gElements(){
    if(batxAmbInputs) return gInpQ();
    return gSelQ();
  }

  function pD(){
    let els=gElements();
    if(!els.length)return;
    let susp=0,matsSusp=[];
    els.forEach(el=>{
      const mat=getNomMateria(el);
      if(mat&&!(mat in mm))mm[mat]=0;
      const nota=getNotaEl(el);
      if(nota!==''&&mat){
        if(esSuspes(nota)){mm[mat]++;susp++;matsSusp.push(mat);}
      }
    });
    sm[total]=susp;al.push({num:total+1,count:susp,mats:matsSusp});total++;}

  function eE(cb){
    let lC=0,sT=0;
    let int=setInterval(()=>{
      let count=gElements().length;
      let bt=batxAmbInputs?true:_q("a.btn.btn-warning[data-ng-click='showCommentsModal()']");
      if(bt&&count===lC&&count>0){sT+=100;if(sT>=500){clearInterval(int);cb();}}
      else{sT=0;lC=count;}
    },100);}

  function aA(){sP(prog,"Tot processat! ✓");mR(total,mm,sm,al);}
  function dP(last){_st(function(){let sG=_q("a[data-ng-click='saveNotesAvaluacio()']");if(sG)sG.click();let wS=setInterval(function(){let alerts=_qa(".alert-success");let found=false;alerts.forEach(function(a){if(a.innerText.toLowerCase().includes("desat"))found=true;});if(found){clearInterval(wS);if(last){aA();return;}let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");if(!next||next.hasAttribute("disabled")){aA();return;}angular.element(next).triggerHandler('click');i++;_st(rC,7000);}},500);},2000);}
  function eC(last){let c=(cm[i]||"").trim();if(c===""){dP(last);return;}let oB=_q("a[data-ng-click='showCommentsModal()']");if(!oB){_st(()=>eC(last),500);return;}oB.click();let wM=setInterval(function(){let ta=_q("textarea[data-ng-model='comentariGeneral.comentari']");let sC=_q("a[data-ng-click='saveComentariGeneral()']");if(ta&&sC){clearInterval(wM);ta.value=c;ta.dispatchEvent(new InputEvent("input",{bubbles:true}));sC.click();dP(last);}},200);}
  function rC(){sP(prog,"Processant: "+(i+1)+" / "+cm.length);eE(()=>{pD();let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");let isLast=!next||next.hasAttribute("disabled");eC(isLast);});}rC();});}

  function bindTutoriaButtons(){
    let b1=_id("btn1");
    let b2=_id("btn2");
    let b3=_id("btn3");
    let bts=_id("btnTS");
    let b4=_id("btn4");
    let bco=_id("btnCO");
    let bi=_id("btnInfo");
    let bx=_id("btnX");
    if(b1)b1.onclick=o1;
    if(b2)b2.onclick=o2;
    if(b3)b3.onclick=o3;
    if(bts&&teTS)bts.onclick=oTS;
    if(b4&&teTS)b4.onclick=o4;
    if(bco&&teResumAvaluacio)bco.onclick=oCO;
    if(bi)bi.onclick=sInfoA;
    if(bx)bx.onclick=tM;
  }
  _st(bindTutoriaButtons,100);

// ── COMENTARIS / CONSELL ORIENTADOR (isLIT) ───────────────────────────────────
}else if(isLIT){
  let fontLink=_c('link');fontLink.rel='stylesheet';
  fontLink.href='https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap';
  document.head.ap(fontLink);
  let styleEl=_c('style');
  styleEl.textContent='@keyframes tutorFadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes tutorPulse{0%,100%{opacity:1}50%{opacity:0.3}}';
  document.head.ap(styleEl);
  const F="font-family:'Outfit',system-ui,sans-serif;box-sizing:border-box;";

  const url=window.location.href;
  const esGeneral=url.includes('RES_P_COM_GENERAL_LIT');
  const titol=esGeneral?'Comentaris de tutor':'Consell orientador';
  const emoji=esGeneral?'💬':'🧭';

  const textareasTots=Array.from(document.querySelectorAll('textarea')).filter((_,i)=>esGeneral?i%2===1:i%2===0);
  const ambContingut=textareasTots.filter(ta=>ta.value.trim()!=='').length;

  function cO(html,tancarFn){
    let ov=_c('div');
    ov.style.cssText='position:fixed;inset:0;background:rgba(10,10,20,0.5);backdrop-filter:blur(6px);z-index:999999;display:flex;align-items:center;justify-content:center';
    let box=_c('div');
    box.style.cssText=F+'background:#fff;border-radius:20px;padding:36px;min-width:360px;max-width:min(92vw,520px);box-shadow:0 32px 80px rgba(0,0,0,0.18),0 2px 8px rgba(0,0,0,0.06);animation:tutorFadeIn 0.22s ease';
    box.innerHTML=html;
    ov.ap(box);
    _ba(ov);
    if(tancarFn)ov.addEventListener('click',e=>{if(e.target===ov)tancarFn(ov);});
    return ov;
  }

  const avisHTML=ambContingut>0
    ?'<div style="'+F+'background:#fff8e1;border:1.5px solid #f5a623;border-radius:12px;padding:12px 16px;margin-bottom:20px;display:flex;gap:10px;align-items:flex-start">'
      +'<span style="font-size:16px;line-height:1.4">⚠️</span>'
      +'<span style="font-size:13px;color:#7a5c00;line-height:1.5">'+ambContingut+' alumne'+(ambContingut>1?'s ja tenen':'ja té')+' comentari. Si continues, es sobreescriurà.</span>'
      +'</div>'
    :'';

  const litMainHTML=''
    +'<div style="'+F+'">'
    +'<div style="text-align:center;margin-bottom:24px">'
    +'<div style="width:52px;height:52px;background:#0f0f1a;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:14px">'+emoji+'</div>'
    +'<h2 style="'+F+'margin:0 0 4px;font-size:21px;font-weight:700;color:#0f0f1a">'+titol+'</h2>'
    +'<p style="'+F+'margin:0;font-size:13px;color:#9ca3af">Enganxa els textos (un per alumne)</p>'
    +'</div>'
    +avisHTML
    +'<textarea id="litTA" placeholder="Text alumne 1&#10;Text alumne 2&#10;Text alumne 3&#10;..." style="'+F+'width:100%;height:160px;border:1.5px solid #e5e7eb;border-radius:12px;padding:14px;font-size:13px;color:#0f0f1a;resize:vertical;outline:none;line-height:1.6;margin-bottom:8px"></textarea>'
    +'<div id="litInfo" style="'+F+'font-size:12px;color:#9ca3af;min-height:18px;margin-bottom:16px"></div>'
    +'<div style="display:flex;gap:10px">'
    +'<button id="litCancel" style="'+F+'flex:1;padding:13px;font-size:14px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#9ca3af;cursor:pointer">Cancel·lar</button>'
    +'<button id="litOk" style="'+F+'flex:2;padding:13px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Aplicar '+titol.toLowerCase()+' →</button>'
    +'</div>'
    +'<button id="litInfoBtn" style="'+F+'width:100%;margin-top:10px;padding:9px;font-size:13px;font-weight:500;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#6b7280;cursor:pointer">ℹ️ Com funciona</button>'
    +'<p style="font-size:11px;color:#9ca3af;text-align:center;margin-top:14px;margin-bottom:0">© 2026 Ignasi Martí Palet</p>'
    +'</div>';

  const ov=cO(litMainHTML,o=>_rm(o));

  function sInfoLIT(){
    const box=ov.firstElementChild;
    if(!box)return;
    const sec=(tit,items)=>'<div style="'+F+'margin-bottom:16px"><p style="'+F+'font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px">'+tit+'</p><div style="border-radius:10px;overflow:hidden;border:1px solid #f0f0f0">'+items.map((it,i)=>'<div style="'+F+'padding:9px 14px;font-size:13px;color:#374151;line-height:1.5'+(i>0?';border-top:1px solid #f3f4f6':'')+'">'+it+'</div>').join('')+'</div></div>';
    box.innerHTML='<div style="'+F+'max-height:70vh;overflow-y:auto">'
      +'<button id="litInfoBack" style="'+F+'background:none;border:none;color:#6b7280;font-size:13px;cursor:pointer;padding:0;margin-bottom:16px;display:block">← Tornar</button>'
      +'<h2 style="'+F+'margin:0 0 18px;font-size:18px;font-weight:700;color:#0f0f1a">ℹ️ Com funciona</h2>'
      +sec(titol,['💬 Enganxa un text per alumne, <strong>un per línia</strong>, en el mateix ordre que apareixen a la pantalla.','↵ Cada text ha d\'ocupar exactament una sola línia, <strong>sense salts de línia interns</strong>.','⬜ Per saltar-te un alumne, deixa la línia corresponent <strong>buida</strong>.'])
      +'</div>';
    _st(()=>{const b=_id('litInfoBack');if(b)b.onclick=()=>{box.innerHTML=litMainHTML;_st(bindLIT,50);};},50);
  }

  function bindLIT(){
    const ta=_id('litTA');
    const info=_id('litInfo');
    const ok=_id('litOk');
    const cancel=_id('litCancel');
    const ib=_id('litInfoBtn');

    if(ta)ta.focus();

    if(ta&&info){
      ta.addEventListener('input',()=>{
        const n=ta.value.trim().split('\n').filter(l=>l.trim()!=='').length;
        info.textContent=n>0?n+' comentari'+(n>1?'s':'')+' detectat'+(n>1?'s':''):'';
      });
    }

    if(cancel)cancel.onclick=()=>{if(ov.parentNode)_rm(ov);};
    if(ib)ib.onclick=sInfoLIT;

    if(ok)ok.onclick=()=>{
      if(!ta)return;
      const comentaris=ta.value.trim().split('\n').map(c=>c.trim()).filter(c=>c!=='');
      if(!comentaris.length){
        info.style.color='#dc2626';
        info.textContent='⚠️ Enganxa almenys un comentari';
        return;
      }
      const textareas=Array.from(document.querySelectorAll('textarea')).filter((_,i)=>esGeneral?i%2===1:i%2===0);
      const n=Math.min(comentaris.length,textareas.length);
      for(let i=0;i<n;i++){const taEl=textareas[i];const scope=angular.element(taEl).scope();const model=taEl.getAttribute('data-ng-model')||taEl.getAttribute('ng-model');if(scope&&model){const parts=model.split('.');let obj=scope;for(let j=0;j<parts.length-1;j++)obj=obj[parts[j]];obj[parts[parts.length-1]]=comentaris[i];scope.$apply();}else{taEl.value=comentaris[i];taEl.dispatchEvent(new Event('input',{bubbles:true}));taEl.dispatchEvent(new Event('change',{bubbles:true}));}}
      if(ov.parentNode)_rm(ov);
      const pill=_c('div');
      pill.style.cssText=F+'position:fixed;top:20px;right:20px;padding:12px 20px;background:#0f0f1a;color:#fff;font-size:13px;font-weight:500;border-radius:100px;z-index:999998;box-shadow:0 8px 28px rgba(0,0,0,0.22);display:flex;align-items:center;gap:10px';
      pill.innerHTML='<span style="width:8px;height:8px;border-radius:50%;background:#4ade80;display:inline-block"></span><span>'+n+' alumnes actualitzats ✓</span>';
      _ba(pill);_st(()=>{if(pill.parentNode)_rm(pill);},3000);
    };
  }
  _st(bindLIT,100);

// ── AVALUACIONS FINALS BATXILLERAT (isBATX) — comprovat ABANS que isM ─────────
}else if(isBATX){
  if(_id('esfera-overlay-batx'))return;
  const CTX='Avaluació final Batxillerat';
  const ov=_c('div');ov.id='esfera-overlay-batx';ov.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.45);z-index:99999;display:flex;align-items:center;justify-content:center;';
  const md=_c('div');md.style.cssText='background:#fff;border-radius:12px;padding:24px;width:420px;max-width:90vw;max-height:85vh;overflow-y:auto;font-family:sans-serif;color:#111;box-sizing:border-box;';
  function close(){ov.remove();}
  ov.addEventListener('click',e=>{if(e.target===ov)close();});

  function gR(){
    return Array.from(_qa('table[data-st-table="dummyStudents"] tbody tr')).filter(r=>{
      const inp=r.querySelector('input[name="qualitativa"]');
      const gris=r.querySelector('.cursiva');
      return inp&&!inp.disabled&&!gris;
    });
  }
  function gN(row){
    return ['td:nth-child(2)','td:nth-child(3)','td:nth-child(4)']
      .map(s=>row.querySelector(s)).map(t=>t?t.textContent.trim():'').filter(Boolean).join(' ');
  }
  function rN(row){const inp=row.querySelector('input[name="qualitativa"]');return inp&&inp.value.trim()!=='';}
  function hasComment(row){const btn=row.querySelector('a.glyphicon.glyphicon-new-window');return btn&&!btn.classList.contains('emptyIcon');}
  function hN(){return gR().some(rN);}
  function hC(){return gR().some(hasComment);}

  function aCFastBATX(text,idx2,wM,cb){
    const cm=text.split('\n').map(s=>s.trim());
    const rows=gR();
    const tg=idx2!==null?idx2.map(i=>rows[i]):rows;
    const sk=[];
    try{
      const tbl=_q('table[data-st-table="dummyStudents"]');
      let scope=tbl?angular.element(tbl).scope():null;
      let found=null;
      for(let i=0;i<8&&scope;i++){
        if(scope.dummyStudents){found=scope;break;}
        scope=scope.$parent;
      }
      const students=found&&found.dummyStudents?found.dummyStudents.filter(a=>!a.esBaixa):null;
      if(students&&students.length){
        const tgStudents=idx2!==null?idx2.map(i=>students[i]):students;
        let applied=0;
        for(let i=0;i<cm.length&&i<tgStudents.length;i++){
          const st=tgStudents[i];if(!st)continue;
          if(wM==='skip'&&hasComment(tg[i])){sk.push(gN(tg[i]));continue;}
          if(!cm[i])continue;
          st.comentaris=cm[i];
          applied++;
        }
        if(applied>0){found.$apply();cb(sk);return;}
      }
    }catch(e){}
    aC(text,idx2,wM,cb);
  }

  function nrmESO(v){
    const s=v.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(s==='na'||s==='no assolit'||s==='no assoliment')return 'NA';
    if(s==='as'||s==='satisfactori'||s==='assoliment satisfactori')return 'AS';
    if(s==='an'||s==='notable'||s==='assoliment notable')return 'AN';
    if(s==='ae'||s==='excel·lent'||s==='excellent'||s==='assoliment excel·lent'||s==='assoliment excellent')return 'AE';
    return v.trim();
  }

  function aN(text,idx2,wM){
    const vals=text.split('\n').map(s=>s.trim());
    const rows=gR();
    const tg=idx2!==null?idx2.map(i=>rows[i]):rows;
    const sk=[];
    for(let i=0;i<vals.length&&i<tg.length;i++){
      const row=tg[i];if(!row)continue;
      if(wM==='skip'&&rN(row)){sk.push(gN(row));continue;}
      const v=vals[i];if(v==='')continue;
      let ok=false;
      try{
        const scope=angular.element(row).scope();
        scope.$apply(()=>{
          const alumne=scope.alumne||scope.$parent?.alumne;
          if(!alumne)return;
          (alumne.asig||[]).forEach(a=>(a.elem||[]).forEach(e=>{
            if(e.hasOwnProperty('quantitativa'))e.quantitativa=v;
          }));
        });
        ok=true;
      }catch(e){}
      if(!ok){
        const inp=row.querySelector('input[name="qualitativa"]');
        if(inp){
          inp.value=v;
          inp.dispatchEvent(new Event('input',{bubbles:true}));
          inp.dispatchEvent(new Event('change',{bubbles:true}));
          try{angular.element(inp).triggerHandler('input');angular.element(inp).triggerHandler('change');}catch(e){}
        }
      }
    }
    return sk;
  }

  function aC(text,idx2,wM,cb){
    const cm=text.split('\n').map(s=>s.trim());
    const rows=gR();
    const tg=idx2!==null?idx2.map(i=>rows[i]):rows;
    const sk=[];
    function next(i){
      if(i>=cm.length||i>=tg.length){cb(sk);return;}
      const row=tg[i];if(!row){next(i+1);return;}
      if(wM==='skip'&&hasComment(row)){sk.push(gN(row));next(i+1);return;}
      const c=cm[i]||'';
      const btn=row.querySelector('a.glyphicon.glyphicon-new-window');
      if(!btn){next(i+1);return;}
      btn.click();
      _st(()=>{
        const ta=_q('textarea[data-ng-model="commentsToModify.commentsToModifyModal"]');
        const save=_q('a.btn.btn-primary[data-ng-click="modalSave()"]');
        if(!ta||!save){next(i+1);return;}
        ta.focus();ta.value=c;
        ta.dispatchEvent(new Event('input',{bubbles:true}));
        try{angular.element(ta).triggerHandler('input');}catch(e){}
        _st(()=>{save.click();_st(()=>next(i+1),500);},200);
      },700);
    }
    next(0);
  }

  const clrs={notes:'#4e7f4e',comentaris:'#3d6b9e',ambdos:'#7a4e9e'};
  const lbls={notes:'Aplicar notes',comentaris:'Aplicar comentaris',ambdos:'Aplicar notes i comentaris'};
  function mkBtn(txt,bg,fn){const b=_c('button');b.textContent=txt;b.style.cssText=`display:block;width:100%;padding:12px 16px;margin-bottom:8px;border:none;border-radius:8px;background:${bg};color:#fff;font-size:14px;font-weight:500;cursor:pointer;text-align:left;`;b.onclick=fn;return b;}
  function mkCancel(txt,fn){const b=_c('button');b.textContent=txt||'Cancel·lar';b.style.cssText='width:100%;padding:9px;border:1px solid #ccc;border-radius:8px;background:transparent;font-size:13px;cursor:pointer;color:#666;margin-top:4px;';b.onclick=fn||close;return b;}
  function mkBack(fn){const b=_c('button');b.textContent='← Tornar';b.style.cssText='background:none;border:none;color:#666;font-size:13px;cursor:pointer;padding:0;margin-bottom:16px;display:block;';b.onclick=fn;return b;}
  function mkLbl(txt){const l=_c('label');l.textContent=txt;l.style.cssText='display:block;font-weight:500;font-size:13px;color:#555;margin-bottom:4px;';return l;}
  function mkTA(ph){const t=_c('textarea');t.placeholder=ph;t.style.cssText='width:100%;height:80px;box-sizing:border-box;border:1px solid #ccc;border-radius:6px;padding:6px 8px;font-size:12px;font-family:monospace;margin-bottom:12px;resize:vertical;';return t;}
  function mkCtx(){const b=_c('div');b.textContent=CTX;b.style.cssText='display:inline-block;background:#f0f4ff;color:#3d6b9e;border:1px solid #c5d5f0;border-radius:20px;padding:3px 10px;font-size:11px;font-weight:500;margin-bottom:14px;';return b;}

  function sS(skN,skC){
    const all=[...new Set([...skN,...skC])];if(!all.length){close();return;}
    md.innerHTML='';
    const ic=_c('div');ic.textContent='⚠';ic.style.cssText='font-size:26px;margin-bottom:8px;';md.ap(ic);
    const h=_c('p');h.style.cssText='font-weight:500;font-size:15px;margin:0 0 6px;';h.textContent='Alumnes no modificats';md.ap(h);
    const setN=new Set(skN),setC=new Set(skC),parts=[];
    if(skN.length)parts.push('notes');if(skC.length)parts.push('comentaris');
    const sub=_c('p');sub.style.cssText='font-size:13px;color:#666;margin:0 0 12px;line-height:1.5;';
    sub.textContent=`Els alumnes següents ja tenien ${parts.join(' o ')} i no s'han sobreescrit:`;md.ap(sub);
    const ul=_c('ul');ul.style.cssText='font-size:13px;margin:0 0 16px;padding-left:18px;line-height:1.9;max-height:200px;overflow-y:auto;';
    all.forEach(name=>{const li=_c('li');const tags=[];if(setN.has(name))tags.push('notes');if(setC.has(name))tags.push('comentaris');li.textContent=`${name} (${tags.join(', ')})`;ul.ap(li);});md.ap(ul);
    const ok=_c('button');ok.textContent='Tancar';ok.style.cssText='width:100%;padding:11px;border:none;border-radius:8px;background:#555;color:#fff;font-size:14px;font-weight:500;cursor:pointer;';ok.onclick=close;md.ap(ok);
  }
  function sF(mode,idx2,wM){
    md.innerHTML='';md.ap(mkCtx());md.ap(mkBack(()=>idx2===null?sSc(mode,wM):sPk(mode,wM)));
    let nTA=null,cTA=null;
    if(mode==='notes'||mode==='ambdos'){md.ap(mkLbl('Notes (una per línia, en el mateix ordre que la taula)'));nTA=mkTA('10\n7\n5\n...');md.ap(nTA);}
    if(mode==='comentaris'||mode==='ambdos'){md.ap(mkLbl('Comentaris (un per línia)'));cTA=mkTA('Comentari alumne 1\nComentari alumne 2\n...');md.ap(cTA);}
    const ap=_c('button');ap.textContent=lbls[mode];ap.style.cssText=`width:100%;padding:11px;border:none;border-radius:8px;background:${clrs[mode]};color:#fff;font-size:14px;font-weight:500;cursor:pointer;`;
    ap.onclick=()=>{const skN=nTA?aN(nTA.value,idx2,wM):[];if(cTA){aCFastBATX(cTA.value,idx2,wM,skC=>sS(skN,skC));}else{sS(skN,[]);}};
    md.ap(ap);
  }
  function sPk(mode,wM){
    md.innerHTML='';md.ap(mkCtx());md.ap(mkBack(()=>sSc(mode,wM)));
    const rows=gR();
    const h=_c('p');h.textContent='Selecciona els alumnes';h.style.cssText='font-weight:500;font-size:15px;margin:0 0 10px;';md.ap(h);
    const sr=_c('div');sr.style.cssText='display:flex;gap:8px;margin-bottom:8px;';
    const sA=_c('button');sA.textContent='Tots';sA.style.cssText='flex:1;padding:5px;border:1px solid #ccc;border-radius:6px;background:transparent;font-size:12px;cursor:pointer;';
    const sN=_c('button');sN.textContent='Cap';sN.style.cssText='flex:1;padding:5px;border:1px solid #ccc;border-radius:6px;background:transparent;font-size:12px;cursor:pointer;';
    sr.ap(sA);sr.ap(sN);md.ap(sr);
    const ld=_c('div');ld.style.cssText='max-height:220px;overflow-y:auto;border:1px solid #eee;border-radius:6px;margin-bottom:12px;';
    const cbs=[];
    rows.forEach((row,i)=>{
      const name=gN(row)||`Alumne ${i+1}`;
      const item=_c('label');item.style.cssText='display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:13px;';
      const cb=_c('input');cb.type='checkbox';cb.checked=true;cbs.push(cb);
      item.ap(cb);item.ap(document.createTextNode(name));ld.ap(item);
    });
    md.ap(ld);
    sA.onclick=()=>cbs.forEach(c=>c.checked=true);
    sN.onclick=()=>cbs.forEach(c=>c.checked=false);
    const ap=_c('button');ap.textContent='Continuar';ap.style.cssText=`width:100%;padding:11px;border:none;border-radius:8px;background:${clrs[mode]};color:#fff;font-size:14px;font-weight:500;cursor:pointer;`;
    ap.onclick=()=>{const idx=cbs.map((c,i)=>c.checked?i:null).filter(i=>i!==null);if(!idx.length)return;sF(mode,idx,wM);};
    md.ap(ap);
  }
  function sSc(mode,wM){
    md.innerHTML='';md.ap(mkCtx());md.ap(mkBack(sCh));
    const h=_c('p');h.textContent='A quins alumnes?';h.style.cssText='font-weight:500;font-size:16px;margin:0 0 16px;';md.ap(h);
    md.ap(mkBtn('Tots els alumnes del grup',clrs[mode],()=>sF(mode,null,wM)));
    md.ap(mkBtn('Escollir alumnes','#888',()=>sPk(mode,wM)));
  }
  function sW(msg,mode){
    md.innerHTML='';md.ap(mkCtx());md.ap(mkBack(sCh));
    const ic=_c('div');ic.textContent='⚠';ic.style.cssText='font-size:28px;margin-bottom:8px;';md.ap(ic);
    const h=_c('p');h.style.cssText='font-weight:500;font-size:15px;margin:0 0 8px;';h.textContent='Ja hi ha dades existents';md.ap(h);
    const s=_c('p');s.style.cssText='font-size:13px;color:#666;margin:0 0 16px;line-height:1.5;';s.textContent=msg;md.ap(s);
    md.ap(mkBtn('Reescriure tot','#c0392b',()=>sSc(mode,'overwrite')));
    md.ap(mkBtn('No sobreescriure els que ja en tienen','#e67e22',()=>sSc(mode,'skip')));
    md.ap(mkCancel('Cancel·lar',close));
  }
  function cAS(mode){
    const nWarn=(mode==='notes'||mode==='ambdos')&&hN();
    const cWarn=(mode==='comentaris'||mode==='ambdos')&&hC();
    const parts=[];if(nWarn)parts.push('notes');if(cWarn)parts.push('comentaris');
    if(parts.length){sW(`Ja hi ha ${parts.join(' i ')} introduïts.`,mode);}else{sSc(mode,'overwrite');}
  }
  function sInfoBATX(){
    md.innerHTML='';md.ap(mkBack(sCh));
    const h=_c('p');h.style.cssText='font-weight:500;font-size:18px;margin:0 0 18px;color:#0f0f1a;';h.textContent='ℹ️ Com funciona';md.ap(h);
    function sec(tit,items){const wrap=_c('div');wrap.style.cssText='margin-bottom:16px;';const lbl=_c('p');lbl.style.cssText='font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;';lbl.textContent=tit;wrap.ap(lbl);const box=_c('div');box.style.cssText='border-radius:10px;overflow:hidden;border:1px solid #eee;';items.forEach((it,i)=>{const d=_c('div');d.style.cssText='padding:9px 14px;font-size:13px;color:#374151;line-height:1.5;'+(i>0?'border-top:1px solid #f3f4f6;':'');d.innerHTML=it;box.ap(d);});wrap.ap(box);md.ap(wrap);}
    sec('Notes',['📋 Enganxa una nota per alumne, <strong>una per línia</strong>, en el mateix ordre que la taula.','⬜ Per saltar-te un alumne, deixa la línia corresponent en <strong>blanc</strong>.','🔢 Format acceptat: <strong>números</strong> (p.ex. 7, 8.5).']);
    sec('Comentaris',['💬 Enganxa un comentari per alumne, <strong>un per línia</strong>, en el mateix ordre que la taula.','↵ Cada comentari ha d\'ocupar exactament una sola línia, <strong>sense salts de línia interns</strong>.','⬜ Per saltar-te un alumne, deixa la línia corresponent en <strong>blanc</strong>.','⚡ S\'apliquen a l\'instant sense haver d\'obrir cada alumne individualment.']);
  }
  function sCh(){
    md.innerHTML='';md.ap(mkCtx());
    const h=_c('p');h.style.cssText='font-weight:500;font-size:16px;margin:0 0 16px;';h.textContent='Què vols fer?';md.ap(h);
    md.ap(mkBtn('Posar notes','#4e7f4e',()=>cAS('notes')));
    md.ap(mkBtn('Posar comentaris','#3d6b9e',()=>cAS('comentaris')));
    md.ap(mkBtn('Posar notes i comentaris','#7a4e9e',()=>cAS('ambdos')));
    const biB=_c('button');biB.textContent='ℹ️ Com funciona';biB.style.cssText='width:100%;padding:9px;border:1.5px solid #e5e7eb;border-radius:8px;background:transparent;font-size:13px;cursor:pointer;color:#6b7280;margin-top:4px;';biB.onclick=sInfoBATX;md.ap(biB);
    md.ap(mkCancel());
    const cr=_c('p');cr.textContent='© 2026 Ignasi Martí Palet';cr.style.cssText='font-size:11px;color:#9ca3af;text-align:center;margin-top:14px;margin-bottom:0';md.ap(cr);
  }
  sCh();ov.ap(md);_ba(ov);

// ── QUALIFICACIONS PER GRUP/ALUMNE (isM) ──────────────────────────────────────
}else if(isM){
  if(_id('esfera-overlay'))return;
  const pgURL=window.location.href.toLowerCase();
  const pgTitle=document.title.toLowerCase();
  const isBatxCtx=pgURL.includes('batx')||pgTitle.includes('batx');
  const isFinalCtx=pgURL.includes('final')||pgTitle.includes('final');
  const CTX=isBatxCtx?'Avaluació parcial Batxillerat':(isFinalCtx?'Avaluació final ESO':'Avaluació parcial ESO');

  const ov=_c('div');ov.id='esfera-overlay';ov.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.45);z-index:99999;display:flex;align-items:center;justify-content:center;';
  const md=_c('div');md.style.cssText='background:#fff;border-radius:12px;padding:24px;width:420px;max-width:90vw;max-height:85vh;overflow-y:auto;font-family:sans-serif;color:#111;box-sizing:border-box;';
  function close(){ov.remove();}
  ov.addEventListener('click',e=>{if(e.target===ov)close();});

  function gR(){
    return Array.from(_qa('#my-tab-content tbody tr')).filter(r=>{
      if(r.querySelector('.cursiva'))return false;
      const s6=r.querySelector('td:nth-child(6)>div>div>select')||r.querySelector('td:nth-child(6) input[type="text"]')||r.querySelector('td:nth-child(6) input[type="number"]')||r.querySelector('td:nth-child(6) input');
      if(s6&&!s6.disabled)return true;
      const q=r.querySelector('input[name="qualitativa"]');
      if(q&&!q.disabled)return true;
      return !!r.querySelector('a.glyphicon-new-window');
    });
  }
  function gN(row){const td=row.querySelector('td:nth-child(2)');return td?td.textContent.trim():'';}

  function rN(row){
    const s=row.querySelector('td:nth-child(6)>div>div>select');
    if(s)return s.value&&s.value!==''&&s.value!=='string:';
    const inp=row.querySelector('td:nth-child(6) input[type="text"]')||row.querySelector('td:nth-child(6) input[type="number"]')||row.querySelector('td:nth-child(6) input');
    if(inp)return inp.value&&inp.value.trim()!=='';
    const q=row.querySelector('input[name="qualitativa"]');
    return q&&(q.value.trim()!==''||q.classList.contains('ng-not-empty'));
  }

  function rCm(row){
    const btn=row.querySelector('a.glyphicon.glyphicon-new-window');
    return btn&&!btn.classList.contains('emptyIcon');
  }

  function hN(){return gR().some(rN);}
  function hC(){return gR().some(rCm);}

  function aCFast(text,idx2,wM,cb){
    const cm=text.split('\n').map(s=>s.trim());
    const rows=gR();
    const tg=idx2!==null?idx2.map(i=>rows[i]):rows;
    const sk=[];
    try{
      const activeTab=_q('#my-tab-content .tab-pane.active');
      const scopeBase=activeTab?angular.element(activeTab).scope():null;
      const scopeVm=scopeBase&&scopeBase.vm?scopeBase:null;
      const scopeParent=scopeBase&&scopeBase.$parent&&scopeBase.$parent.$parent&&scopeBase.$parent.$parent.dummyStudents?scopeBase.$parent.$parent:null;
      const scope=scopeVm||scopeParent;
      const vm=scopeVm&&scopeVm.vm;
      const students=vm&&vm.dummyStudents?vm.dummyStudents.filter(a=>a.showComments&&!a.esBaixa):(scope&&scope.dummyStudents?scope.dummyStudents.filter(a=>!a.esBaixa):null);
      if(students&&students.length){
        const tgStudents=idx2!==null?idx2.map(i=>students[i]):students;
        let applied=0;
        for(let i=0;i<cm.length&&i<tgStudents.length;i++){
          const st=tgStudents[i];if(!st)continue;
          if(wM==='skip'&&rCm(tg[i])){sk.push(gN(tg[i]));continue;}
          if(!cm[i])continue;
          st.comentaris=cm[i];
          applied++;
        }
        if(applied>0){(scope||scopeParent||scopeVm).$apply();cb(sk);return;}
      }
    }catch(e){}
    aC(text,idx2,wM,cb);
  }

  function aN(text,idx2,wM){
    const grades=text.split('\n').map(s=>s.split('\t'));
    const rows=gR();const tg=idx2!==null?idx2.map(i=>rows[i]):rows;const sk=[];
    const batxInps=[...document.querySelectorAll('input[data-ng-class]')]
      .filter(i=>!i.disabled&&i.offsetParent!==null);
    if(batxInps.length>0){
      const tgInps=idx2!==null?idx2.map(i=>batxInps[i]):batxInps;
      const upd=[];
      for(let i=0;i<grades.length&&i<tgInps.length;i++){
        const inp=tgInps[i];if(!inp)continue;
        if(wM==='skip'&&tg[i]&&rN(tg[i])){sk.push(gN(tg[i]));continue;}
        const v=(grades[i][0]||'').trim();if(v==='')continue;
        upd.push({inp,v});
      }
      upd.forEach(({inp,v})=>inp.value=v);
      upd.forEach(({inp})=>{
        inp.dispatchEvent(new InputEvent('input',{bubbles:true}));
        inp.dispatchEvent(new Event('change',{bubbles:true}));
      });
      return sk;
    }
    for(let i=0;i<grades.length&&i<tg.length;i++){
      const row=tg[i];if(!row)continue;
      if(wM==='skip'&&rN(row)){sk.push(gN(row));continue;}
      const sg=grades[i];
      for(let j=0;j<sg.length;j++){
        if(sg[j]!==''){
          const sel=row.querySelector(`td:nth-child(${6+j})>div>div>select`);
          if(sel){sel.value='string:'+sg[j].trim();sel.dispatchEvent(new Event('change'));}
          else{const inp=row.querySelector(`td:nth-child(${6+j}) input[type="text"]`)||row.querySelector(`td:nth-child(${6+j}) input[type="number"]`)||row.querySelector(`td:nth-child(${6+j}) input`);if(inp){inp.value=sg[j].trim();inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));}}
        }
      }
    }
    return sk;
  }

  function aC(text,idx2,wM,cb){
    const cm=text.split('\n');
    const rows=gR();
    const tg=idx2!==null?idx2.map(i=>rows[i]):rows;
    const sk=[];
    function next(i){
      if(i>=cm.length||i>=tg.length){cb(sk);return;}
      const row=tg[i];if(!row){next(i+1);return;}
      if(wM==='skip'&&rCm(row)){sk.push(gN(row));next(i+1);return;}
      const btn=row.querySelector('a.glyphicon-new-window');
      if(!btn){next(i+1);return;}
      btn.click();
      _st(()=>{
        const ta=_q('textarea[data-ng-model="vm.commentsToModify.commentsToModifyModal"]')||_q('textarea[data-ng-model="commentsToModify.commentsToModifyModal"]')||_q('textarea.form-control');
        const save=_q('a[data-ng-click="vm.modalSave()"]')||_q('a[data-ng-click="modalSave()"]');
        if(!ta||!save){next(i+1);return;}
        ta.focus();ta.value=cm[i];
        ta.dispatchEvent(new Event('input',{bubbles:true}));
        ta.dispatchEvent(new Event('change',{bubbles:true}));
        _st(()=>{save.click();_st(()=>next(i+1),700);},300);
      },1000);
    }
    next(0);
  }

  const clrs={notes:'#4e7f4e',comentaris:'#3d6b9e',ambdos:'#7a4e9e'};
  const lbls={notes:'Aplicar notes',comentaris:'Aplicar comentaris',ambdos:'Aplicar notes i comentaris'};
  function mkBtn(txt,bg,fn){const b=_c('button');b.textContent=txt;b.style.cssText=`display:block;width:100%;padding:12px 16px;margin-bottom:8px;border:none;border-radius:8px;background:${bg};color:#fff;font-size:14px;font-weight:500;cursor:pointer;text-align:left;`;b.onclick=fn;return b;}
  function mkCancel(txt,fn){const b=_c('button');b.textContent=txt||'Cancel·lar';b.style.cssText='width:100%;padding:9px;border:1px solid #ccc;border-radius:8px;background:transparent;font-size:13px;cursor:pointer;color:#666;margin-top:4px;';b.onclick=fn||close;return b;}
  function mkBack(fn){const b=_c('button');b.textContent='← Tornar';b.style.cssText='background:none;border:none;color:#666;font-size:13px;cursor:pointer;padding:0;margin-bottom:16px;display:block;';b.onclick=fn;return b;}
  function mkLbl(txt){const l=_c('label');l.textContent=txt;l.style.cssText='display:block;font-weight:500;font-size:13px;color:#555;margin-bottom:4px;';return l;}
  function mkTA(ph){const t=_c('textarea');t.placeholder=ph;t.style.cssText='width:100%;height:80px;box-sizing:border-box;border:1px solid #ccc;border-radius:6px;padding:6px 8px;font-size:12px;font-family:monospace;margin-bottom:12px;resize:vertical;';return t;}
  function mkCtx(){const b=_c('div');b.textContent=CTX;b.style.cssText='display:inline-block;background:#f0f4ff;color:#3d6b9e;border:1px solid #c5d5f0;border-radius:20px;padding:3px 10px;font-size:11px;font-weight:500;margin-bottom:14px;';return b;}
  function sS(skN,skC){const allNames=[...new Set([...skN,...skC])];if(!allNames.length){close();return;}md.innerHTML='';const ic=_c('div');ic.textContent='⚠';ic.style.cssText='font-size:26px;margin-bottom:8px;';md.ap(ic);const h=_c('p');h.style.cssText='font-weight:500;font-size:15px;margin:0 0 6px;';h.textContent='Alumnes no modificats';md.ap(h);const setN=new Set(skN);const setC=new Set(skC);const parts=[];if(skN.length)parts.push('notes');if(skC.length)parts.push('comentaris');const sub=_c('p');sub.style.cssText='font-size:13px;color:#666;margin:0 0 12px;line-height:1.5;';sub.textContent=`Els alumnes següents ja tenien ${parts.join(' o ')} i no s'han sobreescrit:`;md.ap(sub);const ul=_c('ul');ul.style.cssText='font-size:13px;margin:0 0 16px;padding-left:18px;line-height:1.9;max-height:200px;overflow-y:auto;';allNames.forEach(name=>{const li=_c('li');const tags=[];if(setN.has(name))tags.push('notes');if(setC.has(name))tags.push('comentaris');li.textContent=`${name} (${tags.join(', ')})`;ul.ap(li);});md.ap(ul);const ok=_c('button');ok.textContent='Tancar';ok.style.cssText='width:100%;padding:11px;border:none;border-radius:8px;background:#555;color:#fff;font-size:14px;font-weight:500;cursor:pointer;';ok.onclick=close;md.ap(ok);}
  function sF(mode,idx2,wM){
    md.innerHTML='';md.ap(mkCtx());md.ap(mkBack(()=>idx2===null?sSc(mode,wM):sPk(mode,wM)));
    let nTA=null,cTA=null;
    if(mode==='notes'||mode==='ambdos'){md.ap(mkLbl('Notes'));nTA=mkTA("Enganxa les notes des d'Excel");md.ap(nTA);}
    if(mode==='comentaris'||mode==='ambdos'){md.ap(mkLbl('Comentaris'));cTA=mkTA('Enganxa els comentaris (un per línia)');md.ap(cTA);}
    const ap=_c('button');ap.textContent=lbls[mode];ap.style.cssText=`width:100%;padding:11px;border:none;border-radius:8px;background:${clrs[mode]};color:#fff;font-size:14px;font-weight:500;cursor:pointer;`;
    ap.onclick=()=>{const skN=nTA?aN(nTA.value,idx2,wM):[];if(cTA){aCFast(cTA.value,idx2,wM,skC=>sS(skN,skC));}else{sS(skN,[]);}};
    md.ap(ap);
  }
  function sPk(mode,wM){md.innerHTML='';md.ap(mkCtx());md.ap(mkBack(()=>sSc(mode,wM)));const rows=gR();const h=_c('p');h.textContent='Selecciona els alumnes';h.style.cssText='font-weight:500;font-size:15px;margin:0 0 10px;';md.ap(h);const sr=_c('div');sr.style.cssText='display:flex;gap:8px;margin-bottom:8px;';const sA=_c('button');sA.textContent='Tots';sA.style.cssText='flex:1;padding:5px;border:1px solid #ccc;border-radius:6px;background:transparent;font-size:12px;cursor:pointer;';const sN=_c('button');sN.textContent='Cap';sN.style.cssText='flex:1;padding:5px;border:1px solid #ccc;border-radius:6px;background:transparent;font-size:12px;cursor:pointer;';sr.ap(sA);sr.ap(sN);md.ap(sr);const ld=_c('div');ld.style.cssText='max-height:220px;overflow-y:auto;border:1px solid #eee;border-radius:6px;margin-bottom:12px;';const cbs=[];rows.forEach((row,i)=>{const name=gN(row)||`Alumne ${i+1}`;const item=_c('label');item.style.cssText='display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:13px;';const cb=_c('input');cb.type='checkbox';cb.checked=true;cbs.push(cb);item.ap(cb);item.ap(document.createTextNode(name));ld.ap(item);});md.ap(ld);sA.onclick=()=>cbs.forEach(c=>c.checked=true);sN.onclick=()=>cbs.forEach(c=>c.checked=false);const ap=_c('button');ap.textContent='Continuar';ap.style.cssText=`width:100%;padding:11px;border:none;border-radius:8px;background:${clrs[mode]};color:#fff;font-size:14px;font-weight:500;cursor:pointer;`;ap.onclick=()=>{const idx=cbs.map((c,i)=>c.checked?i:null).filter(i=>i!==null);if(!idx.length)return;sF(mode,idx,wM);};md.ap(ap);}
  function sSc(mode,wM){md.innerHTML='';md.ap(mkCtx());md.ap(mkBack(sCh));const h=_c('p');h.textContent='A quins alumnes?';h.style.cssText='font-weight:500;font-size:16px;margin:0 0 16px;';md.ap(h);md.ap(mkBtn('Tots els alumnes del grup',clrs[mode],()=>sF(mode,null,wM)));md.ap(mkBtn('Escollir alumnes','#888',()=>sPk(mode,wM)));}
  function sW(msg,mode){md.innerHTML='';md.ap(mkCtx());md.ap(mkBack(sCh));const ic=_c('div');ic.textContent='⚠';ic.style.cssText='font-size:28px;margin-bottom:8px;';md.ap(ic);const h=_c('p');h.style.cssText='font-weight:500;font-size:15px;margin:0 0 8px;';h.textContent='Ja hi ha dades existents';md.ap(h);const s=_c('p');s.style.cssText='font-size:13px;color:#666;margin:0 0 16px;line-height:1.5;';s.textContent=msg;md.ap(s);md.ap(mkBtn('Reescriure tot','#c0392b',()=>sSc(mode,'overwrite')));md.ap(mkBtn('No sobreescriure els que ja en tienen','#e67e22',()=>sSc(mode,'skip')));md.ap(mkCancel('Cancel·lar',close));}
  function cAS(mode){const nWarn=(mode==='notes'||mode==='ambdos')&&hN();const cWarn=(mode==='comentaris'||mode==='ambdos')&&hC();const parts=[];if(nWarn)parts.push('notes');if(cWarn)parts.push('comentaris');if(parts.length){sW(`Ja hi ha ${parts.join(' i ')} introduïts.`,mode);}else{sSc(mode,'overwrite');}}
  function sInfoM(){
    md.innerHTML='';md.ap(mkBack(sCh));
    const h=_c('p');h.style.cssText='font-weight:500;font-size:18px;margin:0 0 18px;color:#0f0f1a;';h.textContent='ℹ️ Com funciona';md.ap(h);
    function sec(tit,items){const wrap=_c('div');wrap.style.cssText='margin-bottom:16px;';const lbl=_c('p');lbl.style.cssText='font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;';lbl.textContent=tit;wrap.ap(lbl);const box=_c('div');box.style.cssText='border-radius:10px;overflow:hidden;border:1px solid #eee;';items.forEach((it,i)=>{const d=_c('div');d.style.cssText='padding:9px 14px;font-size:13px;color:#374151;line-height:1.5;'+(i>0?'border-top:1px solid #f3f4f6;':'');d.innerHTML=it;box.ap(d);});wrap.ap(box);md.ap(wrap);}
    sec('Notes ESO',['📋 Enganxa una nota per alumne, <strong>una per línia</strong>, en el mateix ordre que la taula. Pots enganxar directament des d\'Excel.','⬜ Per saltar-te un alumne, deixa la línia corresponent en <strong>blanc</strong>.','🔤 Formats acceptats: <strong>NA, AS, AN, AE</strong> &mdash; o el text complet: <strong>No assolit, Satisfactori, Notable, Excel&middot;lent</strong> &mdash; o també: <strong>No Assoliment, Assoliment Satisfactori, Assoliment Notable, Assoliment Excel&middot;lent</strong>.']);
    sec('Comentaris',['💬 Enganxa un comentari per alumne, <strong>un per línia</strong>, en el mateix ordre que la taula.','↵ Cada comentari ha d\'ocupar exactament una sola línia, <strong>sense salts de línia interns</strong>.','⬜ Per saltar-te un alumne, deixa la línia corresponent en <strong>blanc</strong>.','⚡ S\'apliquen a l\'instant sense haver d\'obrir cada alumne individualment.']);
  }
  function sCh(){md.innerHTML='';md.ap(mkCtx());const h=_c('p');h.style.cssText='font-weight:500;font-size:16px;margin:0 0 16px;';h.textContent='Què vols fer?';md.ap(h);md.ap(mkBtn('Posar notes','#4e7f4e',()=>cAS('notes')));md.ap(mkBtn('Posar comentaris','#3d6b9e',()=>cAS('comentaris')));md.ap(mkBtn('Posar notes i comentaris','#7a4e9e',()=>cAS('ambdos')));const biM=_c('button');biM.textContent='ℹ️ Com funciona';biM.style.cssText='width:100%;padding:9px;border:1.5px solid #e5e7eb;border-radius:8px;background:transparent;font-size:13px;cursor:pointer;color:#6b7280;margin-top:4px;';biM.onclick=sInfoM;md.ap(biM);md.ap(mkCancel());const cr=_c('p');cr.textContent='© 2026 Ignasi Martí Palet';cr.style.cssText='font-size:11px;color:#9ca3af;text-align:center;margin-top:14px;margin-bottom:0';md.ap(cr);}
  sCh();ov.ap(md);_ba(ov);

}else{
  (function(){var ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;background:rgba(10,10,20,0.5);backdrop-filter:blur(6px);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif';var box=document.createElement('div');box.style.cssText='background:#fff;border-radius:20px;padding:32px;width:420px;max-width:92vw;max-height:85vh;overflow-y:auto;box-shadow:0 32px 80px rgba(0,0,0,0.18)';function row(icon,title,sub){var d=document.createElement('div');d.style.cssText='display:flex;gap:12px;margin-bottom:16px;align-items:flex-start';var ic=document.createElement('div');ic.textContent=icon;ic.style.cssText='font-size:26px;flex-shrink:0;margin-top:1px';var tx=document.createElement('div');var t=document.createElement('div');t.textContent=title;t.style.cssText='font-size:18px;font-weight:600;color:#0f0f1a;margin-bottom:5px';tx.appendChild(t);if(sub){var s=document.createElement('div');s.innerHTML=sub;s.style.cssText='font-size:15px;color:#6b7280;line-height:1.6';tx.appendChild(s);}d.appendChild(ic);d.appendChild(tx);box.appendChild(d);}var hd=document.createElement('div');hd.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:20px';var ht=document.createElement('div');var h1=document.createElement('div');h1.textContent='⚠️ Pàgina no reconeguda';h1.style.cssText='font-size:22px;font-weight:700;color:#0f0f1a';var h2=document.createElement('div');h2.textContent='Aquest bookmarklet només funciona a:';h2.style.cssText='font-size:15px;color:#9ca3af;margin-top:3px';ht.appendChild(h1);ht.appendChild(h2);var cl=document.createElement('button');cl.textContent='×';cl.style.cssText='width:32px;height:32px;border-radius:50%;border:none;background:#f3f4f6;color:#6b7280;font-size:18px;cursor:pointer;flex-shrink:0';cl.onclick=function(){document.body.removeChild(ov);};hd.appendChild(ht);hd.appendChild(cl);box.appendChild(hd);var sep=document.createElement('div');sep.style.cssText='height:1px;background:#f3f4f6;margin-bottom:16px';box.appendChild(sep);row('📊','Qualificacions per grup i matèria','Entra a la <strong>matèria específica</strong> abans d\'executar');row('👤','Qualificacions per grup i alumne/a','Entra al <strong>primer alumne</strong> abans d\'executar');row('📝','Avaluacions finals d\'ESO o batxillerat','→ Per grup i alumne: entra al <strong>primer alumne</strong><br>→ Per grup i matèria: entra a la <strong>matèria específica</strong>');row('🎓','Avaluació final — Qualificacions per al tutor de grup','Comentaris de tutor / Consell orientador');var cr=document.createElement('div');cr.textContent='© 2026 Ignasi Martí Palet';cr.style.cssText='font-size:11px;color:#9ca3af;text-align:center;margin-top:8px';box.appendChild(cr);ov.appendChild(box);ov.addEventListener('click',function(e){if(e.target===ov)document.body.removeChild(ov);});document.body.appendChild(ov);})()
}
})();
