
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

        // Recupera a preferência salva pelo usuário.
        const temaSalvo = localStorage.getItem("tema");

        if (temaSalvo === "escuro") {
            document.body.classList.add("dark-theme");
        }

        // Atualiza o texto do botão.
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

        // Alterna entre os temas.
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
    // FUNCIONALIDADES DO FORMULÁRIO
    // ========================================

    const formularioAgendamento = document.querySelector(
        "#agendamento form"
    );

    // Executa este código somente na página que possui o formulário.
    if (formularioAgendamento) {

        const dataConsulta = document.getElementById("data-consulta");
        const telefone = document.getElementById("telefone");
        const emailAgendamento = document.getElementById("email");
        const consentimento = document.getElementById("consentimento");

        // Obtém a data atual no formato AAAA-MM-DD.
        function obterDataAtual() {
            const hoje = new Date();
            const ano = hoje.getFullYear();
            const mes = String(hoje.getMonth() + 1).padStart(2, "0");
            const dia = String(hoje.getDate()).padStart(2, "0");

            return `${ano}-${mes}-${dia}`;
        }

        // Impede a seleção de datas anteriores ao dia atual.
        if (dataConsulta) {
            dataConsulta.min = obterDataAtual();

            // Atualiza a data mínima ao focar no campo.
            dataConsulta.addEventListener("focus", function () {
                dataConsulta.min = obterDataAtual();
            });

            // Limpa a mensagem de erro quando a data muda.
            dataConsulta.addEventListener("change", function () {
                dataConsulta.setCustomValidity("");
            });
        }

        // Aplica máscara ao telefone enquanto o usuário digita.
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

        // Valida os dados antes de confirmar o agendamento.
        formularioAgendamento.addEventListener("submit", function (evento) {

            // Valida a data da consulta.
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

            // Valida o e-mail.
            if (emailAgendamento && !emailAgendamento.checkValidity()) {
                evento.preventDefault();
                emailAgendamento.reportValidity();
                return;
            }

            // Verifica se o usuário aceitou o consentimento.
            if (consentimento && !consentimento.checked) {
                evento.preventDefault();

                alert("Aceite o consentimento antes de continuar.");

                consentimento.focus();
                return;
            }

            // Impede o envio real, pois o projeto ainda não possui
            // integração com um sistema de agendamento.
            evento.preventDefault();

            alert("Solicitação de agendamento enviada com sucesso!");
        });
    }

});
