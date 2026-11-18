
document.addEventListener("DOMContentLoaded", () => {

  // Elementos da interface
  const formulario = document.querySelector("#ecobot-formulario");
  const campoMensagem = document.querySelector("#ecobot-input");
  const areaMensagens = document.querySelector("#ecobot-mensagens");
  const botaoLimpar = document.querySelector("#ecobot-limpar");
  const botoesRapidos = document.querySelectorAll("[data-pergunta]");
  const botoesAcao = document.querySelectorAll("[data-acao]");

  // Evita erros caso a página não tenha os elementos necessários
  if (!formulario || !campoMensagem || !areaMensagens) {
    console.error("Elementos do EcoBot não encontrados.");
    return;
  }

  // Mensagem inicial do assistente
  const mensagemInicial =
    "Olá! 🌱 Eu sou o EcoBot, assistente virtual da EcoConta!\n\n" +
    "Posso ajudar você com dicas de economia de água e energia, " +
    "metas de consumo e informações sobre sustentabilidade.\n\n" +
    "Como posso ajudar hoje?";

  // Respostas demonstrativas do EcoBot
  const respostas = {

    agua:
      "💧 Dicas para economizar água:\n\n" +
      "• Reduza o tempo no banho.\n" +
      "• Feche a torneira ao escovar os dentes.\n" +
      "• Reutilize água sempre que possível.\n" +
      "• Verifique vazamentos na residência.\n\n" +
      "Pequenas mudanças podem fazer diferença!",

    energia:
      "⚡ Dicas para economizar energia:\n\n" +
      "• Apague as luzes ao sair dos ambientes.\n" +
      "• Aproveite a iluminação natural.\n" +
      "• Retire aparelhos da tomada quando possível.\n" +
      "• Prefira lâmpadas LED.\n" +
      "• Evite deixar o ar-condicionado ligado sem necessidade.",

    consumo:
      "📊 Na EcoConta, você pode acompanhar " +
      "o consumo de água e energia da sua residência.\n\n" +
      "O painel apresenta gráficos, histórico e indicadores " +
      "que ajudam a identificar oportunidades de economia.\n\n" +
      "Nesta demonstração, os dados são fictícios.",

    metas:
      "🎯 As metas de economia ajudam você a reduzir " +
      "seu consumo de água e energia.\n\n" +
      "Por exemplo, você pode estabelecer uma meta " +
      "de reduzir 10% do consumo mensal.\n\n" +
      "A EcoConta permite acompanhar seu progresso " +
      "e visualizar os resultados.",

    pontos:
      "🏆 Os EcoPoints são pontos demonstrativos " +
      "que representam suas conquistas sustentáveis!\n\n" +
      "Você pode ganhar pontos ao economizar água, " +
      "reduzir o consumo de energia e atingir metas.\n\n" +
      "A ideia é incentivar hábitos mais conscientes.",

    anomalias:
      "⚠️ Alerta demonstrativo de consumo:\n\n" +
      "Imagine que sua residência normalmente consuma " +
      "150 kWh de energia por mês, mas registre 210 kWh.\n\n" +
      "Isso representa um aumento de 40%!\n\n" +
      "O EcoBot recomendaria verificar aparelhos ligados " +
      "por muito tempo ou possíveis desperdícios.\n\n" +
      "Este é apenas um exemplo com dados fictícios.",

    sustentabilidade:
      "🌎 Algumas atitudes sustentáveis:\n\n" +
      "• Separe os resíduos recicláveis.\n" +
      "• Evite desperdícios de água e energia.\n" +
      "• Reutilize materiais quando possível.\n" +
      "• Consuma de maneira consciente.\n\n" +
      "A sustentabilidade começa com pequenas ações!",

    ecoconta:
      "🌱 A EcoConta é uma solução voltada ao " +
      "acompanhamento do consumo residencial de água e energia.\n\n" +
      "Seu objetivo é incentivar a economia, " +
      "a sustentabilidade e o uso consciente dos recursos.",

    ajuda:
      "Posso ajudar você com os seguintes assuntos:\n\n" +
      "💧 Economia de água\n" +
      "⚡ Economia de energia\n" +
      "📊 Consumo residencial\n" +
      "🎯 Metas de economia\n" +
      "🏆 EcoPoints\n" +
      "⚠️ Alertas de consumo\n" +
      "🌎 Sustentabilidade",

    desconhecida:
      "Ainda estou aprendendo! 🌱\n\n" +
      "Por enquanto, consigo responder perguntas sobre " +
      "economia de água, energia, consumo, metas, " +
      "EcoPoints e sustentabilidade.\n\n" +
      "Experimente perguntar sobre um desses assuntos!"
  };

  // Remove acentos e padroniza o texto
  function normalizarTexto(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  // Identifica o assunto da mensagem
  function identificarAssunto(mensagem) {
    const texto = normalizarTexto(mensagem);

    if (
      texto.includes("anomalia") ||
      texto.includes("alerta") ||
      texto.includes("aumento") ||
      texto.includes("consumo alto") ||
      texto.includes("desperdicio")
    ) {
      return "anomalias";
    }

    if (
      texto.includes("ecopoint") ||
      texto.includes("pontos") ||
      texto.includes("recompensa") ||
      texto.includes("beneficio")
    ) {
      return "pontos";
    }

    if (
      texto.includes("meta") ||
      texto.includes("objetivo")
    ) {
      return "metas";
    }

    if (
      texto.includes("agua") ||
      texto.includes("banho") ||
      texto.includes("torneira") ||
      texto.includes("vazamento")
    ) {
      return "agua";
    }

    if (
      texto.includes("energia") ||
      texto.includes("eletricidade") ||
      texto.includes("luz") ||
      texto.includes("kwh")
    ) {
      return "energia";
    }

    if (
      texto.includes("consumo") ||
      texto.includes("historico") ||
      texto.includes("grafico")
    ) {
      return "consumo";
    }

    if (
      texto.includes("sustentabilidade") ||
      texto.includes("sustentavel") ||
      texto.includes("meio ambiente") ||
      texto.includes("reciclagem")
    ) {
      return "sustentabilidade";
    }

    if (
      texto.includes("ecoconta") ||
      texto.includes("plataforma")
    ) {
      return "ecoconta";
    }

    if (
      texto.includes("ajuda") ||
      texto.includes("ola") ||
      texto.includes("oi") ||
      texto.includes("bom dia") ||
      texto.includes("boa tarde")
    ) {
      return "ajuda";
    }

    return "desconhecida";
  }

  // Adiciona uma mensagem visualmente ao chat
  function adicionarMensagem(texto, remetente) {
    const mensagem = document.createElement("div");
    mensagem.classList.add("ecobot-mensagem", remetente);

    const bolha = document.createElement("div");
    bolha.classList.add("ecobot-bolha");

    // textContent evita interpretar HTML enviado pelo usuário
    bolha.textContent = texto;

    mensagem.appendChild(bolha);
    areaMensagens.appendChild(mensagem);

    // Rola automaticamente até a mensagem mais recente
    areaMensagens.scrollTop = areaMensagens.scrollHeight;
  }

  // Processa o envio de uma mensagem
  function enviarMensagem(texto) {
    const mensagem = texto.trim();

    if (mensagem === "") {
      return;
    }

    // Mostra a mensagem do usuário
    adicionarMensagem(mensagem, "usuario");

    // Identifica o assunto e escolhe a resposta
    const assunto = identificarAssunto(mensagem);
    const resposta = respostas[assunto];

    // Simula a resposta automática do EcoBot
    adicionarMensagem(resposta, "bot");

    // Limpa o campo de texto
    campoMensagem.value = "";
    campoMensagem.focus();
  }

  // Envio pelo formulário
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    enviarMensagem(campoMensagem.value);
  });

  // Perguntas rápidas
  botoesRapidos.forEach((botao) => {
    botao.addEventListener("click", () => {
      const pergunta = botao.dataset.pergunta;

      if (pergunta) {
        enviarMensagem(pergunta);
      }
    });
  });

  // Botões dos painéis de recomendações
  botoesAcao.forEach((botao) => {
    botao.addEventListener("click", () => {
      const acao = botao.dataset.acao;

      const perguntas = {
        agua: "Como economizar água?",
        energia: "Como economizar energia?",
        anomalias: "Quais são os alertas de consumo?",
        metas: "Como funcionam as metas?",
        pontos: "Como funcionam os EcoPoints?"
      };

      if (perguntas[acao]) {
        enviarMensagem(perguntas[acao]);
      }
    });
  });

  // Reinicia a conversa
  if (botaoLimpar) {
    botaoLimpar.addEventListener("click", () => {
      areaMensagens.innerHTML = "";
      adicionarMensagem(mensagemInicial, "bot");
      campoMensagem.value = "";
    });
  }

  // Inicia o chat com a mensagem de boas-vindas
  adicionarMensagem(mensagemInicial, "bot");

});
