/* Configuração inicial da residência */

// Verifica se o usuário está autenticado antes de acessar o formulário
document.addEventListener("DOMContentLoaded", function () {
  if (!EcoContaDados.autenticado()) {
    window.location.href = "acesso.html";

    return;
  }

  // Identifica os elementos principais da página
  var form = document.getElementById("form-ajustesperfil");

  var voltar = document.getElementById("voltar-etapa");

  var continuar = document.getElementById("continuar-etapa");

  var concluir = document.getElementById("concluir-ajustesperfil");

  var textoAjuda = document.getElementById("texto-ajuda-etapa");

  // Recupera os dados do perfil e da residência já cadastrados
  var perfil = EcoContaDados.lerPerfil();

  var residencia = {};

  var etapaAtual = 1;

  var extras = [];

  if (perfil) {
    if (perfil.residencia) {
      residencia = perfil.residencia;
    }
  }

  if (residencia.equipamentosExtras) {
    extras = residencia.equipamentosExtras;
  }

  // Função para localizar campos pelo ID
  function campo(id) {
    return document.getElementById(id);
  }

  // Marca uma opção selecionada nos campos de escolha
  function marcarRadio(nome, valor) {
    var opcoes = document.getElementsByName(nome);

    for (var i = 0; i < opcoes.length; i++) {
      if (opcoes[i].value === valor) {
        opcoes[i].checked = true;
      }
    }
  }

  // Recupera o valor selecionado em um grupo de opções
  function lerRadio(nome, padrao) {
    var opcoes = document.getElementsByName(nome);

    for (var i = 0; i < opcoes.length; i++) {
      if (opcoes[i].checked) {
        return opcoes[i].value;
      }
    }

    return padrao;
  }

  // Preenche os campos com os dados já salvos
  function preencherCampos() {
    campo("nome-residencia").value = "";

    campo("regiao").value = "";

    campo("area").value = "";

    campo("cidade").value = "";

    campo("concessionaria").value = "";

    if (residencia.nome) {
      campo("nome-residencia").value = residencia.nome;
    }

    if (residencia.estado) {
      campo("regiao").value = residencia.estado;
    }

    if (residencia.area) {
      campo("area").value = residencia.area;
    }

    if (residencia.cidade) {
      campo("cidade").value = residencia.cidade;
    }

    if (residencia.concessionaria) {
      campo("concessionaria").value = residencia.concessionaria;
    }

    var tipoImovel = "";

    var rotina = "Dias úteis, durante o dia";

    var piscina = "Não";

    var jardim = "Não";

    if (residencia.tipoImovel) {
      tipoImovel = residencia.tipoImovel;
    }

    if (residencia.rotina) {
      rotina = residencia.rotina;
    }

    if (residencia.piscina) {
      piscina = residencia.piscina;
    }

    if (residencia.jardim) {
      jardim = residencia.jardim;
    }

    marcarRadio("tipo-imovel", tipoImovel);

    marcarRadio("rotina", rotina);

    marcarRadio("piscina", piscina);

    marcarRadio("jardim", jardim);

    campo("moradores-valor").value = 1;

    campo("criancas-valor").value = 0;

    campo("banheiros-valor").value = 1;

    if (residencia.moradores) {
      campo("moradores-valor").value = residencia.moradores;
    }

    if (residencia.criancas !== undefined) {
      campo("criancas-valor").value = residencia.criancas;
    }

    if (residencia.banheiros) {
      campo("banheiros-valor").value = residencia.banheiros;
    }

    var linhas = document.getElementsByClassName("equipamento");

    for (var i = 0; i < linhas.length; i++) {
      var check = linhas[i].querySelector('input[type="checkbox"]');

      var select = linhas[i].querySelector("select");

      check.checked = false;

      select.disabled = true;

      if (residencia.equipamentos) {
        for (var j = 0; j < residencia.equipamentos.length; j++) {
          if (residencia.equipamentos[j].nome === check.value) {
            check.checked = true;

            select.disabled = false;

            select.value = residencia.equipamentos[j].frequencia;
          }
        }
      }
    }

    mostrarExtras();
  }

  // Exibe os equipamentos extras adicionados pelo usuário
  function mostrarExtras() {
    var lista = campo("lista-equipamentos");

    var antigos = lista.getElementsByClassName("equipamento-extra");

    while (antigos.length > 0) {
      antigos[0].remove();
    }

    for (var i = 0; i < extras.length; i++) {
      var linha = document.createElement("div");

      linha.className = "equipamento-extra";

      var icone = document.createElement("span");

      icone.className = "equipamento-icone";

      icone.innerHTML = '<i class="fas fa-plug"></i>';

      var nome = document.createElement("b");

      nome.textContent = extras[i];

      var botao = document.createElement("button");

      botao.type = "button";

      botao.innerHTML = '<i class="fas fa-trash"></i>';

      botao.setAttribute("aria-label", "Remover equipamento");

      (function (indice) {
        botao.addEventListener("click", function () {
          extras.splice(indice, 1);

          mostrarExtras();
        });
      })(i);

      linha.appendChild(icone);

      linha.appendChild(nome);

      linha.appendChild(botao);

      lista.appendChild(linha);
    }
  }

  // Atualiza a quantidade de moradores, crianças e banheiros
  function atualizarContador(nome, alteracao) {
    var numero = Number(campo(nome + "-valor").value);

    var minimo = 1;

    var maximo = 20;

    if (nome === "criancas") {
      minimo = 0;

      maximo = 30;
    }

    if (nome === "moradores") {
      maximo = 30;
    }

    numero = numero + alteracao;

    if (numero < minimo) {
      numero = minimo;
    }

    if (numero > maximo) {
      numero = maximo;
    }

    campo(nome + "-valor").value = numero;
  }

  // Controla os botões de aumento e diminuição dos contadores
  var botoesContador = document.querySelectorAll("[data-counter]");

  for (var i = 0; i < botoesContador.length; i++) {
    botoesContador[i].addEventListener("click", function () {
      var nome = this.getAttribute("data-counter");

      var alteracao = Number(this.getAttribute("data-change"));

      atualizarContador(nome, alteracao);
    });
  }

  // Habilita ou desabilita a frequência de uso dos equipamentos
  var checks = document.querySelectorAll('.equipamento input[type="checkbox"]');

  for (var i = 0; i < checks.length; i++) {
    checks[i].addEventListener("change", function () {
      var select = this.parentElement.querySelector("select");

      if (this.checked) {
        select.disabled = false;
      } else {
        select.disabled = true;
      }
    });
  }

  // Adiciona novos equipamentos à lista
  campo("adicionar-equipamento").addEventListener("click", function () {
    var entrada = campo("equipamento-extra");

    var nome = entrada.value.trim();

    if (nome === "") {
      entrada.focus();

      return;
    }

    for (var i = 0; i < extras.length; i++) {
      if (extras[i].toLowerCase() === nome.toLowerCase()) {
        alert("Esse equipamento já foi adicionado.");

        return;
      }
    }

    extras.push(nome);

    entrada.value = "";

    mostrarExtras();
  });

  // Reúne as informações preenchidas no formulário
  function coletarDados() {
    var equipamentos = [];

    var linhas = document.getElementsByClassName("equipamento");

    for (var i = 0; i < linhas.length; i++) {
      var check = linhas[i].querySelector('input[type="checkbox"]');

      var select = linhas[i].querySelector("select");

      if (check.checked) {
        equipamentos.push({
          nome: check.value,

          frequencia: select.value,
        });
      }
    }

    var area = null;

    if (campo("area").value !== "") {
      area = Number(campo("area").value);
    }

    var dados = {
      nome: campo("nome-residencia").value.trim(),

      estado: campo("regiao").value,

      tipoImovel: lerRadio("tipo-imovel", ""),

      area: area,

      cidade: campo("cidade").value.trim(),

      concessionaria: campo("concessionaria").value.trim(),

      moradores: Number(campo("moradores-valor").value),

      criancas: Number(campo("criancas-valor").value),

      rotina: lerRadio("rotina", "Dias úteis, durante o dia"),

      banheiros: Number(campo("banheiros-valor").value),

      piscina: lerRadio("piscina", "Não"),

      jardim: lerRadio("jardim", "Não"),

      equipamentos: equipamentos,

      equipamentosExtras: extras,
    };

    return dados;
  }

  // Verifica se os campos de cada etapa foram preenchidos corretamente
  function validarEtapa(numero) {
    var erros = document.querySelectorAll("[data-error]");

    for (var i = 0; i < erros.length; i++) {
      erros[i].textContent = "";
    }

    var dados = coletarDados();

    if (numero === 1) {
      var valido = true;

      if (dados.nome.length < 2) {
        document.querySelector('[data-error="nome-residencia"]').textContent =
          "Informe um nome para identificar a residência.";

        valido = false;
      }

      if (dados.estado === "") {
        campo("regiao").focus();

        valido = false;
      }

      if (dados.tipoImovel === "") {
        document.querySelector('[data-error="tipo-imovel"]').textContent =
          "Selecione o tipo de imóvel.";

        valido = false;
      }

      if (dados.area !== null) {
        if (dados.area <= 0) {
          valido = false;
        }
      }

      return valido;
    }

    if (numero === 2) {
      if (dados.criancas > dados.moradores) {
        textoAjuda.textContent =
          "A quantidade de crianças não pode superar o total de moradores.";

        return false;
      }
    }

    if (numero === 5) {
      if (!campo("confirmar-dados").checked) {
        document.querySelector('[data-error="confirmar-dados"]').textContent =
          "Confirme as informações para concluir.";

        return false;
      }
    }

    return true;
  }

  // Monta o resumo das informações da residência
  function montarResumo() {
    var dados = coletarDados();

    var resumo = campo("resumo-onboarding");

    resumo.innerHTML = "";

    var areaTexto = "";

    if (dados.area) {
      areaTexto = dados.area + " m²";
    }

    var residenciaTexto =
      dados.nome +
      " · " +
      dados.tipoImovel +
      " · " +
      dados.cidade +
      " · " +
      dados.estado;

    if (areaTexto !== "") {
      residenciaTexto += " · " + areaTexto;
    }

    var equipamentosTexto = "";

    for (var i = 0; i < dados.equipamentos.length; i++) {
      if (equipamentosTexto !== "") {
        equipamentosTexto += ", ";
      }

      equipamentosTexto += dados.equipamentos[i].nome;
    }

    for (var j = 0; j < extras.length; j++) {
      if (equipamentosTexto !== "") {
        equipamentosTexto += ", ";
      }

      equipamentosTexto += extras[j];
    }

    if (equipamentosTexto === "") {
      equipamentosTexto = "Nenhum informado";
    }

    adicionarLinhaResumo(resumo, "Residência", residenciaTexto, 1);

    adicionarLinhaResumo(
      resumo,

      "Moradores",

      dados.moradores +
        " moradores · " +
        dados.criancas +
        " crianças · " +
        dados.rotina,

      2,
    );

    adicionarLinhaResumo(
      resumo,

      "Estrutura",

      dados.banheiros +
        " banheiros · piscina: " +
        dados.piscina +
        " · jardim: " +
        dados.jardim,

      3,
    );

    adicionarLinhaResumo(resumo, "Equipamentos", equipamentosTexto, 4);

    var botoesEditar = resumo.querySelectorAll("[data-edit-step]");

    for (var k = 0; k < botoesEditar.length; k++) {
      botoesEditar[k].addEventListener("click", function () {
        mostrarEtapa(Number(this.getAttribute("data-edit-step")));
      });
    }
  }

  // Cria cada linha do resumo com a opção de edição
  function adicionarLinhaResumo(local, titulo, texto, etapa) {
    var linha = document.createElement("div");

    linha.className = "linha-resumo";

    var nome = document.createElement("span");

    nome.textContent = titulo;

    var valor = document.createElement("strong");

    valor.textContent = texto;

    var botao = document.createElement("button");

    botao.type = "button";

    botao.textContent = "Editar";

    botao.setAttribute("data-edit-step", etapa);

    linha.appendChild(nome);

    linha.appendChild(valor);

    linha.appendChild(botao);

    local.appendChild(linha);
  }

  // Controla a exibição das etapas e o indicador de progresso
  function mostrarEtapa(numero) {
    etapaAtual = numero;

    var etapas = document.querySelectorAll(".etapa");

    var indicadores = document.querySelectorAll("[data-step-indicator]");

    for (var i = 0; i < etapas.length; i++) {
      if (Number(etapas[i].getAttribute("data-step")) === numero) {
        etapas[i].classList.add("ativa");
      } else {
        etapas[i].classList.remove("ativa");
      }
    }

    for (var j = 0; j < indicadores.length; j++) {
      var numeroIndicador = Number(
        indicadores[j].getAttribute("data-step-indicator"),
      );

      var circulo = indicadores[j].querySelector("span");

      if (numeroIndicador === numero) {
        indicadores[j].classList.add("atual");
      } else {
        indicadores[j].classList.remove("atual");
      }

      if (numeroIndicador < numero) {
        indicadores[j].classList.add("concluido");

        circulo.innerHTML = '<i class="fas fa-check"></i>';
      } else {
        indicadores[j].classList.remove("concluido");

        circulo.textContent = numeroIndicador;
      }
    }

    if (numero === 1) {
      voltar.classList.add("oculto");

      textoAjuda.textContent = "Campos opcionais podem ficar em branco.";
    } else {
      voltar.classList.remove("oculto");

      textoAjuda.textContent =
        "Você poderá editar essas informações depois no Perfil residencial.";
    }

    if (numero === 5) {
      continuar.classList.add("oculto");

      concluir.classList.remove("oculto");

      montarResumo();
    } else {
      continuar.classList.remove("oculto");

      concluir.classList.add("oculto");
    }

    window.scrollTo(0, 0);
  }

  // Avança para a próxima etapa após a validação
  continuar.addEventListener("click", function () {
    if (validarEtapa(etapaAtual)) {
      mostrarEtapa(etapaAtual + 1);
    }
  });

  // Retorna para a etapa anterior
  voltar.addEventListener("click", function () {
    if (etapaAtual > 1) {
      mostrarEtapa(etapaAtual - 1);
    }
  });

  // Salva as informações do perfil residencial
  function salvarDados(concluido) {
    var perfilSalvo = EcoContaDados.lerPerfil();

    if (!perfilSalvo) {
      perfilSalvo = {};
    }

    if (!perfilSalvo.residencia) {
      perfilSalvo.residencia = {};
    }

    var dados = coletarDados();

    perfilSalvo.residencia.nome = dados.nome;

    perfilSalvo.residencia.estado = dados.estado;

    perfilSalvo.residencia.tipoImovel = dados.tipoImovel;

    perfilSalvo.residencia.area = dados.area;

    perfilSalvo.residencia.cidade = dados.cidade;

    perfilSalvo.residencia.concessionaria = dados.concessionaria;

    perfilSalvo.residencia.moradores = dados.moradores;

    perfilSalvo.residencia.criancas = dados.criancas;

    perfilSalvo.residencia.rotina = dados.rotina;

    perfilSalvo.residencia.banheiros = dados.banheiros;

    perfilSalvo.residencia.piscina = dados.piscina;

    perfilSalvo.residencia.jardim = dados.jardim;

    perfilSalvo.residencia.equipamentos = dados.equipamentos;

    perfilSalvo.residencia.equipamentosExtras = dados.equipamentosExtras;

    perfilSalvo.residencia.onboardingConcluido = concluido;

    EcoContaDados.salvarPerfil(perfilSalvo);
  }

  // Salva os dados e permite sair da configuração
  campo("salvar-sair").addEventListener("click", function () {
    salvarDados(false);

    window.location.href = "index.html";
  });

  // Valida e salva o perfil ao concluir o formulário
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (validarEtapa(5)) {
      salvarDados(true);

      window.location.href = "perfil.html";
    }
  });

  // Carrega os dados salvos e inicia a primeira etapa
  preencherCampos();

  mostrarEtapa(1);
});
