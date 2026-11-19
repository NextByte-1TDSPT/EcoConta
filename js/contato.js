document.addEventListener("DOMContentLoaded", function () {
  // ATIVA OS ÍCONES LUCIDE
  if (window.lucide) {
    lucide.createIcons();
  }

  // FORMULÁRIO DEMONSTRATIVO
  const formulario = document.getElementById("formulario-contato");
  const status = document.getElementById("status-formulario");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (formulario.checkValidity()) {
      status.textContent =
        "Formulário demonstrativo. Nenhuma mensagem foi enviada.";
    }
  });
});
