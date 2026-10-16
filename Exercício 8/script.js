/*
 * Início da integração do JavaScript externo.
 */

// Aguarda o carregamento do HTML antes de executar o código.
document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript foi carregado.");

// Valida a data da consulta.
const formulario = document.querySelector("#agendamento form");
const dataConsulta = document.getElementById("data-consulta");

// Obtém a data atual no formato AAAA-MM-DD.
function obterDataAtual() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

// Impede a seleção de datas anteriores ao dia atual.
dataConsulta.min = obterDataAtual();

// Atualiza a data mínima ao focar no campo.
dataConsulta.addEventListener("focus", function () {
    dataConsulta.min = obterDataAtual();
});

// Confere a data antes de enviar o formulário.
formulario.addEventListener("submit", function (evento) {
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
});

// Limpa a mensagem de erro quando a data muda.
dataConsulta.addEventListener("change", function () {
    dataConsulta.setCustomValidity("");
});








});