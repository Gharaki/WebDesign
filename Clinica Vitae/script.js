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
    // VALIDAÇÃO INTELIGENTE DO FORMULÁRIO
    // ========================================

    const formularioAgendamento = document.querySelector(
        "#agendamento form"
    );

    if (formularioAgendamento) {
        const dataConsulta = document.getElementById("data-consulta");
        const telefone = document.getElementById("telefone");
        const emailAgendamento = document.getElementById("email");
        const nascimento = document.getElementById("nascimento");
        const nome = document.getElementById("nome");
        const consentimento = document.getElementById("consentimento");

        const campos = Array.from(
            formularioAgendamento.querySelectorAll(
                "input, select, textarea"
            )
        );

        function obterDataLocal() {
            const hoje = new Date();
            const ano = hoje.getFullYear();
            const mes = String(hoje.getMonth() + 1).padStart(2, "0");
            const dia = String(hoje.getDate()).padStart(2, "0");

            return `${ano}-${mes}-${dia}`;
        }

        if (dataConsulta) {
            dataConsulta.min = obterDataLocal();
        }

        if (nascimento) {
            nascimento.max = obterDataLocal();
        }

        // Cria mensagens acessíveis sem exigir alterações no HTML.
        campos.forEach(function (campo) {
            if (!campo.id) return;

            const idMensagem = `${campo.id}-erro`;
            let mensagem = document.getElementById(idMensagem);

            if (!mensagem) {
                mensagem = document.createElement("small");
                mensagem.id = idMensagem;
                mensagem.className = "mensagem-validacao";
                mensagem.setAttribute("aria-live", "polite");

                campo.insertAdjacentElement("afterend", mensagem);
            }

            const descricoes = (
                campo.getAttribute("aria-describedby") || ""
            ).split(/\s+/).filter(Boolean);

            if (!descricoes.includes(idMensagem)) {
                descricoes.push(idMensagem);
            }

            campo.setAttribute(
                "aria-describedby",
                descricoes.join(" ")
            );
        });

        function definirErro(campo, mensagem) {
            if (!campo) return false;

            const elementoMensagem = document.getElementById(
                `${campo.id}-erro`
            );

            campo.classList.toggle(
                "campo-invalido",
                Boolean(mensagem)
            );

            campo.classList.toggle(
                "campo-valido",
                !mensagem && campo.value.trim() !== ""
            );

            campo.setAttribute(
                "aria-invalid",
                String(Boolean(mensagem))
            );

            if (elementoMensagem) {
                elementoMensagem.textContent = mensagem || "";
            }

            campo.setCustomValidity(mensagem || "");

            return !mensagem;
        }

        function validarCampo(campo) {
            if (!campo || campo.disabled || campo.type === "hidden") {
                return true;
            }

            const valor = campo.type === "checkbox"
                ? campo.checked
                : campo.value.trim();

            let erro = "";

            if (
                campo.required &&
                (
                    campo.type === "checkbox"
                        ? !campo.checked
                        : !valor
                )
            ) {
                erro = campo.type === "checkbox"
                    ? "É necessário marcar esta opção para continuar."
                    : "Este campo é obrigatório.";

            } else if (
                valor &&
                campo === nome &&
                valor.replace(/\s+/g, " ").length < 3
            ) {
                erro = "Informe seu nome completo (pelo menos 3 caracteres).";

            } else if (valor && campo === telefone) {
                const quantidade = valor.replace(/\D/g, "").length;

                if (quantidade < 10 || quantidade > 11) {
                    erro = "Informe um telefone com DDD e 10 ou 11 dígitos.";
                }

            } else if (
                valor &&
                campo === emailAgendamento &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)
            ) {
                erro = "Digite um endereço de e-mail válido.";

            } else if (
                valor &&
                campo === nascimento &&
                valor > obterDataLocal()
            ) {
                erro = "A data de nascimento não pode estar no futuro.";

            } else if (
                valor &&
                campo === dataConsulta &&
                valor < obterDataLocal()
            ) {
                erro = "Escolha hoje ou uma data futura para a consulta.";
            }

            return definirErro(campo, erro);
        }

        // Máscara de telefone e validação progressiva.
        if (telefone) {
            telefone.setAttribute("inputmode", "tel");

            telefone.addEventListener("input", function () {
                const numeros = telefone.value
                    .replace(/\D/g, "")
                    .slice(0, 11);

                if (numeros.length > 10) {
                    telefone.value = numeros.replace(
                        /^(\d{2})(\d{5})(\d{0,4})$/,
                        "($1) $2-$3"
                    );

                } else if (numeros.length > 6) {
                    telefone.value = numeros.replace(
                        /^(\d{2})(\d{4})(\d{0,4})$/,
                        "($1) $2-$3"
                    );

                } else if (numeros.length > 2) {
                    telefone.value = numeros.replace(
                        /^(\d{2})(\d{0,5})$/,
                        "($1) $2"
                    );

                } else if (numeros.length > 0) {
                    telefone.value = `(${numeros}`;
                }

                if (telefone.dataset.tocado === "true") {
                    validarCampo(telefone);
                }
            });
        }

        campos.forEach(function (campo) {
            const evento =
                campo.type === "checkbox" ||
                campo.tagName === "SELECT" ||
                campo.type === "date"
                    ? "change"
                    : "input";

            campo.addEventListener(evento, function () {
                campo.dataset.tocado = "true";
                validarCampo(campo);
            });

            campo.addEventListener("blur", function () {
                campo.dataset.tocado = "true";
                validarCampo(campo);
            });
        });

        formularioAgendamento.addEventListener(
            "submit",
            function (evento) {
                evento.preventDefault();

                let primeiroCampoInvalido = null;

                campos.forEach(function (campo) {
                    campo.dataset.tocado = "true";

                    if (
                        !validarCampo(campo) &&
                        !primeiroCampoInvalido
                    ) {
                        primeiroCampoInvalido = campo;
                    }
                });

                const avisoAnterior = formularioAgendamento.querySelector(
                    ".retorno-validacao"
                );

                if (avisoAnterior) {
                    avisoAnterior.remove();
                }

                if (primeiroCampoInvalido) {
                    primeiroCampoInvalido.focus();
                    primeiroCampoInvalido.reportValidity();

                    const aviso = document.createElement("p");
                    aviso.className = "retorno-validacao retorno-erro";
                    aviso.setAttribute("role", "alert");
                    aviso.textContent =
                        "Revise os campos destacados antes de continuar.";

                    formularioAgendamento.prepend(aviso);
                    return;
                }

                // O projeto ainda não possui integração com um backend.
                const aviso = document.createElement("p");

                aviso.className =
                    "retorno-validacao retorno-sucesso";

                aviso.setAttribute("role", "status");

                aviso.textContent =
                    "Todos os dados foram validados! A integração para enviar " +
                    "a solicitação à clínica ainda precisa ser configurada.";

                formularioAgendamento.prepend(aviso);
                aviso.focus();
            }
        );
    }

    // ========================================
    // BOTÃO VOLTAR AO TOPO
    // ========================================

    const botaoVoltarTopo = document.createElement("button");

    botaoVoltarTopo.id = "voltar-ao-topo";
    botaoVoltarTopo.type = "button";
    botaoVoltarTopo.textContent = "↑";

    botaoVoltarTopo.setAttribute(
        "aria-label",
        "Voltar ao topo da página"
    );

    botaoVoltarTopo.setAttribute(
        "title",
        "Voltar ao topo"
    );

    document.body.appendChild(botaoVoltarTopo);

    const movimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    function atualizarBotaoVoltarTopo() {
        const deveMostrar = window.scrollY > 350;

        botaoVoltarTopo.classList.toggle(
            "visivel",
            deveMostrar
        );

        botaoVoltarTopo.setAttribute(
            "aria-hidden",
            String(!deveMostrar)
        );

        botaoVoltarTopo.tabIndex = deveMostrar ? 0 : -1;
    }

    window.addEventListener(
        "scroll",
        atualizarBotaoVoltarTopo,
        { passive: true }
    );

    botaoVoltarTopo.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: movimentoReduzido.matches
                ? "auto"
                : "smooth"
        });
    });

    atualizarBotaoVoltarTopo();
});