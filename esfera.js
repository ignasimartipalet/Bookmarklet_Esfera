}else if(isBATX){
  if(_id('esfera-overlay-batx'))return;
  const ov=_c('div');ov.id='esfera-overlay-batx';ov.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.45);z-index:99999;display:flex;align-items:center;justify-content:center;';
  const md=_c('div');md.style.cssText='background:#fff;border-radius:12px;padding:24px;width:420px;max-width:90vw;max-height:85vh;overflow-y:auto;font-family:sans-serif;color:#111;box-sizing:border-box;';
  function close(){ov.remove();}
  ov.addEventListener('click',e=>{if(e.target===ov)close();});

  const CTX='Avaluació final Batxillerat';

  // ── FILES VÀLIDES ──────────────────────────────────────────────────────────
  function gR(){
    return Array.from(_qa('#my-tab-content tbody tr')).filter(r=>{
      const inp=r.querySelector('input[name="qualitativa"]');
      const gris=r.querySelector('.cursiva');
      return inp&&!inp.disabled&&!gris;
    });
  }
  function gN(row){
    const parts=['td:nth-child(2)','td:nth-child(3)','td:nth-child(4)']
      .map(s=>row.querySelector(s)).map(t=>t?t.textContent.trim():'').filter(Boolean);
    return parts.join(' ');
  }
  function rN(row){const inp=row.querySelector('input[name="qualitativa"]');return inp&&inp.value.trim()!=='';}
  function hasComment(row){const btn=row.querySelector('a.glyphicon.glyphicon-new-window');return btn&&!btn.classList.contains('emptyIcon');}
  function hN(){return gR().some(rN);}
  function hC(){return gR().some(hasComment);}

  // ── APLICA NOTES (via scope Angular, amb fallback DOM) ─────────────────────
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

  // ── APLICA COMENTARIS (modal seqüencial) ───────────────────────────────────
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

  // ── HELPERS UI ─────────────────────────────────────────────────────────────
  const clrs={notes:'#4e7f4e',comentaris:'#3d6b9e',ambdos:'#7a4e9e'};
  const lbls={notes:'Aplicar notes',comentaris:'Aplicar comentaris',ambdos:'Aplicar notes i comentaris'};
  function mkBtn(txt,bg,fn){const b=_c('button');b.textContent=txt;b.style.cssText=`display:block;width:100%;padding:12px 16px;margin-bottom:8px;border:none;border-radius:8px;background:${bg};color:#fff;font-size:14px;font-weight:500;cursor:pointer;text-align:left;`;b.onclick=fn;return b;}
  function mkCancel(txt,fn){const b=_c('button');b.textContent=txt||'Cancel·lar';b.style.cssText='width:100%;padding:9px;border:1px solid #ccc;border-radius:8px;background:transparent;font-size:13px;cursor:pointer;color:#666;margin-top:4px;';b.onclick=fn||close;return b;}
  function mkBack(fn){const b=_c('button');b.textContent='← Tornar';b.style.cssText='background:none;border:none;color:#666;font-size:13px;cursor:pointer;padding:0;margin-bottom:16px;display:block;';b.onclick=fn;return b;}
  function mkLbl(txt){const l=_c('label');l.textContent=txt;l.style.cssText='display:block;font-weight:500;font-size:13px;color:#555;margin-bottom:4px;';return l;}
  function mkTA(ph){const t=_c('textarea');t.placeholder=ph;t.style.cssText='width:100%;height:80px;box-sizing:border-box;border:1px solid #ccc;border-radius:6px;padding:6px 8px;font-size:12px;font-family:monospace;margin-bottom:12px;resize:vertical;';return t;}
  function mkCtx(){const b=_c('div');b.textContent=CTX;b.style.cssText='display:inline-block;background:#f0f4ff;color:#3d6b9e;border:1px solid #c5d5f0;border-radius:20px;padding:3px 10px;font-size:11px;font-weight:500;margin-bottom:14px;';return b;}

  // ── PANTALLES ──────────────────────────────────────────────────────────────
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
    md.innerHTML='';md.ap(mkCtx());
    md.ap(mkBack(()=>idx2===null?sSc(mode,wM):sPk(mode,wM)));
    let nTA=null,cTA=null;
    if(mode==='notes'||mode==='ambdos'){md.ap(mkLbl('Notes (una per línia, en el mateix ordre que la taula)'));nTA=mkTA('10\n7\n5\n...');md.ap(nTA);}
    if(mode==='comentaris'||mode==='ambdos'){md.ap(mkLbl('Comentaris (un per línia)'));cTA=mkTA('Comentari alumne 1\nComentari alumne 2\n...');md.ap(cTA);}
    const ap=_c('button');ap.textContent=lbls[mode];ap.style.cssText=`width:100%;padding:11px;border:none;border-radius:8px;background:${clrs[mode]};color:#fff;font-size:14px;font-weight:500;cursor:pointer;`;
    ap.onclick=()=>{const skN=nTA?aN(nTA.value,idx2,wM):[];if(cTA){aC(cTA.value,idx2,wM,skC=>sS(skN,skC));}else{sS(skN,[]);}};
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
    md.ap(mkBtn('No sobreescriure els que ja en tenen','#e67e22',()=>sSc(mode,'skip')));
    md.ap(mkCancel('Cancel·lar',close));
  }
  function cAS(mode){
    const nWarn=(mode==='notes'||mode==='ambdos')&&hN();
    const cWarn=(mode==='comentaris'||mode==='ambdos')&&hC();
    const parts=[];if(nWarn)parts.push('notes');if(cWarn)parts.push('comentaris');
    if(parts.length){sW(`Ja hi ha ${parts.join(' i ')} introduïts.`,mode);}else{sSc(mode,'overwrite');}
  }
  function sCh(){
    md.innerHTML='';md.ap(mkCtx());
    const h=_c('p');h.style.cssText='font-weight:500;font-size:16px;margin:0 0 16px;';h.textContent='Què vols fer?';md.ap(h);
    md.ap(mkBtn('Posar notes','#4e7f4e',()=>cAS('notes')));
    md.ap(mkBtn('Posar comentaris','#3d6b9e',()=>cAS('comentaris')));
    md.ap(mkBtn('Posar notes i comentaris','#7a4e9e',()=>cAS('ambdos')));
    md.ap(mkCancel());
    const cr=_c('p');cr.textContent='© 2026 Ignasi Martí Palet';cr.style.cssText='font-size:11px;color:#9ca3af;text-align:center;margin-top:14px;margin-bottom:0';md.ap(cr);
  }
  sCh();ov.ap(md);_ba(ov);

}else{
