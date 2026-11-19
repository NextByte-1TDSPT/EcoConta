document.addEventListener("DOMContentLoaded", function () {
  var abaLogin = document.getElementById("aba-login");
  var abaCadastro = document.getElementById("aba-cadastro");
  var formLogin = document.getElementById("form-login");
  var formCadastro = document.getElementById("form-cadastro");
  var titulo = document.getElementById("titulo-formulario");
  var etiqueta = document.getElementById("etiqueta-formulario");
  var descricao = document.getElementById("descricao-formulario");

  function limparMensagens() {
    var campos = document.querySelectorAll(".erro");

    for (var i = 0; i < campos.length; i++) {
      campos[i].textContent = "";

      var grupo = campos[i].closest(".campo");

      if (grupo) {
        grupo.classList.remove("invalido");
      }
    }

    var mensagens = ["mensagem-login", "mensagem-cadastro"];

    for (var j = 0; j < mensagens.length; j++) {
      var mensagem = document.getElementById(mensagens[j]);

      mensagem.textContent = "";
      mensagem.classList.remove("erro-msg");
    }
  }

  function alternarFormulario(modo) {
    if (modo === "login") {
      formLogin.classList.remove("oculto");
      formCadastro.classList.add("oculto");

      abaLogin.classList.add("ativa");
      abaCadastro.classList.remove("ativa");

      abaLogin.setAttribute("aria-selected", "true");
      abaCadastro.setAttribute("aria-selected", "false");

      titulo.textContent = "Acesse sua conta";
      etiqueta.textContent = "BEM-VINDA DE VOLTA";
      descricao.textContent =
        "Entre para continuar acompanhando sua residência.";
    } else {
      formLogin.classList.add("oculto");
      formCadastro.classList.remove("oculto");

      abaLogin.classList.remove("ativa");
      abaCadastro.classList.add("ativa");

      abaLogin.setAttribute("aria-selected", "false");
      abaCadastro.setAttribute("aria-selected", "true");

      titulo.textContent = "Crie sua conta";
      etiqueta.textContent = "COMECE POR AQUI";
      descricao.textContent =
        "Cadastre-se para configurar seu perfil residencial.";
    }

    limparMensagens();
  }

  function erro(id, mensagem) {
    var campo = document.getElementById(id);

    campo.textContent = mensagem;
    campo.closest(".campo").classList.add("invalido");
  }

  function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  abaLogin.addEventListener("click", function () {
    alternarFormulario("login");
  });

  abaCadastro.addEventListener("click", function () {
    alternarFormulario("cadastro");
  });

  document.getElementById("ir-cadastro").addEventListener("click", function () {
    alternarFormulario("cadastro");
  });

  document.getElementById("ir-login").addEventListener("click", function () {
    alternarFormulario("login");
  });

  var botoesSenha = document.querySelectorAll(".mostrar-senha");

  for (var i = 0; i < botoesSenha.length; i++) {
    botoesSenha[i].addEventListener("click", function () {
      var entrada = document.getElementById(this.getAttribute("data-target"));

      if (entrada.type === "password") {
        entrada.type = "text";
        this.setAttribute("aria-label", "Ocultar senha");
        this.innerHTML = '<i class="fas fa-eye-slash" aria-hidden="true"></i>';
      } else {
        entrada.type = "password";
        this.setAttribute("aria-label", "Mostrar senha");
        this.innerHTML = '<i class="fas fa-eye" aria-hidden="true"></i>';
      }
    });
  }

  formCadastro.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limparMensagens();

    var nome = document.getElementById("cadastro-nome").value.trim();
    var email = document
      .getElementById("cadastro-email")
      .value.trim()
      .toLowerCase();
    var senha = document.getElementById("cadastro-senha").value;
    var confirmacao = document.getElementById("cadastro-confirmacao").value;

    var valido = true;

    if (nome.length < 3) {
      erro("erro-cadastro-nome", "Informe seu nome (mínimo de 3 caracteres).");
      valido = false;
    }

    if (!emailValido(email)) {
      erro("erro-cadastro-email", "Digite um e-mail válido.");
      valido = false;
    }

    if (senha.length < 8) {
      erro("erro-cadastro-senha", "A senha deve ter pelo menos 8 caracteres.");
      valido = false;
    }

    if (senha !== confirmacao) {
      erro("erro-cadastro-confirmacao", "As senhas não coincidem.");
      valido = false;
    }

    if (valido === false) {
      return;
    }

    EcoContaDados.salvarConta({
      nome: nome,
      email: email,
      senhaDemo: senha,
    });

    var perfilExistente = EcoContaDados.lerPerfil();

    if (!perfilExistente) {
      perfilExistente = {};
    }

    perfilExistente.nome = nome;
    perfilExistente.email = email;

    if (!perfilExistente.residencia) {
      perfilExistente.residencia = {};
    }

    EcoContaDados.salvarPerfil(perfilExistente);
    EcoContaDados.autenticar();

    document.getElementById("mensagem-cadastro").textContent =
      "Conta criada! Vamos configurar sua residência...";

    window.location.href = "onboarding.html";
  });

  formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limparMensagens();

    var email = document
      .getElementById("login-email")
      .value.trim()
      .toLowerCase();
    var senha = document.getElementById("login-senha").value;

    var valido = true;

    if (!emailValido(email)) {
      erro("erro-login-email", "Digite um e-mail válido.");
      valido = false;
    }

    if (senha.length < 8) {
      erro("erro-login-senha", "A senha deve ter pelo menos 8 caracteres.");
      valido = false;
    }

    if (valido === false) {
      return;
    }

    var conta = EcoContaDados.lerConta();

    if (!conta) {
      var mensagem = document.getElementById("mensagem-login");

      mensagem.textContent =
        "Dados não encontrados. Confira seu e-mail e senha ou crie uma conta.";

      mensagem.classList.add("erro-msg");
      return;
    }

    if (conta.email !== email || conta.senhaDemo !== senha) {
      var mensagem = document.getElementById("mensagem-login");

      mensagem.textContent =
        "Dados não encontrados. Confira seu e-mail e senha ou crie uma conta.";

      mensagem.classList.add("erro-msg");
      return;
    }

    EcoContaDados.autenticar();

    var perfil = EcoContaDados.lerPerfil();

    if (perfil) {
      if (perfil.residencia) {
        if (perfil.residencia.onboardingConcluido) {
          window.location.href = "perfil.html";
        } else {
          window.location.href = "onboarding.html";
        }
      } else {
        window.location.href = "onboarding.html";
      }
    } else {
      window.location.href = "onboarding.html";
    }
  });
});
