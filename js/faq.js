document.addEventListener("DOMContentLoaded", function () {
  if (window.lucide) {
    lucide.createIcons();
  }

  // MENU MOBILE
  const botaoMenu = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  botaoMenu.addEventListener("click", function () {
    const aberto = menu.classList.toggle("aberto");

    botaoMenu.setAttribute("aria-expanded", String(aberto));
    botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });

  // CATEGORIAS DO FAQ
  const cards = document.querySelectorAll(".card-categoria");
  const grupos = document.querySelectorAll(".grupo-perguntas");
  const titulo = document.querySelector("#titulo-perguntas");
  const secao = document.querySelector("#perguntas");

  const titulos = {
    sobre: "Sobre o EcoConta",
    consumo: "Água e energia",
    metas: "Metas de economia",
    ecobot: "EcoBot",
  };

  function selecionarCategoria(categoria) {
    cards.forEach(function (card) {
      const selecionado = card.dataset.categoria === categoria;

      card.classList.toggle("selecionado", selecionado);
      card.setAttribute("aria-pressed", String(selecionado));
    });

    grupos.forEach(function (grupo) {
      grupo.hidden = grupo.dataset.grupo !== categoria;

      grupo.querySelectorAll("details").forEach(function (pergunta) {
        pergunta.open = false;
      });
    });

    titulo.textContent = titulos[categoria];

    secao.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      selecionarCategoria(card.dataset.categoria);
    });
  });

  // CATEGORIA INICIAL
  cards[0].classList.add("selecionado");
  cards[0].setAttribute("aria-pressed", "true");
});
