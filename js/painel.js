/* ==========================================
   ECOCONTA - PAINEL E CONSUMO
   Itens comuns às páginas dashboard.html e consumo.html:
   ícones, menu mobile e link "Minha conta".
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
  // INICIALIZA OS ÍCONES LUCIDE
  if (window.lucide) {
    lucide.createIcons();
  }

  // MENU MOBILE (usa a classe "menu-aberto" do css/navegacao.css)
  var botaoMenu = document.querySelector(".menu-toggle");
  var menu = document.getElementById("menu-principal");

  function fecharMenu() {
    menu.classList.remove("menu-aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");
  }

  if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", function () {
      if (menu.classList.contains("menu-aberto")) {
        fecharMenu();
      } else {
        menu.classList.add("menu-aberto");
        botaoMenu.setAttribute("aria-expanded", "true");
        botaoMenu.setAttribute("aria-label", "Fechar menu");
      }
    });

    // Fecha o menu ao escolher um link ou apertar Esc
    var links = menu.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", fecharMenu);
    }

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && menu.classList.contains("menu-aberto")) {
        fecharMenu();
        botaoMenu.focus();
      }
    });
  }

  // LINK "MINHA CONTA": leva ao perfil quando a pessoa já entrou
  var linkConta = document.querySelector("[data-link-conta]");

  if (linkConta) {
    var logado = sessionStorage.getItem("ecoconta_autenticado") === "true";
    var perfil = localStorage.getItem("ecoconta_perfil");

    if (logado && perfil) {
      linkConta.href = "perfil.html";
    }
  }
});
