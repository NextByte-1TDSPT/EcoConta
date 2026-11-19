// Aguarda o carregamento da página e verifica o acesso do usuário
document.addEventListener("DOMContentLoaded", function () {
  if (!EcoContaDados.autenticado()) {
    window.location.href = "acesso.html";
    return;
  }

  const perfil = EcoContaDados.lerPerfil();

  if (!perfil) {
    window.location.href = "acesso.html";
    return;
  }

  // Recupera e exibe os dados pessoais do usuário
  let nome = "Não informado";
  let email = "Não informado";

  if (perfil.nome) {
    nome = perfil.nome;
  }

  if (perfil.email) {
    email = perfil.email;
  }

  document.getElementById("perfil-nome").textContent = nome;
  document.getElementById("perfil-email").textContent = email;

  // Recupera as informações da residência
  let r = {};

  if (perfil.residencia) {
    r = perfil.residencia;
  }

  // Organiza os equipamentos cadastrados e suas frequências de uso
  let equipamentos = [];

  if (r.equipamentos) {
    for (let i = 0; i < r.equipamentos.length; i++) {
      let item = r.equipamentos[i];
      let nomeEquipamento = item.nome;

      if (item.frequencia) {
        nomeEquipamento = nomeEquipamento + " (" + item.frequencia + ")";
      }

      equipamentos.push(nomeEquipamento);
    }
  }

  if (r.equipamentosExtras) {
    for (let i = 0; i < r.equipamentosExtras.length; i++) {
      equipamentos.push(r.equipamentosExtras[i]);
    }
  }

  // Prepara os textos das informações da residência
  let cidadeEstado = "Não informada";

  if (r.cidade && r.estado) {
    cidadeEstado = r.cidade + " – " + r.estado;
  } else {
    if (r.cidade) {
      cidadeEstado = r.cidade;
    } else {
      if (r.estado) {
        cidadeEstado = r.estado;
      }
    }
  }

  let areaTexto = "Não informada";

  if (r.area) {
    areaTexto = r.area + " m²";
  }

  let moradoresTexto = "Não informado";

  if (r.moradores) {
    moradoresTexto = r.moradores + " pessoa(s)";
  }

  let criancasTexto = "Não informado";

  if (r.criancas >= 0 && r.criancas !== "") {
    criancasTexto = r.criancas;
  }

  // Reúne os equipamentos em um único texto
  let equipamentosTexto = "Nenhum informado";

  if (equipamentos.length > 0) {
    equipamentosTexto = "";

    for (let i = 0; i < equipamentos.length; i++) {
      equipamentosTexto += equipamentos[i];

      if (i < equipamentos.length - 1) {
        equipamentosTexto += ", ";
      }
    }
  }

  // Prepara os dados de identificação e estrutura do imóvel
  let identificacao = "Não configurada";
  let tipoImovel = "Não informado";
  let rotina = "Não informada";
  let concessionaria = "Não informada";

  if (r.nome) {
    identificacao = r.nome;
  }

  if (r.tipoImovel) {
    tipoImovel = r.tipoImovel;
  }

  if (r.rotina) {
    rotina = r.rotina;
  }

  if (r.concessionaria) {
    concessionaria = r.concessionaria;
  }

  let banheiros = "—";
  let piscina = "—";
  let jardim = "—";

  if (r.banheiros) {
    banheiros = r.banheiros;
  }

  if (r.piscina) {
    piscina = r.piscina.toLowerCase();
  }

  if (r.jardim) {
    jardim = r.jardim.toLowerCase();
  }

  let estrutura =
    banheiros + " banheiro(s) · piscina: " + piscina + " · jardim: " + jardim;

  // Organiza as informações que serão exibidas no resumo
  const dados = [
    ["Identificação", identificacao],
    ["Tipo de imóvel", tipoImovel],
    ["Cidade / Estado", cidadeEstado],
    ["Área aproximada", areaTexto],
    ["Moradores", moradoresTexto],
    ["Crianças", criancasTexto],
    ["Rotina", rotina],
    ["Estrutura", estrutura],
    ["Concessionária", concessionaria],
    ["Equipamentos", equipamentosTexto],
  ];

  // Monta e exibe o resumo das informações da residência
  let resumo = "";

  for (let i = 0; i < dados.length; i++) {
    resumo +=
      '<div class="item-resumo"><span>' +
      escapar(dados[i][0]) +
      "</span><strong>" +
      escapar(dados[i][1]) +
      "</strong></div>";
  }

  document.getElementById("resumo-residencia").innerHTML = resumo;

  // Realiza o logout e retorna à página de acesso
  document.getElementById("botao-sair").addEventListener("click", function () {
    EcoContaDados.sair();
    window.location.href = "acesso.html";
  });

  // Protege o conteúdo exibido contra caracteres HTML
  function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char];
    });
  }
});