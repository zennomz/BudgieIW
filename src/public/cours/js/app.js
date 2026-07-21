/* =====================================================================
   Budgie — Cours interactif : app.js (moteur, JavaScript vanilla)
   Aucune dépendance, aucun fetch : tout est chargé via <script src>.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- État ---------- */
  var SECTIONS = [
    { id: "architecture", icone: "🏛️", titre: "Architecture" },
    { id: "technos",      icone: "🧰", titre: "Technologies" },
    { id: "donnees",      icone: "🗃️", titre: "Modèle de données" },
    { id: "securite",     icone: "🔒", titre: "Sécurité" },
    { id: "deploiement",  icone: "🚀", titre: "Déploiement" },
    { id: "enonce",       icone: "✅", titre: "Vérif. énoncé" },
    { id: "glossaire",    icone: "📖", titre: "Glossaire" },
    { id: "symboles",     icone: "🔣", titre: "Symboles" }
  ];

  var SUBTABS = [
    { id: "code",   label: "📄 Code (pas à pas)" },
    { id: "schema", label: "🗺️ Schéma" },
    { id: "quiz",   label: "❓ Quiz" },
    { id: "exam",   label: "🎤 Questions du prof" },
    { id: "limites",label: "⚠️ Limites" }
  ];

  var state = {
    kind: "feature",       // "feature" | "section"
    id: FEATURES[0].id,
    stepIndex: 0,
    subtab: "code",
    search: "",
    flash: false
  };

  var LS_PROGRESS = "budgie-cours-progress";
  var LS_THEME = "budgie-cours-theme";
  var LS_FLASH = "budgie-cours-flash-eval";

  /* ---------- Utilitaires ---------- */
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function escAttr(s) { return esc(s).replace(/"/g, "&quot;"); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function featureById(id) { for (var i = 0; i < FEATURES.length; i++) if (FEATURES[i].id === id) return FEATURES[i]; return null; }

  /* ---------- Coloration syntaxique maison (tokenizer regex) ---------- */
  var SYNTAX_RE = /(\{\{--[\s\S]*?--\}\}|\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(@\w+)|(\{\{[\s\S]*?\}\})|(\b\d+(?:\.\d+)?\b)|(\$[A-Za-z_]\w*)|(=>|->|::|===|!==|>=|<=|&&|\|\||!)|(\b(?:return|function|public|private|protected|static|abstract|final|class|interface|extends|implements|use|namespace|new|echo|print|if|else|elseif|endif|foreach|endforeach|for|while|switch|case|default|break|continue|match|try|catch|finally|throw|fn|const|let|var|async|await|true|false|null|this|self|parent|array|void|bool|int|float|string|as|instanceof)\b)|([A-Za-z_]\w*(?=\s*\())/g;

  function highlight(code) {
    var out = "", last = 0, m;
    SYNTAX_RE.lastIndex = 0;
    while ((m = SYNTAX_RE.exec(code))) {
      if (m.index > last) out += esc(code.slice(last, m.index));
      var cls = null, t = m[0];
      if (m[1]) cls = "tok-com";
      else if (m[2]) cls = "tok-str";
      else if (m[3]) cls = "tok-dir";
      else if (m[4]) cls = "tok-dir";
      else if (m[5]) cls = "tok-num";
      else if (m[6]) cls = "tok-var";
      else if (m[7]) cls = "tok-op";
      else if (m[8]) cls = "tok-key";
      else if (m[9]) cls = "tok-fun";
      out += cls ? '<span class="' + cls + '" data-t="' + escAttr(t) + '">' + esc(t) + "</span>" : esc(t);
      last = SYNTAX_RE.lastIndex;
      if (SYNTAX_RE.lastIndex === m.index) SYNTAX_RE.lastIndex++;
    }
    out += esc(code.slice(last));
    return out;
  }

  /* ---------- Couleur par couche ---------- */
  function layerColor(couche) {
    var c = (couche || "").toLowerCase();
    if (c.indexOf("route") === 0) return "#4aa8ff";
    if (c.indexOf("requ") === 0) return "#ffb454";
    if (c.indexOf("contrô") === 0 || c.indexOf("contro") === 0) return "#7c4dff";
    if (c.indexOf("service") === 0) return "#ff6b6b";
    if (c.indexOf("modèle") === 0 || c.indexOf("modele") === 0) return "#2ecc71";
    if (c.indexOf("mail") === 0) return "#ff8bd0";
    if (c.indexOf("vue") === 0) return "#22c1c3";
    if (c.indexOf("migration") === 0) return "#c08457";
    if (c.indexOf("middleware") === 0) return "#e59866";
    if (c.indexOf("config") === 0) return "#95a5a6";
    if (c.indexOf("quota") >= 0) return "#95a5a6";
    return "#4aa8ff";
  }

  /* ---------- Progression (localStorage) ---------- */
  function loadSet(key) {
    try { var a = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(a) ? a : []; }
    catch (e) { return []; }
  }
  function saveSet(key, arr) { try { localStorage.setItem(key, JSON.stringify(arr)); } catch (e) {} }
  function stepKey(fid, i) { return fid + ":" + i; }
  function isDone(fid, i) { return loadSet(LS_PROGRESS).indexOf(stepKey(fid, i)) >= 0; }
  function toggleDone(fid, i) {
    var arr = loadSet(LS_PROGRESS), k = stepKey(fid, i), p = arr.indexOf(k);
    if (p >= 0) arr.splice(p, 1); else arr.push(k);
    saveSet(LS_PROGRESS, arr);
  }
  function totalSteps() { var n = 0; for (var i = 0; i < FEATURES.length; i++) n += FEATURES[i].etapes.length; return n; }
  function doneCount() { return loadSet(LS_PROGRESS).length; }
  function featureCompleted(f) {
    for (var i = 0; i < f.etapes.length; i++) if (!isDone(f.id, i)) return false;
    return f.etapes.length > 0;
  }

  /* ---------- Rendu : en-tête pills + progression ---------- */
  function renderPills() {
    var host = $("#pills");
    var html = "";
    for (var i = 0; i < FEATURES.length; i++) {
      var f = FEATURES[i];
      var active = (state.kind === "feature" && state.id === f.id) ? " active" : "";
      var done = featureCompleted(f) ? " completed" : "";
      html += '<button class="pill' + active + done + '" data-kind="feature" data-id="' + f.id + '">' +
        '<span>' + f.icone + "</span><span>" + esc(f.titre) + '</span><span class="done-dot"></span></button>';
    }
    html += '<span class="sep"></span>';
    for (var j = 0; j < SECTIONS.length; j++) {
      var s = SECTIONS[j];
      var a2 = (state.kind === "section" && state.id === s.id) ? " active" : "";
      html += '<button class="pill section' + a2 + '" data-kind="section" data-id="' + s.id + '">' +
        "<span>" + s.icone + "</span><span>" + esc(s.titre) + "</span></button>";
    }
    host.innerHTML = html;
  }

  function renderProgress() {
    var t = totalSteps(), d = doneCount(), pct = t ? Math.round((d / t) * 100) : 0;
    $("#progress-fill").style.width = pct + "%";
    $("#progress-label").textContent = pct + "%";
  }

  /* ---------- Arborescence ---------- */
  function buildTree(etapes) {
    var root = { dirs: {}, files: {} };
    for (var i = 0; i < etapes.length; i++) {
      var parts = etapes[i].dossier.split("/");
      var node = root;
      for (var p = 0; p < parts.length; p++) {
        var seg = parts[p];
        if (!node.dirs[seg]) node.dirs[seg] = { dirs: {}, files: {} };
        node = node.dirs[seg];
      }
      var fn = etapes[i].fichier;
      if (node.files[fn] === undefined) node.files[fn] = i; // 1re occurrence
    }
    return root;
  }
  function renderTreeNode(node) {
    var html = "<ul>";
    var dirNames = Object.keys(node.dirs);
    for (var i = 0; i < dirNames.length; i++) {
      html += '<li><div class="node dir">📁 ' + esc(dirNames[i]) + "</div>" +
        renderTreeNode(node.dirs[dirNames[i]]) + "</li>";
    }
    var fileNames = Object.keys(node.files);
    for (var j = 0; j < fileNames.length; j++) {
      var idx = node.files[fileNames[j]];
      html += '<li><div class="node file" data-step="' + idx + '">📄 ' + esc(fileNames[j]) + "</div></li>";
    }
    html += "</ul>";
    return html;
  }
  function renderTree(f) {
    var host = $("#tree");
    if (!host) return;
    var tree = buildTree(f.etapes);
    host.innerHTML = renderTreeNode(tree);
    // marquer le fichier courant
    var cur = f.etapes[state.stepIndex];
    var nodes = host.querySelectorAll(".node.file");
    for (var i = 0; i < nodes.length; i++) {
      var si = parseInt(nodes[i].getAttribute("data-step"), 10);
      var e = f.etapes[si];
      if (cur && e.fichier === cur.fichier && e.dossier === cur.dossier) nodes[i].classList.add("active");
      nodes[i].addEventListener("click", (function (idx) {
        return function () { state.stepIndex = idx; state.subtab = "code"; render(); };
      })(si));
    }
  }

  /* ---------- Rendu d'une fonctionnalité ---------- */
  function diffLabel(d) {
    if (d === "facile") return '<span class="diff-badge diff-facile">facile</span>';
    if (d === "cle") return '<span class="diff-badge diff-cle">point clé</span>';
    if (d === "piege") return '<span class="diff-badge diff-piege">piège</span>';
    return "";
  }

  function renderCodeSubtab(f) {
    var e = f.etapes[state.stepIndex];
    var color = layerColor(e.couche);
    var done = isDone(f.id, state.stepIndex);
    var html = "";

    // navigation
    html += '<div class="step-nav">';
    html += '<button class="navbtn" id="prev-step"' + (state.stepIndex === 0 ? " disabled" : "") + ">◀ Précédent</button>";
    html += '<div class="mid">Étape ' + (state.stepIndex + 1) + " / " + f.etapes.length + " — <b>" + esc(e.couche) + "</b></div>";
    html += '<button class="navbtn" id="next-step"' + (state.stepIndex === f.etapes.length - 1 ? " disabled" : "") + ">Suivant ▶</button>";
    html += "</div>";

    // carte
    html += '<div class="step-card">';
    html += '<div class="step-meta">';
    html += '<span class="layer-badge" style="background:' + color + '">' + esc(e.couche) + "</span>";
    html += '<span class="filepath"><b>' + esc(e.fichier) + "</b> — " + esc(e.dossier) + (e.startLine ? " (ligne " + e.startLine + ")" : "") + "</span>";
    html += diffLabel(e.difficulte);
    html += '<span class="step-actions">';
    html += '<button class="mini-btn" id="copy-code">📋 Copier</button>';
    html += '<button class="mini-btn' + (done ? " ok" : "") + '" id="mark-done">' + (done ? "✅ Compris" : "☐ Marquer compris") + "</button>";
    html += "</span></div>";

    html += '<div class="role-line">🎯 <b>Rôle du fichier :</b> ' + esc(e.role) + "</div>";
    html += '<div class="oral">💬 <b>À dire à l\'oral :</b> ' + esc(e.oral) + "</div>";
    html += '<div class="decoder-hint">💡 Cliquez n\'importe quel symbole du code (opérateur, mot-clé, méthode…) pour sa définition précise.</div>';

    // code + explication
    html += '<div class="code-grid"><div class="code-col">';
    for (var i = 0; i < e.lignes.length; i++) {
      var ln = e.startLine ? (e.startLine + i) : (i + 1);
      html += '<div class="code-line" data-i="' + i + '"><span class="ln">' + ln + "</span><code>" + highlight(e.lignes[i].code) + "</code></div>";
    }
    html += '</div><div class="exp-col">';
    for (var k = 0; k < e.lignes.length; k++) {
      html += '<div class="exp-line" data-i="' + k + '">' + expText(e.lignes[k].exp) + "</div>";
    }
    html += "</div></div>";              // ferme exp-col + code-grid
    html += renderDetailBlock(e);        // décorticage détaillé (si présent)
    html += "</div>";                    // ferme step-card
    return html;
  }

  function expText(s) {
    // met en valeur les ⭐ et enveloppe le texte échappé
    return esc(s).replace(/⭐/g, '<span class="dot">⭐</span>');
  }

  function renderSchema(f) {
    var html = '<div class="schema-mantra">🧠 <b>Mantra :</b> ' + esc(f.mantra) + "</div>";
    html += '<div class="flow">';
    // couches distinctes dans l'ordre d'apparition
    var seen = {}, order = [];
    for (var i = 0; i < f.etapes.length; i++) {
      var e = f.etapes[i];
      var key = e.couche + "|" + e.fichier;
      if (!seen[key]) { seen[key] = true; order.push(e); }
    }
    for (var j = 0; j < order.length; j++) {
      var e2 = order[j], col = layerColor(e2.couche);
      html += '<div class="flow-card" style="border-left-color:' + col + '">';
      html += '<div class="fc-head"><span class="fc-layer" style="background:' + col + '">' + esc(e2.couche) + "</span>";
      html += '<span class="fc-file">' + esc(e2.dossier) + "/" + esc(e2.fichier) + "</span></div>";
      html += '<div class="fc-desc">' + esc(e2.role) + "</div></div>";
      if (j < order.length - 1) html += '<div class="flow-arrow">▼</div>';
    }
    html += "</div>";
    // légende
    html += '<div class="legend">';
    var legendSeen = {};
    for (var l = 0; l < f.etapes.length; l++) {
      var cc = f.etapes[l].couche;
      if (legendSeen[cc]) continue; legendSeen[cc] = true;
      html += '<span><span class="sw" style="background:' + layerColor(cc) + '"></span>' + esc(cc) + "</span>";
    }
    html += "</div>";
    return html;
  }

  function renderQuiz(f) {
    var evalSet = loadSet(LS_FLASH);
    var html = '<div class="flash-controls">';
    html += '<button class="tbtn" id="reveal-all">👁️ Tout révéler</button>';
    html += '<button class="tbtn" id="hide-all">🙈 Tout masquer</button>';
    html += '<button class="tbtn" id="toggle-flash">' + (state.flash ? "📖 Mode lecture" : "🎴 Mode flashcards") + "</button>";
    html += "</div>";
    html += '<div class="cards-grid">';
    for (var i = 0; i < f.quiz.length; i++) {
      var q = f.quiz[i];
      var ek = f.id + ":q" + i;
      var known = evalSet.indexOf(ek) >= 0;
      html += '<div class="qcard' + (state.flash ? "" : "") + '" data-qi="' + i + '">';
      html += '<div class="q">❓ ' + esc(q.q) + "</div>";
      html += '<div class="a">✅ ' + esc(q.r);
      if (state.flash) {
        html += '<div style="margin-top:10px;display:flex;gap:8px">' +
          '<button class="mini-btn ok" data-eval="know" data-k="' + ek + '">👍 Su</button>' +
          '<button class="mini-btn" data-eval="revoir" data-k="' + ek + '">🔁 À revoir</button>' +
          (known ? '<span style="color:var(--success);font-size:12px;align-self:center">✔ acquis</span>' : "") +
          "</div>";
      }
      html += "</div>";
      html += '<div class="hint">' + (state.flash ? "Cliquer pour révéler, puis auto-évaluez-vous" : "Cliquer pour révéler la réponse") + "</div>";
      html += "</div>";
    }
    html += "</div>";
    return html;
  }

  function renderExam(f) {
    var html = "";
    for (var i = 0; i < f.examen.length; i++) {
      var x = f.examen[i];
      html += '<div class="exam-item">';
      html += '<div class="exq"><span class="mic">🎤</span><span>' + esc(x.q) + "</span></div>";
      html += '<div class="short">➜ ' + esc(x.court) + "</div>";
      html += '<div class="long">' + esc(x.exp) + "</div>";
      if (x.ref) html += '<div class="ref">📎 ' + esc(x.ref) + "</div>";
      html += "</div>";
    }
    return html;
  }

  function renderLimites(f) {
    if (!f.limites || !f.limites.length) return '<p class="lead">Aucune limite majeure identifiée pour cette fonctionnalité.</p>';
    var html = "";
    for (var i = 0; i < f.limites.length; i++) {
      var l = f.limites[i];
      html += '<div class="limit-item">';
      html += '<div class="lt">⚠️ ' + esc(l.titre) + "</div>";
      html += '<div class="ls"><b>Limite :</b> ' + esc(l.souci) + "</div>";
      html += '<div class="lc"><b>Correction proposée :</b> ' + esc(l.correction) + "</div>";
      html += "</div>";
    }
    return html;
  }

  function renderFeature(f) {
    var html = '<div class="feature-head"><div class="ic">' + f.icone + "</div><div>";
    html += "<h1>" + esc(f.titre) + "</h1><p>" + esc(f.sousTitre) + "</p></div></div>";
    html += '<div class="resume">📌 ' + esc(f.resume) + "</div>";

    html += '<div class="subtabs">';
    for (var i = 0; i < SUBTABS.length; i++) {
      var st = SUBTABS[i];
      html += '<button class="subtab' + (state.subtab === st.id ? " active" : "") + '" data-subtab="' + st.id + '">' + st.label + "</button>";
    }
    html += "</div>";

    html += '<div id="subtab-body">';
    if (state.subtab === "code") html += renderCodeSubtab(f);
    else if (state.subtab === "schema") html += renderSchema(f);
    else if (state.subtab === "quiz") html += renderQuiz(f);
    else if (state.subtab === "exam") html += renderExam(f);
    else if (state.subtab === "limites") html += renderLimites(f);
    html += "</div>";
    return html;
  }

  /* ---------- Rendu des sections transverses ---------- */
  function renderSection(id) {
    if (id === "architecture") return renderArchitecture();
    if (id === "technos") return renderTechnos();
    if (id === "donnees") return renderDonnees();
    if (id === "securite") return renderSecurite();
    if (id === "deploiement") return renderDeploiement();
    if (id === "enonce") return renderEnonce();
    if (id === "glossaire") return renderGlossaire();
    if (id === "symboles") return renderSymboles();
    return "";
  }

  function renderArchitecture() {
    var html = '<div class="section-wrap"><h1>🏛️ Architecture globale</h1>';
    html += '<p class="lead">Patron réel : MVC + couche Service. Voici le trajet d\'une requête, de haut en bas.</p>';
    html += '<div class="schema-mantra">🧠 <b>Mantra :</b> ' + esc(ARCHI.mantra) + "</div>";
    html += '<div class="flow">';
    for (var i = 0; i < ARCHI.couches.length; i++) {
      var c = ARCHI.couches[i], col = layerColor(c.nom);
      html += '<div class="flow-card" style="border-left-color:' + col + '">';
      html += '<div class="fc-head"><span class="fc-layer" style="background:' + col + '">' + c.icone + " " + esc(c.nom) + "</span>";
      html += '<span class="fc-file">' + esc(c.tech) + "</span></div>";
      html += '<div class="fc-desc">' + esc(c.desc) + "</div></div>";
      if (i < ARCHI.couches.length - 1) html += '<div class="flow-arrow">▼</div>';
    }
    html += "</div></div>";
    return html;
  }

  function renderTechnos() {
    var html = '<div class="section-wrap"><h1>🧰 Technologies & méthodes</h1>';
    html += '<p class="lead">Chaque brique : définition, pourquoi ce choix, et où elle est utilisée dans Budgie.</p>';
    html += '<div class="grid-cards">';
    for (var i = 0; i < TECHNOS.length; i++) {
      var t = TECHNOS[i];
      html += '<div class="tech-card"><div class="cat">' + esc(t.cat) + "</div><h3>" + esc(t.nom) + "</h3>";
      html += "<p>" + esc(t.def) + "</p>";
      html += "<p><b>Pourquoi :</b> " + esc(t.pourquoi) + "</p>";
      html += "<p><b>Où :</b> " + esc(t.ou) + "</p></div>";
    }
    html += "</div></div>";
    return html;
  }

  function renderDonnees() {
    var html = '<div class="section-wrap"><h1>🗃️ Modèle de données</h1>';
    html += '<p class="lead">' + esc(DONNEES.intro) + "</p>";
    html += '<div class="schema-mantra">🔗 ' + esc(DONNEES.relations) + "</div>";
    for (var i = 0; i < DONNEES.tables.length; i++) {
      var tb = DONNEES.tables[i];
      html += '<div class="db-card"><h3>▪ ' + esc(tb.nom) + "</h3><ul>";
      for (var j = 0; j < tb.colonnes.length; j++) html += "<li>" + esc(tb.colonnes[j]) + "</li>";
      html += "</ul></div>";
    }
    html += "</div>";
    return html;
  }

  function renderSecurite() {
    var html = '<div class="section-wrap"><h1>🔒 Sécurité</h1>';
    html += '<p class="lead">Les mesures de sécurité présentes dans le code (exigence de l\'énoncé).</p>';
    html += '<div class="grid-cards">';
    for (var i = 0; i < SECURITE.length; i++) {
      var s = SECURITE[i];
      html += '<div class="tech-card"><h3>' + esc(s.titre) + "</h3><p>" + esc(s.desc) + "</p>";
      html += '<p><b>Où :</b> <code class="inline">' + esc(s.ref) + "</code></p></div>";
    }
    html += "</div></div>";
    return html;
  }

  function renderDeploiement() {
    var html = '<div class="section-wrap"><h1>🚀 Déploiement (Docker / Nginx / PHP-FPM)</h1>';
    html += '<p class="lead">' + esc(DEPLOIEMENT.intro) + "</p>";
    html += '<div class="grid-cards">';
    for (var i = 0; i < DEPLOIEMENT.services.length; i++) {
      var sv = DEPLOIEMENT.services[i];
      html += '<div class="tech-card"><h3>' + esc(sv.nom) + "</h3><p>" + esc(sv.desc) + "</p>";
      html += '<p><b>Fichier :</b> <code class="inline">' + esc(sv.ref) + "</code></p></div>";
    }
    html += "</div>";
    html += '<h3 style="margin-top:22px">Lignes Nginx clés</h3><div class="step-card"><div class="code-grid"><div class="code-col">';
    for (var k = 0; k < DEPLOIEMENT.cle.length; k++)
      html += '<div class="code-line" data-i="' + k + '"><span class="ln">›</span><code>' + highlight(DEPLOIEMENT.cle[k].code) + "</code></div>";
    html += '</div><div class="exp-col">';
    for (var m = 0; m < DEPLOIEMENT.cle.length; m++)
      html += '<div class="exp-line" data-i="' + m + '">' + expText(DEPLOIEMENT.cle[m].exp) + "</div>";
    html += "</div></div></div></div>";
    return html;
  }

  function renderEnonce() {
    var html = '<div class="section-wrap"><h1>✅ Vérification de l\'énoncé</h1>';
    html += '<p class="lead">Correspondance entre les exigences (implémentées) et le code du projet.</p>';
    html += '<table class="table"><thead><tr><th>Exigence</th><th>Points</th><th>État</th><th>Fichiers</th><th>Note</th></tr></thead><tbody>';
    for (var i = 0; i < ENONCE.length; i++) {
      var e = ENONCE[i];
      var b = e.statut === "ok" ? '<span class="badge-ok">✔ présent</span>'
        : e.statut === "partiel" ? '<span class="badge-partiel">◐ partiel</span>'
        : '<span class="badge-non">✘ absent</span>';
      html += "<tr><td><b>" + esc(e.exigence) + "</b></td><td>" + esc(e.points) + "</td><td>" + b +
        '</td><td><code class="inline">' + esc(e.fichiers) + "</code></td><td>" + esc(e.note) + "</td></tr>";
    }
    html += "</tbody></table></div>";
    return html;
  }

  function renderGlossaire() {
    var html = '<div class="section-wrap"><h1>📖 Glossaire</h1>';
    html += '<p class="lead">Tous les termes techniques, définis simplement.</p><div class="grid-cards">';
    for (var i = 0; i < GLOSSAIRE.length; i++) {
      html += '<div class="tech-card"><h3>' + esc(GLOSSAIRE[i].term) + "</h3><p>" + esc(GLOSSAIRE[i].def) + "</p></div>";
    }
    html += "</div></div>";
    return html;
  }

  /* ---------- Décodeur de symboles (clic sur un token du code) ---------- */
  var SYM_MAP = (function () {
    var map = {};
    for (var i = 0; i < SYMBOLES.length; i++) {
      var s = SYMBOLES[i];
      var parts = s.sym.split(" / ");            // ex: "const / let"
      for (var p = 0; p < parts.length; p++) {
        var key = parts[p].trim();
        if (key) map[key] = s;                    // ex: "validate()"
        var bare = key.replace(/\(\)$/, "");      // ex: "validate"
        if (bare && bare !== key && !map[bare]) map[bare] = s;
      }
    }
    return map;
  })();

  function decodeToken(text, cls) {
    if (SYM_MAP[text]) return { t: text, cat: SYM_MAP[text].cat, def: SYM_MAP[text].def };
    var bare = text.replace(/\(\)$/, "");
    if (SYM_MAP[bare]) return { t: text, cat: SYM_MAP[bare].cat, def: SYM_MAP[bare].def };
    if (cls === "tok-var") return { t: text, cat: "Variable", def: "Variable PHP « " + text + " » : le $ marque une variable ; elle contient une valeur." };
    if (cls === "tok-str") return { t: text, cat: "Chaîne", def: "Chaîne de caractères (du texte, entre guillemets)." };
    if (cls === "tok-num") return { t: text, cat: "Nombre", def: "Valeur numérique." };
    if (cls === "tok-com") return { t: text, cat: "Commentaire", def: "Commentaire : ignoré à l'exécution, sert à expliquer le code." };
    if (cls === "tok-fun") return { t: text, cat: "Méthode", def: "Méthode/fonction « " + text + "() » : une action nommée (voir l'onglet Symboles pour le détail)." };
    if (cls === "tok-key") return { t: text, cat: "Mot-clé", def: "Mot-clé du langage « " + text + " »." };
    if (cls === "tok-op") return { t: text, cat: "Opérateur", def: "Opérateur « " + text + " »." };
    if (cls === "tok-dir") {
      if (text.charAt(0) === "@") return { t: text, cat: "Directive Blade", def: "Directive Blade « " + text + " » : instruction du moteur de template." };
      return { t: text, cat: "Blade", def: "Affichage Blade : insère une valeur en l'échappant (protection XSS)." };
    }
    return { t: text, cat: "Symbole", def: "Symbole « " + text + " »." };
  }

  var _decoderEl = null;
  function decoderEl() {
    if (!_decoderEl) {
      _decoderEl = document.createElement("div");
      _decoderEl.className = "sym-pop";
      _decoderEl.style.display = "none";
      document.body.appendChild(_decoderEl);
    }
    return _decoderEl;
  }
  function showDecoder(span) {
    var cls = "";
    var m = (span.className || "").match(/tok-\w+/);
    if (m) cls = m[0];
    var info = decodeToken(span.getAttribute("data-t") || span.textContent, cls);
    var el = decoderEl();
    el.innerHTML = '<span class="sym-pop-cat">' + esc(info.cat) + '</span><code class="sym-pop-t">' + esc(info.t) + '</code><div class="sym-pop-def">' + esc(info.def) + "</div>";
    el.style.display = "block";
    var r = span.getBoundingClientRect();
    var top = r.bottom + 8;
    var left = Math.max(8, Math.min(r.left, window.innerWidth - el.offsetWidth - 12));
    if (top + el.offsetHeight > window.innerHeight - 8) top = r.top - el.offsetHeight - 8;
    el.style.top = top + "px";
    el.style.left = left + "px";
  }
  function hideDecoder() { if (_decoderEl) _decoderEl.style.display = "none"; }

  /* ---------- Décorticage détaillé (caractère par caractère) ---------- */
  function renderDetail(s) {
    return esc(s).replace(/⭐/g, '<span class="dot">⭐</span>').replace(/`([^`]+)`/g, '<code class="inline">$1</code>');
  }
  function renderDetailBlock(e) {
    var any = false;
    for (var i = 0; i < e.lignes.length; i++) { if (e.lignes[i].detail) { any = true; break; } }
    if (!any) return "";
    var html = '<details class="detail-block"><summary>🔬 Décortiquer caractère par caractère</summary><div class="detail-body">';
    for (var j = 0; j < e.lignes.length; j++) {
      var l = e.lignes[j];
      if (!l.detail) continue;
      html += '<div class="detail-item"><div class="detail-code"><code>' + highlight(l.code) + '</code></div><div class="detail-txt">' + renderDetail(l.detail) + "</div></div>";
    }
    html += "</div></details>";
    return html;
  }

  /* ---------- Section Symboles ---------- */
  function renderSymboles() {
    var html = '<div class="section-wrap"><h1>🔣 Symboles — que fait chaque caractère</h1>';
    html += '<p class="lead">Référence de tous les symboles, opérateurs, mots-clés et méthodes. Astuce : dans l\'onglet Code, cliquez n\'importe quel symbole pour sa définition.</p>';
    var cats = [], byCat = {};
    for (var i = 0; i < SYMBOLES.length; i++) {
      var s = SYMBOLES[i];
      if (!byCat[s.cat]) { byCat[s.cat] = []; cats.push(s.cat); }
      byCat[s.cat].push(s);
    }
    for (var c = 0; c < cats.length; c++) {
      html += '<h3 class="sym-cat-title">' + esc(cats[c]) + '</h3><div class="sym-grid">';
      var list = byCat[cats[c]];
      for (var k = 0; k < list.length; k++) {
        html += '<div class="sym-row"><code class="sym-key">' + esc(list[k].sym) + '</code><span class="sym-def">' + esc(list[k].def) + "</span></div>";
      }
      html += "</div>";
    }
    html += "</div>";
    return html;
  }

  /* ---------- Rendu global ---------- */
  function render() {
    renderPills();
    renderProgress();
    var layout = $("#layout");
    if (state.kind === "feature") {
      var f = featureById(state.id);
      if (state.stepIndex >= f.etapes.length) state.stepIndex = 0;
      layout.className = "layout";
      layout.innerHTML =
        '<aside class="tree-panel"><div class="tree-title">Arborescence du projet</div><div class="tree" id="tree"></div></aside>' +
        '<section class="content" id="content"></section>';
      $("#content").innerHTML = renderFeature(f);
      renderTree(f);
      wireFeature(f);
    } else {
      layout.className = "layout no-tree";
      layout.innerHTML = '<section class="content section-content" id="content"></section>';
      $("#content").innerHTML = renderSection(state.id);
    }
    if (state.search) applySearch(state.search);
  }

  /* ---------- Câblage des interactions d'une fonctionnalité ---------- */
  function wireFeature(f) {
    var subtabs = document.querySelectorAll(".subtab");
    for (var i = 0; i < subtabs.length; i++) {
      subtabs[i].addEventListener("click", function () {
        state.subtab = this.getAttribute("data-subtab"); render();
      });
    }
    if (state.subtab === "code") {
      var prev = $("#prev-step"), next = $("#next-step");
      if (prev) prev.addEventListener("click", function () { if (state.stepIndex > 0) { state.stepIndex--; render(); } });
      if (next) next.addEventListener("click", function () { if (state.stepIndex < f.etapes.length - 1) { state.stepIndex++; render(); } });
      var copy = $("#copy-code");
      if (copy) copy.addEventListener("click", function () { copyCode(f.etapes[state.stepIndex]); });
      var mark = $("#mark-done");
      if (mark) mark.addEventListener("click", function () { toggleDone(f.id, state.stepIndex); render(); });
      wireSyncHover();
    }
    if (state.subtab === "quiz") wireQuiz(f);
  }

  function wireSyncHover() {
    var lines = document.querySelectorAll(".code-line[data-i], .exp-line[data-i]");
    function set(i, on) {
      var els = document.querySelectorAll('[data-i="' + i + '"]');
      for (var k = 0; k < els.length; k++) els[k].classList.toggle("hl", on);
    }
    for (var j = 0; j < lines.length; j++) {
      lines[j].addEventListener("mouseenter", function () { set(this.getAttribute("data-i"), true); });
      lines[j].addEventListener("mouseleave", function () { set(this.getAttribute("data-i"), false); });
    }
  }

  function wireQuiz(f) {
    var cards = document.querySelectorAll(".qcard");
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener("click", function (ev) {
        if (ev.target.getAttribute && ev.target.getAttribute("data-eval")) return; // boutons su/revoir
        this.classList.toggle("revealed");
      });
    }
    var ra = $("#reveal-all"), ha = $("#hide-all"), tf = $("#toggle-flash");
    if (ra) ra.addEventListener("click", function () { toggleAll(true); });
    if (ha) ha.addEventListener("click", function () { toggleAll(false); });
    if (tf) tf.addEventListener("click", function () { state.flash = !state.flash; render(); });
    var evals = document.querySelectorAll("[data-eval]");
    for (var j = 0; j < evals.length; j++) {
      evals[j].addEventListener("click", function (ev) {
        ev.stopPropagation();
        var k = this.getAttribute("data-k"), kind = this.getAttribute("data-eval");
        var arr = loadSet(LS_FLASH), p = arr.indexOf(k);
        if (kind === "know" && p < 0) arr.push(k);
        if (kind === "revoir" && p >= 0) arr.splice(p, 1);
        saveSet(LS_FLASH, arr); render();
      });
    }
  }
  function toggleAll(on) {
    var cards = document.querySelectorAll(".qcard");
    for (var i = 0; i < cards.length; i++) cards[i].classList.toggle("revealed", on);
  }

  /* ---------- Copier le code ---------- */
  function copyCode(etape) {
    var text = etape.lignes.map(function (l) { return l.code; }).join("\n");
    var done = function () { flash("📋 Code copié !"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else fallbackCopy(text, done);
  }
  function fallbackCopy(text, cb) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta); if (cb) cb();
  }
  function flash(msg) {
    var d = document.createElement("div");
    d.textContent = msg;
    d.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--card);border:1px solid var(--accent);color:var(--text);padding:10px 16px;border-radius:10px;z-index:99;box-shadow:var(--shadow)";
    document.body.appendChild(d);
    setTimeout(function () { d.style.transition = "opacity .4s"; d.style.opacity = "0"; setTimeout(function () { d.remove(); }, 400); }, 1200);
  }

  /* ---------- Recherche (surligne dans le contenu affiché) ---------- */
  function applySearch(term) {
    var root = $("#content");
    if (!root) return;
    clearMarks(root);
    if (!term || term.length < 2) return;
    var rx;
    try { rx = new RegExp("(" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"); }
    catch (e) { return; }
    var count = markIn(root, rx);
    var first = root.querySelector(".mark");
    if (first) first.scrollIntoView({ block: "center" });
  }
  function markIn(node, rx) {
    var count = 0;
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        if (p && (p.tagName === "SCRIPT" || p.tagName === "STYLE" || p.classList.contains("mark"))) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var targets = [], cur;
    while ((cur = walker.nextNode())) if (rx.test(cur.nodeValue)) { rx.lastIndex = 0; targets.push(cur); }
    for (var i = 0; i < targets.length; i++) {
      var t = targets[i], frag = document.createDocumentFragment(), s = t.nodeValue, last = 0, m;
      rx.lastIndex = 0;
      while ((m = rx.exec(s))) {
        if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
        var mk = document.createElement("span"); mk.className = "mark"; mk.textContent = m[0];
        frag.appendChild(mk); last = rx.lastIndex; count++;
        if (rx.lastIndex === m.index) rx.lastIndex++;
      }
      if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
      t.parentNode.replaceChild(frag, t);
    }
    return count;
  }
  function clearMarks(root) {
    var marks = root.querySelectorAll(".mark");
    for (var i = 0; i < marks.length; i++) {
      var mk = marks[i], tn = document.createTextNode(mk.textContent);
      mk.parentNode.replaceChild(tn, mk); mk.parentNode.normalize && mk.parentNode.normalize();
    }
  }

  /* ---------- Thème ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(LS_THEME, t); } catch (e) {}
    var b = $("#theme-btn"); if (b) b.textContent = t === "light" ? "🌙 Sombre" : "☀️ Clair";
  }

  /* ---------- Initialisation ---------- */
  function init() {
    var savedTheme = "dark";
    try { savedTheme = localStorage.getItem(LS_THEME) || "dark"; } catch (e) {}
    applyTheme(savedTheme);

    $("#pills").addEventListener("click", function (ev) {
      var p = ev.target.closest ? ev.target.closest(".pill") : null;
      if (!p) return;
      state.kind = p.getAttribute("data-kind");
      state.id = p.getAttribute("data-id");
      state.stepIndex = 0; state.subtab = "code";
      render();
    });

    $("#search").addEventListener("input", function () {
      state.search = this.value.trim();
      applySearch(state.search);
    });

    $("#theme-btn").addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      applyTheme(cur === "light" ? "dark" : "light");
    });
    $("#print-btn").addEventListener("click", function () { window.print(); });

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") { hideDecoder(); return; }
      var tag = (ev.target && ev.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (state.kind !== "feature" || state.subtab !== "code") return;
      var f = featureById(state.id);
      if (ev.key === "ArrowLeft" && state.stepIndex > 0) { state.stepIndex--; render(); }
      else if (ev.key === "ArrowRight" && state.stepIndex < f.etapes.length - 1) { state.stepIndex++; render(); }
    });

    // Décodeur : clic sur un symbole du code → popover de définition
    document.addEventListener("click", function (ev) {
      var span = ev.target && ev.target.closest ? ev.target.closest("[data-t]") : null;
      if (span) { showDecoder(span); ev.stopPropagation(); return; }
      if (!(ev.target && ev.target.closest && ev.target.closest(".sym-pop"))) hideDecoder();
    });
    window.addEventListener("scroll", hideDecoder, true);

    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
