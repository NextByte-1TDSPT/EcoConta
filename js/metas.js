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
        inicial: 13.8,
        passoSimulacao: 0.5,
        icone: "droplets"
    },
    energia: {
        rotulo: "Energia",
        unidade: "kWh",
        referencia: 180,
        atual: 165,
        inicial: 165,
        passoSimulacao: 5,
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
        percentual: Math.round(percentual),
        atingida: percentual >= 100
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
    renderizarRewards();

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


/* ---------- ALERTAS DE CONSUMO ---------- */

const NIVEIS = {
    critico: { rotulo: "Crítico", icone: "triangle-alert" },
    atencao: { rotulo: "Atenção", icone: "circle-alert" },
    info: { rotulo: "Informação", icone: "info" }
};

let alertas = [
    {
        id: 1,
        nivel: "critico",
        tipo: "agua",
        titulo: "Possível vazamento",
        mensagem: "O consumo de água está 40% acima da média " +
                  "dos últimos 3 dias. Verifique torneiras e descargas.",
        quando: "Hoje, 08:15"
    },
    {
        id: 2,
        nivel: "atencao",
        tipo: "energia",
        titulo: "Pico de energia à noite",
        mensagem: "O consumo subiu entre 18h e 21h. " +
                  "Chuveiro e ar-condicionado foram os maiores gastos.",
        quando: "Ontem, 21:30"
    },
    {
        id: 3,
        nivel: "info",
        tipo: "energia",
        titulo: "Você está perto da meta",
        mensagem: "Faltam 12 kWh de redução para bater " +
                  "sua meta de energia.",
        quando: "Ontem, 10:00"
    },
    {
        id: 4,
        nivel: "info",
        tipo: "agua",
        titulo: "Água abaixo da referência",
        mensagem: "Você consumiu 13,8 m³ neste mês, " +
                  "abaixo da referência de 15 m³.",
        quando: "2 dias atrás"
    }
];

let filtroAlertas = "todos";

function criarAlerta(alerta) {
    const nivel = NIVEIS[alerta.nivel];
    const recurso = RECURSOS[alerta.tipo];

    const item = document.createElement("article");
    item.className = "metas-alerta metas-alerta-" + alerta.nivel;

    item.innerHTML = `
        <i data-lucide="${nivel.icone}" class="metas-alerta-icone"
           aria-hidden="true"></i>
        <div class="metas-alerta-corpo">
            <div class="metas-alerta-cabecalho">
                <span class="metas-selo">${nivel.rotulo}</span>
                <span class="metas-alerta-recurso">${recurso.rotulo}</span>
                <span class="metas-alerta-quando">${alerta.quando}</span>
            </div>
            <h3>${alerta.titulo}</h3>
            <p>${alerta.mensagem}</p>
        </div>
        <button type="button" class="metas-remover metas-dispensar"
                data-id="${alerta.id}"
                aria-label="Dispensar alerta: ${alerta.titulo}">
            <i data-lucide="x" aria-hidden="true"></i>
        </button>
    `;

    return item;
}

function renderizarAlertas() {
    const lista = document.getElementById("lista-alertas");
    const contagem = document.getElementById("contagem-alertas");
    lista.innerHTML = "";

    const visiveis = alertas.filter(function (alerta) {
        return filtroAlertas === "todos" || alerta.tipo === filtroAlertas;
    });

    contagem.textContent = visiveis.length === 1
        ? "1 alerta ativo"
        : visiveis.length + " alertas ativos";

    if (visiveis.length === 0) {
        const vazio = document.createElement("p");
        vazio.className = "metas-vazio";
        vazio.textContent =
            "Nenhum alerta no momento. Seu consumo está dentro do esperado.";
        lista.appendChild(vazio);
        return;
    }

    visiveis.forEach(function (alerta) {
        lista.appendChild(criarAlerta(alerta));
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

function configurarAlertas() {
    // Filtros: todos, água ou energia
    const botoes = document.querySelectorAll(".metas-filtro");

    botoes.forEach(function (botao) {
        botao.addEventListener("click", function () {
            filtroAlertas = botao.dataset.filtro;

            botoes.forEach(function (outro) {
                outro.setAttribute(
                    "aria-pressed",
                    String(outro === botao)
                );
            });

            renderizarAlertas();
        });
    });

    // Dispensar alerta (um único ouvinte para todos os botões)
    document.getElementById("lista-alertas")
        .addEventListener("click", function (evento) {
            const botao = evento.target.closest(".metas-dispensar");
            if (botao) {
                const id = Number(botao.dataset.id);
                alertas = alertas.filter(function (alerta) {
                    return alerta.id !== id;
                });
                renderizarAlertas();
            }
        });
}


/* ---------- ECOREWARDS ---------- */

const PONTOS_ANTERIORES = 120;   // pontos acumulados em meses passados
const BONUS_DUAS_METAS = 50;

const NIVEIS_ECO = [
    { nome: "Semente", minimo: 0 },
    { nome: "Broto", minimo: 200 },
    { nome: "Árvore", minimo: 350 },
    { nome: "Floresta", minimo: 500 }
];

// Soma os pontos das metas de cada recurso e aplica o bônus
function calcularEcoPoints() {
    let agua = 0;
    let energia = 0;
    let aguaAtingida = false;
    let energiaAtingida = false;

    metas.forEach(function (meta) {
        const progresso = calcularProgresso(meta);

        if (meta.tipo === "agua") {
            agua += progresso.percentual;
            if (progresso.atingida) { aguaAtingida = true; }
        } else {
            energia += progresso.percentual;
            if (progresso.atingida) { energiaAtingida = true; }
        }
    });

    const bonus = (aguaAtingida && energiaAtingida) ? BONUS_DUAS_METAS : 0;

    return {
        agua: agua,
        energia: energia,
        bonus: bonus,
        total: PONTOS_ANTERIORES + agua + energia + bonus
    };
}

function descobrirNivel(total) {
    let indice = 0;

    NIVEIS_ECO.forEach(function (nivel, i) {
        if (total >= nivel.minimo) { indice = i; }
    });

    return indice;
}

function renderizarRewards() {
    const pontos = calcularEcoPoints();

    document.getElementById("saldo-pontos").textContent = pontos.total;
    document.getElementById("pontos-agua").textContent = pontos.agua;
    document.getElementById("pontos-energia").textContent = pontos.energia;
    document.getElementById("pontos-bonus").textContent = pontos.bonus;

    // Bônus
    const cardBonus = document.getElementById("card-bonus");
    const statusBonus = document.getElementById("bonus-status");

    if (pontos.bonus > 0) {
        cardBonus.classList.add("metas-pontos-ativo");
        statusBonus.textContent = "Bônus conquistado!";
    } else {
        cardBonus.classList.remove("metas-pontos-ativo");
        statusBonus.textContent =
            "Atinja uma meta de água e uma de energia.";
    }

    // Nível atual e progresso até o próximo
    const indice = descobrirNivel(pontos.total);
    const atual = NIVEIS_ECO[indice];
    const proximo = NIVEIS_ECO[indice + 1];

    document.getElementById("nivel-nome").textContent =
        "Nível " + atual.nome;

    let percentualNivel = 100;
    let texto = "Você chegou ao nível máximo.";

    if (proximo) {
        const faixa = proximo.minimo - atual.minimo;
        percentualNivel =
            Math.round(((pontos.total - atual.minimo) / faixa) * 100);
        texto = "Faltam " + (proximo.minimo - pontos.total) +
                " pontos para o nível " + proximo.nome + ".";
    }

    document.getElementById("nivel-info").textContent = texto;
    document.getElementById("barra-nivel")
        .setAttribute("aria-valuenow", percentualNivel);
    document.getElementById("barra-nivel-preenchimento")
        .style.width = percentualNivel + "%";
}

function configurarSimulacao() {
    // Reduz o consumo atual para demonstrar o ganho de pontos
    document.getElementById("btn-simular")
        .addEventListener("click", function () {
            Object.keys(RECURSOS).forEach(function (chave) {
                const recurso = RECURSOS[chave];
                recurso.atual = Math.max(
                    0,
                    Math.round((recurso.atual - recurso.passoSimulacao) * 10) / 10
                );
            });
            renderizarMetas();
        });

    document.getElementById("btn-restaurar")
        .addEventListener("click", function () {
            Object.keys(RECURSOS).forEach(function (chave) {
                RECURSOS[chave].atual = RECURSOS[chave].inicial;
            });
            renderizarMetas();
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
    configurarAlertas();
    renderizarAlertas();
    configurarSimulacao();

    // Remover meta (um único ouvinte para todos os botões)
    document.getElementById("lista-metas")
        .addEventListener("click", function (evento) {
            const botao = evento.target.closest(".metas-remover");
            if (botao) {
                removerMeta(Number(botao.dataset.id));
            }
        });

});