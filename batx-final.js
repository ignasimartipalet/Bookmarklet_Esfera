/* © 2026 Ignasi Martí Palet — Notes i comentaris — avaluació final Batxillerat */
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
    const cm=text.split('\n').map(s=>s.replace(/\t+/g,' ').trim());
    const rows=gR();
    const tg=idx2!==null?idx2.map(i=>rows[i]):rows;
    const sk=[];const fails=[];
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
        for(let i=tgStudents.length;i<cm.length;i++){if(cm[i])fails.push('línia '+(i+1)+' (sobra: no hi ha alumne)');}
        if(applied>0){found.$apply();cb(sk,fails);return;}
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

  function aN(text,idx2,wM,rep){
    rep=rep||{err:[],bloc:[],sense:[]};
    const vals=text.split('\n').map(s=>s.trim());
    const rows=gR();
    const tg=idx2!==null?idx2.map(i=>rows[i]):rows;
    const sk=[];
    tg.forEach((row,i)=>{if(row&&(vals[i]||'')===''&&!rN(row))rep.sense.push(gN(row));});
    for(let i=tg.length;i<vals.length;i++){if(vals[i])rep.err.push('línia '+(i+1)+' (sobra: no hi ha alumne)');}
    for(let i=0;i<vals.length&&i<tg.length;i++){
      const row=tg[i];if(!row)continue;
      if(wM==='skip'&&rN(row)){sk.push(gN(row));continue;}
      let v=vals[i];if(v==='')continue;
      if(!notaValida(v)){rep.err.push(gN(row)+' ('+v+')');continue;}
      v=v.replace(',','.');
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

  let _aturat=false;
  function pillAtura(txt){
    _aturat=false;
    const dd=_c('div');dd.setAttribute('data-esfera','1');
    dd.style.cssText='position:fixed;top:20px;right:20px;z-index:999998;background:#0f0f1a;color:#fff;font:500 13px system-ui,sans-serif;padding:10px 14px;border-radius:100px;display:flex;gap:10px;align-items:center;box-shadow:0 8px 28px rgba(0,0,0,.22)';
    const sp=_c('span');sp.textContent=txt;
    const b=_c('button');b.textContent='⏹ Aturar';b.style.cssText='border:none;border-radius:100px;padding:5px 12px;background:#dc2626;color:#fff;font-size:12px;font-weight:600;cursor:pointer;';
    b.onclick=()=>{_aturat=true;b.disabled=true;sp.textContent='Aturant…';};
    dd.ap(sp);dd.ap(b);_ba(dd);
    return {d:dd,sp:sp};
  }

  function aC(text,idx2,wM,cb){
    const cm=text.split('\n').map(s=>s.replace(/\t+/g,' ').trim());
    const rows=gR();
    const tg=idx2!==null?idx2.map(i=>rows[i]):rows;
    const sk=[];const fails=[];
    const tot=Math.min(cm.length,tg.length);
    const pill=pillAtura('Comentaris: 0 / '+tot);
    function fi(){pill.d.remove();cb(sk,fails);}
    function next(i){
      if(_aturat){for(let k=i;k<tot;k++){if(cm[k]&&tg[k])fails.push('(aturat) '+gN(tg[k]));}fi();return;}
      if(i>=tot){fi();return;}
      pill.sp.textContent='Comentaris: '+(i+1)+' / '+tot;
      const row=tg[i];if(!row){next(i+1);return;}
      if(cm[i]===''){next(i+1);return;}
      if(wM==='skip'&&hasComment(row)){sk.push(gN(row));next(i+1);return;}
      const c=cm[i];
      const btn=row.querySelector('a.glyphicon.glyphicon-new-window');
      if(!btn){fails.push(gN(row));next(i+1);return;}
      btn.click();
      _st(()=>{
        const ta=_q('textarea[data-ng-model="commentsToModify.commentsToModifyModal"]');
        const save=_q('a.btn.btn-primary[data-ng-click="modalSave()"]');
        if(!ta||!save){fails.push(gN(row));next(i+1);return;}
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

  // ── MODE AMB NOMS + VALIDACIÓ ──
  const PARAULES_BUIDES=['de','del','la','el','els','les','dels','i'];
  function normNom(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w&&PARAULES_BUIDES.indexOf(w)<0);}
  // Nom complet de la fila: columnes 2, 3 i 4 (1r cognom, 2n cognom, nom)
  function gNomComplet(row){
    const t=[2,3,4].map(i=>{const td=row.querySelector('td:nth-child('+i+')');return td?td.textContent.trim():'';}).filter(Boolean).join(' ');
    return t||gN(row);
  }
  function claveNom(s){return normNom(s).sort().join(' ');}
  function filesObjectiu(idx2){const rows=gR();return idx2!==null?idx2.map(i=>rows[i]):rows;}
  // Assigna cada fila de la taula a una entrada de la llista pel nom (sense ambigüitats).
  // files:[{S:mots dels cognoms, N:mots del nom}] · entrades:[{t:mots, usat:bool}]
  // Passos: 1) mateixos mots · 2) cognoms complets + nom(s), tolerant que falti o sobri un segon nom · 3) últim recurs.
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
    const p2=[];
    files.forEach((f,k)=>{
      if(res[k]||!f.S.length||!f.N.length)return;
      entrades.forEach(e=>{
        if(!lliure(e))return;
        if(!f.S.every(t=>e.t.includes(t)))return;
        const G=e.t.filter(t=>f.S.indexOf(t)<0);
        const inter=G.filter(t=>f.N.includes(t)).length;
        if(!inter)return;
        if(!(G.every(t=>f.N.includes(t))||f.N.every(t=>G.includes(t))))return;
        p2.push({k:k,e:e,d:(G.length-inter)+(f.N.length-inter)});
      });
    });
    resol(p2);
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
  function infoFila(row){const g=i=>{const td=row.querySelector('td:nth-child('+i+')');return td?td.textContent:'';};return {S:normNom(g(2)+' '+g(3)),N:normNom(g(4))};}
  // Converteix línies "Nom<TAB>valor" en línies alineades amb l'ordre de la taula
  function alineaNoms(text,idx2){
    const rows=gR();
    const tg=filesObjectiu(idx2);
    const parsed=text.split('\n').map(l=>l.replace(/\r$/,'')).filter(l=>l.trim()!=='').map(l=>{const p=l.indexOf('\t');return p<0?{nom:l.trim(),resta:'',usat:false}:{nom:l.slice(0,p).trim(),resta:l.slice(p+1).trim(),usat:false};});
    parsed.forEach(p=>{p.t=normNom(p.nom);});
    const asg=assignaNoms(tg.map(infoFila),parsed);
    const res=asg.map(e=>e?e.resta:null);
    const fora=new Set();
    if(idx2!==null){const c2=parsed.map(p=>({t:p.t,usat:false}));assignaNoms(rows.map(infoFila),c2);c2.forEach((c,i)=>{if(c.usat)fora.add(parsed[i]);});}
    const usatsRows=new Set();asg.forEach((e,k)=>{if(e)usatsRows.add(tg[k]);});
    const millorFila=p=>{
      if(!p.t.length)return null;
      let best=null,bs=0,bs2=0;
      rows.forEach(r=>{
        const f=infoFila(r),rt=f.S.concat(f.N);
        const comu=p.t.filter(t=>rt.includes(t)).length;
        const sc=comu/Math.max(1,new Set(p.t.concat(rt)).size)-(usatsRows.has(r)?0.15:0);
        if(sc>bs){bs2=bs;bs=sc;best=r;}else if(sc>bs2)bs2=sc;
      });
      if(!best||bs<0.25)return null;
      const f=infoFila(best),rt=f.S.concat(f.N);
      const cov=p.t.filter(t=>rt.includes(t)).length/p.t.length;
      return {row:best,sc:bs,cov:cov,marge:bs-bs2,falta:rt.filter(t=>p.t.indexOf(t)<0),sobra:p.t.filter(t=>rt.indexOf(t)<0),usat:usatsRows.has(best)};
    };
    const avisos=[],sugs=[];
    parsed.filter(p=>!p.usat&&!fora.has(p)).forEach(p=>{
      const m=millorFila(p);
      const amb=p.amb?' (coincideix amb més d\'un alumne)':'';
      if(m)sugs.push({p:p,row:m.row,sc:m.sc,marcat:m.cov>=0.6&&m.marge>=0.15&&!m.usat,falta:m.falta,sobra:m.sobra,usat:m.usat});
      else avisos.push((p.nom||'(línia buida)')+amb+' → cap alumne de la taula s\'hi assembla');
    });
    const sugSet=new Set(sugs.map(x=>x.p));
    const estats=parsed.map(p=>p.usat?'ok':(fora.has(p)?'fora':(sugSet.has(p)?((sugs.find(x=>x.p===p)||{}).usat?'dup':'sug'):'no')));
    return {text:res.map(x=>x===null?'':x).join('\n'),avisos:avisos,sugs:sugs,trobats:parsed.filter(p=>p.usat).length,estats:estats};
  }
  function notaValida(c){c=(c||'').trim();return c===''||/^\d+([.,]\d+)?$/.test(c);}
  function liniesNoNota(text){
    const mal=[];
    text.split('\n').forEach((l,i)=>{if(l.trim()==='')return;if(l.split('\t').some(c=>!notaValida(c)))mal.push(i);});
    return mal;
  }

  function nomFila(row){return gNomComplet(row);}
  function nrmTxt(s){return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}

  function sS(skN,skC,secs,fix){
    secs=(secs||[]).filter(x=>x.items&&x.items.length);
    const allNames=[...new Set([...skN,...skC])];
    const teFix=!!(fix&&fix.items&&fix.items.length);
    if(!allNames.length&&!secs.length&&!teFix){close();return;}
    md.innerHTML='';md.style.width='420px';
    const ic=_c('div');ic.textContent='⚠';ic.style.cssText='font-size:26px;margin-bottom:8px;';md.ap(ic);
    const h=_c('p');h.style.cssText='font-weight:500;font-size:15px;margin:0 0 10px;';h.textContent='Avisos';md.ap(h);
    const llistes=[];
    if(allNames.length){
      const setN=new Set(skN),setC=new Set(skC),parts=[];
      if(skN.length)parts.push('notes');if(skC.length)parts.push('comentaris');
      llistes.push({t:'Ja tenien '+parts.join(' o ')+' (no s\'han sobreescrit)',items:allNames.map(name=>{const tags=[];if(setN.has(name))tags.push('notes');if(setC.has(name))tags.push('comentaris');return name+' ('+tags.join(', ')+')';})});
    }
    secs.forEach(x=>llistes.push(x));
    llistes.forEach(x=>{
      const sub=_c('p');sub.style.cssText='font-size:13px;font-weight:500;color:#444;margin:0 0 6px;line-height:1.5;';sub.textContent=x.t+' ('+x.items.length+')';md.ap(sub);
      const ul=_c('ul');ul.style.cssText='font-size:13px;margin:0 0 14px;padding-left:18px;line-height:1.8;max-height:160px;overflow-y:auto;';
      x.items.forEach(t=>{const li=_c('li');li.textContent=t;ul.ap(li);});md.ap(ul);
    });
    if(teFix){
      const sub=_c('p');sub.style.cssText='font-size:13px;font-weight:500;color:#444;margin:0 0 6px;line-height:1.5;';sub.textContent='Coincidències probables ('+fix.items.length+')';md.ap(sub);
      const cap=_c('p');cap.style.cssText='font-size:12px;color:#666;margin:0 0 6px;line-height:1.5;';cap.textContent='Les caselles marcades són molt probables. Revisa-les, desmarca les que no ho siguin i prem el botó.';md.ap(cap);
      const bx=_c('div');bx.style.cssText='border:1px solid #eee;border-radius:8px;margin:0 0 10px;max-height:220px;overflow-y:auto;';
      const cbs=[];
      fix.items.forEach(it=>{
        const lb=_c('label');lb.style.cssText='display:flex;gap:8px;align-items:flex-start;padding:7px 10px;border-bottom:1px solid #f5f5f5;font-size:13px;cursor:pointer;line-height:1.4;';
        const cb=_c('input');cb.type='checkbox';cb.checked=!!it.checked;cbs.push(cb);
        const sp=_c('span');sp.textContent=it.txt;
        lb.ap(cb);lb.ap(sp);bx.ap(lb);
      });
      md.ap(bx);
      const fm=_c('div');fm.style.cssText='font-size:12px;color:#c0392b;min-height:16px;margin:0 0 6px;';md.ap(fm);
      const go=_c('button');go.textContent='Aplicar als alumnes marcats';go.style.cssText='width:100%;padding:11px;margin-bottom:10px;border:none;border-radius:8px;background:#7a4e9e;color:#fff;font-size:14px;font-weight:500;cursor:pointer;';
      go.onclick=()=>{const sel=cbs.map((c,i)=>c.checked?i:null).filter(i=>i!==null);if(!sel.length){fm.textContent='⚠️ Marca almenys un alumne';return;}fix.onApply(sel);};
      md.ap(go);
    }
    const ok=_c('button');ok.textContent='Tancar';ok.style.cssText='width:100%;padding:11px;border:none;border-radius:8px;background:#555;color:#fff;font-size:14px;font-weight:500;cursor:pointer;';ok.onclick=close;md.ap(ok);
  }

  function sF(mode,idx2,wM,useNames,prev){
    prev=prev||{n:'',c:''};
    md.innerHTML='';md.style.width='420px';md.ap(mkCtx());if(idx2!==null)md.ap(mkBack(()=>sPk(mode,wM)));
    let confirmat=false,chEl=null;
    md.style.width='min(640px,92vw)';
    const hasN=true,hasC=true;
    const cols=[{k:'nom',t:'Nom alumne',w:'1.6fr'}].concat(hasN?[{k:'nota',t:'Nota',w:'.6fr'}]:[]).concat(hasC?[{k:'com',t:'Comentari',w:'2fr'}]:[]);
    const NC=cols.length;
    const tgR0=filesObjectiu(idx2);
    const RC='display:grid;grid-template-columns:34px '+cols.map(c=>c.w).join(' ')+';';
    let modeNoms=false;
    md.ap(mkLbl(idx2===null?'Notes i comentaris':'Notes i comentaris · '+idx2.length+' alumne'+(idx2.length>1?'s':'')+' seleccionat'+(idx2.length>1?'s':'')));
    // Selector de mode + esborrar
    const barra=_c('div');barra.style.cssText='display:flex;gap:8px;align-items:center;justify-content:space-between;margin-bottom:8px;';
    const seg=_c('div');seg.style.cssText='display:flex;border:1.5px solid #e5e7eb;border-radius:8px;overflow:hidden;';
    const bOrd=_c('button'),bNom=_c('button');
    bOrd.textContent='📋 Per ordre de la taula';bNom.textContent='👤 Amb noms';
    [bOrd,bNom].forEach(b=>{b.style.cssText='padding:7px 12px;font-size:12px;font-weight:500;border:none;cursor:pointer;font-family:inherit;';seg.ap(b);});
    bOrd.onclick=()=>setMode(false);bNom.onclick=()=>setMode(true);
    const clr=_c('button');clr.textContent='🗑 Esborrar tot';clr.style.cssText='padding:7px 12px;font-size:12px;font-weight:500;border:1.5px solid #e5e7eb;border-radius:8px;background:#fff;color:#c0392b;cursor:pointer;font-family:inherit;';
    barra.ap(seg);barra.ap(clr);md.ap(barra);
    const gridWrap=_c('div');gridWrap.style.cssText='border:1.5px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-bottom:6px;';
    const gHead=_c('div');gHead.style.cssText=RC+'background:#f9fafb;border-bottom:1px solid #e5e7eb;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;';
    let hNom=null;
    [''].concat(cols.map(c=>c.t)).forEach((t,ix)=>{const h=_c('div');h.textContent=t;h.style.cssText='padding:8px 10px;'+(ix?'border-left:1px solid #f0f0f0;':'');if(ix===1)hNom=h;gHead.ap(h);});
    const gBody=_c('div');gBody.style.cssText='max-height:240px;overflow-y:auto;';
    gridWrap.ap(gHead);gridWrap.ap(gBody);md.ap(gridWrap);
    const gridRows=[];
    const cellsOf=tr=>Array.from(tr.querySelectorAll('input'));
    const gHint=_c('p');gHint.style.cssText='font-size:11px;color:#9ca3af;margin:0 0 10px;line-height:1.5;';
    md.ap(gHint);
    const gInfo=_c('div');gInfo.style.cssText='font-size:12px;color:#6b7280;min-height:16px;margin:0 0 12px;';md.ap(gInfo);
    function focusCell(r,c){while(gridRows.length<=r)addRow();const i=cellsOf(gridRows[r])[c];if(i){i.focus();if(!i.readOnly)i.select();}}
    // Cel·la del nom: bloquejada (gris, amb el nom de la taula) en mode per ordre; buida i editable en mode amb noms
    function nomStyle(inp,r){
      if(modeNoms){inp.value='';inp.readOnly=false;inp.style.color='#111';inp.style.fontStyle='normal';inp.style.cursor='text';inp.style.background='transparent';inp.title='';}
      else{inp.value=tgR0[r]?nomFila(tgR0[r]):'';inp.readOnly=true;inp.style.color='#9ca3af';inp.style.fontStyle='italic';inp.style.cursor='pointer';inp.style.background='#f9fafb';inp.title='Alumne de la taula (ordre). Clica per escriure els noms tu mateix.';}
    }
    function aplicaMode(){
      bOrd.style.background=modeNoms?'#fff':'#0f0f1a';bOrd.style.color=modeNoms?'#6b7280':'#fff';
      bNom.style.background=modeNoms?'#0f0f1a':'#fff';bNom.style.color=modeNoms?'#fff':'#6b7280';
      if(hNom)hNom.textContent=modeNoms?'Nom alumne · escriu o enganxa':'Alumne de la taula (ordre)';
      gHint.textContent=modeNoms?"💡 Escriu o enganxa el nom, la nota i el comentari (des d'Excel o Sheets, cap a la dreta i cap avall). Cada alumne s'identifica pel nom, en qualsevol ordre. Verd: trobat · groc: semblant · vermell: no es troba.":"💡 Enganxa notes i comentaris des d'Excel o Sheets: la fila 1 és el primer alumne de la taula, la 2 el segon, etc. (els noms en gris només són de referència). Si prefereixes escriure els noms, prem «Amb noms».";
      gridRows.forEach((tr,r)=>nomStyle(cellsOf(tr)[0],r));
      gSync();
    }
    function setMode(m){
      if(m===modeNoms)return;
      if(!m&&gLlegeix().some(o=>o.nom)&&!window.confirm('Si passes a «Per ordre de la taula», s\'esborren els noms que has escrit. Vols continuar?'))return;
      modeNoms=m;aplicaMode();reset();
    }
    function addRow(){
      const r=gridRows.length;
      const tr=_c('div');tr.style.cssText=RC+(r?'border-top:1px solid #f0f0f0;':'');
      const n=_c('div');n.textContent=r+1;n.style.cssText='font-size:11px;color:#9ca3af;display:flex;align-items:center;justify-content:center;background:#fafafa;';tr.ap(n);
      cols.forEach((c,ci)=>{
        const inp=_c('input');inp.type='text';inp.spellcheck=false;inp.autocomplete='off';inp.dataset.c=ci;
        inp.style.cssText='border:none;border-left:1px solid #f0f0f0;padding:8px 10px;font-size:13px;color:#111;outline:none;background:transparent;min-width:0;width:100%;box-sizing:border-box;font-family:inherit;';
        if(ci===0)nomStyle(inp,r);
        inp.addEventListener('input',gSync);
        inp.addEventListener('paste',gPaste);
        if(ci===0)inp.addEventListener('mousedown',e=>{if(!modeNoms){e.preventDefault();setMode(true);focusCell(gridRows.indexOf(tr),0);}});
        inp.addEventListener('keydown',e=>{
          const rr=gridRows.indexOf(tr);
          if(e.key==='Enter'||e.key==='ArrowDown'){e.preventDefault();focusCell(rr+1,ci);}
          else if(e.key==='ArrowUp'&&rr>0){e.preventDefault();focusCell(rr-1,ci);}
          else if(ci===0&&!modeNoms&&e.key.length===1&&!e.ctrlKey&&!e.metaKey){setMode(true);}
        });
        tr.ap(inp);
      });
      gBody.ap(tr);gridRows.push(tr);
    }
    function gPaste(e){
      const txt=(e.clipboardData||window.clipboardData).getData('text');
      const bloc=!modeNoms&&+e.target.dataset.c===0;
      if(!/[\t\n\r]/.test(txt)&&!bloc)return;
      e.preventDefault();
      if(bloc)setMode(true);
      const r0=gridRows.indexOf(e.target.parentNode),c0=+e.target.dataset.c;
      const data=netejaExcel(txt).split('\n').map(l=>l.split('\t'));
      while(data.length&&data[data.length-1].every(x=>!x.trim()))data.pop();
      let perdudes=false;
      data.forEach((pp,i)=>{
        while(gridRows.length<=r0+i)addRow();
        const ins=cellsOf(gridRows[r0+i]);
        pp.forEach((v,j)=>{if(c0+j>=NC){if(v.trim())perdudes=true;return;}ins[c0+j].value=v.trim();});
      });
      gSync();reset();
      if(perdudes)gInfo.textContent='ℹ️ Hi havia més columnes de les que caben des d\'aquesta cel·la: les sobrants s\'han ignorat.';
    }
    // Llegeix la graella: [{nom,nota,com}] per fila (en mode per ordre el nom de la cel·la bloquejada no compta)
    function gLlegeix(){return gridRows.map(tr=>{const v=cellsOf(tr).map(x=>x.value.replace(/[\t\r\n]+/g,' ').trim());const o={nom:'',nota:'',com:''};cols.forEach((c,i)=>{o[c.k]=v[i]||'';});if(!modeNoms)o.nom='';return o;});}
    const gTeDades=o=>!!(o.nom||o.nota||o.com);
    function gSync(){
      let blank=0;
      for(let i=gridRows.length-1;i>=0;i--){const cs=cellsOf(gridRows[i]);if(cs.slice(1).every(x=>!x.value.trim())&&(!modeNoms?true:!cs[0].value.trim()))blank++;else break;}
      while(blank<2){addRow();blank++;}
      gColors();
    }
    // Colors del nom (mode amb noms): verd = coincideix amb un alumne de la taula · groc = alumne semblant · vermell = no es troba
    function gColors(){
      const L=gLlegeix();
      const k=L.filter(gTeDades).length;
      if(!modeNoms){
        gridRows.forEach(tr=>{const c0=cellsOf(tr)[0];c0.style.background='#f9fafb';c0.style.boxShadow='none';});
        gInfo.textContent=k?'Per ordre de la taula · '+k+(k>1?' files':' fila')+' amb dades':'';
        return;
      }
      let sn=0,nOk=0,nSug=0,nNo=0;
      const idxNoms=[];L.forEach((o,i)=>{if(o.nom)idxNoms.push(i);});
      let estats=[];
      if(idxNoms.length){try{estats=alineaNoms(idxNoms.map(i=>L[i].nom+'\t1').join('\n'),idx2).estats||[];}catch(e){estats=[];}}
      const COL={ok:['#dcfce7','Coincideix amb un alumne de la taula'],sug:['#fef3c7','No és idèntic, però hi ha un alumne molt semblant: et proposarà aplicar-hi el valor'],no:['#fee2e2','No coincideix amb cap alumne de la taula'],dup:['#fee2e2','Aquest alumne ja té una altra fila assignada: només s\'aplicaria la primera'],fora:['#fee2e2','Aquest alumne és a la taula però no l\'has seleccionat']};
      L.forEach((o,i)=>{
        const c0=cellsOf(gridRows[i])[0];
        const falta=!o.nom&&(o.nota||o.com);if(falta)sn++;
        const kk=idxNoms.indexOf(i),st=kk>=0?estats[kk]:null;
        if(st==='ok')nOk++;else if(st==='sug')nSug++;else if(st)nNo++;
        c0.style.background=st&&COL[st]?COL[st][0]:'transparent';
        c0.title=st&&COL[st]?COL[st][1]:'';
        c0.style.boxShadow=falta?'inset 0 0 0 2px #fca5a5':'none';
      });
      gInfo.textContent=k?'Mode amb noms · '+(nOk?'🟢 '+nOk+' trobat'+(nOk>1?'s':'')+'  ':'')+(nSug?'🟡 '+nSug+' semblant'+(nSug>1?'s':'')+'  ':'')+(nNo?'🔴 '+nNo+' no trobat'+(nNo>1?'s':'')+'  ':'')+(sn?'⚠️ '+sn+' sense nom':''):'';
    }
    const nRows0=Math.max(6,tgR0.length+2);
    for(let i=0;i<nRows0;i++)addRow();
    aplicaMode();
    clr.onclick=()=>{gridRows.forEach((tr,r)=>{cellsOf(tr).forEach((x,ci)=>{if(ci===0&&!modeNoms)return;x.value='';});});gInfo.textContent='';gSync();reset();};
    const warn=_c('div');warn.style.cssText='font-size:12px;color:#c0392b;margin:0 0 10px;line-height:1.5;';md.ap(warn);
    const ap=_c('button');ap.textContent=lbls[mode];ap.style.cssText=`width:100%;padding:11px;border:none;border-radius:8px;background:${clrs[mode]};color:#fff;font-size:14px;font-weight:500;cursor:pointer;`;
    const reset=()=>{confirmat=false;ap.textContent=lbls[mode];warn.textContent='';if(chEl){chEl.remove();chEl=null;ap.style.display='';}};
    ap.onclick=()=>{
      const GL=gLlegeix(),useNames=modeNoms;
      if(useNames){
        const fSN=[];GL.forEach((o,i)=>{if(!o.nom&&(o.nota||o.com))fSN.push(i+1);});
        if(fSN.length){warn.textContent='⚠️ Falta el nom a '+(fSN.length>1?'les files ':'la fila ')+fSN.join(', ')+'. Posa el nom a totes les files amb dades, o passa a «Per ordre de la taula».';return;}
      }
      // Text d'una columna: amb noms → "nom<TAB>valor"; per ordre → una línia per fila de la taula
      function textCol(k){
        if(useNames)return GL.filter(o=>o.nom&&o[k]).map(o=>o.nom+'\t'+o[k]).join('\n');
        let ult=-1;GL.forEach((o,i)=>{if(o[k])ult=i;});
        return GL.slice(0,ult+1).map(o=>o[k]).join('\n');
      }
      const doN=GL.some(o=>o.nota),doC=GL.some(o=>o.com);
      if(!doN&&!doC){warn.textContent='⚠️ Enganxa alguna nota o algun comentari a la graella.';return;}
      if(wM===null||wM===undefined){
        const cN=doN&&hN(),cC=doC&&hC();
        if(cN||cC){
          warn.textContent='⚠️ Ja hi ha '+(cN&&cC?'notes i comentaris introduïts':(cN?'notes introduïdes':'comentaris introduïts'))+' a la taula. Què vols fer?';
          ap.style.display='none';
          chEl=_c('div');
          const mkOp=(txt,bg,v)=>{const b=_c('button');b.textContent=txt;b.style.cssText='display:block;width:100%;padding:10px;margin-bottom:6px;border:none;border-radius:8px;background:'+bg+';color:#fff;font-size:13px;font-weight:500;cursor:pointer;';b.onclick=()=>{wM=v;chEl.remove();chEl=null;ap.style.display='';warn.textContent='';ap.onclick();};return b;};
          chEl.ap(mkOp('Reescriure tot','#c0392b','overwrite'));
          chEl.ap(mkOp('No sobreescriure els que ja en tenen','#e67e22','skip'));
          md.insertBefore(chEl,ap);
          return;
        }
        wM='overwrite';
      }
      const avisos=[];const sugsAll=[];
      const tgR=filesObjectiu(idx2);
      function prepara(txt,etq){
        if(!useNames)return txt;
        const r=alineaNoms(txt,idx2);
        if(txt.trim()!==''&&r.trobats===0)return null;
        r.avisos.forEach(a=>avisos.push(etq+': '+a));
        r.sugs.forEach(sg=>sugsAll.push({etq:etq,s:sg}));
        return r.text;
      }
      let nTxt=doN?prepara(textCol('nota'),'Notes'):'';
      let cTxt=doC?prepara(textCol('com'),'Comentaris'):'';
      if(nTxt===null||cTxt===null){warn.textContent='⚠️ Cap nom coincideix amb els alumnes de la pantalla. Comprova que has copiat el nom i el valor separats per una tabulació.';return;}
      if(doN&&!confirmat){
        const probs=[];
        const mal=liniesNoNota(nTxt);
        if(mal.length){
          const llista=mal.slice(0,5).map(i=>(useNames?'':'línia '+(i+1)+' – ')+(tgR[i]?nomFila(tgR[i]):'?'));
          probs.push('Aquests valors no semblen una nota ('+llista.join('; ')+(mal.length>5?'…':'')+'). '+(useNames?'':'Has copiat també els noms? Prova el mode amb noms.'));
        }
        if(!useNames){
          const nl=nTxt.replace(/\s+$/,'')===''?0:nTxt.replace(/\s+$/,'').split('\n').length;
          if(nl>tgR.length)probs.push('Has enganxat '+nl+' línies però la taula només té '+tgR.length+' alumnes.');
        }
        if(probs.length){
          warn.textContent='⚠️ '+probs.join(' ')+' Si vols continuar igualment, torna a prémer el botó.';
          confirmat=true;ap.textContent='Aplicar igualment';
          return;
        }
      }
      const rep={err:[],bloc:[],sense:[]};
      const skN=doN?aN(nTxt,idx2,wM,rep):[];
      const senseC=[];
      if(doC){const ls=cTxt.split('\n');tgR.forEach((row,i)=>{if(!(ls[i]||'').trim()&&!hasComment(row))senseC.push(nomFila(row));});}
      function aplicaSug(sel){
        const rowsAll=gR();
        const gr={Notes:{idx:[],lines:[],vist:new Set()},Comentaris:{idx:[],lines:[],vist:new Set()}};
        const dup=[];
        sel.forEach(i=>{
          const o=sugsAll[i],g=gr[o.etq],ri=rowsAll.indexOf(o.s.row);
          if(ri<0)return;
          if(g.vist.has(ri)){dup.push(o.s.p.nom);return;}
          g.vist.add(ri);g.idx.push(ri);g.lines.push(o.s.p.resta);
        });
        if(dup.length&&!window.confirm('Hi ha noms que apunten al mateix alumne ('+dup.join(', ')+'). Només s\'aplicarà el primer. Vols continuar?'))return;
        const rep2={err:[],bloc:[],sense:[]};
        const skN2=gr.Notes.idx.length?aN(gr.Notes.lines.join('\n'),gr.Notes.idx,wM,rep2):[];
        const fin2=(skC,fc)=>{
          const secs2=[
            {t:'Notes no assignades (valor no vàlid o inexistent al desplegable)',items:rep2.err},
            {t:'Camps bloquejats (no s\'ha modificat)',items:rep2.bloc},
            {t:'Comentaris que no s\'han pogut posar',items:fc||[]}
          ];
          if(secs2.some(x=>x.items.length)||skN2.length||(skC||[]).length){sS(skN2,skC||[],secs2);return;}
          md.innerHTML='';md.style.width='420px';
          const ic=_c('div');ic.textContent='✓';ic.style.cssText='font-size:30px;color:#16a34a;margin-bottom:8px;';md.ap(ic);
          const p=_c('p');p.style.cssText='font-weight:500;font-size:15px;margin:0 0 14px;';p.textContent='Fet: aplicat a '+sel.length+' coincidència'+(sel.length>1?'s':'')+'.';md.ap(p);
          const okb=_c('button');okb.textContent='Tancar';okb.style.cssText='width:100%;padding:11px;border:none;border-radius:8px;background:#555;color:#fff;font-size:14px;font-weight:500;cursor:pointer;';okb.onclick=close;md.ap(okb);
        };
        if(gr.Comentaris.idx.length)aCFastBATX(gr.Comentaris.lines.join('\n'),gr.Comentaris.idx,wM,(skC,f)=>fin2(skC,f));else fin2([],[]);
      }
      const fixObj=sugsAll.length?{
        items:sugsAll.map(o=>({txt:o.etq+': '+o.s.p.nom+' → '+nomFila(o.s.row)+(o.s.falta.length?' · a la teva llista falta: '+o.s.falta.join(' '):'')+(o.s.sobra.length?' · sobra o és diferent: '+o.s.sobra.join(' '):'')+(o.s.usat?' · ja té una altra entrada assignada':''),checked:o.s.marcat})),
        onApply:aplicaSug
      }:null;
      function fin(skC,failsC){
        sS(skN,skC||[],[
          {t:'Noms de la llista que no s\'han trobat a la taula',items:avisos},
          {t:'Notes no assignades (valor no vàlid o inexistent al desplegable)',items:rep.err},
          {t:'Camps bloquejats (no s\'ha modificat)',items:rep.bloc},
          {t:'Alumnes de la taula sense cap nota nova',items:rep.sense},
          {t:'Comentaris que no s\'han pogut posar',items:failsC||[]},
          {t:'Alumnes de la taula sense cap comentari nou',items:senseC}
        ],fixObj);
      }
      if(doC){aCFastBATX(cTxt,idx2,wM,(skC,f)=>fin(skC,f));}else{fin([],[]);}
    };
    md.ap(ap);
    const extra=_c('div');extra.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;';
    const mkSm=(txt,fn)=>{const b=_c('button');b.textContent=txt;b.style.cssText='flex:1 1 auto;padding:8px 10px;border:1.5px solid #e5e7eb;border-radius:8px;background:transparent;font-size:12px;cursor:pointer;color:#6b7280;font-family:inherit;';b.onclick=fn;return b;};
    if(idx2===null)extra.ap(mkSm('👥 Només alguns alumnes',()=>sPk(mode,wM)));
    extra.ap(mkSm('🗂️ Optatives per grups',()=>{close();if(window.__esferaCarrega)window.__esferaCarrega('optatives');}));
    extra.ap(mkSm('ℹ️ Com funciona',sInfoBATX));
    extra.ap(mkSm('Tancar',close));
    md.ap(extra);
    const cr2=_c('p');cr2.textContent='© 2026 Ignasi Martí Palet';cr2.style.cssText='font-size:11px;color:#9ca3af;text-align:center;margin:12px 0 0;';md.ap(cr2);
  }
  
  function sPk(mode,wM){
    md.innerHTML='';md.style.width='420px';md.ap(mkCtx());md.ap(mkBack(()=>sF(mode,null,wM)));
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
    md.innerHTML='';md.style.width='420px';md.ap(mkCtx());md.ap(mkBack(sCh));
    const h=_c('p');h.textContent='A quins alumnes?';h.style.cssText='font-weight:500;font-size:16px;margin:0 0 16px;';md.ap(h);
    md.ap(mkBtn('Tots els alumnes del grup',clrs[mode],()=>sF(mode,null,wM)));
    md.ap(mkBtn('Escollir alumnes','#888',()=>sPk(mode,wM)));
  }
  function sW(msg,mode){
    md.innerHTML='';md.style.width='420px';md.ap(mkCtx());md.ap(mkBack(sCh));
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
    md.innerHTML='';md.style.width='420px';md.ap(mkBack(sCh));
    const h=_c('p');h.style.cssText='font-weight:500;font-size:18px;margin:0 0 18px;color:#0f0f1a;';h.textContent='ℹ️ Com funciona';md.ap(h);
    function sec(tit,items){const wrap=_c('div');wrap.style.cssText='margin-bottom:16px;';const lbl=_c('p');lbl.style.cssText='font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;';lbl.textContent=tit;wrap.ap(lbl);const box=_c('div');box.style.cssText='border-radius:10px;overflow:hidden;border:1px solid #eee;';items.forEach((it,i)=>{const d=_c('div');d.style.cssText='padding:9px 14px;font-size:13px;color:#374151;line-height:1.5;'+(i>0?'border-top:1px solid #f3f4f6;':'');d.innerHTML=it;box.ap(d);});wrap.ap(box);md.ap(wrap);}
    sec('Notes',['1️⃣ Una sola pantalla: omple <strong>només el que vulguis posar</strong> (només notes, només comentaris o tot) i prem Aplicar.','📋 Enganxa les notes a la <strong>graella</strong> (directament des d\'Excel o Sheets), una fila per alumne. Amb el Nom buit, s\'usa l\'<strong>ordre de la taula</strong> (els noms de la taula surten en gris).','⬜ Per saltar-te un alumne, deixa la fila corresponent en <strong>blanc</strong>.','🔢 Format acceptat: <strong>números</strong> (p.ex. 7, 8.5).']);
    sec('Mode amb noms',['👤 A dalt de la graella pots triar <strong>Per ordre de la taula</strong> (els noms en gris només són de referència) o <strong>Amb noms</strong> (escrius o enganxes els noms, en qualsevol ordre). Si cliques un nom gris o hi enganxes noms, passa sol al mode amb noms. Verd: trobat · groc: semblant · vermell: no es troba.','📋 En mode amb noms pots enganxar nom, nota i comentari de cop a la cel·la Nom, o només nota i comentari començant a la columna <strong>Nota</strong>. Totes les files amb dades necessiten el nom.','🔀 No cal que l\'ordre coincideixi amb el de la taula. Si l\'alumne té dos noms a Esfer@ i tu en tens un, també el reconeix.','🔎 Si un nom no es troba però hi ha un alumne molt semblant, apareix amb una casella: marca o desmarca i prem <strong>Aplicar als alumnes marcats</strong>.','⏹ Si els comentaris es posen un a un, apareix un botó <strong>Aturar</strong>.']);
    sec('Comentaris',['💬 Enganxa un comentari per alumne a la graella, una fila per alumne (amb el Nom buit, en l\'ordre de la taula).','↵ Si copies des d\'Excel o Sheets, una cel·la amb salts de línia o cometes es llegeix com un sol text.','⬜ Per saltar-te un alumne, deixa la línia corresponent en <strong>blanc</strong>.','⚡ S\'apliquen a l\'instant sense haver d\'obrir cada alumne individualment.']);
  }
  function sCh(){sF('ambdos',null,null);}
  sCh();ov.ap(md);_ba(ov);
})();
