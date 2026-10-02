/* ============================================================================
   MODO VITRINE — usado pela home do portfólio
   ----------------------------------------------------------------------------
   index.html?vitrine=desktop   tela grande da vitrine
   index.html?vitrine=celular   tela do celular da vitrine
   Sem o parâmetro, este arquivo não faz nada.

   Protocolo (o mesmo do Credencia):
     home → app   { tipo: "vitrine:passo", passo }
     app  → home  { origem: "vitrine", tipo: "pronto" | "fim", tela, passo }

   Cada passo volta a um ponto de partida fixo e executa um roteiro: um cursor
   vai até o elemento, clica (element.click() de verdade) e digita nos campos.
   Os títulos dos passos ficam em home/projects-data.js — mudar a quantidade
   ou a ordem aqui exige mudar lá também.
   ============================================================================ */
(function () {
  var modo = new URLSearchParams(location.search).get("vitrine");
  if (modo !== "desktop" && modo !== "celular") return;

  document.documentElement.classList.add("vitrine", "vitrine-" + modo);

  /* ------------------------------------------------------------ estilos */

  var estilo = document.createElement("style");
  estilo.textContent =
    ".vitrine .wa{display:none!important}" +
    // Sem barras de rolagem dentro das telas da vitrine: a tela só desliza.
    "html.vitrine,html.vitrine *{scrollbar-width:none}" +
    "html.vitrine ::-webkit-scrollbar{display:none}" +
    "html.vitrine body{overflow-x:hidden}" +
    ".vt-cursor{position:fixed;left:0;top:0;z-index:9999;pointer-events:none;opacity:0;" +
    "transition:transform .68s cubic-bezier(.45,.05,.2,1),opacity .3s}" +
    ".vt-cursor svg{display:block;transform:translate(-3px,-2px);filter:drop-shadow(0 4px 10px rgba(0,0,0,.45))}" +
    ".vt-toque{display:block;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;" +
    "border:2px solid rgba(29,78,216,.75);background:rgba(37,99,235,.18);box-shadow:0 0 0 6px rgba(37,99,235,.1)}" +
    ".vt-onda{position:absolute;left:0;top:0;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;" +
    "border:2px solid rgba(37,99,235,.9);animation:vtOnda .62s ease-out forwards}" +
    "@keyframes vtOnda{from{transform:scale(.3);opacity:1}to{transform:scale(1.5);opacity:0}}" +
    ".vitrine-celular .al-banner h1{font-size:21px}" +
    ".vitrine-celular .al-banner p{font-size:13px}";
  document.head.appendChild(estilo);

  /* ------------------------------------------------------------ cursor */

  var cursor = document.createElement("div");
  cursor.className = "vt-cursor vt-" + modo;
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML =
    modo === "desktop"
      ? '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 2.5 19.5 13l-7 1.2 3.9 7.3-2.6 1.4-3.9-7.3L4.8 20Z" fill="#fff" stroke="#0b1220" stroke-width="1.4" stroke-linejoin="round"/></svg>'
      : '<span class="vt-toque"></span>';
  document.body.appendChild(cursor);

  function moverCursor(x, y) {
    cursor.style.transform = "translate(" + x + "px," + y + "px)";
    cursor.style.opacity = "1";
  }
  function esconderCursor() {
    cursor.style.opacity = "0";
  }
  function onda() {
    var o = document.createElement("span");
    o.className = "vt-onda";
    cursor.appendChild(o);
    setTimeout(function () { o.remove(); }, 700);
  }

  /* ------------------------------------------------------------- motor */

  var token = 0;
  var CANCELADO = {};

  function Roteiro(t) { this.t = t; }


  Roteiro.prototype.checar = function () {
    if (this.t !== token) throw CANCELADO;
  };

  Roteiro.prototype.esperar = function (ms) {
    var self = this;
    self.checar();
    return new Promise(function (r) { setTimeout(r, ms); }).then(function () { self.checar(); });
  };

  Roteiro.prototype.alvo = async function (sel, limite) {
    var inicio = performance.now();
    for (;;) {
      this.checar();
      var el = document.querySelector(sel);
      if (el && el.offsetParent !== null) return el;
      if (performance.now() - inicio > (limite || 4000)) throw new Error("alvo não encontrado: " + sel);
      await new Promise(function (r) { setTimeout(r, 60); });
    }
  };

  // Rola só a janela do próprio app. scrollIntoView não serve: dentro de um
  // iframe ele também rolaria a página que hospeda a vitrine.
  Roteiro.prototype.rolarAte = async function (el, bloco) {
    var r = el.getBoundingClientRect();
    var desloc = bloco === "topo" ? r.top - 90 : r.top - (innerHeight - r.height) / 2;
    window.scrollTo({ top: scrollY + desloc, behavior: "smooth" });
    await this.esperar(750);
  };

  Roteiro.prototype.rolar = async function (y) {
    window.scrollTo({ top: y, behavior: "smooth" });
    await this.esperar(900);
  };

  Roteiro.prototype.apontar = async function (sel) {
    var el = await this.alvo(sel);
    var r = el.getBoundingClientRect();
    if (r.top < 70 || r.bottom > innerHeight - 20) {
      await this.rolarAte(el);
      r = el.getBoundingClientRect();
    }
    moverCursor(r.left + Math.min(r.width / 2, 120), r.top + r.height / 2);
    await this.esperar(720);
    return el;
  };

  Roteiro.prototype.clicar = async function (sel) {
    var el = await this.apontar(sel);
    onda();
    await this.esperar(180);
    el.click();
    await this.esperar(450);
  };

  Roteiro.prototype.digitar = async function (sel, texto, intervalo) {
    var el = await this.apontar(sel);
    onda();
    el.focus({ preventScroll: true });
    el.value = "";
    el.dispatchEvent(new Event("input", { bubbles: true }));
    for (var i = 1; i <= texto.length; i++) {
      el.value = texto.slice(0, i);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      await this.esperar(intervalo || 55);
    }
    await this.esperar(300);
  };

  Roteiro.prototype.escolher = async function (sel, valor) {
    var el = await this.apontar(sel);
    onda();
    el.value = valor;
    el.dispatchEvent(new Event("change", { bubbles: true }));
    await this.esperar(500);
  };

  Roteiro.prototype.ir = async function (hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
    await this.esperar(650);
  };

  /* --------------------------------------------- ponto de partida */

  // Os filtros são variáveis globais de app.js; zerar todos deixa cada passo
  // começar igual, mesmo se o visitante pular passos.
  function zerarFiltros() {
    filtroTrilha = "Todos";
    filtroBusca = "";
    alunoAba = "todos";
    alunoBusca = "";
    admFiltroTrilha = "Todas";
    admBusca = "";
    var t = document.getElementById("toast");
    if (t) t.hidden = true;
  }

  /* ---------------------------------------------------------- roteiros */

  var ROTEIROS = {
    desktop: [
      // 0 · Site público e catálogo
      async function (r) {
        await r.ir("#/");
        await r.esperar(2200);
        await r.clicar('.site-nav a[href="#/cursos"]');
        await r.esperar(600);
        await r.digitar("#busca", "leitura", 90);
        await r.esperar(900);
        await r.digitar("#busca", "", 0);
        await r.clicar('[data-trilha="Educação e Tecnologia"]');
        await r.esperar(1400);
        await r.clicar('[data-trilha="Inclusão e Equidade"]');
        await r.esperar(1600);
      },
      // 1 · Acesso do cursista
      async function (r) {
        await r.ir("#/");
        await r.esperar(900);
        await r.clicar('.site-nav a[href="#/entrar"]');
        await r.esperar(500);
        await r.digitar("#doc", "2048193", 90);
        await r.digitar("#senha", "formacao26", 70);
        await r.clicar('#form-login button[type="submit"]');
        await r.esperar(2600);
      },
      // 2 · Percurso do cursista
      async function (r) {
        await r.ir("#/aluno");
        await r.esperar(1200);
        await r.clicar('[data-aba="andamento"]');
        await r.esperar(1200);
        await r.clicar('[data-aba="concluidos"]');
        await r.esperar(1200);
        await r.clicar('[data-aba="todos"]');
        await r.digitar("#al-busca", "leitura", 90);
        await r.esperar(1800);
      },
      // 3 · Sala de aula
      async function (r) {
        await r.ir("#/aluno");
        await r.esperar(700);
        await r.clicar('.al-curso a[href^="#/curso/"]');
        await r.esperar(1400);
        await r.clicar('[data-painel="materiais"]');
        await r.esperar(1400);
        await r.clicar('[data-painel="atividades"]');
        await r.esperar(1600);
      },
      // 4 · Painel de produção
      async function (r) {
        await r.ir("#/admin");
        await r.esperar(1400);
        await r.escolher("#adm-trilha", "Linguagens");
        await r.esperar(1200);
        await r.escolher("#adm-trilha", "Todas");
        await r.digitar("#adm-busca", "matemática", 80);
        await r.esperar(1400);
        await r.apontar(".admin-grid > *");
        await r.esperar(1600);
      },
    ],
    celular: [
      // 0 · Site público no celular
      async function (r) {
        await r.ir("#/");
        await r.esperar(1800);
        await r.rolarAte(await r.alvo("#cursos"), "topo");
        await r.esperar(1800);
        await r.rolarAte(await r.alvo("#plataforma"), "topo");
        await r.esperar(1800);
        await r.rolarAte(await r.alvo("#guias"), "topo");
        await r.esperar(1600);
      },
      // 1 · Login no celular
      async function (r) {
        await r.ir("#/entrar");
        await r.esperar(1400);
        await r.digitar("#doc", "2048193", 110);
        await r.digitar("#senha", "formacao26", 90);
        await r.clicar('#form-login button[type="submit"]');
        await r.esperar(2400);
      },
      // 2 · Meus cursos no celular
      async function (r) {
        await r.ir("#/aluno");
        await r.esperar(1500);
        await r.rolarAte(await r.alvo("#al-abas"), "topo");
        await r.esperar(800);
        await r.clicar('[data-aba="andamento"]');
        await r.esperar(1400);
        await r.rolarAte(await r.alvo("#al-lista"), "topo");
        await r.esperar(1800);
      },
      // 3 · Aula no celular
      async function (r) {
        await r.ir("#/curso/c11");
        await r.esperar(1800);
        await r.rolar(560);
        await r.esperar(1500);
        await r.rolar(1150);
        await r.esperar(1800);
      },
      // 4 · Painel no celular
      async function (r) {
        await r.ir("#/admin");
        await r.esperar(1800);
        await r.rolarAte(await r.alvo(".filters"), "topo");
        await r.esperar(1400);
        await r.rolarAte(await r.alvo("#adm-grade"), "topo");
        await r.esperar(2200);
      },
    ],
  };

  /* --------------------------------------------- conversa com a home */

  function avisar(msg) {
    msg.origem = "vitrine";
    msg.tela = modo;
    if (parent !== window) parent.postMessage(msg, "*");
  }

  async function executar(passo) {
    token += 1;
    var r = new Roteiro(token);
    esconderCursor();
    zerarFiltros();
    try {
      var fn = ROTEIROS[modo][passo];
      if (fn) await fn(r);
      esconderCursor();
      avisar({ tipo: "fim", passo: passo });
    } catch (erro) {
      if (erro === CANCELADO) return;
      console.warn("[vitrine]", erro);
      esconderCursor();
      avisar({ tipo: "fim", passo: passo });
    }
  }

  window.addEventListener("message", function (e) {
    var d = e.data;
    if (d && d.tipo === "vitrine:passo" && typeof d.passo === "number") executar(d.passo);
    if (d && d.tipo === "vitrine:parar") {
      token += 1;
      esconderCursor();
    }
  });

  avisar({ tipo: "pronto" });
})();
