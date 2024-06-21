// Função para formatar valores como reais (R$)
function formatarReais(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para converter valores formatados em string para número
function converterParaNumero(valor) {
    return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
}

// Função para calcular a proposta
function calcularProposta() {
    // Obtendo os valores do formulário e convertendo para números
    const valorBrutoOficio = converterParaNumero(document.getElementById('valorBrutoOficio').value);
    const valorPrevidenciaOficio = converterParaNumero(document.getElementById('valorPrevidenciaOficio').value);
    const valorAtualizadoTJRJ = converterParaNumero(document.getElementById('valorAtualizadoTJRJ').value);
    const percentHonorarios = parseFloat(document.getElementById('percentHonorarios').value.replace(',', '.'));
    const impostoRenda = document.getElementById('impostoRenda').value;
    const ano = parseInt(document.getElementById('ano').value);

    // Passo 1: Calculando e arredondando a porcentagem da previdência
    let porcentagemPrevidencia = (valorPrevidenciaOficio / valorBrutoOficio) * 100;
    porcentagemPrevidencia = Math.round(porcentagemPrevidencia);
    document.getElementById('resultadoPrevidenciaPorcentagem').innerText = `${porcentagemPrevidencia}%`;

    // Passo 2: Tirando a % dos honorários do valor atualizado
    const valorMenosHonorarios = valorAtualizadoTJRJ * (1 - percentHonorarios / 100);
    document.getElementById('resultadoHonorarios').innerText = formatarReais(valorMenosHonorarios);

    // Passo 3: Tirando a porcentagem da previdência do valor atualizado
    const descontoPrevidencia = valorMenosHonorarios * (porcentagemPrevidencia / 100);
    const valorMenosPrevidencia = valorMenosHonorarios - descontoPrevidencia;
    document.getElementById('resultadoPrevidencia').innerText = `Valor líquido: ${formatarReais(valorMenosPrevidencia)} \n Valor descontado: ${formatarReais(descontoPrevidencia)}`;

    // Passo 4: Aplicando o imposto de renda se necessário
    let valorAposImpostoRenda = valorMenosPrevidencia;
    let valorDescontoIR = 0;
    if (impostoRenda === 'sim') {
        valorDescontoIR = valorMenosPrevidencia * 0.275;
        valorAposImpostoRenda = valorMenosPrevidencia - valorDescontoIR;
        document.getElementById('resultadoImpostoRenda').innerText = `Valor líquido atualizado: ${formatarReais(valorAposImpostoRenda)} \n Valor descontado: ${formatarReais(valorDescontoIR)}`;
    } else {
        document.getElementById('resultadoImpostoRenda').innerText = `Valor líquido atualizado: ${formatarReais(valorAposImpostoRenda)} \n Valor descontado: R$ 0,00`;
    }

    // Passo 5: Calculando a proposta para o ano
    let valorProposta;
    switch (ano) {
        case 2021:
            valorProposta = valorAposImpostoRenda * 0.68;
            break;
        case 2022:
            valorProposta = valorAposImpostoRenda * 0.65;
            break;
        case 2023:
            valorProposta = valorAposImpostoRenda * 0.55;
            break;
        case 2024:
            valorProposta = valorAposImpostoRenda * 0.45;
            break;
        case 2025:
            valorProposta = valorAposImpostoRenda * 0.35;
            break;
        default:
            valorProposta = NaN;
            break;
    }

    if (!isNaN(valorProposta)) {
        document.getElementById('resultadoAno').innerText = formatarReais(valorProposta);
        document.getElementById('resultadoFinal').innerText = formatarReais(valorProposta);
    } else {
        document.getElementById('resultadoAno').innerText = `Ano inválido`;
        document.getElementById('resultadoFinal').innerText = `Ano inválido`;
    }

}

