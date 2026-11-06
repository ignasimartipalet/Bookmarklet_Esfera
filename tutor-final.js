/* © 2026 Ignasi Martí Palet — Comentaris de tutor / Consell orientador (avaluació final) */
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
    +'<p style="'+F+'margin:0;font-size:13px;color:#9ca3af">Enganxa els textos a la graella (un per alumne)</p>'
    +'</div>'
    +avisHTML
    +'<div id="litBar" style="display:flex;gap:8px;align-items:center;justify-content:space-between;margin-bottom:8px"></div>'
    +'<div id="litGrid" style="border:1.5px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:6px"></div>'
    +'<p id="litHint" style="'+F+'margin:0 0 8px;font-size:11px;color:#9ca3af;line-height:1.5"></p>'
    +'<div id="litInfo" style="'+F+'font-size:12px;color:#9ca3af;min-height:18px;margin-bottom:14px"></div>'
    +'<div style="display:flex;gap:10px">'
    +'<button id="litCancel" style="'+F+'flex:1;padding:13px;font-size:14px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#9ca3af;cursor:pointer">Cancel·lar</button>'
    +'<button id="litOk" style="'+F+'flex:2;padding:13px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Aplicar '+titol.toLowerCase()+' →</button>'
    +'</div>'
    +'<button id="litInfoBtn" style="'+F+'width:100%;margin-top:10px;padding:9px;font-size:13px;font-weight:500;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#6b7280;cursor:pointer">ℹ️ Com funciona</button>'
    +'<p style="font-size:11px;color:#9ca3af;text-align:center;margin-top:14px;margin-bottom:0">© 2026 Ignasi Martí Palet</p>'
    +'</div>';

  const ov=cO(litMainHTML,o=>_rm(o));
  if(ov.firstElementChild)ov.firstElementChild.style.maxWidth='min(92vw,640px)';

  function sInfoLIT(){
    const box=ov.firstElementChild;
    if(!box)return;
    const sec=(tit,items)=>'<div style="'+F+'margin-bottom:16px"><p style="'+F+'font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px">'+tit+'</p><div style="border-radius:10px;overflow:hidden;border:1px solid #f0f0f0">'+items.map((it,i)=>'<div style="'+F+'padding:9px 14px;font-size:13px;color:#374151;line-height:1.5'+(i>0?';border-top:1px solid #f3f4f6':'')+'">'+it+'</div>').join('')+'</div></div>';
    box.innerHTML='<div style="'+F+'max-height:70vh;overflow-y:auto">'
      +'<button id="litInfoBack" style="'+F+'background:none;border:none;color:#6b7280;font-size:13px;cursor:pointer;padding:0;margin-bottom:16px;display:block">← Tornar</button>'
      +'<h2 style="'+F+'margin:0 0 18px;font-size:18px;font-weight:700;color:#0f0f1a">ℹ️ Com funciona</h2>'
      +sec(titol,['📋 Enganxa els textos a la <strong>graella</strong> (directament des d\'Excel o Sheets), una fila per alumne. Pots enganxar des de qualsevol cel·la: s\'omple cap avall.','↵ Si copies des d\'Excel o Sheets, una cel·la amb salts de línia o cometes es llegeix com un sol text.','⬜ Per saltar-te un alumne, deixa la fila corresponent <strong>buida</strong>.'])+sec('Mode de la graella',['📋 <strong>Per ordre de la taula</strong>: la fila 1 és el primer alumne de la pantalla, la 2 el segon, etc. Els noms en gris només són de referència.','👤 <strong>Amb noms</strong>: escrius o enganxes el nom de l\'alumne i el text, en qualsevol ordre. Si cliques un nom gris, hi escrius o hi enganxes noms, passa sol a aquest mode.','🟢 Verd: el nom coincideix amb un alumne · 🔴 vermell: no es troba, o ja té una altra fila · només s\'aplicaran els verds.','🔤 Si l\'alumne té dos noms a Esfer@ i tu en tens un, també el reconeix.','🗑 <strong>Esborrar tot</strong> buida el que has escrit.','⚠️ Al final t\'avisa dels noms que no s\'han trobat.'])
      +'</div>';
    _st(()=>{const b=_id('litInfoBack');if(b)b.onclick=()=>{box.innerHTML=litMainHTML;_st(bindLIT,50);};},50);
  }

  // ── MODE AMB NOMS ──
  const PARAULES_BUIDES=['de','del','la','el','els','les','dels','i'];
  const escH=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function normNom(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w&&PARAULES_BUIDES.indexOf(w)<0);}
  function parseNoms(text){
    return text.split('\n').map(l=>l.replace(/\r$/,'')).filter(l=>l.trim()!=='').map(l=>{
      const p=l.indexOf('\t');const nom=(p<0?l:l.slice(0,p)).trim();
      return {nom:nom,resta:(p<0?'':l.slice(p+1)).replace(/\t+/g,' ').trim(),t:normNom(nom),usat:false};
    });
  }
  function assignaNoms(files,entrades){
    const res=files.map(()=>null);
    const lliure=e=>!e.usat;
    const clau=a=>a.slice().sort().join(' ');
    files.forEach((f,k)=>{const key=clau(f.S.concat(f.N));const m=entrades.find(e=>lliure(e)&&clau(e.t)===key);if(m){m.usat=true;res[k]=m;}});
    function resol(parelles){
      parelles.sort((a,b)=>a.d-b.d);
      parelles.forEach(x=>{
        if(res[x.k]||x.e.usat)return;
        const riv=parelles.filter(y=>y!==x&&!res[y.k]&&!y.e.usat&&(y.k===x.k||y.e===x.e)&&y.d<=x.d);
        if(riv.length){x.e.amb=true;return;}
        x.e.usat=true;res[x.k]=x.e;
      });
    }
    const p3=[];
    files.forEach((f,k)=>{
      if(res[k])return;
      const rt=f.S.concat(f.N);
      entrades.forEach(e=>{
        if(!lliure(e)||e.t.length<2||rt.length<2)return;
        if(e.t.every(t=>rt.includes(t))||rt.every(t=>e.t.includes(t)))p3.push({k:k,e:e,d:Math.abs(rt.length-e.t.length)});
      });
    });
    resol(p3);
    return res;
  }
  // Contenidor d'un alumne: l'ancestre més gran que només té els textareas d'aquest alumne
  function contenidor(ta){
    let best=ta.parentElement,el=ta;
    while(el.parentElement&&el.parentElement!==document.body){
      el=el.parentElement;
      if(el.querySelectorAll('textarea').length>2)break;
      best=el;
    }
    return best;
  }
  function textFila(ta){
    const c=contenidor(ta).cloneNode(true);
    c.querySelectorAll('textarea,input,select,button,script,style,option').forEach(n=>n.remove());
    return c.textContent||'';
  }
  function alineaLIT(text,textareas){
    const entrades=parseNoms(text);
    if(!entrades.length)return {error:'Enganxa almenys una línia amb nom i text'};
    const files=textareas.map(t=>({S:[],N:normNom(textFila(t))}));
    const llegibles=files.filter(f=>f.N.length>=2).length;
    if(llegibles<Math.ceil(files.length/2))return {error:'No he pogut llegir els noms dels alumnes en aquesta pantalla. Fes servir el mode normal.'};
    const asg=assignaNoms(files,entrades);
    return {textes:asg.map(e=>e?e.resta:''),avisos:entrades.filter(e=>!e.usat).map(e=>e.nom+(e.amb?' (coincideix amb més d\'un alumne)':''))};
  }
  function posaText(taEl,text){
    try{
      const scope=angular.element(taEl).scope();const model=taEl.getAttribute('data-ng-model')||taEl.getAttribute('ng-model');
      if(scope&&model){const parts=model.split('.');let obj=scope;for(let j=0;j<parts.length-1;j++)obj=obj[parts[j]];obj[parts[parts.length-1]]=text;scope.$apply();return;}
    }catch(e){}
    taEl.value=text;taEl.dispatchEvent(new Event('input',{bubbles:true}));taEl.dispatchEvent(new Event('change',{bubbles:true}));
  }

  function bindLIT(){
    const bar=_id('litBar'),gridEl=_id('litGrid'),hint=_id('litHint');
    const info=_id('litInfo');
    const ok=_id('litOk');
    const cancel=_id('litCancel');
    const ib=_id('litInfoBtn');
    const pillsTA=()=>Array.from(document.querySelectorAll('textarea')).filter((_,i)=>esGeneral?i%2===1:i%2===0);

    if(gridEl&&bar){
      const tgTA=pillsTA();
      const nomsTaula=tgTA.map(t=>{try{return textFila(t).replace(/\s+/g,' ').trim();}catch(e){return '';}});
      let modeNoms=false;
      const RC='display:grid;grid-template-columns:34px 1.6fr 2.4fr;';
      // Barra: selector de mode + Esborrar tot
      const seg=_c('div');seg.style.cssText='display:flex;border:1.5px solid #e5e7eb;border-radius:8px;overflow:hidden;';
      const bOrd=_c('button'),bNom=_c('button');
      bOrd.textContent='📋 Per ordre de la taula';bNom.textContent='👤 Amb noms';
      [bOrd,bNom].forEach(b=>{b.style.cssText=F+'padding:7px 12px;font-size:12px;font-weight:500;border:none;cursor:pointer;';seg.ap(b);});
      const clr=_c('button');clr.textContent='🗑 Esborrar tot';clr.style.cssText=F+'padding:7px 12px;font-size:12px;font-weight:500;border:1.5px solid #e5e7eb;border-radius:8px;background:#fff;color:#c0392b;cursor:pointer;';
      bar.ap(seg);bar.ap(clr);
      // Capçalera i cos
      const gHead=_c('div');gHead.style.cssText=F+RC+'background:#f9fafb;border-bottom:1px solid #e5e7eb;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;';
      let hNom=null;
      ['',' ',esGeneral?'Comentari':'Consell'].forEach((t,ix)=>{const h=_c('div');h.textContent=t;h.style.cssText='padding:8px 10px;'+(ix?'border-left:1px solid #f0f0f0;':'');if(ix===1)hNom=h;gHead.ap(h);});
      const gBody=_c('div');gBody.style.cssText='max-height:240px;overflow-y:auto;';
      gridEl.ap(gHead);gridEl.ap(gBody);
      const rows=[];
      const cellsOf=tr=>Array.from(tr.querySelectorAll('input'));
      function focusCell(r,c){while(rows.length<=r)addRow();const i=cellsOf(rows[r])[c];if(i){i.focus();if(!i.readOnly)i.select();}}
      // Cel·la del nom: bloquejada (gris, nom de la pantalla) en mode ordre; buida i editable en mode noms
      function nomStyle(inp,r){
        if(modeNoms){inp.value='';inp.readOnly=false;inp.style.color='#0f0f1a';inp.style.fontStyle='normal';inp.style.cursor='text';inp.style.background='transparent';inp.title='';}
        else{inp.value=nomsTaula[r]||'';inp.readOnly=true;inp.style.color='#9ca3af';inp.style.fontStyle='italic';inp.style.cursor='pointer';inp.style.background='#f9fafb';inp.title='Alumne de la pantalla (ordre). Clica per escriure els noms tu mateix.';}
      }
      function aplicaMode(){
        bOrd.style.background=modeNoms?'#fff':'#0f0f1a';bOrd.style.color=modeNoms?'#6b7280':'#fff';
        bNom.style.background=modeNoms?'#0f0f1a':'#fff';bNom.style.color=modeNoms?'#fff':'#6b7280';
        if(hNom)hNom.textContent=modeNoms?'Nom alumne · escriu o enganxa':'Alumne de la pantalla (ordre)';
        if(hint)hint.textContent=modeNoms?"💡 Escriu o enganxa el nom i el text (des d'Excel o Sheets, cap a la dreta i cap avall). Cada alumne s'identifica pel nom, en qualsevol ordre. Verd: trobat · vermell: no es troba.":"💡 Enganxa els textos des d'Excel o Sheets: la fila 1 és el primer alumne de la pantalla, la 2 el segon, etc. (els noms en gris només són de referència). Si prefereixes escriure els noms, prem «Amb noms».";
        rows.forEach((tr,r)=>nomStyle(cellsOf(tr)[0],r));
        gSync();
      }
      function netejaAvis(){if(info){info.style.color='#9ca3af';}}
      function setMode(m){
        if(m===modeNoms)return;
        if(!m&&llegeix().some(o=>o.nom)&&!window.confirm('Si passes a «Per ordre de la taula», s\'esborren els noms que has escrit. Vols continuar?'))return;
        modeNoms=m;aplicaMode();netejaAvis();
      }
      bOrd.onclick=()=>setMode(false);bNom.onclick=()=>setMode(true);
      function addRow(){
        const r=rows.length;
        const tr=_c('div');tr.style.cssText=RC+(r?'border-top:1px solid #f0f0f0;':'');
        const n=_c('div');n.textContent=r+1;n.style.cssText=F+'font-size:11px;color:#9ca3af;display:flex;align-items:center;justify-content:center;background:#fafafa;';tr.ap(n);
        [0,1].forEach(ci=>{
          const inp=_c('input');inp.type='text';inp.spellcheck=false;inp.autocomplete='off';inp.dataset.c=ci;
          inp.style.cssText=F+'border:none;border-left:1px solid #f0f0f0;padding:8px 10px;font-size:13px;color:#0f0f1a;outline:none;background:transparent;min-width:0;width:100%;';
          if(ci===0)nomStyle(inp,r);
          inp.addEventListener('input',()=>{gSync();netejaAvis();});
          inp.addEventListener('paste',gPaste);
          if(ci===0)inp.addEventListener('mousedown',e=>{if(!modeNoms){e.preventDefault();setMode(true);focusCell(rows.indexOf(tr),0);}});
          inp.addEventListener('keydown',e=>{
            const rr=rows.indexOf(tr);
            if(e.key==='Enter'||e.key==='ArrowDown'){e.preventDefault();focusCell(rr+1,ci);}
            else if(e.key==='ArrowUp'&&rr>0){e.preventDefault();focusCell(rr-1,ci);}
            else if(ci===0&&!modeNoms&&e.key.length===1&&!e.ctrlKey&&!e.metaKey){setMode(true);}
          });
          tr.ap(inp);
        });
        gBody.ap(tr);rows.push(tr);
      }
      function gPaste(e){
        const txt=(e.clipboardData||window.clipboardData).getData('text');
        const bloc=!modeNoms&&+e.target.dataset.c===0;
        if(!/[\t\n\r]/.test(txt)&&!bloc)return;
        e.preventDefault();
        if(bloc)setMode(true);
        const r0=rows.indexOf(e.target.parentNode),c0=+e.target.dataset.c;
        const data=netejaExcel(txt).split('\n').map(l=>l.split('\t'));
        while(data.length&&data[data.length-1].every(x=>!x.trim()))data.pop();
        let perdudes=false;
        data.forEach((pp,i)=>{
          while(rows.length<=r0+i)addRow();
          const ins=cellsOf(rows[r0+i]);
          pp.forEach((v,j)=>{
            if(c0+j>1){if(v.trim())perdudes=true;return;}
            ins[c0+j].value=v.trim();
          });
        });
        gSync();netejaAvis();
        if(perdudes&&info)info.textContent='ℹ️ Hi havia més columnes de les que caben des d\'aquesta cel·la: les sobrants s\'han ignorat.';
      }
      // Lectura de la graella: [{nom,text}] (en mode ordre el nom bloquejat no compta)
      function llegeix(){return rows.map(tr=>{const v=cellsOf(tr).map(x=>x.value.replace(/[\t\r\n]+/g,' ').trim());return {nom:modeNoms?(v[0]||''):'',text:v[1]||''};});}
      const teDades=o=>!!(o.nom||o.text);
      function gSync(){
        let blank=0;
        for(let i=rows.length-1;i>=0;i--){const cs=cellsOf(rows[i]);if(!cs[1].value.trim()&&(!modeNoms||!cs[0].value.trim()))blank++;else break;}
        while(blank<2){addRow();blank++;}
        gColors();
      }
      // Colors del nom (mode noms): mateix criteri que en aplicar (assignaNoms)
      function gColors(){
        const L=llegeix(),k=L.filter(teDades).length;
        if(!modeNoms){
          rows.forEach(tr=>{const c0=cellsOf(tr)[0];c0.style.background='#f9fafb';c0.style.boxShadow='none';});
          if(info&&info.style.color==='rgb(156, 163, 175)'||info&&info.style.color==='#9ca3af')info.textContent=k?'Per ordre de la taula · '+k+(k>1?' files':' fila')+' amb dades':'';
          return;
        }
        const idxNoms=[];L.forEach((o,i)=>{if(o.nom)idxNoms.push(i);});
        let estats=[];
        if(idxNoms.length){
          try{
            const entrades=idxNoms.map(i=>({nom:L[i].nom,t:normNom(L[i].nom),usat:false}));
            const files=pillsTA().map(t=>({S:[],N:normNom(textFila(t))}));
            assignaNoms(files,entrades);
            estats=entrades.map(e=>e.usat?'ok':(e.amb?'amb':'no'));
          }catch(e){estats=[];}
        }
        const COL={ok:['#dcfce7','Coincideix amb un alumne de la pantalla'],no:['#fee2e2','No coincideix amb cap alumne de la pantalla'],amb:['#fee2e2','Coincideix amb més d\'un alumne: afegeix-hi més cognoms']};
        let sn=0,nOk=0,nNo=0;
        L.forEach((o,i)=>{
          const c0=cellsOf(rows[i])[0];
          const falta=!o.nom&&o.text;if(falta)sn++;
          const kk=idxNoms.indexOf(i),st=kk>=0?estats[kk]:null;
          if(st==='ok')nOk++;else if(st)nNo++;
          c0.style.background=st&&COL[st]?COL[st][0]:'transparent';
          c0.title=st&&COL[st]?COL[st][1]:'';
          c0.style.boxShadow=falta?'inset 0 0 0 2px #fca5a5':'none';
        });
        if(info&&(info.style.color==='rgb(156, 163, 175)'||info.style.color==='#9ca3af'))info.textContent=k?'Mode amb noms · '+(nOk?'🟢 '+nOk+' trobat'+(nOk>1?'s':'')+'  ':'')+(nNo?'🔴 '+nNo+' no trobat'+(nNo>1?'s':'')+'  ':'')+(sn?'⚠️ '+sn+' sense nom':''):'';
      }
      const nRows0=Math.max(6,tgTA.length+2);
      for(let i=0;i<nRows0;i++)addRow();
      aplicaMode();
      clr.onclick=()=>{rows.forEach(tr=>cellsOf(tr).forEach((x,ci)=>{if(ci===0&&!modeNoms)return;x.value='';}));if(info){info.style.color='#9ca3af';info.textContent='';}gSync();};
      // exposa la lectura per al botó d'aplicar
      gridEl._llegeix=llegeix;gridEl._mode=()=>modeNoms;
    }

    if(cancel)cancel.onclick=()=>{if(ov.parentNode)_rm(ov);};
    if(ib)ib.onclick=sInfoLIT;

    if(ok)ok.onclick=()=>{
      if(!gridEl||!gridEl._llegeix)return;
      const textareas=pillsTA();
      const L=gridEl._llegeix(),amb=gridEl._mode();
      let textes,avisos=[];
      info.style.color='#dc2626';
      if(amb){
        const fSN=[];L.forEach((o,i)=>{if(!o.nom&&o.text)fSN.push(i+1);});
        if(fSN.length){info.textContent='⚠️ Falta el nom a '+(fSN.length>1?'les files ':'la fila ')+fSN.join(', ')+'. Posa el nom a totes les files amb text, o passa a «Per ordre de la taula».';return;}
        const text=L.filter(o=>o.nom&&o.text).map(o=>o.nom+'\t'+o.text).join('\n');
        const r=alineaLIT(text,textareas);
        if(r.error){info.textContent='⚠️ '+r.error;return;}
        textes=r.textes;avisos=r.avisos;
      }else{
        textes=L.map(o=>o.text);
        while(textes.length&&textes[textes.length-1]==='')textes.pop();
        if(!textes.length){info.textContent='⚠️ Enganxa almenys un text a la graella';return;}
        const sobra=textes.slice(textareas.length).filter(Boolean);
        if(sobra.length)avisos=sobra.map((t,k)=>'Línia '+(textareas.length+k+1)+' (sobra: no hi ha alumne)');
      }
      info.style.color='#9ca3af';
      let n=0;
      textes.forEach((t,i)=>{if(i<textareas.length&&t){posaText(textareas[i],t);n++;}});
      if(ov.parentNode)_rm(ov);
      const pill=_c('div');
      pill.style.cssText=F+'position:fixed;top:20px;right:20px;padding:12px 20px;background:#0f0f1a;color:#fff;font-size:13px;font-weight:500;border-radius:100px;z-index:999998;box-shadow:0 8px 28px rgba(0,0,0,0.22);display:flex;align-items:center;gap:10px';
      pill.innerHTML='<span style="width:8px;height:8px;border-radius:50%;background:#4ade80;display:inline-block"></span><span>'+n+' alumnes actualitzats ✓</span>';
      _ba(pill);_st(()=>{if(pill.parentNode)_rm(pill);},3000);
      if(avisos.length){
        const ov2=cO('<div style="'+F+'"><h2 style="'+F+'margin:0 0 8px;font-size:19px;font-weight:700;color:#0f0f1a">⚠️ Avisos ('+avisos.length+')</h2><p style="'+F+'margin:0 0 10px;font-size:13px;color:#6b7280;line-height:1.5">No s\'han pogut posar a cap alumne de la pantalla:</p><ul style="'+F+'font-size:13px;margin:0 0 16px;padding-left:18px;line-height:1.8;max-height:200px;overflow-y:auto">'+avisos.map(a=>'<li>'+escH(a)+'</li>').join('')+'</ul><button id="litAvOk" style="'+F+'width:100%;padding:12px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Tancar</button></div>',o=>_rm(o));
        _st(()=>{const bb=_id('litAvOk');if(bb)bb.onclick=()=>{if(ov2.parentNode)_rm(ov2);};},50);
      }
    };
  }
  _st(bindLIT,100);
})();
