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

  /* ---------- GRÁFICO DE CONSUMO MENSAL ---------- */

  var recursoGrafico = "agua";
  var areaGrafico = document.getElementById("grafico");
  var dica = document.getElementById("grafico-dica");

  // Passo "redondo" para as linhas do eixo (1, 2, 5, 10, 20, 50...)
  function passoDoEixo(maximo) {
    var bruto = maximo / 5;
    var potencia = Math.pow(10, Math.floor(Math.log10(bruto)));
    var passos = [1, 2, 5, 10];
    for (var i = 0; i < passos.length; i++) {
      if (passos[i] * potencia >= bruto) {
        return passos[i] * potencia;
      }
    }
    return 10 * potencia;
  }

  function textoReferencia(tipo, quantidade) {
    var reducao = dados.reducaoPercentual(tipo, quantidade);
    if (reducao > 0) {
      return dados.formatar(reducao, 1) + "% abaixo";
    }
    if (reducao < 0) {
      return dados.formatar(-reducao, 1) + "% acima";
    }
    return "igual à referência";
  }

  function desenharGrafico() {
    var tipo = recursoGrafico;
    var recurso = dados.RECURSOS[tipo];
    var registros = dados.porRecurso(tipo).slice(-12);

    document.getElementById("titulo-grafico").textContent =
      "Consumo mensal de " + recurso.rotulo.toLowerCase();
    document.getElementById("legenda-recurso-texto").textContent =
      "Consumo de " + recurso.rotulo.toLowerCase();
    document.getElementById("legenda-recurso").style.backgroundColor =
      tipo === "agua" ? "var(--agua)" : "var(--energia)";

    dica.hidden = true;

    if (registros.length === 0) {
      areaGrafico.innerHTML =
        '<p class="grafico-vazio">Nenhum mês registrado ainda. ' +
        '<a href="consumo.html">Registre o primeiro consumo</a> para ver o gráfico.</p>';
      preencherTabela(tipo, registros);
      return;
    }

    // Dimensões (o desenho acompanha a largura do bloco)
    var largura = Math.max(areaGrafico.clientWidth, 280);
    var altura = largura < 520 ? 240 : 300;
    var margem = { topo: 16, direita: 12, base: 32, esquerda: 44 };
    var areaL = largura - margem.esquerda - margem.direita;
    var areaA = altura - margem.topo - margem.base;

    var maior = recurso.referencia;
    for (var i = 0; i < registros.length; i++) {
      maior = Math.max(maior, registros[i].quantidade);
    }
    var passo = passoDoEixo(maior * 1.05);
    var linhasGrade = Math.ceil((maior * 1.05) / passo);
    var topo = passo * linhasGrade;

    function y(valor) {
      return margem.topo + areaA - (valor / topo) * areaA;
    }

    var faixa = areaL / registros.length;
    var larguraBarra = Math.min(46, faixa * 0.56);
    var svg =
      '<svg viewBox="0 0 ' +
      largura +
      " " +
      altura +
      '" width="' +
      largura +
      '" height="' +
      altura +
      '" aria-hidden="true" focusable="false">';

    // Linhas de grade e valores do eixo
    for (var g = 0; g <= linhasGrade; g++) {
      var valorGrade = passo * g;
      var yGrade = y(valorGrade);
      svg +=
        '<line class="grafico-grade" x1="' +
        margem.esquerda +
        '" x2="' +
        (largura - margem.direita) +
        '" y1="' +
        yGrade +
        '" y2="' +
        yGrade +
        '"></line>';
      svg +=
        '<text class="grafico-eixo" x="' +
        (margem.esquerda - 8) +
        '" y="' +
        (yGrade + 4) +
        '" text-anchor="end">' +
        dados.formatar(valorGrade, valorGrade % 1 === 0 ? 0 : 1) +
        "</text>";
    }

    // Barras: até a referência na cor do recurso; o excesso em destaque
    for (var b = 0; b < registros.length; b++) {
      var item = registros[b];
      var x = margem.esquerda + faixa * b + (faixa - larguraBarra) / 2;
      var yValor = y(item.quantidade);
      var yRef = y(recurso.referencia);
      var base = y(0);
      var raio = 4;

      if (item.quantidade <= recurso.referencia) {
        svg += barra(
          x,
          yValor,
          larguraBarra,
          base - yValor,
          raio,
          "grafico-barra-" + tipo,
        );
      } else {
        // parte até a referência + 2px de respiro + parte acima
        svg +=
          '<rect class="grafico-barra-' +
          tipo +
          '" x="' +
          x +
          '" y="' +
          yRef +
          '" width="' +
          larguraBarra +
          '" height="' +
          (base - yRef) +
          '"></rect>';
        svg += barra(
          x,
          yValor,
          larguraBarra,
          Math.max(yRef - yValor - 2, 1),
          raio,
          "grafico-barra-excesso",
        );
      }

      svg +=
        '<text class="grafico-eixo" x="' +
        (x + larguraBarra / 2) +
        '" y="' +
        (altura - 10) +
        '" text-anchor="middle">' +
        dados.mesCurto(item.mes) +
        "</text>";

      // Área de toque maior que a barra, para o mouse e o teclado
      svg +=
        '<rect class="grafico-alvo" data-indice="' +
        b +
        '" x="' +
        (margem.esquerda + faixa * b) +
        '" y="' +
        margem.topo +
        '" width="' +
        faixa +
        '" height="' +
        areaA +
        '"></rect>';
    }

    // Linha tracejada da referência, por cima das barras
    var yReferencia = y(recurso.referencia);
    svg +=
      '<line class="grafico-referencia" x1="' +
      margem.esquerda +
      '" x2="' +
      (largura - margem.direita) +
      '" y1="' +
      yReferencia +
      '" y2="' +
      yReferencia +
      '"></line>';
    svg += "</svg>";

    areaGrafico.innerHTML = svg;
    areaGrafico.setAttribute(
      "aria-label",
      "Gráfico de barras do consumo mensal de " +
        recurso.rotulo.toLowerCase() +
        ", com a referência de " +
        dados.formatarConsumo(tipo, recurso.referencia) +
        ". Os valores estão na tabela abaixo do gráfico.",
    );

    ligarDicas(tipo, registros, faixa, margem.esquerda);
    preencherTabela(tipo, registros);
  }

  // Retângulo com cantos arredondados só em cima (base reta no eixo)
  function barra(x, yTopo, largura, altura, raio, classe) {
    var r = Math.min(raio, largura / 2, altura);
    var caminho =
      "M" +
      x +
      "," +
      (yTopo + altura) +
      " V" +
      (yTopo + r) +
      " Q" +
      x +
      "," +
      yTopo +
      " " +
      (x + r) +
      "," +
      yTopo +
      " H" +
      (x + largura - r) +
      " Q" +
      (x + largura) +
      "," +
      yTopo +
      " " +
      (x + largura) +
      "," +
      (yTopo + r) +
      " V" +
      (yTopo + altura) +
      " Z";
    return '<path class="' + classe + '" d="' + caminho + '"></path>';
  }

  // Dica ao passar o mouse sobre um mês
  function ligarDicas(tipo, registros, faixa, inicio) {
    var alvos = areaGrafico.querySelectorAll(".grafico-alvo");

    function mostrar(indice) {
      var item = registros[indice];
      dica.innerHTML = "<strong></strong><span></span>";
      dica.querySelector("strong").textContent =
        dados.nomeMes(item.mes) +
        ": " +
        dados.formatarConsumo(tipo, item.quantidade);
      dica.querySelector("span").textContent =
        textoReferencia(tipo, item.quantidade) +
        (item.quantidade !== dados.RECURSOS[tipo].referencia
          ? " da referência"
          : "");
      dica.hidden = false;

      var centro = inicio + faixa * indice + faixa / 2;
      var limite = areaGrafico.clientWidth - dica.offsetWidth / 2 - 4;
      dica.style.left =
        areaGrafico.offsetLeft +
        Math.max(dica.offsetWidth / 2 + 4, Math.min(centro, limite)) +
        "px";
      dica.style.top = areaGrafico.offsetTop + "px";

      for (var i = 0; i < alvos.length; i++) {
        alvos[i].classList.toggle("ativo", i === indice);
      }
    }

    function esconder() {
      dica.hidden = true;
      for (var i = 0; i < alvos.length; i++) {
        alvos[i].classList.remove("ativo");
      }
    }

    for (var i = 0; i < alvos.length; i++) {
      alvos[i].addEventListener("mouseenter", function () {
        mostrar(Number(this.getAttribute("data-indice")));
      });
    }

    areaGrafico.addEventListener("mouseleave", esconder);
  }

  // Mesmos dados do gráfico em tabela (acessibilidade)
  function preencherTabela(tipo, registros) {
    var corpo = document.getElementById("grafico-tabela-corpo");
    corpo.innerHTML = "";

    for (var i = registros.length - 1; i >= 0; i--) {
      var linha = document.createElement("tr");
      var celulas = [
        dados.nomeMes(registros[i].mes),
        dados.formatarConsumo(tipo, registros[i].quantidade),
        textoReferencia(tipo, registros[i].quantidade),
      ];
      for (var c = 0; c < celulas.length; c++) {
        var celula = document.createElement("td");
        celula.textContent = celulas[c];
        linha.appendChild(celula);
      }
      corpo.appendChild(linha);
    }
  }

  function configurarGrafico() {
    var botoes = document.querySelectorAll("[data-grafico]");

    for (var i = 0; i < botoes.length; i++) {
      botoes[i].addEventListener("click", function () {
        recursoGrafico = this.getAttribute("data-grafico");
        for (var j = 0; j < botoes.length; j++) {
          botoes[j].setAttribute("aria-pressed", String(botoes[j] === this));
        }
        desenharGrafico();
      });
    }

    // Redesenha quando a largura da tela muda
    var espera = null;
    window.addEventListener("resize", function () {
      clearTimeout(espera);
      espera = setTimeout(desenharGrafico, 150);
    });
  }

  /* ---------- INDICADORES DE ECONOMIA ---------- */

  function preencherIndicadores() {
    var lista = document.getElementById("indicadores-lista");
    var todos = dados.listar();
    var totalReais = 0;
    var linhas = [];

    ["agua", "energia"].forEach(function (tipo) {
      var recurso = dados.RECURSOS[tipo];
      var registros = dados.porRecurso(tipo);
      var economizado = 0;
      var abaixo = 0;

      for (var i = 0; i < registros.length; i++) {
        var diferenca = dados.economiaQuantidade(tipo, registros[i].quantidade);
        if (diferenca > 0) {
          economizado += diferenca;
          abaixo++;
        }
        totalReais += dados.economiaReais(tipo, registros[i].quantidade);
      }

      linhas.push({
        rotulo: recurso.rotulo + " economizada",
        valor: dados.formatarConsumo(tipo, economizado),
        apoio:
          "abaixo da referência em " +
          abaixo +
          " de " +
          registros.length +
          " meses",
      });
    });

    linhas.push({
      rotulo: "Economia estimada",
      valor: dados.formatarReais(totalReais),
      apoio: "soma dos meses abaixo da referência, com tarifas fictícias",
    });

    lista.innerHTML = "";
    linhas.forEach(function (linha) {
      var grupo = document.createElement("div");
      grupo.className = "indicador";
      grupo.innerHTML =
        '<dt></dt><dd class="numero"></dd><dd class="indicador-apoio"></dd>';
      grupo.querySelector("dt").textContent = linha.rotulo;
      grupo.querySelector(".numero").textContent = linha.valor;
      grupo.querySelector(".indicador-apoio").textContent = linha.apoio;
      lista.appendChild(grupo);
    });

    var periodo = document.getElementById("indicadores-periodo");
    if (todos.length > 0) {
      periodo.textContent =
        "De " +
        dados.nomeMes(todos[0].mes) +
        " a " +
        dados.nomeMes(todos[todos.length - 1].mes);
    } else {
      periodo.textContent = "Ainda não há registros.";
    }
  }

  /* ---------- INICIALIZAÇÃO ---------- */

  mostrarSaudacao();
  preencherCartao("agua");
  preencherCartao("energia");
  configurarGrafico();
  desenharGrafico();
  preencherIndicadores();

  if (window.lucide) {
    lucide.createIcons();
  }
});
