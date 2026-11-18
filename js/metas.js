/* ==========================================
   ECOCONTA - PÁGINA DE METAS E RECOMPENSAS
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // INICIALIZA OS ÍCONES
    if (window.lucide) {
        lucide.createIcons();
    }

    // MENU MOBILE
    const botaoMenu = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");

    botaoMenu.addEventListener("click", function () {

        const aberto = menu.classList.toggle("ativo");

        botaoMenu.setAttribute("aria-expanded", String(aberto));
        botaoMenu.setAttribute(
            "aria-label",
            aberto ? "Fechar menu" : "Abrir menu"
        );

    });

});