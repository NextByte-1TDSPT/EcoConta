# 🌿 EcoConta — NextByte ⚡💧

Projeto desenvolvido para a **Global Solution 2026/2 da FIAP**, pela equipe **NextByte**, da turma **1TDSPT**.

O EcoConta é uma plataforma demonstrativa voltada ao acompanhamento do consumo residencial de água e energia. A solução reúne indicadores de consumo, ferramentas para organização de metas e orientações para incentivar hábitos mais conscientes e sustentáveis.

## Acesse o projeto

- **Aplicação publicada:** [EcoConta — GitHub Pages](https://nextbyte-1tdspt.github.io/EcoConta/)
- **Repositório público:** [NextByte-1TDSPT/EcoConta](https://github.com/NextByte-1TDSPT/EcoConta)

## Funcionalidades

- **Página inicial:** apresentação da proposta e dos recursos da plataforma.
- **Acesso e perfil:** cadastro, login demonstrativo e gerenciamento das informações do perfil.
- **Painel:** visão geral de indicadores de consumo residencial.
- **Consumo:** acompanhamento demonstrativo do consumo de água e energia.
- **Metas:** criação e acompanhamento de objetivos de economia.
- **EcoBot:** orientações relacionadas ao consumo consciente.
- **Páginas institucionais:** Sobre, Integrantes, FAQ e Contato.

## Tecnologias utilizadas

- **HTML5:** estruturação das páginas.
- **CSS3:** estilos, identidade visual e adaptação para diferentes tamanhos de tela.
- **JavaScript:** interações, validações e funcionalidades da aplicação.
- **Lucide Icons:** ícones da interface.
- **Font Awesome:** ícones complementares.
- **Web Storage (`localStorage` e `sessionStorage`):** para armazenarmos localmente os dados para sem demonstrados no navegador.

## Estrutura de pastas

A aplicação está organizada por responsabilidade: `pages/` reúne as páginas internas; `css/` concentra os estilos; `js/` contém os scripts; e `img/` armazena os recursos visuais.

```text
EcoConta/
├── pages/
│   ├── acesso.html
│   ├── ajustes-perfil.html
│   ├── consumo.html
│   ├── contato.html
│   ├── dashboard.html
│   ├── ecobot.html
│   ├── faq.html
│   ├── integrantes.html
│   ├── metas.html
│   ├── perfil.html
│   └── sobre.html
├── css/
│   ├── acesso.css
│   ├── ajustes-perfil.css
│   ├── consumo.css
│   ├── contato.css
│   ├── dashboard.css
│   ├── ecobot.css
│   ├── faq.css
│   ├── integrantes.css
│   ├── metas.css
│   ├── navegacao.css
│   ├── painel.css
│   ├── perfil.css
│   ├── sobre.css
│   └── style.css
├── js/
│   ├── acesso.js
│   ├── ajustes-perfil.js
│   ├── consumo-dados.js
│   ├── consumo.js
│   ├── contato.js
│   ├── dados.js
│   ├── dashboard.js
│   ├── ecobot.js
│   ├── faq.js
│   ├── integrantes.js
│   ├── metas.js
│   ├── navegacao.js
│   ├── painel.js
│   └── perfil.js
├── img/
│   ├── david.png
│   ├── let.png
│   ├── matheus.png
│   ├── sarah.png
│   └── vini.png
├── index.html
├── README.md
```

## Como executar

### Executar localmente 

1. Faça o download do repositório ou clone-o:

   ```bash
   git clone https://github.com/NextByte-1TDSPT/EcoConta.git
   ```

2. Abra a pasta `EcoConta` e abra o arquivo `index.html`
4. A aplicação será aberta no navegador. Utilize o menu de navegação para acessar as demais páginas.

Também é possível acessar diretamente a versão publicada no GitHub Pages:

[https://nextbyte-1tdspt.github.io/EcoConta/](https://nextbyte-1tdspt.github.io/EcoConta/)

## Integrantes — Equipe NextByte

**Turma:** 1TDSPT

| Integrante | RM | GitHub | LinkedIn |
|---|---|---|---|
| Letícia Santana do Nascimento | 575620 | [@Leletsn](https://github.com/Leletsn) | [LinkedIn](https://www.linkedin.com/in/leticia-santana-do-nascimento/) |
| Sarah de Oliveira Montin | 574721 | [@sarahmontin](https://github.com/sarahmontin) | [LinkedIn](https://www.linkedin.com/in/sarah-montin-a4592a315/) |
| Vinícius Jaime Scola | 574861 | [@viniscola](https://github.com/viniscola) | [LinkedIn](https://www.linkedin.com/in/vinicius-jaime-scola-0193a03a8/) |
| Matheus Manoel Silva | 576376 | [@matheus18manoel-stack](https://github.com/matheus18manoel-stack) | [LinkedIn](https://www.linkedin.com/in/matheus-manoel-silva/) |
| David de Oliveira Montin | 574719 | [@davidmontin](https://github.com/davidmontin) | [LinkedIn](https://www.linkedin.com/in/david-montin-17a8882b2/) |

## Contato

Para dúvidas ou informações sobre o projeto, entre em contato com a equipe por meio do [repositório público no GitHub](https://github.com/NextByte-1TDSPT/EcoConta), utilizando a área de *Issues* ou pela aba de contato no Site EcoConta.

## Observações

- Os dados armazenados em `localStorage` e `sessionStorage` permanecem no navegador utilizado e não são sincronizados automaticamente entre dispositivos.
- Os valores apresentados têm finalidade demonstrativa e não representam medições oficiais.
- O EcoConta é um protótipo acadêmico de front-end, não um sistema conectado a medidores ou concessionárias reais.
- As informações de consumo, metas e economia devem ser interpretadas como dados apenas de demonstração.

---

**FIAP — Global Solution 2026/2**  
**Equipe NextByte — Turma 1TDSPT**
