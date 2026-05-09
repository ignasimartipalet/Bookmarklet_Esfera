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
var isBATX=!!_q('table[data-st-table="dummyStudents"]');

// ── TUTORIA (isA) ─────────────────────────────────────────────────────────────
if(isA){
  let fontLink=_c('link');fontLink.rel='stylesheet';
  fontLink.href='https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap';
  document.head.ap(fontLink);
  let styleEl=_c('style');
  styleEl.textContent='@keyframes tutorFadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes tutorPulse{0%,100%{opacity:1}50%{opacity:0.3}}';
  document.head.ap(styleEl);
  const F="font-family:'Outfit',system-ui,sans-serif;box-sizing:border-box;";

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

  // Badge de tutoria eliminat perquè "Eina de Tutoria" ja ho indica
  let mH='<div style="'+F+'text-align:center"><div style="width:52px;height:52px;background:#0f0f1a;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:16px">🎓</div><h2 style="'+F+'margin:0 0 6px;font-size:21px;font-weight:700;color:#0f0f1a">Eina de Tutoria</h2><p style="'+F+'margin:0 0 28px;font-size:13px;color:#9ca3af">Selecciona l\'acció que vols executar</p><div style="display:flex;flex-direction:column;gap:10px"><button id="btn1" style="'+F+'padding:14px 20px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer;display:flex;align-items:center;gap:12px">💬<span>Comentaris de tutor</span></button><button id="btn2" style="'+F+'padding:14px 20px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer;display:flex;align-items:center;gap:12px">📋<span>Acta de tutoria</span></button><button id="btn3" style="'+F+'padding:14px 20px;font-size:14px;font-weight:600;border:2px solid #0f0f1a;border-radius:12px;background:#fff;color:#0f0f1a;cursor:pointer;display:flex;align-items:center;gap:12px">⚡<span>Les dues a la vegada</span></button><button id="btnX" style="'+F+'padding:10px 20px;font-size:13px;font-weight:500;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#9ca3af;cursor:pointer;margin-top:2px">Cancel·lar</button><p style="font-size:11px;color:#9ca3af;text-align:center;margin-top:14px;margin-bottom:0">© 2026 Ignasi Martí Palet</p><div></div>';
  let mO=cO(mH,o=>_rm(o));
  function tM(){if(mO.parentNode)_rm(mO);}
  function o1(){tM();dC(function(text){if(!text.trim())return;let cm=text.split("\n");let i=0;let prog=cP("Comentaris: 0 / "+cm.length);function run(){if(i>=cm.length){sP(prog,"Tots els comentaris processats! ✓");return;}sP(prog,"Comentaris: "+(i+1)+" / "+cm.length);let oB=_q("a[data-ng-click='showCommentsModal()']");if(!oB){_st(run,500);return;}oB.click();let wM=setInterval(function(){let ta=_q("textarea[data-ng-model='comentariGeneral.comentari']");let sC=_q("a[data-ng-click='saveComentariGeneral()']");if(ta&&sC){clearInterval(wM);let c=(cm[i]||"").trim();if(c!==""){ta.value=c;ta.dispatchEvent(new InputEvent("input",{bubbles:true}));sC.click();}_st(function(){let sG=_q("a[data-ng-click='saveNotesAvaluacio()']");if(sG)sG.click();let wS=setInterval(function(){let alerts=_qa(".alert-success");let found=false;alerts.forEach(function(a){if(a.innerText.toLowerCase().includes("desat"))found=true;});if(found){clearInterval(wS);let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");if(!next||next.disabled){sP(prog,"Tots els comentaris processats! ✓");return;}angular.element(next).triggerHandler('click');i++;_st(run,7000);}},500);},2000);}},200);}run();});}
  function o2(){tM();let total=0,mm={},sm={},aP=new Set(),mC={},al=[];let prog=cP("Alumnes: 0");function gS(){return Array.from(_qa("select[data-ng-model='contingut.qualitativa']")).filter(s=>s.offsetParent!==null);}function pr(){let selects=gS();let bt=_q("a.btn.btn-warning[data-ng-click='showCommentsModal()']");if(!bt)return;let alumID=bt.closest("tr")?bt.closest("tr").textContent.trim():total;if(aP.has(alumID))return;aP.add(alumID);let susp=0,matsSusp=[];selects.forEach(sel=>{let tr=sel.closest("tr");let td=tr?tr.querySelector("td[data-ng-if*='matPNomVis']"):null;if(td){let mat=td.textContent.trim();let matID=alumID+"||"+mat;if(!mC[matID]){mC[matID]=true;let nota=sel.value.replace("string:","");if(nota==="NA"){mm[mat]=(mm[mat]||0)+1;susp++;matsSusp.push(mat);}else{mm[mat]=mm[mat]||0;}}}});sm[alumID]=susp;al.push({num:total+1,count:susp,mats:matsSusp});total++;sP(prog,"Alumnes: "+total);}function sg(){let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");if(next&&!next.hasAttribute("disabled")){angular.element(next).triggerHandler('click');return true;}return false;}function eE(cb){let lC=0,sT=0;let int=setInterval(()=>{let count=gS().length;let bt=_q("a.btn.btn-warning[data-ng-click='showCommentsModal()']");if(bt&&count===lC&&count>0){sT+=100;if(sT>=500){clearInterval(int);cb();}}else{sT=0;lC=count;}},100);}function acabar(){sP(prog,"Processament complet! ✓");mR(total,mm,sm,al);}function loop(){eE(()=>{pr();if(sg()){_st(loop,150);}else{acabar();}});}loop();}
  function o3(){tM();dC(function(text){if(!text.trim())return;let cm=text.split("\n");let i=0;let total=0,mm={},sm={},aP=new Set(),mC={},al=[];let prog=cP("Processant: 0 / "+cm.length);function gS(){return Array.from(_qa("select[data-ng-model='contingut.qualitativa']")).filter(s=>s.offsetParent!==null);}function pD(){let selects=gS();let bt=_q("a.btn.btn-warning[data-ng-click='showCommentsModal()']");if(!bt)return;let alumID=bt.closest("tr")?bt.closest("tr").textContent.trim():total;if(aP.has(alumID))return;aP.add(alumID);let susp=0,matsSusp=[];selects.forEach(sel=>{let tr=sel.closest("tr");let td=tr?tr.querySelector("td[data-ng-if*='matPNomVis']"):null;if(td){let mat=td.textContent.trim();let matID=alumID+"||"+mat;if(!mC[matID]){mC[matID]=true;let nota=sel.value.replace("string:","");if(nota==="NA"){mm[mat]=(mm[mat]||0)+1;susp++;matsSusp.push(mat);}else{mm[mat]=mm[mat]||0;}}}});sm[alumID]=susp;al.push({num:total+1,count:susp,mats:matsSusp});total++;}function eE(cb){let lC=0,sT=0;let int=setInterval(()=>{let count=gS().length;let bt=_q("a.btn.btn-warning[data-ng-click='showCommentsModal()']");if(bt&&count===lC&&count>0){sT+=100;if(sT>=500){clearInterval(int);cb();}}else{sT=0;lC=count;}},100);}function aA(){sP(prog,"Tot processat! ✓");mR(total,mm,sm,al);}function dP(last){_st(function(){let sG=_q("a[data-ng-click='saveNotesAvaluacio()']");if(sG)sG.click();let wS=setInterval(function(){let alerts=_qa(".alert-success");let found=false;alerts.forEach(function(a){if(a.innerText.toLowerCase().includes("desat"))found=true;});if(found){clearInterval(wS);if(last){aA();return;}let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");if(!next||next.hasAttribute("disabled")){aA();return;}angular.element(next).triggerHandler('click');i++;_st(rC,7000);}},500);},2000);}function eC(last){let c=(cm[i]||"").trim();if(c===""){dP(last);return;}let oB=_q("a[data-ng-click='showCommentsModal()']");if(!oB){_st(()=>eC(last),500);return;}oB.click();let wM=setInterval(function(){let ta=_q("textarea[data-ng-model='comentariGeneral.comentari']");let sC=_q("a[data-ng-click='saveComentariGeneral()']");if(ta&&sC){clearInterval(wM);ta.value=c;ta.dispatchEvent(new InputEvent("input",{bubbles:true}));sC.click();dP(last);}},200);}function rC(){sP(prog,"Processant: "+(i+1)+" / "+cm.length);eE(()=>{pD();let next=_q("a[data-ng-click=\"canviAlumne('next')\"]");let isLast=!next||next.hasAttribute("disabled");eC(isLast);});}rC();});}
 function bindTutoriaButtons(){
  let b1 = _id("btn1");
  let b2 = _id("btn2");
  let b3 = _id("btn3");
  let bx = _id("btnX");

  if(b1) b1.onclick = o1;
  if(b2) b2.onclick = o2;
  if(b3) b3.onclick = o3;
  if(bx) bx.onclick = tM;
}

_st(bindTutoriaButtons, 100);
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
    md.ap(mkBtn('No sobreescriure els que ja en tienen','#e67e22',()=>sSc(mode,'skip')));
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

  // gR: accepta files ESO (td:nth-child(6)), BATX parcial (input[name="qualitativa"] o botó comentari)
  function gR(){
    return Array.from(_qa('#my-tab-content tbody tr')).filter(r=>{
      if(r.querySelector('.cursiva'))return false; // cursiva en qualsevol lloc de la fila
      const s6=r.querySelector('td:nth-child(6)>div>div>select')||r.querySelector('td:nth-child(6) input[type="text"]')||r.querySelector('td:nth-child(6) input[type="number"]')||r.querySelector('td:nth-child(6) input');
      if(s6&&!s6.disabled)return true;
      const q=r.querySelector('input[name="qualitativa"]');
      if(q&&!q.disabled)return true;
      return !!r.querySelector('a.glyphicon-new-window');
    });
  }
  function gN(row){const td=row.querySelector('td:nth-child(2)');return td?td.textContent.trim():'';}

  // rN: ESO → td:nth-child(6); BATX parcial → qualitativa (valor DOM o classe ng-not-empty)
  function rN(row){
    const s=row.querySelector('td:nth-child(6)>div>div>select');
    if(s)return s.value&&s.value!==''&&s.value!=='string:';
    const inp=row.querySelector('td:nth-child(6) input[type="text"]')||row.querySelector('td:nth-child(6) input[type="number"]')||row.querySelector('td:nth-child(6) input');
    if(inp)return inp.value&&inp.value.trim()!=='';
    const q=row.querySelector('input[name="qualitativa"]');
    return q&&(q.value.trim()!==''||q.classList.contains('ng-not-empty'));
  }
  function rCm(row){const btn=row.querySelector('a.glyphicon.glyphicon-new-window');if(!btn)return false;const td=btn.closest('td');if(!td)return false;if(td.querySelector('.badge,.label,span[class*="comment"],span[class*="count"]'))return true;const txt=Array.from(td.childNodes).filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join('');if(/\d+/.test(txt))return true;if(btn.classList.length>2)return true;if(btn.getAttribute('title')||btn.getAttribute('data-original-title'))return true;return false;}
  function hN(){return gR().some(rN);}
  function hC(){return gR().some(rCm);}

  function aN(text,idx2,wM){
    const grades=text.split('\n').map(s=>s.split('\t'));
    const rows=gR();const tg=idx2!==null?idx2.map(i=>rows[i]):rows;const sk=[];
    // Detecta BATX parcial: existeixen input[data-ng-class] visibles al document
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
      // Pas 1: escriu tots els valors
      upd.forEach(({inp,v})=>inp.value=v);
      // Pas 2: dispara tots els events
      upd.forEach(({inp})=>{
        inp.dispatchEvent(new InputEvent('input',{bubbles:true}));
        inp.dispatchEvent(new Event('change',{bubbles:true}));
      });
      return sk;
    }
    // ESO: td:nth-child(6+j)
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

  // aC: selectora de textarea amb prefix vm. (BATX parcial) i fallback genèric (ESO)
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
        const ta=_q('textarea[data-ng-model="vm.commentsToModify.commentsToModifyModal"]')||_q('textarea.form-control');
        const save=_q('a[data-ng-click="vm.modalSave()"]');
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
  function sF(mode,idx2,wM){md.innerHTML='';md.ap(mkCtx());md.ap(mkBack(()=>idx2===null?sSc(mode,wM):sPk(mode,wM)));let nTA=null,cTA=null;if(mode==='notes'||mode==='ambdos'){md.ap(mkLbl('Notes'));nTA=mkTA("Enganxa les notes des d'Excel");md.ap(nTA);}if(mode==='comentaris'||mode==='ambdos'){md.ap(mkLbl('Comentaris'));cTA=mkTA('Enganxa els comentaris (un per línia)');md.ap(cTA);}const ap=_c('button');ap.textContent=lbls[mode];ap.style.cssText=`width:100%;padding:11px;border:none;border-radius:8px;background:${clrs[mode]};color:#fff;font-size:14px;font-weight:500;cursor:pointer;`;ap.onclick=()=>{const skN=nTA?aN(nTA.value,idx2,wM):[];if(cTA){aC(cTA.value,idx2,wM,skC=>sS(skN,skC));}else{sS(skN,[]);}};md.ap(ap);}
  function sPk(mode,wM){md.innerHTML='';md.ap(mkCtx());md.ap(mkBack(()=>sSc(mode,wM)));const rows=gR();const h=_c('p');h.textContent='Selecciona els alumnes';h.style.cssText='font-weight:500;font-size:15px;margin:0 0 10px;';md.ap(h);const sr=_c('div');sr.style.cssText='display:flex;gap:8px;margin-bottom:8px;';const sA=_c('button');sA.textContent='Tots';sA.style.cssText='flex:1;padding:5px;border:1px solid #ccc;border-radius:6px;background:transparent;font-size:12px;cursor:pointer;';const sN=_c('button');sN.textContent='Cap';sN.style.cssText='flex:1;padding:5px;border:1px solid #ccc;border-radius:6px;background:transparent;font-size:12px;cursor:pointer;';sr.ap(sA);sr.ap(sN);md.ap(sr);const ld=_c('div');ld.style.cssText='max-height:220px;overflow-y:auto;border:1px solid #eee;border-radius:6px;margin-bottom:12px;';const cbs=[];rows.forEach((row,i)=>{const name=gN(row)||`Alumne ${i+1}`;const item=_c('label');item.style.cssText='display:flex;align-items:center;gap:8px;padding:7px 10px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:13px;';const cb=_c('input');cb.type='checkbox';cb.checked=true;cbs.push(cb);item.ap(cb);item.ap(document.createTextNode(name));ld.ap(item);});md.ap(ld);sA.onclick=()=>cbs.forEach(c=>c.checked=true);sN.onclick=()=>cbs.forEach(c=>c.checked=false);const ap=_c('button');ap.textContent='Continuar';ap.style.cssText=`width:100%;padding:11px;border:none;border-radius:8px;background:${clrs[mode]};color:#fff;font-size:14px;font-weight:500;cursor:pointer;`;ap.onclick=()=>{const idx=cbs.map((c,i)=>c.checked?i:null).filter(i=>i!==null);if(!idx.length)return;sF(mode,idx,wM);};md.ap(ap);}
  function sSc(mode,wM){md.innerHTML='';md.ap(mkCtx());md.ap(mkBack(sCh));const h=_c('p');h.textContent='A quins alumnes?';h.style.cssText='font-weight:500;font-size:16px;margin:0 0 16px;';md.ap(h);md.ap(mkBtn('Tots els alumnes del grup',clrs[mode],()=>sF(mode,null,wM)));md.ap(mkBtn('Escollir alumnes','#888',()=>sPk(mode,wM)));}
  function sW(msg,mode){md.innerHTML='';md.ap(mkCtx());md.ap(mkBack(sCh));const ic=_c('div');ic.textContent='⚠';ic.style.cssText='font-size:28px;margin-bottom:8px;';md.ap(ic);const h=_c('p');h.style.cssText='font-weight:500;font-size:15px;margin:0 0 8px;';h.textContent='Ja hi ha dades existents';md.ap(h);const s=_c('p');s.style.cssText='font-size:13px;color:#666;margin:0 0 16px;line-height:1.5;';s.textContent=msg;md.ap(s);md.ap(mkBtn('Reescriure tot','#c0392b',()=>sSc(mode,'overwrite')));md.ap(mkBtn('No sobreescriure els que ja en tienen','#e67e22',()=>sSc(mode,'skip')));md.ap(mkCancel('Cancel·lar',close));}
  function cAS(mode){const nWarn=(mode==='notes'||mode==='ambdos')&&hN();const cWarn=(mode==='comentaris'||mode==='ambdos')&&hC();const parts=[];if(nWarn)parts.push('notes');if(cWarn)parts.push('comentaris');if(parts.length){sW(`Ja hi ha ${parts.join(' i ')} introduïts.`,mode);}else{sSc(mode,'overwrite');}}
  function sCh(){md.innerHTML='';md.ap(mkCtx());const h=_c('p');h.style.cssText='font-weight:500;font-size:16px;margin:0 0 16px;';h.textContent='Què vols fer?';md.ap(h);md.ap(mkBtn('Posar notes','#4e7f4e',()=>cAS('notes')));md.ap(mkBtn('Posar comentaris','#3d6b9e',()=>cAS('comentaris')));md.ap(mkBtn('Posar notes i comentaris','#7a4e9e',()=>cAS('ambdos')));md.ap(mkCancel());const cr=_c('p');cr.textContent='© 2026 Ignasi Martí Palet';cr.style.cssText='font-size:11px;color:#9ca3af;text-align:center;margin-top:14px;margin-bottom:0';md.ap(cr);}
  sCh();ov.ap(md);_ba(ov);

}else{
  alert('⚠️ Aquest bookmarklet només funciona a:\n• Qualificacions per grup i matèria\n• Qualificacions per grup i alumne/a\n• Avaluacions finals de batxillerat');
}
})();
