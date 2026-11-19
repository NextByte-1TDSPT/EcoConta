/* ==========================================
   ECOCONTA - REGISTRO DE CONSUMO (consumo.html)
   Usa os dados e cálculos de js/consumo-dados.js.
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
  var dados = window.EcoContaConsumo;

  var form = document.getElementById("form-consumo");
  var campoMes = document.getElementById("consumo-mes");
  var campoQuantidade = document.getElementById("consumo-quantidade");
  var unidade = document.getElementById("unidade-quantidade");
  var ajuda = document.getElementById("ajuda-quantidade");
  var mensagem = document.getElementById("registro-mensagem");
  var previa = document.getElementById("previa-conteudo");

  // Limites para evitar valores digitados por engano
  var LIMITES = { agua: 200, energia: 5000 };

  var AJUDAS = {
    agua: 'Na conta de água, procure por "consumo (m³)".',
    energia: 'Na conta de luz, procure por "consumo (kWh)".',
  };

  /* ---------- APOIO ---------- */

  // Mês atual no formato do campo (ex.: "2026-11")
  function mesAtual() {
    var hoje = new Date();
    var mes = String(hoje.getMonth() + 1);
    return hoje.getFullYear() + "-" + (mes.length === 1 ? "0" + mes : mes);
  }

  function tipoEscolhido() {
    var marcado = form.querySelector('input[name="tipo"]:checked');
    return marcado ? marcado.value : "agua";
  }

  function mostrarErro(campo, idErro, texto) {
    document.getElementById(idErro).textContent = texto;

    if (texto) {
      campo.setAttribute("aria-invalid", "true");
    } else {
      campo.removeAttribute("aria-invalid");
    }

    return texto === "";
  }

  /* ---------- VALIDAÇÃO ---------- */

  function validarMes() {
    var valor = campoMes.value;

    if (valor === "") {
      return mostrarErro(campoMes, "erro-mes", "Escolha o mês da conta.");
    }
    if (valor > mesAtual()) {
      return mostrarErro(
        campoMes,
        "erro-mes",
        "O mês não pode estar no futuro.",
      );
    }
    if (valor < "2020-01") {
      return mostrarErro(
        campoMes,
        "erro-mes",
        "Use um mês a partir de janeiro de 2020.",
      );
    }
    return mostrarErro(campoMes, "erro-mes", "");
  }

  function validarQuantidade() {
    var texto = campoQuantidade.value;
    var tipo = tipoEscolhido();
    var recurso = dados.RECURSOS[tipo];

    // O campo number fica vazio quando o texto não é um número
    if (texto === "") {
      return mostrarErro(
        campoQuantidade,
        "erro-quantidade",
        "Informe o consumo em " + recurso.unidade + ", usando só números.",
      );
    }

    var valor = Number(texto);

    if (valor < 0) {
      return mostrarErro(
        campoQuantidade,
        "erro-quantidade",
        "O consumo não pode ser negativo.",
      );
    }
    if (valor > LIMITES[tipo]) {
      return mostrarErro(
        campoQuantidade,
        "erro-quantidade",
        "Confira o valor: acima de " +
          dados.formatar(LIMITES[tipo], 0) +
          " " +
          recurso.unidade +
          " é muito alto para uma residência.",
      );
    }
    return mostrarErro(campoQuantidade, "erro-quantidade", "");
  }

  /* ---------- PRÉVIA: COMPARAÇÃO COM A REFERÊNCIA ---------- */

  function atualizarPrevia() {
    var tipo = tipoEscolhido();
    var recurso = dados.RECURSOS[tipo];
    var texto = campoQuantidade.value;
    var valor = Number(texto);

    if (texto === "" || valor < 0 || valor > LIMITES[tipo]) {
      previa.innerHTML =
        '<p class="previa-vazia">Digite o consumo para ver como ele fica em relação à referência de ' +
        dados.formatarConsumo(tipo, recurso.referencia) +
        ".</p>";
      return;
    }

    var reducao = dados.reducaoPercentual(tipo, valor);
    var economia = dados.economiaReais(tipo, valor);
    var situacao;

    if (reducao > 0) {
      situacao =
        '<p class="previa-situacao abaixo"><i data-lucide="circle-check" aria-hidden="true"></i>' +
        dados.formatar(reducao, 1) +
        "% abaixo da referência</p>";
    } else if (reducao < 0) {
      situacao =
        '<p class="previa-situacao acima"><i data-lucide="circle-alert" aria-hidden="true"></i>' +
        dados.formatar(-reducao, 1) +
        "% acima da referência</p>";
    } else {
      situacao =
        '<p class="previa-situacao"><i data-lucide="minus-circle" aria-hidden="true"></i>' +
        "Igual à referência</p>";
    }

    var html =
      situacao +
      '<dl class="previa-detalhes">' +
      '<div><dt>Seu consumo</dt><dd class="numero">' +
      dados.formatarConsumo(tipo, valor) +
      "</dd></div>" +
      '<div><dt>Referência</dt><dd class="numero">' +
      dados.formatarConsumo(tipo, recurso.referencia) +
      "</dd></div>" +
      '<div><dt>Economia estimada</dt><dd class="numero">' +
      (economia > 0 ? dados.formatarReais(economia) : "Sem economia") +
      "</dd></div>" +
      '<div><dt>Valor estimado da conta</dt><dd class="numero">' +
      dados.formatarReais(dados.valorEstimado(tipo, valor)) +
      "</dd></div>" +
      "</dl>";

    // Compara com a média dos três meses anteriores, se houver
    if (campoMes.value !== "") {
      var historico = dados.compararComHistorico(tipo, campoMes.value, valor);

      if (historico && historico.foraDoPadrao) {
        html +=
          '<p class="previa-alerta"><i data-lucide="triangle-alert" aria-hidden="true"></i><span>' +
          "Esse valor fica " +
          dados.formatar(historico.variacao, 0) +
          "% acima da média dos três meses anteriores. Confira se digitou certo; " +
          "se estiver certo, vale verificar o que mudou na rotina da casa.</span></p>";
      }
    }

    html +=
      '<p class="previa-nota">Referência e tarifas fictícias, só para demonstração.</p>';

    previa.innerHTML = html;

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Troca a unidade e a dica quando muda o recurso
  function atualizarRecurso() {
    var tipo = tipoEscolhido();
    unidade.textContent = dados.RECURSOS[tipo].unidade;
    ajuda.textContent = AJUDAS[tipo];

    if (campoQuantidade.getAttribute("aria-invalid")) {
      validarQuantidade();
    }
    atualizarPrevia();
  }

  /* ---------- ENVIO DO FORMULÁRIO ---------- */

  function configurarFormulario() {
    campoMes.max = mesAtual();
    campoMes.value = mesAtual();

    var opcoes = form.querySelectorAll('input[name="tipo"]');
    for (var i = 0; i < opcoes.length; i++) {
      opcoes[i].addEventListener("change", atualizarRecurso);
    }

    campoQuantidade.addEventListener("input", function () {
      if (campoQuantidade.getAttribute("aria-invalid")) {
        validarQuantidade();
      }
      mensagem.textContent = "";
      atualizarPrevia();
    });

    campoMes.addEventListener("change", function () {
      validarMes();
      mensagem.textContent = "";
      atualizarPrevia();
    });

    form.addEventListener("submit", function (evento) {
      evento.preventDefault();
      mensagem.textContent = "";
      mensagem.className = "registro-mensagem";

      var mesOk = validarMes();
      var quantidadeOk = validarQuantidade();

      if (!mesOk) {
        campoMes.focus();
        return;
      }
      if (!quantidadeOk) {
        campoQuantidade.focus();
        return;
      }

      var resultado = dados.adicionar(
        campoMes.value,
        tipoEscolhido(),
        Number(campoQuantidade.value),
      );

      mensagem.textContent = resultado.mensagem;
      mensagem.classList.add(resultado.ok ? "sucesso" : "erro");

      if (resultado.ok) {
        campoQuantidade.value = "";
        atualizarPrevia();
        document.dispatchEvent(new CustomEvent("consumo-atualizado"));
      }
    });
  }

    /* ---------- HISTÓRICO COM FILTROS ---------- */

    var filtroPeriodo = "6";
    var filtroRecurso = "todos";

    var corpo = document.getElementById("historico-corpo");
    var vazio = document.getElementById("historico-vazio");
    var resumo = document.getElementById("historico-resumo");
    var medias = document.getElementById("historico-medias");
    var statusHistorico = document.getElementById("historico-status");

    // Primeiro mês incluído no período (ex.: 6 meses até nov/2026 -> "2026-06")
    function inicioDoPeriodo(quantidadeMeses) {
        var partes = mesAtual().split("-");
        var data = new Date(Number(partes[0]), Number(partes[1]) - 1 - (quantidadeMeses - 1), 1);
        var mes = String(data.getMonth() + 1);
        return data.getFullYear() + "-" + (mes.length === 1 ? "0" + mes : mes);
    }

    function registrosFiltrados() {
        var inicio = filtroPeriodo === "todos" ? "0000-00" : inicioDoPeriodo(Number(filtroPeriodo));

        return dados.listar().filter(function (item) {
            var noPeriodo = item.mes >= inicio;
            var noRecurso = filtroRecurso === "todos" || item.tipo === filtroRecurso;
            return noPeriodo && noRecurso;
        });
    }

    function textoPeriodo() {
        if (filtroPeriodo === "todos") {
            return "todo o histórico";
        }
        return "de " + dados.nomeMes(inicioDoPeriodo(Number(filtroPeriodo))) +
            " a " + dados.nomeMes(mesAtual());
    }

    // Média mensal de cada recurso dentro do período filtrado
    function mostrarMedias(lista) {
        medias.innerHTML = "";

        ["agua", "energia"].forEach(function (tipo) {
            if (filtroRecurso !== "todos" && filtroRecurso !== tipo) {
                return;
            }

            var itens = lista.filter(function (item) {
                return item.tipo === tipo;
            });

            if (itens.length === 0) {
                return;
            }

            var soma = 0;
            for (var i = 0; i < itens.length; i++) {
                soma += itens[i].quantidade;
            }
            var media = soma / itens.length;
            var reducao = dados.reducaoPercentual(tipo, media);

            var bloco = document.createElement("div");
            bloco.className = "media-recurso";
            bloco.setAttribute("data-recurso", tipo);
            bloco.innerHTML = '<span class="media-rotulo"></span><strong class="numero"></strong><span class="media-apoio"></span>';
            bloco.querySelector(".media-rotulo").textContent = "Média de " + dados.RECURSOS[tipo].rotulo.toLowerCase();
            bloco.querySelector("strong").textContent = dados.formatarConsumo(tipo, Math.round(media * 10) / 10) + " por mês";
            bloco.querySelector(".media-apoio").textContent =
                (reducao >= 0 ? dados.formatar(reducao, 1) + "% abaixo" : dados.formatar(-reducao, 1) + "% acima") +
                " da referência, em " + itens.length + (itens.length === 1 ? " mês" : " meses");
            medias.appendChild(bloco);
        });
    }

    function criarLinha(item) {
        var recurso = dados.RECURSOS[item.tipo];
        var reducao = dados.reducaoPercentual(item.tipo, item.quantidade);
        var economia = dados.economiaReais(item.tipo, item.quantidade);
        var linha = document.createElement("tr");

        var situacao;
        if (reducao > 0) {
            situacao = '<span class="situacao abaixo"><i data-lucide="circle-check" aria-hidden="true"></i>' +
                dados.formatar(reducao, 1) + '% abaixo</span>';
        } else if (reducao < 0) {
            situacao = '<span class="situacao acima"><i data-lucide="circle-alert" aria-hidden="true"></i>' +
                dados.formatar(-reducao, 1) + '% acima</span>';
        } else {
            situacao = '<span class="situacao">Igual</span>';
        }

        linha.innerHTML =
            '<td data-rotulo="Mês">' + dados.nomeMes(item.mes) + '</td>' +
            '<td data-rotulo="Recurso"><span class="recurso-marca" data-recurso="' + item.tipo + '">' +
            recurso.rotulo + '</span></td>' +
            '<td data-rotulo="Consumo" class="numero">' + dados.formatarConsumo(item.tipo, item.quantidade) + '</td>' +
            '<td data-rotulo="Referência">' + situacao + '</td>' +
            '<td data-rotulo="Economia" class="numero">' + (economia > 0 ? dados.formatarReais(economia) : "—") + '</td>' +
            '<td class="coluna-acao"><button type="button" class="botao-excluir" data-id="' + item.id + '">Excluir</button></td>';

        linha.querySelector(".botao-excluir").setAttribute("aria-label",
            "Excluir o registro de " + recurso.rotulo.toLowerCase() + " de " + dados.nomeMes(item.mes));

        return linha;
    }

    function mostrarHistorico() {
        var lista = registrosFiltrados();
        corpo.innerHTML = "";

        // Mais recente primeiro
        for (var i = lista.length - 1; i >= 0; i--) {
            corpo.appendChild(criarLinha(lista[i]));
        }

        resumo.textContent = lista.length + (lista.length === 1 ? " registro" : " registros") +
            ", " + textoPeriodo() + ".";

        mostrarMedias(lista);

        if (lista.length === 0) {
            vazio.hidden = false;
            vazio.textContent = dados.listar().length === 0
                ? "Nenhum consumo registrado ainda. Use o formulário acima para começar."
                : "Nenhum registro nesse período. Escolha um período maior ou registre um novo consumo.";
        } else {
            vazio.hidden = true;
        }

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    function configurarHistorico() {
        // Filtros de período e de recurso
        function ligarFiltros(seletor, atributo, aoEscolher) {
            var botoes = document.querySelectorAll(seletor);
            for (var i = 0; i < botoes.length; i++) {
                botoes[i].addEventListener("click", function () {
                    for (var j = 0; j < botoes.length; j++) {
                        botoes[j].setAttribute("aria-pressed", String(botoes[j] === this));
                    }
                    aoEscolher(this.getAttribute(atributo));
                    statusHistorico.textContent = "";
                    mostrarHistorico();
                });
            }
        }

        ligarFiltros("[data-periodo]", "data-periodo", function (valor) {
            filtroPeriodo = valor;
        });

        ligarFiltros("[data-filtro-recurso]", "data-filtro-recurso", function (valor) {
            filtroRecurso = valor;
        });

        // Excluir: o primeiro clique pede confirmação, o segundo exclui
        corpo.addEventListener("click", function (evento) {
            var botao = evento.target.closest(".botao-excluir");
            if (!botao) {
                return;
            }

            if (botao.getAttribute("data-confirmar") !== "sim") {
                botao.setAttribute("data-confirmar", "sim");
                botao.textContent = "Confirmar";
                setTimeout(function () {
                    if (document.body.contains(botao)) {
                        botao.removeAttribute("data-confirmar");
                        botao.textContent = "Excluir";
                    }
                }, 4000);
                return;
            }

            dados.remover(Number(botao.getAttribute("data-id")));
            statusHistorico.textContent = "Registro excluído.";
            mostrarHistorico();
            atualizarPrevia();
        });

        // Volta aos seis meses fictícios do início
        document.getElementById("historico-restaurar").addEventListener("click", function () {
            dados.restaurarDemonstracao();
            statusHistorico.textContent = "Dados de demonstração restaurados.";
            mostrarHistorico();
            atualizarPrevia();
        });

        // Novo registro feito no formulário
        document.addEventListener("consumo-atualizado", mostrarHistorico);
    }


    /* ---------- INICIALIZAÇÃO ---------- */

    configurarFormulario();
    atualizarRecurso();
    configurarHistorico();
    mostrarHistorico();
});