/* © 2026 Ignasi Martí Palet — Eina de tutoria (comentaris, treball de síntesi, acta, consell orientador) */
(function(){
Element.prototype.ap=Element.prototype.appendChild;
var _c=(...a)=>document.createElement(...a);
var _q=(...a)=>document.querySelector(...a);
var _qa=(...a)=>document.querySelectorAll(...a);
var _id=(...a)=>document.getElementById(...a);
var _rm=(...a)=>document.body.removeChild(...a);
var _ba=(...a)=>document.body.appendChild(...a);
var _st=(...a)=>setTimeout(...a);
  // Neteja el text enganxat des d'Excel/Sheets: una cel·la entre cometes (amb salts de línia, tabulacions
  // o cometes dobles) es llegeix com un sol text. Un canvi d'alumne és només un salt de línia fora de cometes.
  function netejaExcel(text){
    const s=String(text==null?'':text).replace(/\r\n?/g,'\n'),n=s.length;
    const out=[];let row=[],i=0;
    for(;;){
      let f='';
      if(s[i]==='"'){
        let j=i+1,buf='',ok=false;
        while(j<n){
          const ch=s[j];
          if(ch==='"'){
            if(s[j+1]==='"'){buf+='"';j+=2;continue;}
            if(j+1>=n||s[j+1]==='\t'||s[j+1]==='\n')ok=true;
            break;
          }
          buf+=ch;j++;
        }
        if(ok){f=buf.replace(/[\t\n]+/g,' ').replace(/ {2,}/g,' ').trim();i=j+1;}
        else{let j2=i;while(j2<n&&s[j2]!=='\t'&&s[j2]!=='\n')j2++;f=s.slice(i,j2);i=j2;}
      }else{
        let j2=i;while(j2<n&&s[j2]!=='\t'&&s[j2]!=='\n')j2++;f=s.slice(i,j2);i=j2;
      }
      row.push(f);
      if(i>=n){out.push(row);break;}
      if(s[i]==='\t'){i++;continue;}
      out.push(row);row=[];i++;
    }
    return out.map(r=>r.join('\t')).join('\n');
  }

  let fontLink=_c('link');fontLink.rel='stylesheet';
  fontLink.href='https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap';
  document.head.ap(fontLink);
  let styleEl=_c('style');
  styleEl.textContent='@keyframes tutorFadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes tutorPulse{0%,100%{opacity:1}50%{opacity:0.3}}';
  document.head.ap(styleEl);
  const F="font-family:'Outfit',system-ui,sans-serif;box-sizing:border-box;";
  let modeNoms=false,aturat=false;

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

  function cO(html,tancarFn){let ov=_c('div');ov.setAttribute('data-esfera','1');ov.style.cssText='position:fixed;inset:0;background:rgba(10,10,20,0.5);backdrop-filter:blur(6px);z-index:999999;display:flex;align-items:center;justify-content:center';let box=_c('div');box.style.cssText=F+'background:#fff;border-radius:20px;padding:36px;min-width:360px;max-width:min(92vw,520px);box-shadow:0 32px 80px rgba(0,0,0,0.18),0 2px 8px rgba(0,0,0,0.06);animation:tutorFadeIn 0.22s ease';box.innerHTML=html;ov.ap(box);_ba(ov);if(tancarFn)ov.addEventListener('click',e=>{if(e.target===ov)tancarFn(ov);});return ov;}
  function cP(text){let d=_c('div');d.style.cssText=F+'position:fixed;top:20px;right:20px;padding:12px 20px;background:#0f0f1a;color:#fff;font-size:13px;font-weight:500;border-radius:100px;z-index:999998;box-shadow:0 8px 28px rgba(0,0,0,0.22);display:flex;align-items:center;gap:10px';d.innerHTML='<span style="width:8px;height:8px;border-radius:50%;background:#4ade80;display:inline-block;animation:tutorPulse 1.2s infinite"></span><span id="tutorProgressText">'+text+'</span>';aturat=false;let bS=_c('button');bS.textContent='⏹ Aturar';bS.style.cssText='border:none;border-radius:100px;padding:5px 12px;background:#dc2626;color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit';bS.onclick=()=>{aturat=true;bS.disabled=true;bS.textContent='Aturant…';};d.ap(bS);d.setAttribute('data-esfera','1');_ba(d);return d;}
  function sP(prog,t){let el=prog.querySelector('#tutorProgressText');if(el)el.textContent=t;}
  function cT(id,btn){let taula=_id(id);if(!taula)return;let files=taula.querySelectorAll('tr');let text='';files.forEach(tr=>{let cel=tr.querySelectorAll('th,td');let fila=Array.from(cel).map(c=>c.textContent.trim()).join('\t');text+=fila+'\n';});navigator.clipboard.writeText(text).then(()=>{btn.textContent='✓ Copiat!';btn.style.background='#16a34a';_st(()=>{btn.textContent='📋 Copiar taula';btn.style.background='#0f0f1a';},2000);});}
  function mR(total,mm,sm,al){let html='<div style="'+F+'"><div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px"><div><h2 style="'+F+'margin:0 0 4px;font-size:20px;font-weight:700;color:#0f0f1a">Resum de l\'acta</h2><p style="'+F+'margin:0;font-size:13px;color:#9ca3af">'+total+' alumnes processats</p></div><button id="btnTancarRes" style="'+F+'width:34px;height:34px;border-radius:50%;border:none;background:#f3f4f6;color:#6b7280;font-size:20px;cursor:pointer;line-height:1">×</button></div>';
  html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><p style="'+F+'font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin:0">Per matèria</p><span style="display:flex;gap:6px"><button id="btnRot1" style="'+F+'padding:6px 12px;font-size:12px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:8px;background:#fff;color:#374151;cursor:pointer">↔ Girar la taula</button><button id="btnCopy1" style="'+F+'padding:6px 12px;font-size:12px;font-weight:600;border:none;border-radius:8px;background:#0f0f1a;color:#fff;cursor:pointer">📋 Copiar taula</button></span></div>';
  html+='<div style="border-radius:12px;overflow-x:auto;border:1px solid #f0f0f0;margin-bottom:20px"><table id="tutorTaula1" style="width:100%;border-collapse:collapse"><thead><tr style="background:#f9fafb"><th style="'+F+'padding:10px 14px;text-align:left;font-size:12px;font-weight:600;color:#6b7280">MATÈRIA</th><th style="'+F+'padding:10px 14px;text-align:center;font-size:12px;font-weight:600;color:#6b7280">SUSPESOS</th><th style="'+F+'padding:10px 14px;text-align:center;font-size:12px;font-weight:600;color:#6b7280">%</th></tr></thead><tbody>';
  for(let m in mm){let pct=(mm[m]/total*100).toFixed(1);let col=mm[m]===0?'#16a34a':mm[m]/total>0.3?'#dc2626':'#d97706';html+='<tr style="border-top:1px solid #f3f4f6"><td style="'+F+'padding:10px 14px;font-size:13px;color:#111">'+m+'</td><td style="'+F+'padding:10px 14px;text-align:center;font-size:14px;font-weight:700;color:'+col+'">'+mm[m]+'</td><td style="'+F+'padding:10px 14px;text-align:center;font-size:13px;color:#9ca3af">'+pct+'%</td></tr>';}
  html+='</tbody></table></div>';
  html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><p style="'+F+'font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin:0">Per nombre de suspesos</p><span style="display:flex;gap:6px"><button id="btnRot2" style="'+F+'padding:6px 12px;font-size:12px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:8px;background:#fff;color:#374151;cursor:pointer">↔ Girar la taula</button><button id="btnCopy2" style="'+F+'padding:6px 12px;font-size:12px;font-weight:600;border:none;border-radius:8px;background:#0f0f1a;color:#fff;cursor:pointer">📋 Copiar taula</button></span></div>';
  html+='<div style="border-radius:12px;overflow-x:auto;border:1px solid #f0f0f0;margin-bottom:20px"><table id="tutorTaula2" style="width:100%;border-collapse:collapse"><thead><tr style="background:#f9fafb"><th style="'+F+'padding:10px 14px;text-align:center;font-size:12px;font-weight:600;color:#6b7280">MAT. SUSPESES</th><th style="'+F+'padding:10px 14px;text-align:center;font-size:12px;font-weight:600;color:#6b7280">Nº ALUMNES</th><th style="'+F+'padding:10px 14px;text-align:center;font-size:12px;font-weight:600;color:#6b7280">%</th></tr></thead><tbody>';
  for(let i=0;i<=10;i++){let n=Object.values(sm).filter(x=>x===i).length;let pct=total>0?((n/total)*100).toFixed(1):'0.0';let colorN=n===0?'#9ca3af':'#0f0f1a';html+='<tr style="border-top:1px solid #f3f4f6"><td style="'+F+'padding:10px 14px;text-align:center;font-size:13px;color:#111">'+i+'</td><td style="'+F+'padding:10px 14px;text-align:center;font-size:14px;font-weight:700;color:'+colorN+'">'+n+'</td><td style="'+F+'padding:10px 14px;text-align:center;font-size:13px;color:#9ca3af">'+pct+'%</td></tr>';}
  html+='<tr style="background:#f9fafb;border-top:1px solid #e5e7eb"><td style="'+F+'padding:10px 14px;text-align:center;font-size:13px;font-weight:700;color:#0f0f1a">Total</td><td style="'+F+'padding:10px 14px;text-align:center;font-size:14px;font-weight:700;color:#0f0f1a">'+total+'</td><td style="'+F+'padding:10px 14px;text-align:center;font-size:13px;color:#9ca3af">100%</td></tr></tbody></table></div>';
  if(al&&al.length){html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><p style="'+F+'font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin:0">Per alumne</p><span style="display:flex;gap:6px"><button id="btnRot3" style="'+F+'padding:6px 12px;font-size:12px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:8px;background:#fff;color:#374151;cursor:pointer">↔ Girar la taula</button><button id="btnCopy3" style="'+F+'padding:6px 12px;font-size:12px;font-weight:600;border:none;border-radius:8px;background:#0f0f1a;color:#fff;cursor:pointer">📋 Copiar taula</button></span></div>';
  html+='<div style="border-radius:12px;overflow-x:auto;border:1px solid #f0f0f0;margin-bottom:20px"><table id="tutorTaula3" style="width:100%;border-collapse:collapse"><thead><tr style="background:#f9fafb"><th style="'+F+'padding:10px 14px;text-align:center;font-size:12px;font-weight:600;color:#6b7280">ALUMNE</th><th style="'+F+'padding:10px 14px;text-align:center;font-size:12px;font-weight:600;color:#6b7280">Nº SUSP.</th><th style="'+F+'padding:10px 14px;text-align:left;font-size:12px;font-weight:600;color:#6b7280">MATÈRIES SUSPESES</th></tr></thead><tbody>';
  al.forEach(a=>{let col=a.count===0?'#16a34a':a.count>3?'#dc2626':'#d97706';html+='<tr style="border-top:1px solid #f3f4f6"><td style="'+F+'padding:10px 14px;text-align:center;font-size:13px;color:#111">'+a.num+'</td><td style="'+F+'padding:10px 14px;text-align:center;font-size:14px;font-weight:700;color:'+col+'">'+a.count+'</td><td style="'+F+'padding:10px 14px;font-size:12px;color:#374151;line-height:1.7">'+a.mats.join('<br>')+'</td></tr>';});
  html+='</tbody></table></div>';}
  html+='</div>';
  let ov=cO('<div style="max-height:80vh;overflow-y:auto;padding-right:4px">'+html+'</div>',o=>_rm(o));
  // Girar una taula: files <-> columnes (es copia tal com es veu)
  const boxR=ov.firstChild,mw0=boxR.style.maxWidth;
  function giraTaula(t){
    const M=Array.from(t.rows).map(tr=>Array.from(tr.cells)),C=Math.max(...M.map(r=>r.length));
    const tb=_c('tbody');
    for(let j=0;j<C;j++){
      const tr=_c('tr');tr.style.cssText=j?'border-top:1px solid #f3f4f6;':'background:#f9fafb;';
      for(let i=0;i<M.length;i++){
        const src=M[i][j],td=_c(i===0?'th':'td');
        if(src){td.innerHTML=src.innerHTML;td.style.cssText=src.style.cssText;}
        td.style.whiteSpace='nowrap';
        if(i===0){td.style.textAlign='left';td.style.background='#f9fafb';td.style.fontSize='12px';td.style.fontWeight='600';td.style.color='#6b7280';td.style.textTransform='uppercase';}
        else if(j===0){td.style.background='#f9fafb';td.style.fontWeight='700';}
        else if(src&&src.parentNode.style.background)td.style.background='#f9fafb';
        tr.ap(td);
      }
      tb.ap(tr);
    }
    t.innerHTML='';t.ap(tb);
  }
  function ajustaAmplada(){
    const any=[1,2,3].some(n=>{const t=_id('tutorTaula'+n);return t&&t._girada;});
    boxR.style.maxWidth=any?'94vw':mw0;boxR.style.width=any?'min(1100px,94vw)':'';
  }
  [1,2,3].forEach(n=>{
    const b=_id('btnRot'+n),t=_id('tutorTaula'+n);if(!b||!t)return;
    b.onclick=()=>{
      if(t._girada){t.innerHTML=t._orig;t._girada=false;b.textContent='↔ Girar la taula';}
      else{t._orig=t.innerHTML;giraTaula(t);t._girada=true;b.textContent='↕ Tornar a vertical';}
      ajustaAmplada();
    };
  });
  _st(()=>{let b=_id('btnTancarRes');if(b)b.onclick=()=>{if(ov.parentNode)_rm(ov);};let c1=_id('btnCopy1');if(c1)c1.onclick=()=>cT('tutorTaula1',c1);let c2=_id('btnCopy2');if(c2)c2.onclick=()=>cT('tutorTaula2',c2);let c3=_id('btnCopy3');if(c3)c3.onclick=()=>cT('tutorTaula3',c3);},100);}

  function dC(callback){let html='<div style="'+F+'text-align:center"><div style="width:52px;height:52px;background:#0f0f1a;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:16px">💬</div><h2 style="'+F+'margin:0 0 6px;font-size:21px;font-weight:700;color:#0f0f1a">Comentaris</h2><p style="'+F+'margin:0 0 20px;font-size:13px;color:#9ca3af">Enganxa els comentaris (un per alumne)</p><textarea id="tutorTA" placeholder="Comentari alumne 1&#10;Comentari alumne 2&#10;Comentari alumne 3&#10;..." style="'+F+'width:100%;height:160px;border:1.5px solid #e5e7eb;border-radius:12px;padding:14px;font-size:13px;color:#0f0f1a;resize:vertical;outline:none;line-height:1.6"></textarea><div style="display:flex;gap:10px;margin-top:16px"><button id="btnCancelCom" style="'+F+'flex:1;padding:13px;font-size:14px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#9ca3af;cursor:pointer">Cancel·lar</button><button id="btnOkCom" style="'+F+'flex:2;padding:13px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Continuar →</button></div></div>';
  let ov=cO(html,null);toggleNoms(ov);_st(()=>{let ta=_id('tutorTA');if(ta)ta.focus();let ok=_id('btnOkCom');if(ok)ok.onclick=()=>{let val=ta?netejaExcel(ta.value):'';if(ov.parentNode)_rm(ov);callback(val);};let ca=_id('btnCancelCom');if(ca)ca.onclick=()=>{if(ov.parentNode)_rm(ov);};},100);}

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
    let ov=cO(html,null);toggleNoms(ov);
    _st(()=>{
      let ta=_id('tutorTAts');if(ta)ta.focus();
      let ok=_id('btnOkTS');if(ok)ok.onclick=()=>{let val=ta?netejaExcel(ta.value):'';if(ov.parentNode)_rm(ov);callback(val);};
      let ca=_id('btnCancelTS');if(ca)ca.onclick=()=>{if(ov.parentNode)_rm(ov);};
    },100);
  }

  // Diàleg combinat comentaris + TS
  function dCTS(callback){
    let html='<div style="'+F+'">'
      +'<div style="text-align:center;margin-bottom:20px">'
      +'<div style="width:52px;height:52px;background:#0f0f1a;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:16px">⚡</div>'
      +'<h2 style="'+F+'margin:0 0 6px;font-size:21px;font-weight:700;color:#0f0f1a">Comentaris + Treball de Síntesi</h2>'
      +'<p style="'+F+'margin:0;font-size:13px;color:#9ca3af">Una fila per alumne</p>'
      +'</div>'
      +'<p style="'+F+'font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 6px">Comentaris de tutor</p>'
      +'<textarea id="tutorTAcom2" placeholder="Comentari alumne 1&#10;Comentari alumne 2&#10;..." style="'+F+'width:100%;height:110px;border:1.5px solid #e5e7eb;border-radius:12px;padding:14px;font-size:13px;color:#0f0f1a;resize:vertical;outline:none;line-height:1.6;margin-bottom:14px"></textarea>'
      +'<p style="'+F+'font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 6px">Notes Treball de Síntesi</p>'
      +'<textarea id="tutorTAts2" placeholder="FA&#10;NF&#10;FT&#10;..." style="'+F+'width:100%;height:110px;border:1.5px solid #e5e7eb;border-radius:12px;padding:14px;font-size:13px;color:#0f0f1a;resize:vertical;outline:none;line-height:1.6;margin-bottom:16px"></textarea>'
      +'<div style="display:flex;gap:10px">'
      +'<button id="btnCancelCTS" style="'+F+'flex:1;padding:13px;font-size:14px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#9ca3af;cursor:pointer">Cancel·lar</button>'
      +'<button id="btnOkCTS" style="'+F+'flex:2;padding:13px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Continuar →</button>'
      +'</div></div>';
    let ov=cO(html,null);toggleNoms(ov);
    _st(()=>{
      let taC=_id('tutorTAcom2');if(taC)taC.focus();
      let ok=_id('btnOkCTS');if(ok)ok.onclick=()=>{
        let valC=taC?netejaExcel(taC.value):'';
        let taT=_id('tutorTAts2');let valT=taT?netejaExcel(taT.value):'';
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
    let ov=cO(html,null);toggleNoms(ov);
    _st(()=>{
      let ta=_id('tutorTAco');if(ta)ta.focus();
      let ok=_id('btnOkCO');if(ok)ok.onclick=()=>{let val=ta?netejaExcel(ta.value):'';if(ov.parentNode)_rm(ov);callback(val);};
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
      +sec('Comentaris de tutor',['💬 Enganxa els comentaris a la <strong>graella</strong>, una fila per alumne, en el mateix ordre que apareixen a la pantalla (directament des d\'Excel o Sheets).','↵ Si copies des d\'Excel o Sheets, una cel·la amb salts de línia o cometes es llegeix com un sol text.','⬜ Per saltar-te un alumne, deixa la línia corresponent en <strong>blanc</strong>.'])
      +sec('Treball de Síntesi',['📝 Enganxa les notes a la <strong>graella</strong>, una fila per alumne.','✅ Formats acceptats: <strong>FA, FT, NF</strong> o el text complet: <strong>Fet amb aprofitament, Fet, No fet</strong>.','⬜ Per saltar-te un alumne, deixa la línia corresponent en <strong>blanc</strong>.','⚠️ Disponible només si la matèria Treball de Síntesi apareix a la pantalla.'])
      +sec('Mode amb noms',['👤 A dalt de la graella de cada diàleg tria <strong>Amb noms</strong> (o enganxa-hi també la columna dels noms i hi passa sol).','📋 Escriu o enganxa <strong>nom i valor</strong>. No cal l\'ordre de la pantalla.','🔎 L\'eina llegeix el nom de l\'alumne de la pantalla i el busca a la llista. Abans de començar et mostra qui ha identificat; <strong>has d\'estar al primer alumne</strong>.','⚠️ Si no pot identificar un alumne, no hi escriu res, i al final et diu quins noms de la llista no s\'han aplicat.'])+sec('Aturar',['⏹ Mentre treballa, el botó <strong>Aturar</strong> (a dalt a la dreta) atura el procés en acabar l\'alumne actual.'])+sec('Acta de tutoria',['📋 Recorre tots els alumnes automàticament i genera un resum de suspesos per matèria i per alumne.','▶️ No cal enganxar res: simplement prem el botó i espera que acabi.'])
      +sec('Consell orientador',['🧭 Enganxa els consells a la <strong>graella</strong>, una fila per alumne, en el mateix ordre que apareixen a la pantalla.','↵ Si copies des d\'Excel o Sheets, una cel·la amb salts de línia o cometes es llegeix com un sol text.','⬜ Per saltar-te un alumne, deixa la línia corresponent en <strong>blanc</strong>.','⚠️ Disponible només si apareix el panell <strong>Resum d\'avaluació</strong> a la pantalla.'])
      +'</div>';
    _st(()=>{const b=_id('btnInfoBack');if(b)b.onclick=()=>{box.innerHTML=mH;_st(bindTutoriaButtons,50);};},50);
  }

  // ── MODE AMB NOMS: identifica l'alumne de la pantalla i busca'l a la llista ──
  const PARAULES_BUIDES=['de','del','la','el','els','les','dels','i'];
  const escH=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function normNom(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w&&PARAULES_BUIDES.indexOf(w)<0);}
  function parseNoms(text){
    return text.split('\n').map(l=>l.replace(/\r$/,'')).filter(l=>l.trim()!=='').map(l=>{
      const p=l.indexOf('\t');const nom=(p<0?l:l.slice(0,p)).trim();
      return {nom:nom,resta:(p<0?'':l.slice(p+1)).replace(/\t+/g,' ').trim(),t:normNom(nom),usat:false};
    });
  }
  // 1) nom de l'alumne a les dades d'Angular (objecte amb nom + cognoms; s'ignoren les llistes)
  function cercaNom(o,dd,vist){
    if(!o||typeof o!=='object'||dd>3||vist.has(o)||Array.isArray(o))return '';
    vist.add(o);
    if(typeof o.nom==='string'&&(typeof o.cognom1==='string'||typeof o.cognoms==='string'))return [o.cognom1,o.cognom2,o.cognoms,o.nom].filter(x=>typeof x==='string'&&x).join(' ');
    for(const k of Object.keys(o)){
      if(k.charAt(0)==='$')continue;
      let v;try{v=o[k];}catch(e){continue;}
      const r=cercaNom(v,dd+1,vist);if(r)return r;
    }
    return '';
  }
  function nomEscope(){
    try{
      const el=_q("select[data-ng-model='contingut.qualitativa']")||document.body;
      let sc=angular.element(el).scope();
      for(let k=0;k<12&&sc;k++){const r=cercaNom(sc,0,new Set());if(r)return r;sc=sc.$parent;}
    }catch(e){}
    return '';
  }
  // 2) text visible de la pantalla (sense formularis ni les finestres d'aquesta eina)
  function liniesVisibles(){
    const out=[];
    document.body.querySelectorAll('*').forEach(el=>{
      if(el.closest('textarea,select,option,script,style,[data-esfera]'))return;
      if(el.children.length>8)return;
      const x=(el.textContent||'').replace(/\s+/g,' ').trim();
      if(x&&x.length<=150)out.push(x);
    });
    return out;
  }
  function identifica(entrades,marca){
    const lliures=entrades.filter(e=>!e.usat&&e.t.length>=2);
    const clau=a=>a.slice().sort().join(' ');
    const nom=nomEscope();
    if(nom){
      const T=normNom(nom);
      let c=lliures.filter(e=>clau(e.t)===clau(T));
      if(!c.length)c=lliures.filter(e=>e.t.every(t=>T.includes(t))||T.every(t=>e.t.includes(t)));
      if(c.length>1){
        c.sort((a,b)=>Math.abs(a.t.length-T.length)-Math.abs(b.t.length-T.length));
        c=Math.abs(c[0].t.length-T.length)===Math.abs(c[1].t.length-T.length)?[]:[c[0]];
      }
      if(c.length===1){if(marca)c[0].usat=true;return {e:c[0],font:'dades de la pàgina'};}
    }
    const ls=liniesVisibles().map(normNom);
    const tr=lliures.filter(e=>ls.some(lt=>e.t.every(t=>lt.includes(t))));
    if(tr.length===1){if(marca)tr[0].usat=true;return {e:tr[0],font:'text de la pantalla'};}
    return null;
  }
  // text de la llista per a l'alumne de la pantalla (una sola identificació per alumne)
  function textAlumne(ent,i){
    if(ent.cache&&ent.cache.i===i)return ent.cache.txt;
    const r=identifica(ent,true);
    ent.cache={i:i,txt:r?r.e.resta:''};
    return ent.cache.txt;
  }
  function acaba(prog,msg,ents){
    sP(prog,msg);
    if(!ents)return;
    const sobra=Array.from(new Set(ents.filter(e=>!e.usat).map(e=>e.nom)));
    if(!sobra.length)return;
    let ov=cO('<div style="'+F+'"><h2 style="'+F+'margin:0 0 8px;font-size:19px;font-weight:700;color:#0f0f1a">⚠️ Noms sense aplicar ('+sobra.length+')</h2><p style="'+F+'margin:0 0 10px;font-size:13px;color:#6b7280;line-height:1.5">Aquests noms de la llista no s\'han associat a cap alumne de la pantalla (o no s\'ha pogut identificar l\'alumne):</p><ul style="'+F+'font-size:13px;margin:0 0 16px;padding-left:18px;line-height:1.8;max-height:200px;overflow-y:auto">'+sobra.map(n=>'<li>'+escH(n)+'</li>').join('')+'</ul><button id="nmAvOk" style="'+F+'width:100%;padding:12px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Tancar</button></div>',o=>_rm(o));
    _st(()=>{const b=_id('nmAvOk');if(b)b.onclick=()=>{if(ov.parentNode)_rm(ov);};},50);
  }
  // confirmació abans de començar: mostra qui ha identificat a la pantalla actual
  function iniciaNoms(llistes,go,cancel){
    let r=null;
    for(const l of llistes){r=identifica(l,false);if(r)break;}
    const html='<div style="'+F+'text-align:center"><div style="width:52px;height:52px;background:#0f0f1a;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:14px">👤</div><h2 style="'+F+'margin:0 0 8px;font-size:20px;font-weight:700;color:#0f0f1a">Mode amb noms</h2>'
      +(r?'<p style="'+F+'margin:0 0 4px;font-size:13px;color:#9ca3af">Alumne actual identificat com a:</p><p style="'+F+'margin:0 0 8px;font-size:17px;font-weight:700;color:#0f0f1a">'+escH(r.e.nom)+'</p><p style="'+F+'margin:0;font-size:12px;color:#9ca3af;line-height:1.5">(segons les '+r.font+'). Si no és el primer alumne o no és correcte, cancel·la.</p>'
        :'<p style="'+F+'margin:0;font-size:13px;color:#dc2626;line-height:1.5">No he pogut identificar l\'alumne de la pantalla amb cap nom de la teva llista. Comprova que ets al primer alumne i que el nom de la llista surt a la pantalla. Si continua fallant, fes servir el mode normal.</p>')
      +'<div style="display:flex;gap:10px;margin-top:18px"><button id="nmNo" style="'+F+'flex:1;padding:13px;font-size:14px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#9ca3af;cursor:pointer">Cancel·lar</button>'
      +(r?'<button id="nmOk" style="'+F+'flex:2;padding:13px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Continuar →</button>':'')+'</div></div>';
    let ov=cO(html,null);
    _st(()=>{
      const n=_id('nmNo');if(n)n.onclick=()=>{if(ov.parentNode)_rm(ov);if(cancel)cancel();};
      const o=_id('nmOk');if(o)o.onclick=()=>{if(ov.parentNode)_rm(ov);go();};
    },50);
  }
  // Graella tipus full de càlcul als diàlegs d'entrada (substitueix el botó antic de mode amb noms).
  // Els quadres de text originals es mantenen (amagats) amb el mateix format de sempre: així la resta del codi no canvia.
  function toggleNoms(ov){
    const tas=Array.from(ov.querySelectorAll('textarea'));if(!tas.length)return;
    const LBL={tutorTA:'Comentari',tutorTAts:'Nota TS',tutorTAco:'Consell',tutorTAcom2:'Comentari',tutorTAts2:'Nota TS'};
    const nv=tas.length,labels=tas.map(t=>LBL[t.id]||'Valor');
    tas.forEach(t=>{t.style.display='none';const p=t.previousElementSibling;if(p&&p.tagName==='P'&&nv>1)p.style.display='none';});
    const colsT=()=>'34px '+(modeNoms?'1.4fr ':'')+(nv===1?'2.4fr':'2fr .7fr');
    const RC=()=>'display:grid;grid-template-columns:'+colsT()+';';
    const wrap=_c('div');wrap.style.cssText='text-align:left;margin:0 0 14px;';
    const bar=_c('div');bar.style.cssText='display:flex;gap:8px;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;';
    const seg=_c('div');seg.style.cssText='display:flex;border:1.5px solid #e5e7eb;border-radius:8px;overflow:hidden;';
    const bOrd=_c('button'),bNom=_c('button');
    bOrd.textContent='📋 Per ordre dels alumnes';bNom.textContent='👤 Amb noms';
    [bOrd,bNom].forEach(b=>{b.style.cssText=F+'padding:7px 12px;font-size:12px;font-weight:500;border:none;cursor:pointer;';seg.ap(b);});
    const clr=_c('button');clr.textContent='🗑 Esborrar tot';clr.style.cssText=F+'padding:7px 12px;font-size:12px;font-weight:500;border:1.5px solid #e5e7eb;border-radius:8px;background:#fff;color:#c0392b;cursor:pointer;white-space:nowrap;';
    const rot=_c('button');rot.style.cssText=F+'padding:7px 12px;font-size:12px;font-weight:500;border:1.5px solid #e5e7eb;border-radius:8px;background:#fff;color:#374151;cursor:pointer;white-space:nowrap;';
    const bdr=_c('div');bdr.style.cssText='display:flex;gap:6px;';bdr.ap(rot);bdr.ap(clr);
    bar.ap(seg);bar.ap(bdr);wrap.ap(bar);
    const gridEl=_c('div');gridEl.style.cssText='border:1.5px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-bottom:6px;';
    const gHead=_c('div');gHead.style.cssText=F+'background:#f9fafb;border-bottom:1px solid #e5e7eb;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;';
    const hCells=[];
    ['#','Nom alumne'].concat(labels).forEach((t,ix)=>{const h=_c('div');h.textContent=t;h.style.cssText='padding:8px 10px;'+(ix?'border-left:1px solid #f0f0f0;':'');hCells.push(h);gHead.ap(h);});
    const gBody=_c('div');gBody.style.cssText='max-height:240px;overflow-y:auto;';
    gridEl.ap(gHead);gridEl.ap(gBody);wrap.ap(gridEl);
    // en horitzontal: cada columna és un alumne i cada fila un camp (les etiquetes van a la primera columna)
    const LC='padding:8px 10px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;background:#f9fafb;align-items:center;display:none;';
    const corner=_c('div');corner.style.cssText=LC;corner.textContent='#';gBody.ap(corner);
    const labelCells=['Nom alumne'].concat(labels).map(t=>{const d=_c('div');d.textContent=t;d.style.cssText=LC+'border-top:1px solid #f0f0f0;';gBody.ap(d);return d;});
    const box0=ov.firstChild,w0=box0?box0.style.width:'',mw0=box0?box0.style.maxWidth:'';
    function layout(){
      const vr=c=>(modeNoms?c:c-1)+2;
      if(!horiz){
        gHead.style.display='grid';gBody.style.display='block';gBody.style.gridTemplateColumns='';gBody.style.overflowX='hidden';gBody.style.maxHeight='240px';
        corner.style.display='none';labelCells.forEach(d=>{d.style.display='none';});
        rows.forEach((tr,i)=>{tr.style.display='grid';tr.style.gridTemplateColumns=colsT();tr.style.borderTop=i?'1px solid #f0f0f0':'none';tr.firstChild.style.gridRow='';tr.firstChild.style.gridColumn='';tr._c.forEach(x=>{x.style.gridRow='';x.style.gridColumn='';x.style.borderTop='none';});});
        if(box0){box0.style.width=w0;box0.style.maxWidth=mw0;}
        return;
      }
      gHead.style.display='none';gBody.style.display='grid';gBody.style.overflowX='auto';gBody.style.maxHeight='none';
      gBody.style.gridTemplateColumns='104px repeat('+rows.length+',minmax(116px,1fr))';
      corner.style.display='flex';corner.style.gridRow='1';corner.style.gridColumn='1';
      labelCells.forEach((d,c)=>{d.style.display=(c===0&&!modeNoms)?'none':'flex';d.style.gridColumn='1';d.style.gridRow=String(vr(c));});
      rows.forEach((tr,i)=>{tr.style.display='contents';const n=tr.firstChild;n.style.gridRow='1';n.style.gridColumn=String(i+2);tr._c.forEach((x,c)=>{x.style.gridRow=String(vr(c));x.style.gridColumn=String(i+2);x.style.borderTop='1px solid #f0f0f0';});});
      if(box0){box0.style.width='min(920px,94vw)';box0.style.maxWidth='94vw';}
    }
    function pintaRot(){rot.textContent=horiz?'↕ Veure en vertical':'↔ Veure en horitzontal';rot.title=horiz?'Un alumne per fila':'Un alumne per columna';}
    rot.onclick=()=>{horiz=!horiz;pintaRot();pinta();};
    const hint=_c('p');hint.style.cssText=F+'font-size:11px;color:#9ca3af;margin:0 0 6px;line-height:1.5;';wrap.ap(hint);
    const info=_c('div');info.style.cssText=F+'font-size:12px;color:#6b7280;min-height:16px;';wrap.ap(info);
    tas[0].parentNode.insertBefore(wrap,tas[0]);
    const rows=[];
    let horiz=false;
    const neteja=v=>String(v||'').replace(/[\t\r\n]+/g,' ').trim();
    function focusCell(r,c){while(rows.length<=r)addRow();const inp=rows[r]._c[c];if(inp&&inp.style.display!=='none'){inp.focus();inp.select();}}
    function addRow(){
      const r=rows.length,tr=_c('div');
      tr.style.cssText=F+RC()+(r?'border-top:1px solid #f0f0f0;':'');
      const n=_c('div');n.textContent=r+1;n.style.cssText='font-size:11px;color:#9ca3af;display:flex;align-items:center;justify-content:center;background:#fafafa;';tr.ap(n);
      tr._c=[];
      for(let c=0;c<=nv;c++){
        const inp=_c('input');inp.type='text';inp.spellcheck=false;inp.autocomplete='off';inp.dataset.c=c;
        inp.style.cssText=F+'border:none;border-left:1px solid #f0f0f0;padding:8px 10px;font-size:13px;color:#0f0f1a;outline:none;background:transparent;min-width:0;width:100%;'+(c===0&&!modeNoms?'display:none;':'');
        inp.addEventListener('input',sync);
        inp.addEventListener('paste',gPaste);
        inp.addEventListener('keydown',e=>{
          const rr=rows.indexOf(tr);
          if(horiz){
            if(e.key==='Enter'){e.preventDefault();focusCell(rr+1,c);}
            else if(e.key==='ArrowDown'){e.preventDefault();focusCell(rr,c+1);}
            else if(e.key==='ArrowUp'&&c>0){e.preventDefault();focusCell(rr,c-1);}
          }else if(e.key==='Enter'||e.key==='ArrowDown'){e.preventDefault();focusCell(rr+1,c);}
          else if(e.key==='ArrowUp'&&rr>0){e.preventDefault();focusCell(rr-1,c);}
        });
        tr.ap(inp);tr._c.push(inp);
      }
      gBody.ap(tr);rows.push(tr);
    }
    function gPaste(e){
      const txt=(e.clipboardData||window.clipboardData).getData('text');
      if(!/[\t\n\r]/.test(txt))return;
      e.preventDefault();
      let data=netejaExcel(txt).split('\n').map(l=>l.split('\t'));
      // en horitzontal, una fila d'Excel són alumnes diferents: es transposa abans d'enganxar
      if(horiz){const W=data.reduce((m,p)=>Math.max(m,p.length),0),T=[];for(let j=0;j<W;j++)T.push(data.map(p=>p[j]===undefined?'':p[j]));data=T;}
      while(data.length&&data[data.length-1].every(x=>!x.trim()))data.pop();
      let c0=+e.target.dataset.c,auto=false;
      const maxC=data.reduce((m,p)=>Math.max(m,p.length),0);
      // en mode per ordre, si hi ha més columnes de les que caben, la primera són els noms: passa a mode amb noms
      if(!modeNoms&&c0===1&&maxC>nv){setMode(true,true);c0=0;auto=true;}
      const r0=rows.indexOf(e.target.parentNode);
      let perdudes=false;
      data.forEach((pp,i)=>{
        while(rows.length<=r0+i)addRow();
        pp.forEach((v,j)=>{const ci=c0+j;if(ci>nv){if(v.trim())perdudes=true;return;}rows[r0+i]._c[ci].value=v.trim();});
      });
      sync();
      if(auto)info.textContent='ℹ️ He passat a «Amb noms» perquè hi havia una columna de més (els noms).';
      else if(perdudes)info.textContent='ℹ️ Hi havia més columnes de les que caben des d\'aquesta cel·la: les sobrants s\'han ignorat.';
    }
    function llegeix(){return rows.map(tr=>({nom:modeNoms?neteja(tr._c[0].value):'',v:labels.map((_,j)=>neteja(tr._c[1+j].value))}));}
    let sinNom=0;
    function sync(){
      let blank=0;
      for(let i=rows.length-1;i>=0;i--){const tr=rows[i];if(tr._c.slice(1).every(x=>!x.value.trim())&&(!modeNoms||!tr._c[0].value.trim()))blank++;else break;}
      while(blank<2){addRow();blank++;}
      layout();
      const L=llegeix();
      tas.forEach((t,j)=>{
        if(modeNoms)t.value=L.filter(o=>o.nom&&o.v[j]).map(o=>o.nom+'\t'+o.v[j]).join('\n');
        else{let ult=-1;L.forEach((o,i)=>{if(o.v[j])ult=i;});t.value=L.slice(0,ult+1).map(o=>o.v[j]).join('\n');}
      });
      sinNom=0;
      L.forEach((o,i)=>{const falta=modeNoms&&!o.nom&&o.v.some(Boolean);if(falta)sinNom++;rows[i]._c[0].style.boxShadow=falta?'inset 0 0 0 2px #fca5a5':'none';});
      const k=L.filter(o=>o.nom||o.v.some(Boolean)).length;
      info.style.color='#6b7280';
      info.textContent=k?(modeNoms?'Mode amb noms · ':'Per ordre dels alumnes · ')+k+(k>1?' files':' fila')+(sinNom?' · ⚠️ '+sinNom+' sense nom':''):'';
    }
    function pinta(){
      bOrd.style.background=modeNoms?'#fff':'#0f0f1a';bOrd.style.color=modeNoms?'#6b7280':'#fff';
      bNom.style.background=modeNoms?'#0f0f1a':'#fff';bNom.style.color=modeNoms?'#fff':'#6b7280';
      hCells[1].style.display=modeNoms?'':'none';
      gHead.style.cssText=F+RC()+'background:#f9fafb;border-bottom:1px solid #e5e7eb;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;';
      hint.textContent=modeNoms
        ?"💡 Escriu o enganxa el nom i el valor (des d'Excel o Sheets, cap a la dreta i cap avall). Els alumnes s'identifiquen a la pantalla mentre es processa, en qualsevol ordre; al final et diu quins noms no ha trobat."
        :"💡 Enganxa els valors des d'Excel o Sheets: la fila 1 és el primer alumne de la pantalla, la 2 el segon, etc. Si copies també els noms, passa sol a «Amb noms».";
      rows.forEach(tr=>{tr.style.gridTemplateColumns=colsT();tr._c[0].style.display=modeNoms?'':'none';});
      if(horiz)hint.textContent+=' Taula girada: cada columna és un alumne, i en enganxar una fila d\'Excel s\'omple cap a la dreta.';
      layout();
    }
    function setMode(m,sense){
      if(m===modeNoms)return;
      if(!m&&!sense&&llegeix().some(o=>o.nom)&&!window.confirm('Si passes a «Per ordre dels alumnes», s\'esborren els noms que has escrit. Vols continuar?'))return;
      modeNoms=m;
      if(!m)rows.forEach(tr=>{tr._c[0].value='';});
      pinta();sync();
    }
    bOrd.onclick=()=>setMode(false);bNom.onclick=()=>setMode(true);
    clr.onclick=()=>{rows.forEach(tr=>tr._c.forEach(x=>{x.value='';}));sync();};
    for(let i=0;i<8;i++)addRow();
    pintaRot();pinta();sync();
    // no deixa continuar si, en mode amb noms, hi ha files amb valor però sense nom
    ov.querySelectorAll('button[id^="btnOk"]').forEach(b=>b.addEventListener('click',e=>{
      if(modeNoms&&sinNom>0){e.stopImmediatePropagation();e.preventDefault();info.style.color='#dc2626';info.textContent='⚠️ Falta el nom a '+sinNom+(sinNom>1?' files':' fila')+' amb dades. Posa-hi el nom o passa a «Per ordre dels alumnes».';}
    },true));
    _st(()=>{const f=rows[0]&&rows[0]._c[modeNoms?0:1];if(f)f.focus();},120);
  }

  function o1(){tM();dC(function(text){if(!text.trim())return;let noms=modeNoms;let ent=noms?parseNoms(text):null;let cm=noms?[]:text.split("\n");let i=0;let tot=noms?"":" / "+cm.length;let prog=cP("Comentaris: 0"+tot);function run(){if(aturat){acaba(prog,"Aturat · "+i+" alumnes processats",ent);return;}if(!noms&&i>=cm.length){sP(prog,"Tots els comentaris processats! ✓");return;}sP(prog,"Comentaris: "+(i+1)+tot);let oB=_q("a[data-ng-click='showCommentsModal()']");if(!oB){_st(run,500);return;}oB.click();let wM=setInterval(function(){if(aturat){clearInterval(wM);acaba(prog,"Aturat · "+i+" alumnes processats",ent);return;}let ta=_q("textarea[data-ng-model='comentariGeneral.comentari']");let sC=_q("a[data-ng-click='saveComentariGeneral()']");if(ta&&sC){clearInterval(wM);let c=(noms?textAlumne(ent,i):(cm[i]||"")).trim();if(c!==""){ta.value=c;ta.dispatchEvent(new InputEvent("input",{bubbles:true}));sC.click();}_st(function(){let sG=_q("a[data-ng-click='saveNotesAvaluacio()']");if(sG)sG.click();let wS=setInterval(function(){if(aturat){clearInterval(wS);acaba(prog,"Aturat · "+i+" alumnes processats",ent);return;}let alerts=_qa(".alert-success");let found=false;alerts.forEach(function(a){if(a.innerText.toLowerCase().includes("desat"))found=true;});if(found){clearInterval(wS);let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");if(!next||next.disabled){acaba(prog,"Tots els comentaris processats! ✓",ent);return;}angular.element(next).triggerHandler('click');i++;_st(run,7000);}},500);},2000);}},200);}if(noms)iniciaNoms([ent],run,()=>prog.remove());else run();});}

  // ── FUNCIÓ: NOMÉS TREBALL DE SÍNTESI ──
  function oTS(){tM();dTS(function(text){if(!text.trim())return;let noms=modeNoms;let ent=noms?parseNoms(text):null;let ts=noms?[]:text.split("\n");let i=0;let tot=noms?"":" / "+ts.length;let prog=cP("TS: 0"+tot);
  function esperaTS(cb){
    let lVal=null,sT=0;
    let int=setInterval(()=>{if(aturat){clearInterval(int);acaba(prog,"Aturat · "+i+" alumnes processats",ent);return;}
      const sel=gTSSelect();
      if(sel){const v=sel.value;if(v===lVal){sT+=100;if(sT>=400){clearInterval(int);cb();}}else{sT=0;lVal=v;}}
      else{sT=0;lVal=null;}
    },100);}
  function run(){if(aturat){acaba(prog,"Aturat · "+i+" alumnes processats",ent);return;}if(!noms&&i>=ts.length){sP(prog,"Treball de Síntesi processat! ✓");return;}sP(prog,"TS: "+(i+1)+tot);
  esperaTS(()=>{posarTS(noms?textAlumne(ent,i):ts[i]);
  let sG=_q("a[data-ng-click='saveNotesAvaluacio()']");if(sG)sG.click();
  let wS=setInterval(function(){if(aturat){clearInterval(wS);acaba(prog,"Aturat · "+i+" alumnes processats",ent);return;}let alerts=_qa(".alert-success");let found=false;alerts.forEach(function(a){if(a.innerText.toLowerCase().includes("desat"))found=true;});if(found){clearInterval(wS);let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");if(!next||next.hasAttribute("disabled")){acaba(prog,"Treball de Síntesi processat! ✓",ent);return;}angular.element(next).triggerHandler('click');i++;if(noms)_st(run,7000);else run();}},500);});}if(noms)iniciaNoms([ent],run,()=>prog.remove());else run();});}

  // ── FUNCIÓ: COMENTARIS + TREBALL DE SÍNTESI ──
  function o4(){tM();dCTS(function(textC,textT){if(!textC.trim()&&!textT.trim())return;let noms=modeNoms;let entC=noms?parseNoms(textC):null;let entT=noms?parseNoms(textT):null;let ents=noms?entC.concat(entT):null;let cm=noms?[]:textC.split("\n");let ts=noms?[]:textT.split("\n");let i=0;let total=Math.max(cm.length,ts.length);let tot=noms?"":" / "+total;let prog=cP("Processant: 0"+tot);
  function run(){if(aturat){acaba(prog,"Aturat · "+i+" alumnes processats",ents);return;}if(!noms&&i>=total){sP(prog,"Tot processat! ✓");return;}sP(prog,"Processant: "+(i+1)+tot);
  posarTS(noms?textAlumne(entT,i):(ts[i]||''));
  let c=(noms?textAlumne(entC,i):(cm[i]||"")).trim();
  if(c!==""){let oB=_q("a[data-ng-click='showCommentsModal()']");if(!oB){_st(run,500);return;}oB.click();let wM=setInterval(function(){if(aturat){clearInterval(wM);acaba(prog,"Aturat · "+i+" alumnes processats",ents);return;}let ta=_q("textarea[data-ng-model='comentariGeneral.comentari']");let sC=_q("a[data-ng-click='saveComentariGeneral()']");if(ta&&sC){clearInterval(wM);ta.value=c;ta.dispatchEvent(new InputEvent("input",{bubbles:true}));sC.click();dP();}},200);}else{dP();}
  function dP(){_st(function(){let sG=_q("a[data-ng-click='saveNotesAvaluacio()']");if(sG)sG.click();let wS=setInterval(function(){if(aturat){clearInterval(wS);acaba(prog,"Aturat · "+i+" alumnes processats",ents);return;}let alerts=_qa(".alert-success");let found=false;alerts.forEach(function(a){if(a.innerText.toLowerCase().includes("desat"))found=true;});if(found){clearInterval(wS);let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");if(!next||next.hasAttribute("disabled")){acaba(prog,"Tot processat! ✓",ents);return;}angular.element(next).triggerHandler('click');i++;_st(run,7000);}},500);},2000);}}if(noms)iniciaNoms([entC,entT].filter(l=>l&&l.length),run,()=>prog.remove());else run();});}

  // ── FUNCIÓ: CONSELL ORIENTADOR ──
  function oCO(){
    tM();
    dCO(function(text){
      if(!text.trim())return;
      let noms=modeNoms;let ent=noms?parseNoms(text):null;
      let co=noms?[]:text.split("\n");
      let i=0;
      let tot=noms?"":" / "+co.length;
      let prog=cP("Consell orientador: 0"+tot);

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
        if(aturat){acaba(prog,"Aturat · "+i+" alumnes processats",ent);return;}
        if(!noms&&i>=co.length){acaba(prog,"Consell orientador processat! ✓",ent);return;}
        sP(prog,"Consell orientador: "+(i+1)+tot);

        asseguraResumObert(function(ta){
          if(!ta){
            // No s'ha pogut obrir el resum, passem al següent
            i++;
            _st(run,500);
            return;
          }

          const c=(noms?textAlumne(ent,i):(co[i]||"")).trim();

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
            let wS=setInterval(function(){if(aturat){clearInterval(wS);acaba(prog,"Aturat · "+i+" alumnes processats",ent);return;}
              let alerts=_qa(".alert-success");
              let found=false;
              alerts.forEach(function(a){if(a.innerText.toLowerCase().includes("desat"))found=true;});
              if(found){
                clearInterval(wS);
                let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");
                if(!next||next.hasAttribute("disabled")){
                  acaba(prog,"Consell orientador processat! ✓",ent);
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
      if(noms)iniciaNoms([ent],run,()=>prog.remove());else run();
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

  function acabar(){sP(prog,aturat?"Aturat · resum parcial":"Processament complet! ✓");mR(total,mm,sm,al);}
  function loop(){eE(()=>{pr();if(!aturat&&sg()){_st(loop,150);}else{acabar();}});}loop();}

  function o3(){tM();dC(function(text){if(!text.trim())return;let noms=modeNoms;let ent=noms?parseNoms(text):null;let cm=noms?[]:text.split("\n");let i=0;let tot=noms?"":" / "+cm.length;let total=0,mm={},sm={},al=[];let prog=cP("Processant: 0"+tot);

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

  function aA(){acaba(prog,aturat?"Aturat · resum parcial":"Tot processat! ✓",ent);mR(total,mm,sm,al);}
  function dP(last){_st(function(){let sG=_q("a[data-ng-click='saveNotesAvaluacio()']");if(sG)sG.click();let wS=setInterval(function(){let alerts=_qa(".alert-success");let found=false;alerts.forEach(function(a){if(a.innerText.toLowerCase().includes("desat"))found=true;});if(found){clearInterval(wS);if(last||aturat){aA();return;}let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");if(!next||next.hasAttribute("disabled")){aA();return;}angular.element(next).triggerHandler('click');i++;_st(rC,7000);}},500);},2000);}
  function eC(last,c0){let c=c0!==undefined?c0:(noms?textAlumne(ent,i):(cm[i]||"")).trim();if(c===""){dP(last);return;}let oB=_q("a[data-ng-click='showCommentsModal()']");if(!oB){_st(()=>eC(last,c),500);return;}oB.click();let wM=setInterval(function(){let ta=_q("textarea[data-ng-model='comentariGeneral.comentari']");let sC=_q("a[data-ng-click='saveComentariGeneral()']");if(ta&&sC){clearInterval(wM);ta.value=c;ta.dispatchEvent(new InputEvent("input",{bubbles:true}));sC.click();dP(last);}},200);}
  function rC(){if(aturat){aA();return;}sP(prog,"Processant: "+(i+1)+tot);eE(()=>{pD();let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");let isLast=!next||next.hasAttribute("disabled");eC(isLast);});}if(noms)iniciaNoms([ent],rC,()=>prog.remove());else rC();});}

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
})();
