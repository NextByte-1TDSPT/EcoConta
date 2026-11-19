/* Armazenamento do EcoConta (demonstração). */

var CHAVE_CONTA = "ecoconta_conta_demo";
var CHAVE_PERFIL = "ecoconta_perfil";

function ler(chave, padrao) {
  var valor = localStorage.getItem(chave);

  if (valor) {
    return JSON.parse(valor);
  } else {
    return padrao;
  }
}

function salvar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

window.EcoContaDados = {
  lerConta: function () {
    return ler(CHAVE_CONTA, null);
  },

  salvarConta: function (conta) {
    salvar(CHAVE_CONTA, conta);
  },

  lerPerfil: function () {
    return ler(CHAVE_PERFIL, null);
  },

  salvarPerfil: function (perfil) {
    salvar(CHAVE_PERFIL, perfil);
  },

  autenticado: function () {
    var status = sessionStorage.getItem("ecoconta_autenticado");

    if (status === "true") {
      return true;
    } else {
      return false;
    }
  },

  autenticar: function () {
    sessionStorage.setItem("ecoconta_autenticado", "true");
  },

  sair: function () {
    sessionStorage.removeItem("ecoconta_autenticado");
  },
};
