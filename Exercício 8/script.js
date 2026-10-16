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

// Aplica máscara ao telefone enquanto o usuário digita.
const telefone = document.getElementById("telefone");

telefone.addEventListener("input", function () {
    let numeros = telefone.value.replace(/\D/g, "").slice(0, 11);

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







});