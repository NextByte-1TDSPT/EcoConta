/* ==========================================
   ECOCONTA - DADOS E CÁLCULOS DE CONSUMO
   Usado por dashboard.html e consumo.html.

   Os registros ficam no localStorage deste navegador.
   Referências e tarifas são FICTÍCIAS, apenas para demonstração
   (as mesmas usadas na aplicação Java do projeto).
   ========================================== */

(function () {
  var CHAVE = "ecoconta_consumos";

  // Referência mensal e tarifa estimada de cada recurso
  var RECURSOS = {
    agua: {
      rotulo: "Água",
      unidade: "m³",
      referencia: 15,
      tarifa: 6.5,
      icone: "droplets",
    },
    energia: {
      rotulo: "Energia",
      unidade: "kWh",
      referencia: 200,
      tarifa: 0.85,
      icone: "zap",
    },
  };

  // Seis meses fictícios carregados na primeira visita
  var DADOS_INICIAIS = [
    { mes: "2026-05", agua: 15.8, energia: 212 },
    { mes: "2026-06", agua: 14.9, energia: 204 },
    { mes: "2026-07", agua: 14.2, energia: 196 },
    { mes: "2026-08", agua: 14.0, energia: 188 },
    { mes: "2026-09", agua: 13.5, energia: 185 },
    { mes: "2026-10", agua: 12.0, energia: 170 },
  ];

  var MESES = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  /* ---------- ARMAZENAMENTO ---------- */

  function gerarDadosIniciais() {
    var lista = [];
    var id = 1;

    for (var i = 0; i < DADOS_INICIAIS.length; i++) {
      lista.push({
        id: id++,
        mes: DADOS_INICIAIS[i].mes,
        tipo: "agua",
        quantidade: DADOS_INICIAIS[i].agua,
      });
      lista.push({
        id: id++,
        mes: DADOS_INICIAIS[i].mes,
        tipo: "energia",
        quantidade: DADOS_INICIAIS[i].energia,
      });
    }

    return lista;
  }

  function ordenar(lista) {
    return lista.sort(function (a, b) {
      if (a.mes === b.mes) {
        return a.tipo < b.tipo ? -1 : 1;
      }
      return a.mes < b.mes ? -1 : 1;
    });
  }

  function salvar(lista) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(lista));
    } catch (erro) {
      // Sem armazenamento disponível: os dados valem só nesta visita
    }
  }

  function listar() {
    var texto = null;

    try {
      texto = localStorage.getItem(CHAVE);
    } catch (erro) {
      texto = null;
    }

    if (texto === null) {
      var iniciais = gerarDadosIniciais();
      salvar(iniciais);
      return iniciais;
    }

    try {
      var lista = JSON.parse(texto);
      return Array.isArray(lista) ? ordenar(lista) : [];
    } catch (erro) {
      return [];
    }
  }

  function restaurarDemonstracao() {
    salvar(gerarDadosIniciais());
  }

  // Registra um consumo. Retorna { ok, mensagem }.
  function adicionar(mes, tipo, quantidade) {
    if (!RECURSOS[tipo]) {
      return { ok: false, mensagem: "Escolha água ou energia." };
    }
    if (!/^\d{4}-\d{2}$/.test(mes)) {
      return { ok: false, mensagem: "Informe o mês da conta." };
    }
    if (!(quantidade >= 0)) {
      return {
        ok: false,
        mensagem: "O consumo precisa ser um número igual ou maior que zero.",
      };
    }

    var lista = listar();
    var maiorId = 0;

    for (var i = 0; i < lista.length; i++) {
      if (lista[i].mes === mes && lista[i].tipo === tipo) {
        return {
          ok: false,
          mensagem:
            "Já existe um registro de " +
            RECURSOS[tipo].rotulo.toLowerCase() +
            " em " +
            nomeMes(mes) +
            ". Exclua o registro antigo no histórico para trocar o valor.",
        };
      }
      if (lista[i].id > maiorId) {
        maiorId = lista[i].id;
      }
    }

    lista.push({
      id: maiorId + 1,
      mes: mes,
      tipo: tipo,
      quantidade: quantidade,
    });
    salvar(ordenar(lista));

    return {
      ok: true,
      mensagem: "Consumo de " + nomeMes(mes) + " registrado.",
    };
  }

  function remover(id) {
    var lista = listar().filter(function (item) {
      return item.id !== id;
    });
    salvar(lista);
  }

  // Registros de um recurso, do mais antigo para o mais recente
  function porRecurso(tipo) {
    return listar().filter(function (item) {
      return item.tipo === tipo;
    });
  }

  /* ---------- CÁLCULOS ---------- */

  // Redução (%) = (referência - consumo) / referência x 100
  function reducaoPercentual(tipo, quantidade) {
    var referencia = RECURSOS[tipo].referencia;
    var valor = ((referencia - quantidade) / referencia) * 100;
    return Math.round(valor * 10) / 10;
  }

  // Quanto deixou de consumir (negativo = acima da referência)
  function economiaQuantidade(tipo, quantidade) {
    return RECURSOS[tipo].referencia - quantidade;
  }

  // Economia estimada em reais; nunca negativa
  function economiaReais(tipo, quantidade) {
    var economia = economiaQuantidade(tipo, quantidade);
    return economia > 0 ? economia * RECURSOS[tipo].tarifa : 0;
  }

  function valorEstimado(tipo, quantidade) {
    return quantidade * RECURSOS[tipo].tarifa;
  }

  // Compara um mês com a média dos 3 registros anteriores do mesmo recurso.
  // Retorna null quando ainda não há histórico suficiente.
  function compararComHistorico(tipo, mes, quantidade) {
    var anteriores = porRecurso(tipo).filter(function (item) {
      return item.mes < mes;
    });

    if (anteriores.length < 3) {
      return null;
    }

    var ultimos = anteriores.slice(-3);
    var soma = 0;

    for (var i = 0; i < ultimos.length; i++) {
      soma += ultimos[i].quantidade;
    }

    var media = soma / ultimos.length;
    var variacao = media > 0 ? ((quantidade - media) / media) * 100 : 0;

    return {
      media: media,
      variacao: variacao,
      foraDoPadrao: variacao > 30,
    };
  }

  /* ---------- FORMATAÇÃO ---------- */

  function formatar(numero, casas) {
    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: casas,
      maximumFractionDigits: casas,
    });
  }

  function formatarConsumo(tipo, quantidade) {
    var casas = tipo === "agua" ? 1 : 0;
    if (tipo === "energia" && quantidade % 1 !== 0) {
      casas = 1;
    }
    return formatar(quantidade, casas) + " " + RECURSOS[tipo].unidade;
  }

  function formatarReais(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // "2026-10" -> "outubro de 2026"
  function nomeMes(mes) {
    var partes = mes.split("-");
    return MESES[Number(partes[1]) - 1] + " de " + partes[0];
  }

  // "2026-10" -> "out"
  function mesCurto(mes) {
    return MESES[Number(mes.split("-")[1]) - 1].slice(0, 3);
  }

  window.EcoContaConsumo = {
    RECURSOS: RECURSOS,
    listar: listar,
    porRecurso: porRecurso,
    adicionar: adicionar,
    remover: remover,
    restaurarDemonstracao: restaurarDemonstracao,
    reducaoPercentual: reducaoPercentual,
    economiaQuantidade: economiaQuantidade,
    economiaReais: economiaReais,
    valorEstimado: valorEstimado,
    compararComHistorico: compararComHistorico,
    formatar: formatar,
    formatarConsumo: formatarConsumo,
    formatarReais: formatarReais,
    nomeMes: nomeMes,
    mesCurto: mesCurto,
  };
})();
