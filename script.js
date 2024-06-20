function parseReal(valor) {
    // Remove os pontos de milhar e substitui a vírgula por ponto
    return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
}

function formatarReal(valor) {
    // Formata o valor para exibir em formato de moeda brasileira
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularProposta() {
    // Obtendo os valores do formulário
    const valorAtualizadoTJRJ = parseReal(document.getElementById('valorAtualizadoTJRJ').value);
    const percentHonorarios = parseFloat(document.getElementById('percentHonorarios').value);
    const valorBrutoOficio = parseReal(document.getElementById('valorBrutoOficio').value);
    const valorPrevidenciaOficio = parseReal(document.getElementById('valorPrevidenciaOficio').value);
    const impostoRenda = document.getElementById('impostoRenda').value;
    const ano = parseInt(document.getElementById('ano').value);

    // Passo 1: Calcular o valor após descontar os honorários
    const valorMenosHonorarios = valorAtualizadoTJRJ * (1 - percentHonorarios / 100);
    document.getElementById('resultadoHonorarios').innerText = formatarReal(valorMenosHonorarios);

    // Passo 2: Calcular a porcentagem da previdência sobre o valor bruto do ofício
    const porcentagemPrevidencia = (valorPrevidenciaOficio / valorBrutoOficio) * 100;
    document.getElementById('resultadoPrevidenciaPorcentagem').innerText = `${porcentagemPrevidencia.toFixed(2)}%`;

    // Passo 3: Calcular o valor menos a previdência sobre o valor após descontar os honorários
    const valorMenosPrevidencia = valorMenosHonorarios * (1 - porcentagemPrevidencia / 100);
    document.getElementById('resultadoPrevidencia').innerText = formatarReal(valorMenosPrevidencia);

    // Passo 4: Aplicar o imposto de renda se necessário sobre o valor após descontar os honorários e a previdência
    let valorAposImpostoRenda;
    if (impostoRenda === 'sim') {
        valorAposImpostoRenda = valorMenosPrevidencia * (1 - 0.275); // Retira 27.5% de imposto de renda
        document.getElementById('resultadoImpostoRenda').innerText = `(${formatarReal(valorMenosPrevidencia * 0.275)} de IR)`;
    } else {
        valorAposImpostoRenda = valorMenosPrevidencia;
        document.getElementById('resultadoImpostoRenda').innerText = `(Sem IR)`;
    }

    // Passo 5: Calcular a proposta final para o ano selecionado
    let valorProposta;
    switch (ano) {
        case 2021:
            valorProposta = valorAposImpostoRenda * (1 - 0.32); // Retira 32%
            break;
        case 2022:
            valorProposta = valorAposImpostoRenda * (1 - 0.35); // Retira 35%
            break;
        case 2023:
            valorProposta = valorAposImpostoRenda * (1 - 0.45); // Retira 45%
            break;
        case 2024:
            valorProposta = valorAposImpostoRenda * (1 - 0.55); // Retira 55%
            break;
        case 2025:
            valorProposta = valorAposImpostoRenda * (1 - 0.65); // Retira 65%
            break;
        default:
            valorProposta = NaN;
            break;
    }

    // Exibir a proposta final na página
    if (!isNaN(valorProposta)) {
        document.getElementById('resultadoProposta').innerText = formatarReal(valorProposta);
    } else {
        document.getElementById('resultadoProposta').innerText = 'Ano inválido. Por favor, insira um ano entre 2021 e 2025.';
    }
}
