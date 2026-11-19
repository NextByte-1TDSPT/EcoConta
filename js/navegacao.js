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

        botaoMenu.setAttribute(
            "aria-expanded",
            String(aberto)
        );

        botaoMenu.setAttribute(
            "aria-label",
            aberto ? "Fechar menu" : "Abrir menu"
        );

    });

    /* Menu principal e link Minha conta */
    document.addEventListener("DOMContentLoaded", function () {
        var linkConta = document.querySelector("[data-link-conta]");
        var botao = document.querySelector(".menu-toggle");
        var menu = document.getElementById("menu-principal");

        if (linkConta) {
            var estaLogado = sessionStorage.getItem("ecoconta_autenticado");
            var perfil = localStorage.getItem("ecoconta_perfil");

            if (estaLogado === "true" && perfil) {
                linkConta.href = "perfil.html";
            } else {
                linkConta.href = "acesso.html";
            }
            linkConta.textContent = "Minha conta";
        }

        if (botao && menu) {
            botao.addEventListener("click", function () {
                if (menu.classList.contains("menu-aberto")) {
                    menu.classList.remove("menu-aberto");
                    botao.setAttribute("aria-expanded", "false");
                    botao.setAttribute("aria-label", "Abrir menu");
                } else {
                    menu.classList.add("menu-aberto");
                    botao.setAttribute("aria-expanded", "true");
                    botao.setAttribute("aria-label", "Fechar menu");
                }
            });

            var links = menu.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                links[i].addEventListener("click", function () {
                    menu.classList.remove("menu-aberto");
                    botao.setAttribute("aria-expanded", "false");
                    botao.setAttribute("aria-label", "Abrir menu");
                });
            }
        }
    });