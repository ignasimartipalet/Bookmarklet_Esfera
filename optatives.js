(function () {
  if (window.__optBusy) return;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
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
  async function waitFor(f, ms) {
    ms = ms || 15000;
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      try {
        const v = f();
        if (v) return v;
      } catch (e) {}
      await sleep(250);
    }
    return null;
  }
  const norm = (s) =>
    (s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  const stop = ["de", "del", "la", "el", "els", "les", "dels", "i"];
  const toks = (s) =>
    norm(s)
      .split(" ")
      .filter((w) => w && !stop.includes(w));
  const esc = (s) =>
    String(s == null ? "" : s).replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
  const F = "font-family:'Outfit',system-ui,sans-serif;box-sizing:border-box;";
  const mk = (t, css, html) => {
    let e = document.createElement(t);
    if (css) e.style.cssText = css;
    if (html !== undefined) e.innerHTML = html;
    return e;
  };
  const GI = {};
  if (!document.getElementById("optSt")) {
    let l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap";
    document.head.appendChild(l);
    let s = document.createElement("style");
    s.id = "optSt";
    s.textContent =
      "@keyframes tutorFadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes tutorPulse{0%,100%{opacity:1}50%{opacity:0.3}}";
    document.head.appendChild(s);
  }
  const sec = (tit, items) =>
    '<div style="margin-bottom:16px"><p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em">' +
    tit +
    '</p><div style="border-radius:10px;overflow:hidden;border:1px solid #f0f0f0">' +
    items
      .map(
        (it, i) =>
          '<div style="padding:9px 14px;font-size:13px;color:#374151;line-height:1.5' +
          (i > 0 ? ";border-top:1px solid #f3f4f6" : "") +
          '">' +
          it +
          "</div>",
      )
      .join("") +
    "</div></div>";
  function cO(html, close) {
    let ov = mk(
      "div",
      "position:fixed;inset:0;background:rgba(10,10,20,0.5);backdrop-filter:blur(6px);z-index:2147483646;display:flex;align-items:center;justify-content:center",
    );
    let box = mk(
      "div",
      F +
        "background:#fff;border-radius:20px;padding:32px;width:560px;max-width:92vw;max-height:90vh;overflow-y:auto;box-shadow:0 32px 80px rgba(0,0,0,0.18),0 2px 8px rgba(0,0,0,0.06);animation:tutorFadeIn 0.22s ease;color:#0f0f1a",
      html,
    );
    ov.appendChild(box);
    document.body.appendChild(ov);
    if (close)
      ov.addEventListener("click", (e) => {
        if (e.target === ov) close();
      });
    return { ov: ov, box: box };
  }
  let prog = null;
  function pillOn(t) {
    if (!prog) {
      prog = mk(
        "div",
        F +
          "position:fixed;top:20px;right:20px;padding:12px 20px;background:#0f0f1a;color:#fff;font-size:13px;font-weight:500;border-radius:100px;z-index:2147483647;box-shadow:0 8px 28px rgba(0,0,0,0.22);display:flex;align-items:center;gap:10px",
        '<span style="width:8px;height:8px;border-radius:50%;background:#4ade80;display:inline-block;animation:tutorPulse 1.2s infinite"></span><span class="optPT"></span>',
      );
      const bs = mk(
        "button",
        "border:none;border-radius:100px;padding:5px 12px;background:#dc2626;color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit",
      );
      bs.textContent = "⏹ Aturar";
      bs.onclick = () => {
        aturat = true;
        bs.disabled = true;
        bs.textContent = "S'aturarà en acabar el grup";
      };
      prog.appendChild(bs);
      document.body.appendChild(prog);
    }
    if (!prog.isConnected) document.body.appendChild(prog);
    if (!aturat) prog.querySelector(".optPT").textContent = t;
  }
  function pillOff() {
    if (prog) {
      prog.remove();
      prog = null;
    }
  }
  function showModal(html) {
    let m = cO(html, () => m.ov.remove());
    m.box.querySelectorAll(".optClose").forEach((b) => (b.onclick = () => m.ov.remove()));
    return m;
  }
  const evalTxt = () =>
    /final/.test((location.href + " " + document.title).toLowerCase()) ? "Avaluació final" : "Avaluació parcial";
  const nrmQ = (v) => {
    let s = norm(v);
    if (["na", "no assolit", "no assoliment"].includes(s)) return "NA";
    if (["as", "satisfactori", "assoliment satisfactori"].includes(s)) return "AS";
    if (["an", "notable", "assoliment notable"].includes(s)) return "AN";
    if (["ae", "excel lent", "excellent", "assoliment excel lent", "assoliment excellent"].includes(s)) return "AE";
    return (v || "").trim();
  };
  const gTable = () =>
    Array.from(document.querySelectorAll("table")).find((t) => {
      let h = t.querySelector("thead");
      return h && /codi del grup/i.test(h.innerText);
    });
  const gRows = () => {
    let t = gTable();
    return t ? Array.from(t.querySelectorAll("tbody tr")).filter((r) => r.querySelector("a.glyphicon-new-window")) : [];
  };
  const sRows = () => {
    let a = Array.from(document.querySelectorAll("#my-tab-content tbody tr"));
    if (!a.length) a = Array.from(document.querySelectorAll('table[data-st-table="dummyStudents"] tbody tr'));
    return a;
  };
  const ctl = (r) => {
    let s = r.querySelector("td:nth-child(6) select");
    if (s) return { k: "sel", el: s };
    let i =
      r.querySelector('input[name="qualitativa"]') ||
      r.querySelector("input[data-ng-class]") ||
      r.querySelector('td:nth-child(6) input[type="text"]') ||
      r.querySelector('td:nth-child(6) input[type="number"]') ||
      r.querySelector("td:nth-child(6) input");
    return i ? { k: "inp", el: i } : null;
  };
  const notesRows = () => (gTable() ? 0 : sRows().filter((r) => ctl(r)).length);
  const subjRows = () =>
    gTable()
      ? []
      : Array.from(document.querySelectorAll("tbody tr")).filter((r) => {
          if (!r.querySelector("a.glyphicon-new-window") || r.querySelector("select") || ctl(r)) return false;
          let t = r.closest("table"),
            h = t && t.querySelector("thead");
          return !(h && /cognom|alumn/i.test(h.innerText));
        });
  const crumbs = () => Array.from(document.querySelectorAll("a.bread-crumb-text"));
  const rtxt = (r) => r.innerText.replace(/\s+/g, " ").trim();
  async function goList() {
    if (!gRows().length) {
      location.hash = "#/";
      await waitFor(() => gRows().length, 8000);
    }
    if (!gRows().length) {
      history.back();
      await waitFor(() => gRows().length, 6000);
    }
    if (gRows().length) await sleep(500);
    return !!gRows().length;
  }
  function pick(opts, code) {
    return new Promise((res) => {
      let m;
      const done = (i) => {
        m.ov.remove();
        res(i);
      };
      m = cO(
        '<div style="text-align:center;margin-bottom:18px"><div style="width:52px;height:52px;background:#0f0f1a;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:14px">📚</div><h2 style="margin:0 0 4px;font-size:21px;font-weight:700;color:#0f0f1a">Quina matèria?</h2><p style="margin:0;font-size:13px;color:#9ca3af">' +
          esc(code) +
          ": hi ha més d'una matèria en aquest grup</p></div>",
        null,
      );
      opts.forEach((r, i) => {
        let b = mk(
          "button",
          F +
            "display:block;width:100%;text-align:left;padding:13px 16px;margin-bottom:8px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer",
        );
        b.textContent = rtxt(r);
        b.onclick = () => done(i);
        m.box.appendChild(b);
      });
      let s = mk(
        "button",
        F +
          "width:100%;padding:11px;font-size:13px;font-weight:500;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#9ca3af;cursor:pointer;margin-top:4px",
      );
      s.textContent = "Saltar aquest grup";
      s.onclick = () => done(-1);
      m.box.appendChild(s);
    });
  }
  function getStuds() {
    const cands = [
      document.querySelector("#my-tab-content .tab-pane.active"),
      document.querySelector("#my-tab-content"),
      document.querySelector('table[data-st-table="dummyStudents"]'),
      document.querySelector("#my-tab-content table"),
    ].filter(Boolean);
    for (const el of cands) {
      try {
        let sc = angular.element(el).scope();
        for (let i = 0; i < 10 && sc; i++) {
          if (sc.vm && sc.vm.dummyStudents && sc.vm.dummyStudents.length) return { list: sc.vm.dummyStudents, sc: sc };
          if (sc.dummyStudents && sc.dummyStudents.length) return { list: sc.dummyStudents, sc: sc };
          sc = sc.$parent;
        }
      } catch (e) {}
    }
    return { list: [], sc: null };
  }
  function findOpt(c, g) {
    const code = nrmQ(g).toLowerCase();
    return Array.from(c.el.options).find((o) => {
      let cd = o.value.replace(/^string:/, "").toLowerCase();
      return cd && (cd === code || norm(o.text) === norm(g) || norm(o.text.split("-")[0]) === norm(g));
    });
  }
  // Estat de la nota nova respecte a la del camp: cap | nova | igual | sobre (cur) | invalida
  function estatNota(r, g) {
    const c = ctl(r);
    if (!c || !g || g === "-") return { k: "cap" };
    if (c.k === "sel") {
      const nou = findOpt(c, g);
      if (!nou) return { k: "invalida" };
      const o = c.el.options[c.el.selectedIndex];
      const v = o ? o.value.replace(/^string:/, "") : "";
      if (!o || !v || v === "?") return { k: "nova" };
      if (o.index === nou.index) return { k: "igual" };
      return { k: "sobre", cur: o.text.trim() || v };
    }
    const nv = g.replace(",", ".").trim();
    if (!/^\d+(\.\d+)?$/.test(nv)) return { k: "invalida" };
    const cur = String(c.el.value || "").trim();
    if (!cur) return { k: "nova" };
    if (parseFloat(cur.replace(",", ".")) === parseFloat(nv)) return { k: "igual" };
    return { k: "sobre", cur: cur };
  }
  // Nota actual del camp si és diferent de la nova: retorna el text actual, o null si no cal preguntar
  function notaDiferent(r, g) {
    const e = estatNota(r, g);
    return e.k === "sobre" ? e.cur : null;
  }
  function studDe(row, studs) {
    const id = row.querySelector("td:nth-child(1)").innerText.trim();
    const rk = toks([2, 3, 4].map((i) => row.querySelector("td:nth-child(" + i + ")").innerText).join(" "))
      .sort()
      .join(" ");
    return (
      (id && studs.find((x) => x.idRalc != null && String(x.idRalc).trim() === id)) ||
      studs.find((x) => toks([x.cognom1, x.cognom2, x.nom].join(" ")).sort().join(" ") === rk) ||
      null
    );
  }
  function estatComent(s2, c) {
    if (!c || c === "-") return { k: "cap" };
    if (!s2) return { k: "desconegut" };
    const cur = String(s2.comentaris || "").trim();
    if (!cur) return { k: "nova" };
    if (cur === c) return { k: "igual" };
    return { k: "sobre", cur: cur };
  }
  async function setGrade(r, d, gradeErr) {
    const c = ctl(r);
    if (!c) return;
    const g = d.grade;
    if (c.k === "sel") {
      const code = nrmQ(g).toLowerCase();
      const o = Array.from(c.el.options).find((o) => {
        let cd = o.value.replace(/^string:/, "").toLowerCase();
        return cd && (cd === code || norm(o.text) === norm(g) || norm(o.text.split("-")[0]) === norm(g));
      });
      if (o) {
        c.el.selectedIndex = o.index;
        c.el.dispatchEvent(new Event("change", { bubbles: true }));
      } else gradeErr.push(d.raw + " (" + g + ")");
      return;
    }
    const v = g.replace(",", ".").trim();
    if (!/^\d+(\.\d+)?$/.test(v)) {
      gradeErr.push(d.raw + " (" + g + ")");
      return;
    }
    const inp = c.el;
    const ret = { row: r, inp: inp, v: v, d: d };
    if (inp.name === "qualitativa") {
      try {
        const sc = angular.element(r).scope();
        sc.$apply(() => {
          const al = sc.alumne || (sc.$parent && sc.$parent.alumne);
          if (!al) return;
          (al.asig || []).forEach((a) =>
            (a.elem || []).forEach((e) => {
              if (Object.prototype.hasOwnProperty.call(e, "quantitativa")) e.quantitativa = v;
            }),
          );
        });
      } catch (e) {}
      await sleep(150);
    }
    if (parseFloat(inp.value) !== parseFloat(v)) {
      inp.value = v;
      inp.dispatchEvent(new InputEvent("input", { bubbles: true }));
      inp.dispatchEvent(new Event("change", { bubbles: true }));
      try {
        angular.element(inp).triggerHandler("input");
        angular.element(inp).triggerHandler("change");
      } catch (e) {}
    }
    return ret;
  }
  // Torna a escriure el valor i avisa Angular (input + change + blur)
  function escriu(inp, v) {
    inp.value = v;
    inp.dispatchEvent(new InputEvent("input", { bubbles: true }));
    inp.dispatchEvent(new Event("change", { bubbles: true }));
    try {
      angular.element(inp).triggerHandler("input");
      angular.element(inp).triggerHandler("change");
    } catch (e) {}
    inp.dispatchEvent(new Event("blur", { bubbles: true }));
  }
  // Comprova que les notes numèriques s'han quedat al camp (Angular pot repintar la taula) i les reaplica si cal
  async function verificaNotes(pend, gradeErr) {
    if (!pend.length) return;
    await sleep(250);
    for (let pass = 0; pass < 2; pass++) {
      let fals = 0;
      for (const p of pend) {
        if (p.ok) continue;
        let inp = p.inp;
        if (!inp || !inp.isConnected) {
          const c = ctl(p.row);
          inp = c && c.k === "inp" ? c.el : null;
        }
        if (inp && parseFloat(inp.value) === parseFloat(p.v)) {
          p.ok = true;
          continue;
        }
        if (inp) {
          p.inp = inp;
          escriu(inp, p.v);
          fals++;
        }
      }
      if (!fals) break;
      await sleep(250);
    }
    for (const p of pend) {
      const inp = p.inp && p.inp.isConnected ? p.inp : (ctl(p.row) || {}).el;
      if (!p.ok && !(inp && parseFloat(inp.value) === parseFloat(p.v))) gradeErr.push(p.d.raw + " (" + p.v + ": no s'ha pogut escriure al camp)");
    }
  }
  // Diàleg: comentaris que ja existeixen. Cada caixa blava es clica per triar: verd = sobreescriure, vermell = no sobreescriure.
  // Retorna una llista de booleans (true = sobreescriure). Les caixes que queden blaves (sense decidir) es respecten.
  async function decideOverwrite(code, items, what) {
    what = what || 'comentari';
    if (owAuto) return items.map(() => true);
    const W = what === 'nota' ? { t: 'Notes ja existents', s: 'una nota', p: 'notes' } : { t: 'Comentaris ja existents', s: 'un comentari', p: 'comentaris' };
    const ST = {
      0: { bg: "#dbeafe", bd: "#2563eb", tx: "#1e3a8a", lb: "🔵 Sense decidir · es respecta" },
      1: { bg: "#dcfce7", bd: "#16a34a", tx: "#14532d", lb: "🟢 Es sobreescriurà" },
      2: { bg: "#fee2e2", bd: "#dc2626", tx: "#7f1d1d", lb: "🔴 No es sobreescriurà" },
    };
    const state = items.map(() => 0);
    const rowsH = items
      .map(
        (it, i) =>
          '<div style="margin-bottom:12px"><div style="font-size:13px;font-weight:600;color:#0f0f1a;margin-bottom:5px">' +
          esc(it.name) +
          '</div><div class="optOw" data-i="' +
          i +
          '" style="cursor:pointer;border:2px solid;border-radius:10px;padding:9px 12px;font-size:13px;line-height:1.45;white-space:pre-wrap;word-break:break-word"></div>' +
          '<div style="font-size:11px;color:#6b7280;margin-top:4px;line-height:1.4"><b>Nou:</b> ' +
          esc(it.neu) +
          "</div></div>",
      )
      .join("");
    const btn = (cls, bg, col, bd, t) =>
      '<button class="' + cls + '" style="' + F + "padding:9px 12px;font-size:12px;font-weight:600;border-radius:10px;cursor:pointer;background:" + bg + ";color:" + col + ";border:1.5px solid " + bd + '">' + t + "</button>";
    const h =
      '<div style="' + F + '"><h2 style="' + F + 'margin:0 0 4px;font-size:19px;font-weight:700;color:#0f0f1a">' + W.t + '</h2>' +
      '<p style="' + F + 'margin:0 0 14px;font-size:13px;color:#6b7280;line-height:1.5">Grup <b>' + esc(code) + "</b>: " +
      (items.length > 1 ? "aquests alumnes ja tenen " : "aquest alumne ja té ") + W.s +
      " diferent. Clica la caixa per triar: <b style='color:#16a34a'>verd</b> = sobreescriure, <b style='color:#dc2626'>vermell</b> = no sobreescriure. Les que quedin <b style='color:#2563eb'>blaves</b> no es toquen.</p>" +
      '<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">' +
      btn("optOwAll", "#dcfce7", "#14532d", "#16a34a", "Sobreescriure tots") +
      btn("optOwNone", "#fee2e2", "#7f1d1d", "#dc2626", "No sobreescriure cap") +
      '</div><div style="max-height:340px;overflow-y:auto;padding-right:4px">' + rowsH + "</div>" +
      '<div class="optOwInfo" style="font-size:12px;color:#6b7280;text-align:center;margin:10px 0 6px"></div>' +
      '<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:#374151;margin:0 0 12px;cursor:pointer"><input type="checkbox" class="optOwAuto" style="accent-color:#16a34a;width:15px;height:15px"><span>No tornar a preguntar: <b>sobreescriure-ho tot</b> als grups següents</span></label>' +
      '<button class="optOwGo" style="' + F + 'width:100%;padding:13px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Continuar →</button></div>';
    const m = showModal(h);
    let done = false;
    const paint = () => {
      m.box.querySelectorAll(".optOw").forEach((el) => {
        const c = ST[state[+el.dataset.i]];
        el.style.background = c.bg;
        el.style.borderColor = c.bd;
        el.style.color = c.tx;
        el.textContent = items[+el.dataset.i].cur;
        el.title = c.lb;
      });
      const g = state.filter((x) => x === 1).length,
        r = state.filter((x) => x === 2).length,
        b = state.filter((x) => x === 0).length;
      m.box.querySelector(".optOwInfo").textContent = "🟢 " + g + " · 🔴 " + r + " · 🔵 " + b;
    };
    m.box.querySelectorAll(".optOw").forEach((el) => {
      el.onclick = () => {
        const i = +el.dataset.i;
        state[i] = state[i] === 1 ? 2 : 1;
        paint();
      };
    });
    m.box.querySelector(".optOwAll").onclick = () => {
      state.fill(1);
      paint();
    };
    m.box.querySelector(".optOwNone").onclick = () => {
      state.fill(2);
      paint();
    };
    m.box.querySelector(".optOwGo").onclick = () => {
      done = true;
      if (m.box.querySelector(".optOwAuto").checked) owAuto = true;
      m.ov.remove();
    };
    paint();
    // si es tanca la finestra sense continuar (× o clic fora), no se sobreescriu res
    await waitFor(() => (m.ov.isConnected ? null : true), 3600000, 200);
    return state.map((x) => x === 1 && done);
  }
  async function viaModal(q, existing, failed, decide) {
    let btn = q.row.querySelector("a.glyphicon-new-window");
    if (!btn) {
      failed.push(q.name);
      return;
    }
    btn.click();
    let w = await waitFor(() => {
      let ta =
          document.querySelector('textarea[data-ng-model$="commentsToModifyModal"]') ||
          document.querySelector("textarea.form-control"),
        sb =
          document.querySelector('a[data-ng-click="vm.modalSave()"]') ||
          document.querySelector('a[data-ng-click="modalSave()"]');
      return ta && sb ? { ta: ta, sb: sb } : null;
    }, 5000);
    if (!w) {
      failed.push(q.name);
      return;
    }
    let cur = w.ta.value.trim();
    let ow = false;
    if (cur && cur !== q.c) {
      if (decide) ow = await decide(q.name, cur, q.c);
      if (!ow) existing.push(q.name);
    }
    if (!cur || ow) {
      w.ta.value = q.c;
      w.ta.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: q.c }));
      w.ta.dispatchEvent(new Event("change", { bubbles: true }));
    }
    w.sb.click();
    await waitFor(
      () =>
        !document.querySelector('textarea[data-ng-model$="commentsToModifyModal"]') &&
        !document.querySelector("textarea.form-control"),
      4000,
    );
    await sleep(200);
  }
  async function desa() {
    let sv =
      document.querySelector('a[data-ng-click="vm.saveNotesAvaluacio()"]') ||
      document.querySelector('a[data-ng-click="saveNotesAvaluacio()"]') ||
      Array.from(document.querySelectorAll("a.btn-primary,button.btn-primary")).find((b) =>
        /^desa$/i.test(b.innerText.trim()),
      );
    if (!sv) return { t: "nobtn", m: "" };
    sv.click();
    await sleep(2000);
    let ok = await waitFor(
      () => Array.from(document.querySelectorAll(".alert-success")).some((a) => /desat/i.test(a.innerText)),
      3000,
    );
    let m = "";
    let md = document.querySelector(".modal.in,.modal.show");
    if (md) {
      let tx = md.innerText.replace(/\s+/g, " ").trim().slice(0, 150);
      let bt = Array.from(md.querySelectorAll("a,button")).find((b) =>
        /^(accepta|d.acord|tanca|ok)$/i.test(b.innerText.trim()),
      );
      if (bt) {
        bt.click();
        await sleep(500);
        m = "diàleg tancat → " + tx;
      } else m = "diàleg obert sense botó conegut → " + tx;
    }
    return { t: ok ? "ok" : "noconf", m: m };
  }
  function summary(res, dry, nf) {
    const col = (c) => (c === "ok" ? "#16a34a" : c === "warn" ? "#d97706" : "#dc2626");
    const dgHtml = (g) => {
      if (!dry || !g.diag || !g.diag.length) return "";
      const nom = (e) =>
        "<b>" + esc(e.name) + "</b>" +
        (norm(e.name).split(" ").sort().join(" ") === norm(e.txt).split(" ").sort().join(" ") ? "" : ' <span style="color:#9ca3af">→ ' + esc(e.txt) + "</span>");
      const lines = g.diag.map((e) => {
        let col = "#16a34a",
          p = [];
        const n = e.nota,
          c = e.cm;
        if (e.blk) {
          p.push("camp bloquejat: no es pot modificar");
          col = "#dc2626";
        } else if (n.k === "nova") p.push("nota " + esc(e.grade) + " (nova)");
        else if (n.k === "sobre") {
          p.push("nota " + esc(n.cur) + " → " + esc(e.grade) + " (sobreescriuria)");
          col = "#d97706";
        } else if (n.k === "igual") p.push("nota " + esc(e.grade) + " (ja hi és)");
        else if (n.k === "invalida") {
          p.push("nota «" + esc(e.grade) + "» no vàlida per a aquest camp");
          col = "#dc2626";
        }
        if (c.k === "nova") p.push("comentari nou");
        else if (c.k === "sobre") {
          p.push("comentari existent «" + esc(c.cur.length > 40 ? c.cur.slice(0, 40) + "…" : c.cur) + "» (sobreescriuria)");
          if (col !== "#dc2626") col = "#d97706";
        } else if (c.k === "igual") p.push("comentari igual a l'existent");
        else if (c.k === "desconegut") p.push("comentari: no puc llegir l'actual");
        if (!p.length) p.push("res a escriure (nota i comentari buits)");
        return '<div style="margin-top:4px;font-size:12px"><span style="color:' + col + '">●</span> ' + nom(e) + "<br>&nbsp;&nbsp;&nbsp;" + p.join(" · ") + "</div>";
      });
      return (
        '<div style="margin-top:6px;border-top:1px dashed #e5e7eb;padding-top:4px">' +
        lines.join("") +
        (g.noLlista && g.noLlista.length
          ? '<div style="margin-top:8px;font-size:12px;color:#6b7280">👥 Alumnes del grup que no surten a la teva llista (' + g.noLlista.length + "): " + esc(g.noLlista.join(" · ")) + "</div>"
          : "") +
        "</div>"
      );
    };
    let items = res.groups.map(
      (g) =>
        "<b>" +
        esc(g.code) +
        "</b> · " +
        esc(g.name) +
        '<br><span style="color:' +
        col(g.cls) +
        ';font-weight:600">' +
        esc(g.st) +
        '</span> <span style="color:#9ca3af">· ' +
        g.found +
        (g.n != null ? " de " + g.n : "") +
        " alumnes" +
        (g.fmt ? " · " + esc(g.fmt) : "") +
        (g.subj ? " · " + esc(g.subj) : "") +
        (g.cm ? " · " + esc(g.cm) : "") +
        "</span>" +
        dgHtml(g),
    );
    let h =
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px"><div><h2 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#0f0f1a">Resum' +
      (dry ? " · diagnòstic" : "") +
      '</h2><p style="margin:0;font-size:13px;color:#9ca3af">' +
      res.groups.length +
      ' grups processats</p></div><button class="optClose" style="' +
      F +
      'width:34px;height:34px;border-radius:50%;border:none;background:#f3f4f6;color:#6b7280;font-size:20px;cursor:pointer;line-height:1">×</button></div>';
    if (dry) {
      const T = { nN: 0, nS: 0, nI: 0, cN: 0, cS: 0, cI: 0, inv: 0, blk: 0, tot: 0 };
      res.groups.forEach((g) => {
        T.blk += g.blk || 0;
        T.tot += g.found || 0;
        (g.diag || []).forEach((e) => {
          if (e.nota.k === "nova") T.nN++;
          else if (e.nota.k === "sobre") T.nS++;
          else if (e.nota.k === "igual") T.nI++;
          else if (e.nota.k === "invalida") T.inv++;
          if (e.cm.k === "nova") T.cN++;
          else if (e.cm.k === "sobre") T.cS++;
          else if (e.cm.k === "igual") T.cI++;
        });
      });
      h +=
        '<div style="background:#eff6ff;border:1.5px solid #93c5fd;border-radius:12px;padding:12px 16px;margin-bottom:18px;font-size:13px;color:#1e3a8a;line-height:1.6">🩺 <b>Diagnòstic: no s\'ha canviat ni desat res.</b><br>' +
        T.tot + " alumnes trobats. Escriuria <b>" + T.nN + "</b> notes noves i <b>" + T.cN + "</b> comentaris nous." +
        "<br>Sobreescriuria <b>" + T.nS + "</b> notes i <b>" + T.cS + "</b> comentaris que ja hi són" +
        (T.nI + T.cI ? " (" + (T.nI + T.cI) + " ja eren iguals)" : "") + "." +
        (T.inv || T.blk ? '<br><b style="color:#dc2626">Problemes: ' + (T.inv ? T.inv + " notes no vàlides" : "") + (T.inv && T.blk ? " · " : "") + (T.blk ? T.blk + " camps bloquejats" : "") + "</b>" : "") +
        "</div>";
    }
    h += sec("Per grup", items.length ? items : ["Cap grup processat"]);
    const lst = (t, a) => {
      if (a.length)
        h += sec(
          t,
          a.map((x) => esc(x)),
        );
    };
    lst("Incidències", res.issues);
    let nFix = 0;
    const nfItems = nf.map((it, i) => {
      let t = "<b>" + esc(it.x.raw) + "</b>" + (it.x.amb ? ' <span style="color:#d97706">(coincideix amb més d\'un alumne)</span>' : "");
      if (!it.m) return t + (it.aturat ? " → no processat (has aturat el procés)" : " → cap alumne dels grups triats s'hi assembla");
      nFix++;
      const marcat = it.m.cov >= 0.6 && it.m.marge >= 0.15 && !it.m.v.usat;
      const diff =
        (it.m.falta.length ? "a la teva llista falta: " + esc(it.m.falta.join(" ")) : "") +
        (it.m.falta.length && it.m.sobra.length ? " · " : "") +
        (it.m.sobra.length ? "sobra o és diferent: " + esc(it.m.sobra.join(" ")) : "") +
        (it.m.v.usat ? " · ja té una altra entrada assignada" : "");
      return (
        '<label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer"><input type="checkbox" class="optFix" data-i="' + i + '"' +
        (marcat ? " checked" : "") +
        ' style="accent-color:#0f0f1a;width:16px;height:16px;margin-top:2px;flex-shrink:0"><span>' +
        t + " → <b>" + esc(it.m.v.txt) + "</b> (" + esc(it.m.v.code) + ")" +
        (diff ? '<br><span style="color:#9ca3af;font-size:12px">' + diff + "</span>" : "") +
        "</span></label>"
      );
    });
    h += sec("No trobats en els grups triats", nfItems.length ? nfItems : ["✅ Cap: s'han trobat tots els alumnes"]);
    if (nFix)
      h +=
        '<div class="optFixMsg" style="font-size:12px;color:#dc2626;min-height:16px;text-align:center"></div><p style="margin:0 0 8px;font-size:12px;color:#6b7280;line-height:1.5">Les caselles marcades són coincidències molt probables. Revisa-les, desmarca les que no ho siguin i prem el botó.</p><button class="optFixGo" style="' +
        F +
        'width:100%;padding:13px;margin-bottom:16px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#7a4e9e;color:#fff;cursor:pointer">' +
        (dry ? "Diagnosticar amb els alumnes marcats" : "Aplicar als alumnes marcats") +
        "</button>";
    lst("Notes no assignades", res.gradeErr);
    lst("Ja tenien nota (no s'ha sobreescrit)", res.gKept);
    lst("Ja tenien comentari (no s'ha sobreescrit)", res.existing);
    lst("Comentaris fallits", res.failed);
    h +=
      '<button class="optClose" style="' +
      F +
      'width:100%;padding:13px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Tancar</button>';
    const mm = showModal(h);
    const go = mm.box.querySelector(".optFixGo");
    if (go)
      go.onclick = () => {
        const msg = mm.box.querySelector(".optFixMsg");
        const marcats = Array.from(mm.box.querySelectorAll(".optFix:checked")).map((c) => nf[+c.getAttribute("data-i")]);
        if (!marcats.length) {
          msg.textContent = "⚠️ Marca almenys un alumne";
          return;
        }
        const vists = new Set(),
          linies = [],
          codes = [],
          dup = [];
        marcats.forEach((it) => {
          const key = it.m.v.code + "|" + it.m.v.txt;
          if (vists.has(key)) {
            dup.push(it.x.raw);
            return;
          }
          vists.add(key);
          linies.push(it.m.v.txt + "\t" + (it.x.grade || "") + "\t" + (it.x.comment || ""));
          if (codes.indexOf(it.m.v.code) < 0) codes.push(it.m.v.code);
        });
        if (dup.length && !window.confirm("Hi ha noms que apunten al mateix alumne (" + dup.join(", ") + "). Només s'aplicarà el primer. Vols continuar?")) return;
        mm.ov.remove();
        executa(linies.join("\n"), dry, codes);
      };
  }
  function executa(t, d, sel) {
    window.__optBusy = true;
    window.onbeforeunload = () => "recarrega";
    run(t, d, sel).catch((e) => {
      window.onbeforeunload = null;
      window.__optBusy = false;
      pillOff();
      showModal(
        '<h2 style="margin:0 0 10px;font-size:20px;font-weight:700;color:#0f0f1a">Error</h2><p style="font-size:13px;color:#374151;line-height:1.5">' +
          esc(e.message) +
          '</p><button class="optClose" style="' +
          F +
          'width:100%;padding:13px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Tancar</button>',
      );
    });
  }
  // Assigna cada fila de la taula a una entrada de la llista pel nom (sense ambigüitats).
  // files:[{S:mots dels cognoms, N:mots del nom}] · entrades:[{t:mots, done:bool}]
  // Passos: 1) mateixos mots · 2) cognoms complets + nom(s), tolerant que falti o sobri un segon nom · 3) últim recurs.
