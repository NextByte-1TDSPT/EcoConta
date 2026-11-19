document.addEventListener("DOMContentLoaded", function () {
  // INICIALIZA OS ÍCONES
  if (window.lucide) {
    lucide.createIcons();
  }

  // ELEMENTOS DO MENU
  const botaoMenu = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  // MENU MOBILE
  if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", function () {
      const aberto = menu.classList.toggle("menu-aberto");

      botaoMenu.setAttribute("aria-expanded", String(aberto));
      botaoMenu.setAttribute(
        "aria-label",
        aberto ? "Fechar menu" : "Abrir menu",
      );
    });

    // FECHAR MENU AO CLICAR EM UM LINK
    const links = menu.querySelectorAll("a");

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("menu-aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  // LINK MINHA CONTA
  const linkConta = document.querySelector("[data-link-conta]");

  if (linkConta) {
    const estaLogado = sessionStorage.getItem("ecoconta_autenticado");
    const perfil = localStorage.getItem("ecoconta_perfil");

    if (estaLogado === "true" && perfil) {
      linkConta.href = "perfil.html";
    } else {
      linkConta.href = "acesso.html";
    }

    linkConta.textContent = "Minha conta";
  }
});
