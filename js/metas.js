/* ==========================================
   ECOCONTA - PÁGINA DE METAS E RECOMPENSAS
   Dados fictícios, sem backend.
   ========================================== */


/* ---------- DADOS FICTÍCIOS ---------- */

// Referência de consumo mensal e consumo atual de cada recurso
const RECURSOS = {
    agua: {
        rotulo: "Água",
        unidade: "m³",
        referencia: 15,
        atual: 13.8,
        icone: "droplets"
    },
    energia: {
        rotulo: "Energia",
        unidade: "kWh",
        referencia: 180,
        atual: 165,
        icone: "zap"
    }
};

// Metas já criadas ao abrir a página
let metas = [
    { id: 1, nome: "Banhos mais curtos", tipo: "agua", reducao: 10 },
    { id: 2, nome: "Reduzir a conta de luz", tipo: "energia", reducao: 15 }
];

let proximoId = 3;


/* ---------- CÁLCULOS ---------- */

function formatarNumero(valor) {
    return valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

// Retorna referência, valor da meta, consumo atual e progresso (0 a 100)
function calcularProgresso(meta) {
    const recurso = RECURSOS[meta.tipo];
    const valorMeta = recurso.referencia * (1 - meta.reducao / 100);
    const economiaNecessaria = recurso.referencia - valorMeta;
    const economiaFeita = recurso.referencia - recurso.atual;

    let percentual = (economiaFeita / economiaNecessaria) * 100;
    percentual = Math.max(0, Math.min(100, percentual));

    return {
        valorMeta: valorMeta,
        percentual: Math.round(percentual)
    };
}


/* ---------- LISTA DE METAS ---------- */

function criarCard(meta) {
    const recurso = RECURSOS[meta.tipo];
    const progresso = calcularProgresso(meta);

    const card = document.createElement("article");
    card.className = "metas-card";

    card.innerHTML = `
        <div class="metas-card-topo">
            <i data-lucide="${recurso.icone}" class="metas-card-icone"
               aria-hidden="true"></i>
            <div class="metas-card-titulo">
                <h3></h3>
                <p>Reduzir ${meta.reducao}% do consumo de
                   ${recurso.rotulo.toLowerCase()}</p>
            </div>
            <button type="button" class="metas-remover"
                    data-id="${meta.id}">
                <i data-lucide="trash-2" aria-hidden="true"></i>
            </button>
        </div>

        <div class="metas-progresso-info">
            <strong>Progresso</strong>
            <span>${progresso.percentual}%</span>
        </div>

        <div class="metas-barra" role="progressbar"
             aria-valuemin="0" aria-valuemax="100"
             aria-valuenow="${progresso.percentual}">
            <div class="metas-barra-preenchimento"
                 style="width: ${progresso.percentual}%"></div>
        </div>

        <div class="metas-detalhes">
            <span>Referência: ${formatarNumero(recurso.referencia)}
                  ${recurso.unidade}</span>
            <span>Atual: ${formatarNumero(recurso.atual)}
                  ${recurso.unidade}</span>
            <span>Meta: ${formatarNumero(progresso.valorMeta)}
                  ${recurso.unidade}</span>
        </div>
    `;

    // O nome vem do usuário: inserido como texto, nunca como HTML
    card.querySelector("h3").textContent = meta.nome;

    const botaoRemover = card.querySelector(".metas-remover");
    botaoRemover.setAttribute("aria-label", "Remover meta " + meta.nome);

    return card;
}

function renderizarMetas() {
    const lista = document.getElementById("lista-metas");
    lista.innerHTML = "";

    if (metas.length === 0) {
        const vazio = document.createElement("p");
        vazio.className = "metas-vazio";
        vazio.textContent =
            "Você ainda não tem metas. Crie a primeira no formulário.";
        lista.appendChild(vazio);
        return;
    }

    metas.forEach(function (meta) {
        lista.appendChild(criarCard(meta));
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

function removerMeta(id) {
    metas = metas.filter(function (meta) {
        return meta.id !== id;
    });
    renderizarMetas();
}


/* ---------- VALIDAÇÃO DO FORMULÁRIO ---------- */

function mostrarErro(campoId, erroId, mensagem) {
    const campo = document.getElementById(campoId);
    document.getElementById(erroId).textContent = mensagem;

    if (mensagem) {
        campo.setAttribute("aria-invalid", "true");
    } else {
        campo.removeAttribute("aria-invalid");
    }

    return mensagem === "";
}

function validarFormulario() {
    const nome = document.getElementById("meta-nome").value.trim();
    const tipo = document.getElementById("meta-tipo").value;
    const reducao = Number(document.getElementById("meta-reducao").value);
    const reducaoPreenchida =
        document.getElementById("meta-reducao").value !== "";

    let nomeOk = true;
    if (nome.length < 3) {
        nomeOk = mostrarErro("meta-nome", "erro-nome",
            "Digite um nome com pelo menos 3 letras.");
    } else {
        mostrarErro("meta-nome", "erro-nome", "");
    }

    const tipoOk = tipo
        ? mostrarErro("meta-tipo", "erro-tipo", "")
        : mostrarErro("meta-tipo", "erro-tipo",
            "Escolha água ou energia.");

    let reducaoOk = true;
    if (!reducaoPreenchida || reducao < 5 || reducao > 50) {
        reducaoOk = mostrarErro("meta-reducao", "erro-reducao",
            "Informe uma redução entre 5% e 50%.");
    } else {
        mostrarErro("meta-reducao", "erro-reducao", "");
    }

    return nomeOk && tipoOk && reducaoOk;
}

function configurarFormulario() {
    const form = document.getElementById("form-meta");
    const status = document.getElementById("status-form");

    form.addEventListener("submit", function (evento) {
        evento.preventDefault();
        status.textContent = "";

        if (!validarFormulario()) {
            return;
        }

        metas.push({
            id: proximoId++,
            nome: document.getElementById("meta-nome").value.trim(),
            tipo: document.getElementById("meta-tipo").value,
            reducao: Number(document.getElementById("meta-reducao").value)
        });

        form.reset();
        renderizarMetas();
        status.textContent = "Meta criada.";
    });
}


/* ---------- INICIALIZAÇÃO ---------- */

document.addEventListener("DOMContentLoaded", function () {

    // INICIALIZA OS ÍCONES
    if (window.lucide) {
        lucide.createIcons();
    }

    // MENU MOBILE
    const botaoMenu = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");

    botaoMenu.addEventListener("click", function () {

        const aberto = menu.classList.toggle("ativo");

        botaoMenu.setAttribute("aria-expanded", String(aberto));
        botaoMenu.setAttribute(
            "aria-label",
            aberto ? "Fechar menu" : "Abrir menu"
        );

    });

    // METAS
    configurarFormulario();
    renderizarMetas();

    // Remover meta (um único ouvinte para todos os botões)
    document.getElementById("lista-metas")
        .addEventListener("click", function (evento) {
            const botao = evento.target.closest(".metas-remover");
            if (botao) {
                removerMeta(Number(botao.dataset.id));
            }
        });

});