function assignaNoms(files,entrades){
    const res=files.map(()=>null);
    const lliure=e=>!e.done;
    const clau=a=>a.slice().sort().join(' ');
    files.forEach((f,k)=>{const key=clau(f.S.concat(f.N));const m=entrades.find(e=>lliure(e)&&clau(e.t)===key);if(m){m.done=true;res[k]=m;}});
    function resol(parelles){
      parelles.sort((a,b)=>a.d-b.d);
      parelles.forEach(x=>{
        if(res[x.k]||x.e.done)return;
        const riv=parelles.filter(y=>y!==x&&!res[y.k]&&!y.e.done&&(y.k===x.k||y.e===x.e)&&y.d<=x.d);
        if(riv.length){x.e.amb=true;return;}
        x.e.done=true;res[x.k]=x.e;
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

  function infoFila(r) {
    const g = (i) => {
      const td = r.querySelector("td:nth-child(" + i + ")");
      return td ? td.innerText : "";
    };
    return { S: toks(g(2) + " " + g(3)), N: toks(g(4)) };
  }
  let lastChosen = null;
  let owAuto = false; // true = sobreescriu notes i comentaris existents sense preguntar
  let aturat = false;
  async function run(text, dry, codes) {
    aturat = false;
    let data = text
      .split("\n")
      .map((l) => {
        l = l.replace(/\r/g, "");
        let p = l.split("\t");
        if (p.length < 2 && l.indexOf(";") > -1) p = l.split(";");
        return p;
      })
      .filter((p) => p[0] && p[0].trim())
      .map((p) => ({
        raw: p[0].trim(),
        t: toks(p[0]),
        grade: (p[1] || "").trim(),
        comment: p.slice(2).join(" ").trim(),
        done: false,
      }));
    let res = { groups: [], issues: [], gradeErr: [], existing: [], gKept: [], failed: [] },
      chosen = lastChosen,
      n = 0;
    const vistos = [];
    for (const code of codes) {
      n++;
      if (aturat) {
        res.issues.push("Aturat per tu: no s'han processat els grups des de " + code + " (inclòs)");
        break;
      }
      pillOn("Grup " + n + " / " + codes.length + " · " + code);
      if (!gRows().length && !(await goList())) {
        res.issues.push("No he pogut tornar a la llista de grups, m'aturo");
        break;
      }
      let gi = GI[code] || {};
      let g = { code: code, name: gi.name || "", found: 0, fmt: "", subj: "", cm: "", st: "", cls: "ok" };
      res.groups.push(g);
      let row = gRows().find((r) => r.querySelector("td:nth-child(3)").innerText.trim() === code);
      if (!row) {
        g.st = "no trobat a la llista";
        g.cls = "err";
        continue;
      }
      row.querySelector("a.glyphicon-new-window").click();
      let st = await waitFor(() => {
        if (notesRows()) return "notes";
        return subjRows().length ? "subj" : null;
      }, 15000);
      if (!st) {
        g.st = "no s'ha carregat res";
        g.cls = "err";
        await goList();
        continue;
      }
      if (st === "subj") {
        await sleep(800);
        if (notesRows()) st = "notes";
      }
      if (st === "subj") {
        let sr = subjRows();
        if (!sr.length) {
          g.st = "no he pogut llegir les matèries";
          g.cls = "err";
          await goList();
          continue;
        }
        let mr = null;
        if (chosen) mr = sr.find((r) => norm(rtxt(r)) === chosen);
        if (!mr) {
          let i = await pick(sr, code);
          if (i < 0) {
            g.st = "saltat";
            g.cls = "warn";
            await goList();
            continue;
          }
          mr = sr[i];
        }
        chosen = norm(rtxt(mr));
        lastChosen = chosen;
        mr.querySelector("a.glyphicon-new-window").click();
        let ok = await waitFor(() => notesRows());
        if (!ok) {
          g.st = "no s'ha carregat la pàgina de notes";
          g.cls = "err";
          await goList();
          continue;
        }
      }
      await sleep(1000);
      let sc = await waitFor(
        () =>
          crumbs().find((a) => {
            let t = a.innerText.replace(/\s+/g, " ").trim();
            return t && !/^\d{4}\/\d{4}/.test(t) && !/qualificacions|avaluacions/.test(norm(t));
          }),
        3000,
      );
      if (sc) g.subj = sc.innerText.replace(/\s+/g, " ").trim().slice(0, 45);
      let rows = sRows().filter((r) => {
        let c = ctl(r);
        let td = r.querySelector("td:nth-child(1)");
        return c && td && !r.querySelector(".cursiva");
      });
      if (rows.length) g.fmt = ctl(rows[0]).k === "sel" ? "qualitativa" : "nota numèrica";
      g.n = rows.length;
      rows.forEach((r) => {
        const o = infoFila(r);
        vistos.push({
          code: code,
          row: r,
          S: o.S,
          N: o.N,
          usat: false,
          txt: [2, 3, 4]
            .map((i) => {
              const td = r.querySelector("td:nth-child(" + i + ")");
              return td ? td.innerText.trim() : "";
            })
            .join(" ")
            .replace(/\s+/g, " ")
            .trim(),
        });
      });
      let queue = [],
        pend = [];
      const asg = assignaNoms(rows.map(infoFila), data);
      rows.forEach((r, ri) => {
        const v = vistos.find((q) => q.row === r);
        if (v && asg[ri]) v.usat = true;
      });
      const keepG = new Set();
      g.diag = [];
      const rowTxt = (r) =>
        [2, 3, 4]
          .map((i) => {
            const td = r.querySelector("td:nth-child(" + i + ")");
            return td ? td.innerText.trim() : "";
          })
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
      let studD = null;
      if (dry) {
        const l0 = getStuds().list;
        studD = l0.length ? l0 : null;
        g.noLlista = rows.filter((r, ri) => !asg[ri]).map(rowTxt);
        g.dadesAng = !!studD;
      }
      if (!dry) {
        const gc = [];
        for (let ri = 0; ri < rows.length; ri++) {
          const d0 = asg[ri];
          if (!d0 || ctl(rows[ri]).el.disabled) continue;
          const cu = notaDiferent(rows[ri], d0.grade);
          if (cu != null) gc.push({ ri: ri, name: d0.raw, cur: cu, neu: d0.grade });
        }
        if (gc.length) {
          const dg = await decideOverwrite(
            code,
            gc.map((x) => ({ name: x.name, cur: x.cur, neu: x.neu })),
            "nota",
          );
          gc.forEach((x, i) => {
            if (!dg[i]) {
              keepG.add(x.ri);
              res.gKept.push(x.name);
            }
          });
        }
      }
      for (let ri = 0; ri < rows.length; ri++) {
        const r = rows[ri];
        let d = asg[ri];
        if (!d) continue;
        d.done = true;
        g.found++;
        if (ctl(r).el.disabled) {
          g.blk = (g.blk || 0) + 1;
          if (dry) g.diag.push({ name: d.raw, txt: rowTxt(r), blk: true, nota: { k: "cap" }, cm: { k: "cap" } });
          res.issues.push(code + ": " + d.raw + " trobat, però el camp està bloquejat");
          continue;
        }
        if (dry) {
          const e = { name: d.raw, txt: rowTxt(r), nota: estatNota(r, d.grade), cm: estatComent(studD ? studDe(r, studD) : null, d.comment), grade: d.grade, comment: d.comment };
          g.diag.push(e);
          continue;
        }
        if (d.grade && d.grade !== "-" && !keepG.has(ri)) {
          const sg = await setGrade(r, d, res.gradeErr);
          if (sg) pend.push(sg);
        }
        if (d.comment && d.comment !== "-") queue.push({ row: r, c: d.comment, name: d.raw });
      }
      if (!dry) {
        await verificaNotes(pend, res.gradeErr);
        if (queue.length) {
          let nF = 0,
            nS = 0,
            why = "",
            gs = getStuds(),
            studs = gs.list,
            conf = [],
            fast = 0;
          if (!studs.length) why = "no trobo les dades d'Angular, ho faig per finestra";
          for (const q of queue) {
            let id = q.row.querySelector("td:nth-child(1)").innerText.trim();
            let rk = toks([2, 3, 4].map((i) => q.row.querySelector("td:nth-child(" + i + ")").innerText).join(" "))
              .sort()
              .join(" ");
            let s2 =
              (id && studs.find((s) => s.idRalc != null && String(s.idRalc).trim() === id)) ||
              studs.find((s) => toks([s.cognom1, s.cognom2, s.nom].join(" ")).sort().join(" ") === rk);
            if (!s2) {
              q.slow = true;
              continue;
            }
            const cur0 = String(s2.comentaris || "").trim();
            if (cur0) {
              if (cur0 === q.c) q.skip = true;
              else conf.push({ q: q, s2: s2, cur: cur0 });
              continue;
            }
            s2.comentaris = q.c;
            q.fo = s2;
            fast++;
          }
          if (conf.length) {
            const dec = await decideOverwrite(
              code,
              conf.map((x) => ({ name: x.q.name, cur: x.cur, neu: x.q.c })),
            );
            conf.forEach((x, i) => {
              if (dec[i]) {
                x.s2.comentaris = x.q.c;
                x.q.fo = x.s2;
                fast++;
              } else {
                res.existing.push(x.q.name);
                x.q.skip = true;
              }
            });
          }
          if (fast && gs.sc) {
            try {
              gs.sc.$apply();
            } catch (e) {
              why += " $apply: " + e.message;
            }
          }
          await sleep(400);
          for (const q of queue) {
            if (q.skip) continue;
            if (q.fo && String(q.fo.comentaris || "").trim() === q.c) {
              nF++;
              continue;
            }
            nS++;
            await viaModal(q, res.existing, res.failed, async (nm, cu, ne) => (await decideOverwrite(code, [{ name: nm, cur: cu, neu: ne }]))[0]);
          }
          g.cm = "comentaris: " + nF + " directes" + (nS ? ", " + nS + " per finestra" : "");
          if (why) res.issues.push(code + ": " + why);
          await sleep(500);
        }
        if (g.found > (g.blk || 0)) {
          let r2 = await desa();
          if (r2.t === "nobtn") {
            g.st = "NO he trobat el botó Desa";
            g.cls = "err";
          } else if (r2.t === "noconf") {
            g.st = "desat (sense avís de confirmació visible)";
            g.cls = "warn";
          } else g.st = "desat";
          if (r2.m) res.issues.push(code + ": " + r2.m);
        } else {
          g.st = g.found ? "alumnes trobats però bloquejats (res desat)" : "cap alumne de la llista (res desat)";
          g.cls = "warn";
        }
      } else {
        g.st = g.found ? "diagnòstic: " + g.found + " alumne" + (g.found > 1 ? "s" : "") + " de la teva llista trobat" + (g.found > 1 ? "s" : "") : "diagnòstic: cap alumne de la llista";
        g.cls = g.found ? "ok" : "warn";
      }
      if (!(await goList())) {
        res.issues.push("No he pogut tornar a la llista de grups, m'aturo");
        break;
      }
    }
    function millor(x) {
      if (!x.t.length) return null;
      let best = null,
        bs = 0,
        bs2 = 0;
      vistos.forEach((v) => {
        const rt = v.S.concat(v.N);
        const comu = x.t.filter((t) => rt.includes(t)).length;
        const sc = comu / Math.max(1, new Set(x.t.concat(rt)).size) - (v.usat ? 0.15 : 0);
        if (sc > bs) {
          bs2 = bs;
          bs = sc;
          best = v;
        } else if (sc > bs2) bs2 = sc;
      });
      if (!best || bs < 0.25) return null;
      const rt = best.S.concat(best.N);
      const cov = x.t.filter((t) => rt.includes(t)).length / x.t.length;
      return {
        v: best,
        sc: bs,
        cov: cov,
        marge: bs - bs2,
        falta: rt.filter((t) => !x.t.includes(t)),
        sobra: x.t.filter((t) => !rt.includes(t)),
      };
    }
    let nf = data.filter((x) => !x.done).map((x) => ({ x: x, m: aturat ? null : millor(x), aturat: aturat }));
    pillOff();
    window.onbeforeunload = null;
    window.__optBusy = false;
    summary(res, dry, nf);
  }
  async function init() {
    if (!gRows().length && !(await goList())) {
      alert("Ves a la llista de grups (Qualificacions per grup i matèria) i torna-ho a provar.");
      return;
    }
    const groups = gRows().map((r) => ({
      code: r.querySelector("td:nth-child(3)").innerText.trim(),
      name: r.querySelector("td:nth-child(4)").innerText.trim(),
      ens: (r.querySelector("td:nth-child(5)") || { innerText: "" }).innerText.trim(),
    }));
    groups.forEach((g) => (GI[g.code] = g));
    window.__optBusy = true;
    const lab = (t) =>
      '<p style="margin:0;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em">' +
      t +
      "</p>";
    const sm =
      F +
      "padding:5px 12px;font-size:12px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:8px;background:transparent;color:#6b7280;cursor:pointer;";
    const smRed = sm.replace("color:#6b7280", "color:#c0392b");
    const H =
      '<div class="optMain"><div style="text-align:center;margin-bottom:22px"><div style="width:52px;height:52px;background:#0f0f1a;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:14px">🗂️</div><h2 style="margin:0 0 4px;font-size:21px;font-weight:700;color:#0f0f1a">Notes i comentaris per grups</h2><p style="margin:0 0 10px;font-size:13px;color:#9ca3af">Una línia per alumne: Nom, Nota i Comentari</p><span style="display:inline-block;background:#f0f4ff;color:#3d6b9e;border:1px solid #c5d5f0;border-radius:20px;padding:3px 10px;font-size:11px;font-weight:500">' +
      evalTxt() +
      '</span></div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">' +
      lab("1 · Llista d'alumnes") +
      '<button class="optClr" style="' +
      smRed +
      '">🗑 Esborrar tot</button></div><div class="optGrid" style="border:1.5px solid #e5e7eb;border-radius:12px;overflow:hidden"></div><p style="margin:6px 0 0;font-size:11px;color:#9ca3af;line-height:1.5">💡 Enganxa des de qualsevol cel·la: s\'omple cap a la dreta i cap avall, com un full de càlcul. Si comences a Nota, el Nom no es toca.</p><textarea class="optTA" hidden placeholder="Garcia López Joan  [tab]  AN  [tab]  Comentari&#10;Puig Martí Anna  [tab]  AE  [tab]  Comentari" style="' +
      F +
      'width:100%;height:150px;border:1.5px solid #e5e7eb;border-radius:12px;padding:14px;font-size:13px;color:#0f0f1a;resize:vertical;outline:none;line-height:1.6"></textarea><div class="optCnt" style="font-size:12px;color:#9ca3af;min-height:18px;margin:6px 0 14px"></div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">' +
      lab("2 · Grups a recórrer") +
      '<div style="display:flex;gap:6px"><button class="optAll" style="' +
      sm +
      '">Tots</button><button class="optNone" style="' +
      sm +
      '">Cap</button></div></div><div class="optG" style="max-height:200px;overflow-y:auto;border:1px solid #f0f0f0;border-radius:12px"></div><label style="display:flex;align-items:center;gap:10px;margin-top:14px;padding:12px 14px;border:1.5px solid #e5e7eb;border-radius:12px;cursor:pointer;font-size:13px;color:#374151"><input type="checkbox" class="optDry" style="accent-color:#0f0f1a;width:16px;height:16px"><span><b>🩺 Només diagnòstic</b> · no modifica res, et diu què passaria a cada grup</span></label><label style="display:flex;align-items:center;gap:10px;margin-top:8px;padding:12px 14px;border:1.5px solid #e5e7eb;border-radius:12px;cursor:pointer;font-size:13px;color:#374151"><input type="checkbox" class="optOwA" style="accent-color:#16a34a;width:16px;height:16px"><span><b>Sobreescriure-ho tot</b> · notes i comentaris existents, sense preguntar</span></label><div class="optMsg" style="font-size:12px;color:#dc2626;min-height:18px;margin:10px 0;text-align:center"></div><div style="display:flex;gap:10px"><button class="optNo" style="' +
      F +
      'flex:1;padding:13px;font-size:14px;font-weight:600;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#9ca3af;cursor:pointer">Cancel·lar</button><button class="optGo" style="' +
      F +
      'flex:2;padding:13px;font-size:14px;font-weight:600;border:none;border-radius:12px;background:#0f0f1a;color:#fff;cursor:pointer">Executar →</button></div><button class="optI" style="' +
      F +
      'width:100%;margin-top:10px;padding:10px;font-size:13px;font-weight:500;border:1.5px solid #e5e7eb;border-radius:12px;background:transparent;color:#6b7280;cursor:pointer">ℹ️ Com funciona</button><p style="font-size:11px;color:#9ca3af;text-align:center;margin:14px 0 0">© 2026 Ignasi Martí Palet</p></div>';
    const I =
      '<div class="optInfo" style="display:none"><button class="optBack" style="' +
      F +
      'background:none;border:none;color:#6b7280;font-size:13px;cursor:pointer;padding:0;margin-bottom:16px;display:block">← Tornar</button><h2 style="margin:0 0 18px;font-size:18px;font-weight:700;color:#0f0f1a">ℹ️ Com funciona</h2>' +
      sec("Llista", [
        "📋 Una fila per alumne a la graella: <b>Nom</b>, <b>Nota</b> i <b>Comentari</b>. Copia d'Excel o Sheets i enganxa a la cel·la on vulguis començar: s'omple cap a la dreta i cap avall. Pots enganxar els noms per una banda i la nota i el comentari per una altra (comença a la columna Nota). Cada fila necessita el nom.",
        "🔤 El nom pot anar en qualsevol ordre i sense accents. Es compara 1r cognom, 2n cognom i nom. Si l'alumne té dos noms a Esfer@ i tu en tens només un, també el troba (si els cognoms coincideixen). Si un nom no es troba però hi ha un alumne molt semblant, el resum el proposa amb una casella: marca o desmarca i aplica la nota només als alumnes marcats. Mentre treballa, el botó Aturar (a dalt a la dreta) atura el procés en acabar el grup actual; el resum diu quins grups no s'han fet.",
        "⬜ Nota o comentari buit, o <b>-</b>, vol dir no tocar.",
      ]) +
      sec("Notes", [
        "🎓 <b>ESO</b> (qualitatives): AE, AN, AS, NA o el text complet (Assoliment notable...).",
        "🔢 <b>Batxillerat</b> (numèriques): un número, p. ex. 7 o 8,5.",
        "📝 <b>Avaluacions finals</b>: s'adapta al camp que troba a cada grup (desplegable o numèric).",
      ]) +
      sec("Comentaris", [
        "⚡ S'escriuen tots de cop a les dades de la pàgina, sense obrir cada alumne. Si cal, ho fa per la finestra.",
        "🛡️ Si un alumne ja té una nota o un comentari diferent, et mostra el que hi ha i tries un per un si el vols sobreescriure (verd) o no (vermell). Si no decideixes (blau), no es toca. Pots marcar «Sobreescriure-ho tot» abans d'executar, o dins el diàleg, per no haver-ho de preguntar.",
      ]) +
      sec("Grups i matèries", [
        "🗂️ Només entra als grups que marquis i desa cada un abans de passar al següent.",
        "📚 Si en un grup tens més d'una matèria, et deixa triar-ne una i la recorda.",
        "🩺 Si marques «Només diagnòstic», no es canvia res: per a cada grup et diu quins alumnes ha trobat, què escriuria (nota o comentari nou), què sobreescriuria, quines notes no són vàlides per al camp i quins alumnes del grup no surten a la teva llista.",
        "🔒 Si el camp està bloquejat, l'alumne es detecta però no es modifica res.",
      ]) +
      "</div>";
    let dlg;
    const closeAll = () => {
      dlg.ov.remove();
      window.__optBusy = false;
    };
    dlg = cO(H + I, closeAll);
    const box = dlg.box;
    box.style.width = "min(640px,92vw)";
    const gd = box.querySelector(".optG"),
      ta = box.querySelector(".optTA"),
      cnt = box.querySelector(".optCnt"),
      msg = box.querySelector(".optMsg");
    groups.forEach((g, i) => {
      let l = mk(
        "label",
        F +
          "display:flex;align-items:center;gap:10px;padding:9px 14px;cursor:pointer;font-size:13px;color:#111" +
          (i > 0 ? ";border-top:1px solid #f3f4f6" : ""),
      );
      let cb = mk("input");
      cb.type = "checkbox";
      cb.value = g.code;
      cb.style.cssText = "accent-color:#0f0f1a;width:16px;height:16px;flex-shrink:0";
      let s = mk(
        "span",
        "",
        "<b>" +
          esc(g.code) +
          "</b> · " +
          esc(g.name) +
          ' <span style="color:#9ca3af;font-size:12px">' +
          esc(g.ens) +
          "</span>",
      );
      l.appendChild(cb);
      l.appendChild(s);
      gd.appendChild(l);
    });
    // ── Graella tipus full de càlcul: Nom · Nota · Comentari ──
    const gridEl = box.querySelector(".optGrid"),
      RC = "display:grid;grid-template-columns:34px 1.5fr .6fr 2fr;",
      gridRows = [],
      gridState = { sensenom: [] },
      cellsOf = (tr) => Array.from(tr.querySelectorAll("input"));
    const gHead = mk(
      "div",
      F + RC + "background:#f9fafb;border-bottom:1px solid #e5e7eb;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em",
    );
    ["", "Nom alumne", "Nota", "Comentari"].forEach((t) => {
      const h = mk("div", "padding:8px 10px" + (t ? ";border-left:1px solid #f0f0f0" : ""));
      h.textContent = t;
      gHead.appendChild(h);
    });
    const gBody = mk("div", "max-height:230px;overflow-y:auto");
    gridEl.appendChild(gHead);
    gridEl.appendChild(gBody);
    function focusCell(r, c) {
      while (gridRows.length <= r) addRow();
      const i = cellsOf(gridRows[r])[c];
      if (i) {
        i.focus();
        i.select();
      }
    }
    function addRow() {
      const tr = mk("div", RC + (gridRows.length ? "border-top:1px solid #f0f0f0" : ""));
      const n = mk(
        "div",
        F + "font-size:11px;color:#9ca3af;display:flex;align-items:center;justify-content:center;background:#fafafa",
      );
      n.textContent = gridRows.length + 1;
      tr.appendChild(n);
      for (let c = 0; c < 3; c++) {
        const inp = mk(
          "input",
          F + "border:none;border-left:1px solid #f0f0f0;padding:8px 10px;font-size:13px;color:#0f0f1a;outline:none;background:transparent;min-width:0;width:100%",
        );
        inp.type = "text";
        inp.spellcheck = false;
        inp.autocomplete = "off";
        inp.dataset.c = c;
        inp.addEventListener("input", sync);
        inp.addEventListener("paste", onPaste);
        inp.addEventListener("keydown", (e) => {
          const r = gridRows.indexOf(tr);
          if (e.key === "Enter" || e.key === "ArrowDown") {
            e.preventDefault();
            focusCell(r + 1, c);
          } else if (e.key === "ArrowUp" && r > 0) {
            e.preventDefault();
            focusCell(r - 1, c);
          }
        });
        tr.appendChild(inp);
      }
      gBody.appendChild(tr);
      gridRows.push(tr);
    }
    function onPaste(e) {
      const txt = (e.clipboardData || window.clipboardData).getData("text");
      if (!/[\t\n\r]/.test(txt)) return; // text simple d'una sola cel·la: comportament normal
      e.preventDefault();
      const r0 = gridRows.indexOf(e.target.parentNode),
        c0 = +e.target.dataset.c;
      const data = netejaExcel(txt)
        .split("\n")
        .map((l) => l.split("\t"));
      while (data.length && data[data.length - 1].every((x) => !x.trim())) data.pop();
      let perdudes = false;
      data.forEach((p, i) => {
        while (gridRows.length <= r0 + i) addRow();
        const ins = cellsOf(gridRows[r0 + i]);
        p.forEach((v, j) => {
          if (c0 + j > 2) {
            if (v.trim()) perdudes = true;
            return;
          }
          ins[c0 + j].value = v.trim();
        });
      });
      sync();
      msg.textContent = perdudes ? "ℹ️ Hi havia més columnes de les que caben des d'aquesta cel·la: les sobrants s'han ignorat." : "";
    }
    function sync() {
      const lines = [],
        sn = [];
      let blank = 0;
      for (let i = gridRows.length - 1; i >= 0; i--) {
        if (cellsOf(gridRows[i]).every((x) => !x.value.trim())) blank++;
        else break;
      }
      while (blank < 2) {
        addRow();
        blank++;
      }
      gridRows.forEach((tr, i) => {
        const cs = cellsOf(tr),
          v = cs.map((x) => x.value.replace(/[\t\r\n]+/g, " ").trim());
        const buida = !v[0] && !v[1] && !v[2];
        const falta = !buida && !v[0];
        cs[0].style.boxShadow = falta ? "inset 0 0 0 2px #fca5a5" : "none";
        if (buida) return;
        if (falta) {
          sn.push(i + 1);
          return;
        }
        lines.push(v.join("\t"));
      });
      ta.value = lines.join("\n");
      gridState.sensenom = sn;
      const k = lines.length;
      cnt.textContent =
        (k ? k + " alumne" + (k > 1 ? "s" : "") + " detectat" + (k > 1 ? "s" : "") : "") +
        (sn.length ? (k ? " · " : "") + "⚠️ " + sn.length + (sn.length > 1 ? " files" : " fila") + " sense nom (" + sn.join(", ") + ")" : "");
    }
    for (let i = 0; i < 6; i++) addRow();
    const dryCb = box.querySelector(".optDry"),
      goBtn = box.querySelector(".optGo");
    dryCb.onchange = () => {
      goBtn.textContent = dryCb.checked ? "Diagnosticar →" : "Executar →";
      goBtn.style.background = dryCb.checked ? "#2563eb" : "#0f0f1a";
    };
    box.querySelector(".optClr").onclick = () => {
      gridRows.forEach((tr) => cellsOf(tr).forEach((x) => (x.value = "")));
      msg.textContent = "";
      sync();
    };
    box.querySelector(".optAll").onclick = () => gd.querySelectorAll("input").forEach((c) => (c.checked = true));
    box.querySelector(".optNone").onclick = () => gd.querySelectorAll("input").forEach((c) => (c.checked = false));
    box.querySelector(".optNo").onclick = closeAll;
    box.querySelector(".optI").onclick = () => {
      box.querySelector(".optMain").style.display = "none";
      box.querySelector(".optInfo").style.display = "block";
    };
    box.querySelector(".optBack").onclick = () => {
      box.querySelector(".optInfo").style.display = "none";
      box.querySelector(".optMain").style.display = "block";
    };
    box.querySelector(".optGo").onclick = function () {
      let t = ta.value,
        d = box.querySelector(".optDry").checked,
        oa = (owAuto = box.querySelector(".optOwA").checked),
        sel = Array.from(gd.querySelectorAll("input:checked")).map((c) => c.value);
      if (gridState.sensenom.length) {
        msg.textContent =
          "⚠️ Falta el nom a " + (gridState.sensenom.length > 1 ? "les files " : "la fila ") + gridState.sensenom.join(", ") + ": sense nom no sé a quin alumne aplicar la nota ni el comentari";
        return;
      }
      if (!t.trim()) {
        msg.textContent = "⚠️ Enganxa la llista d'alumnes";
        return;
      }
      if (!sel.length) {
        msg.textContent = "⚠️ Marca almenys un grup";
        return;
      }
      dlg.ov.remove();
      executa(t, d, sel);
    };
  }
  init().catch((e) => {
    window.__optBusy = false;
    alert("ERROR: " + e.message);
  });
})();
