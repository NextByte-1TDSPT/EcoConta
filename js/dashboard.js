/* ==========================================
   ECOCONTA - PAINEL DE CONSUMO (dashboard.html)
   Usa os dados e cálculos de js/consumo-dados.js.
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
  var dados = window.EcoContaConsumo;

  /* ---------- SAUDAÇÃO ---------- */

  function mostrarSaudacao() {
    var saudacao = document.getElementById("painel-saudacao");
    var perfil = null;

    try {
      perfil = JSON.parse(localStorage.getItem("ecoconta_perfil"));
    } catch (erro) {
      perfil = null;
    }

    if (perfil && perfil.nome) {
      // Usa só o primeiro nome, inserido como texto
      saudacao.textContent = "Olá, " + perfil.nome.split(" ")[0] + "!";
    }
  }

  /* ---------- CARTÕES DE ÁGUA E ENERGIA ---------- */

  // Monta o medidor: consumo até a referência na cor do recurso
  // e o que passar da referência em destaque de alerta.
  function criarMedidor(tipo, quantidade) {
    var recurso = dados.RECURSOS[tipo];
    var escala = Math.max(recurso.referencia * 1.3, quantidade * 1.05);
    var posicaoReferencia = (recurso.referencia / escala) * 100;
    var dentro = (Math.min(quantidade, recurso.referencia) / escala) * 100;
    var excesso = (Math.max(0, quantidade - recurso.referencia) / escala) * 100;

    var medidor = document.createElement("div");
    medidor.className = "medidor";
    medidor.setAttribute("role", "img");
    medidor.setAttribute(
      "aria-label",
      dados.formatarConsumo(tipo, quantidade) +
        " consumidos para uma referência de " +
        dados.formatarConsumo(tipo, recurso.referencia),
    );

    medidor.innerHTML =
      '<div class="medidor-trilho">' +
      '<span class="medidor-consumo" style="width:' +
      dentro +
      '%"></span>' +
      (excesso > 0
        ? '<span class="medidor-excesso" style="left:' +
          posicaoReferencia +
          "%;width:" +
          excesso +
          '%"></span>'
        : "") +
      "</div>" +
      '<span class="medidor-referencia" style="left:' +
      posicaoReferencia +
      '%">' +
      "<span>Referência " +
      dados.formatarConsumo(tipo, recurso.referencia) +
      "</span>" +
      "</span>";

    return medidor;
  }

  function preencherCartao(tipo) {
    var recurso = dados.RECURSOS[tipo];
    var cartao = document.getElementById("cartao-" + tipo);
    var registros = dados.porRecurso(tipo);

    cartao.innerHTML =
      '<div class="cartao-topo">' +
      '<span class="cartao-icone"><i data-lucide="' +
      recurso.icone +
      '" aria-hidden="true"></i></span>' +
      "<h3>" +
      recurso.rotulo +
      "</h3>" +
      '<span class="cartao-mes"></span>' +
      "</div>";

    if (registros.length === 0) {
      var vazio = document.createElement("p");
      vazio.className = "cartao-vazio";
      vazio.innerHTML =
        "Nenhum consumo de " +
        recurso.rotulo.toLowerCase() +
        ' registrado ainda. <a href="consumo.html">Registrar agora</a>';
      cartao.appendChild(vazio);
      return;
    }

    var atual = registros[registros.length - 1];
    var anterior =
      registros.length > 1 ? registros[registros.length - 2] : null;
    var reducao = dados.reducaoPercentual(tipo, atual.quantidade);

    cartao.querySelector(".cartao-mes").textContent = dados.nomeMes(atual.mes);

    // Valor do mês
    var valor = document.createElement("p");
    valor.className = "cartao-valor numero";
    valor.innerHTML =
      dados.formatar(atual.quantidade, tipo === "agua" ? 1 : 0) +
      " <span>" +
      recurso.unidade +
      "</span>";
    cartao.appendChild(valor);

    // Medidor comparando com a referência
    cartao.appendChild(criarMedidor(tipo, atual.quantidade));

    // Situação em relação à referência (ícone + texto, nunca só cor)
    var status = document.createElement("p");
    if (reducao > 0) {
      status.className = "cartao-status abaixo";
      status.innerHTML =
        '<i data-lucide="circle-check" aria-hidden="true"></i>' +
        dados.formatar(reducao, 1) +
        "% abaixo da referência";
    } else if (reducao === 0) {
      status.className = "cartao-status";
      status.innerHTML =
        '<i data-lucide="minus-circle" aria-hidden="true"></i>Igual à referência';
    } else {
      status.className = "cartao-status acima";
      status.innerHTML =
        '<i data-lucide="circle-alert" aria-hidden="true"></i>' +
        dados.formatar(-reducao, 1) +
        "% acima da referência";
    }
    cartao.appendChild(status);

    // Detalhes: economia estimada e variação sobre o mês anterior
    var economia = dados.economiaReais(tipo, atual.quantidade);
    var detalhes = document.createElement("dl");
    detalhes.className = "cartao-detalhes";

    var htmlDetalhes =
      '<div><dt>Economia no mês</dt><dd class="numero">' +
      (economia > 0 ? dados.formatarReais(economia) : "Sem economia") +
      "</dd></div>" +
      '<div><dt>Valor estimado da conta</dt><dd class="numero">' +
      dados.formatarReais(dados.valorEstimado(tipo, atual.quantidade)) +
      "</dd></div>";

    if (anterior) {
      var variacao =
        ((atual.quantidade - anterior.quantidade) / anterior.quantidade) * 100;
      var sinal = variacao > 0 ? "+" : variacao < 0 ? "−" : "";
      htmlDetalhes +=
        "<div><dt>Em relação a " +
        dados.nomeMes(anterior.mes).split(" de ")[0] +
        "</dt>" +
        '<dd class="numero">' +
        sinal +
        dados.formatar(Math.abs(variacao), 1) +
        "%</dd></div>";
    }

    detalhes.innerHTML = htmlDetalhes;
    cartao.appendChild(detalhes);

    // Possível aumento fora do padrão (nunca afirma a causa)
    var historico = dados.compararComHistorico(
      tipo,
      atual.mes,
      atual.quantidade,
    );
    if (historico && historico.foraDoPadrao) {
      var alerta = document.createElement("p");
      alerta.className = "cartao-alerta";
      alerta.innerHTML =
        '<i data-lucide="triangle-alert" aria-hidden="true"></i><span>' +
        "Possível aumento fora do padrão: " +
        dados.formatar(historico.variacao, 0) +
        "% acima da média dos três meses anteriores. Vale verificar o que mudou na rotina da casa.</span>";
      cartao.appendChild(alerta);
    }
  }

  /* ---------- INICIALIZAÇÃO ---------- */

  mostrarSaudacao();
  preencherCartao("agua");
  preencherCartao("energia");

  if (window.lucide) {
    lucide.createIcons();
  }
});
