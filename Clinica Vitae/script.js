
/*
 * Início da integração do JavaScript externo.
 */

// Aguarda o carregamento do HTML antes de executar o código.
document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript foi carregado.");

    // ========================================
    // MODO ESCURO
    // ========================================

    const header = document.getElementById("header");

    if (header) {
        const botaoTema = document.createElement("button");

        botaoTema.id = "botao-tema";
        botaoTema.type = "button";
        botaoTema.textContent = "🌙 Modo escuro";
        botaoTema.setAttribute("aria-label", "Ativar modo escuro");

        header.appendChild(botaoTema);

        const temaSalvo = localStorage.getItem("tema");

        if (temaSalvo === "escuro") {
            document.body.classList.add("dark-theme");
        }

        function atualizarBotaoTema() {
            const modoEscuro = document.body.classList.contains("dark-theme");

            botaoTema.textContent = modoEscuro
                ? "☀️ Modo claro"
                : "🌙 Modo escuro";

            botaoTema.setAttribute(
                "aria-label",
                modoEscuro ? "Ativar modo claro" : "Ativar modo escuro"
            );
        }

        atualizarBotaoTema();

        botaoTema.addEventListener("click", function () {
            document.body.classList.toggle("dark-theme");

            const novoTema = document.body.classList.contains("dark-theme")
                ? "escuro"
                : "claro";

            localStorage.setItem("tema", novoTema);
            atualizarBotaoTema();
        });
    }

    // ========================================
    // MENU RESPONSIVO
    // ========================================

    const navegacao = header ? header.querySelector("nav") : null;

    if (header && navegacao) {
        const botaoMenu = document.createElement("button");

        botaoMenu.id = "botao-menu";
        botaoMenu.type = "button";
        botaoMenu.textContent = "☰";
        botaoMenu.setAttribute("aria-label", "Abrir menu");
        botaoMenu.setAttribute("aria-expanded", "false");

        if (!navegacao.id) {
            navegacao.id = "menu-principal";
        }

        botaoMenu.setAttribute("aria-controls", navegacao.id);

        header.insertBefore(botaoMenu, navegacao);

        botaoMenu.addEventListener("click", function () {
            const menuAberto = header.classList.toggle("menu-aberto");

            botaoMenu.textContent = menuAberto ? "✕" : "☰";
            botaoMenu.setAttribute(
                "aria-label",
                menuAberto ? "Fechar menu" : "Abrir menu"
            );
            botaoMenu.setAttribute("aria-expanded", String(menuAberto));
        });

        navegacao.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                header.classList.remove("menu-aberto");
                botaoMenu.textContent = "☰";
                botaoMenu.setAttribute("aria-label", "Abrir menu");
                botaoMenu.setAttribute("aria-expanded", "false");
            });
        });
    }

    // ========================================
    // CARROSSEL DE PROFISSIONAIS
    // ========================================

    const equipe = document.getElementById("equipe");
    const listaMedicos = equipe ? equipe.querySelector(".equipe-lista") : null;

    if (equipe && listaMedicos) {
        listaMedicos.classList.add("carrossel-medicos");
        listaMedicos.setAttribute("tabindex", "0");
        listaMedicos.setAttribute(
            "aria-label",
            "Carrossel de profissionais da clínica"
        );

        const controles = document.createElement("div");
        controles.className = "controles-carrossel";
        controles.setAttribute(
            "aria-label",
            "Controles do carrossel de profissionais"
        );

        const botaoAnterior = document.createElement("button");
        botaoAnterior.type = "button";
        botaoAnterior.className = "carrossel-anterior";
        botaoAnterior.textContent = "‹";
        botaoAnterior.setAttribute(
            "aria-label",
            "Ver profissionais anteriores"
        );

        const botaoProximo = document.createElement("button");
        botaoProximo.type = "button";
        botaoProximo.className = "carrossel-proximo";
        botaoProximo.textContent = "›";
        botaoProximo.setAttribute(
            "aria-label",
            "Ver próximos profissionais"
        );

        controles.append(botaoAnterior, botaoProximo);
        listaMedicos.parentNode.insertBefore(controles, listaMedicos);

        function distanciaDoDeslocamento() {
            const primeiroMedico = listaMedicos.querySelector(".medico");

            if (!primeiroMedico) {
                return listaMedicos.clientWidth * 0.8;
            }

            const estilos = window.getComputedStyle(listaMedicos);
            const gap = parseFloat(estilos.columnGap || estilos.gap) || 0;

            return primeiroMedico.getBoundingClientRect().width + gap;
        }

        function atualizarControles() {
            const limite = listaMedicos.scrollWidth - listaMedicos.clientWidth;

            botaoAnterior.disabled = listaMedicos.scrollLeft <= 2;
            botaoProximo.disabled = listaMedicos.scrollLeft >= limite - 2;

            const haRolagem = limite > 2;
            controles.hidden = !haRolagem;
        }

        botaoAnterior.addEventListener("click", function () {
            listaMedicos.scrollBy({
                left: -distanciaDoDeslocamento(),
                behavior: "smooth"
            });
        });

        botaoProximo.addEventListener("click", function () {
            listaMedicos.scrollBy({
                left: distanciaDoDeslocamento(),
                behavior: "smooth"
            });
        });

        listaMedicos.addEventListener(
            "scroll",
            atualizarControles,
            { passive: true }
        );

        window.addEventListener("resize", atualizarControles);
        atualizarControles();
    }

    // ========================================
    // ANIMAÇÕES SUAVES
    // ========================================

    const prefereMovimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefereMovimentoReduzido && "IntersectionObserver" in window) {
        const elementosAnimados = document.querySelectorAll(
            "main > section, #equipe .medico, .diferencial, " +
            ".estrutura-item, .etapa, .convenio, .depoimento, " +
            ".item-contato, #footer .footer-conteudo > div"
        );

        if (elementosAnimados.length > 0) {
            document.body.classList.add("animacoes-prontas");

            const observadorAnimacoes = new IntersectionObserver(
                function (entradas, observador) {
                    entradas.forEach(function (entrada) {
                        if (entrada.isIntersecting) {
                            entrada.target.classList.add("visivel");
                            observador.unobserve(entrada.target);
                        }
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

            elementosAnimados.forEach(function (elemento, indice) {
                elemento.classList.add("animacao-revelar");

                elemento.style.setProperty(
                    "--atraso-animacao",
                    `${(indice % 4) * 90}ms`
                );

                observadorAnimacoes.observe(elemento);
            });
        }
    }

    // ========================================
    // FUNCIONALIDADES DO FORMULÁRIO
    // ========================================

    const formularioAgendamento = document.querySelector(
        "#agendamento form"
    );

    if (formularioAgendamento) {
        const dataConsulta = document.getElementById("data-consulta");
        const telefone = document.getElementById("telefone");
        const emailAgendamento = document.getElementById("email");
        const consentimento = document.getElementById("consentimento");

        function obterDataAtual() {
            const hoje = new Date();
            const ano = hoje.getFullYear();
            const mes = String(hoje.getMonth() + 1).padStart(2, "0");
            const dia = String(hoje.getDate()).padStart(2, "0");

            return `${ano}-${mes}-${dia}`;
        }

        if (dataConsulta) {
            dataConsulta.min = obterDataAtual();

            dataConsulta.addEventListener("focus", function () {
                dataConsulta.min = obterDataAtual();
            });

            dataConsulta.addEventListener("change", function () {
                dataConsulta.setCustomValidity("");
            });
        }

        if (telefone) {
            telefone.addEventListener("input", function () {
                let numeros = telefone.value
                    .replace(/\D/g, "")
                    .slice(0, 11);

                if (numeros.length > 10) {
                    telefone.value = numeros.replace(
                        /^(\d{2})(\d{5})(\d{0,4}).*/,
                        "($1) $2-$3"
                    );
                } else if (numeros.length > 6) {
                    telefone.value = numeros.replace(
                        /^(\d{2})(\d{4})(\d{0,4}).*/,
                        "($1) $2-$3"
                    );
                } else if (numeros.length > 2) {
                    telefone.value = numeros.replace(
                        /^(\d{2})(\d{0,5})/,
                        "($1) $2"
                    );
                } else if (numeros.length > 0) {
                    telefone.value = `(${numeros}`;
                }
            });
        }

        formularioAgendamento.addEventListener("submit", function (evento) {
            if (dataConsulta) {
                const hoje = obterDataAtual();

                if (!dataConsulta.value || dataConsulta.value < hoje) {
                    evento.preventDefault();

                    dataConsulta.setCustomValidity(
                        "Selecione hoje ou uma data futura para a consulta."
                    );

                    dataConsulta.reportValidity();
                    return;
                }

                dataConsulta.setCustomValidity("");
            }

            if (emailAgendamento && !emailAgendamento.checkValidity()) {
                evento.preventDefault();
                emailAgendamento.reportValidity();
                return;
            }

            if (consentimento && !consentimento.checked) {
                evento.preventDefault();
                alert("Aceite o consentimento antes de continuar.");
                consentimento.focus();
                return;
            }

            evento.preventDefault();
            alert("Solicitação de agendamento enviada com sucesso!");
        });
    }
});
