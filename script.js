// Função para formatar valores como reais (R$)
function formatarReais(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para converter valores formatados em string para número
function converterParaNumero(valor) {
    return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
}

// Função para formatar a entrada de texto como reais (R$) durante a digitação
function formatarEntrada(campo) {
    let valor = campo.value;
    valor = valor.replace(/\D/g, '');
    valor = (valor / 100).toFixed(2) + '';
    valor = valor.replace(".", ",");
    valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    campo.value = valor;
}

// Função para calcular a proposta
function calcularProposta() {
    // Obtendo os valores do formulário e convertendo para números
    const valorBrutoOficio = converterParaNumero(document.getElementById('valorBrutoOficio').value);
    const valorPrevidenciaOficio = converterParaNumero(document.getElementById('valorPrevidenciaOficio').value);
    const valorAtualizadoTJRJ = converterParaNumero(document.getElementById('valorAtualizadoTJRJ').value);
    const percentHonorarios = parseFloat(document.getElementById('percentHonorarios').value.replace(',', '.'));
    const impostoRenda = document.getElementById('impostoRenda').value;
    const descontoPrioridade = document.getElementById('descontoPrioridade').value;
    const ano = parseInt(document.getElementById('ano').value);

    // Passo 1: Aplicando o desconto de prioridade se necessário
    let valorComDescontoPrioridade = valorAtualizadoTJRJ;
    if (descontoPrioridade === 'sim') {
        valorComDescontoPrioridade -= 141000;
    }

    // Passo 2: Calculando e arredondando a porcentagem da previdência
    let porcentagemPrevidencia = (valorPrevidenciaOficio / valorBrutoOficio) * 100;
    porcentagemPrevidencia = Math.round(porcentagemPrevidencia);
    document.getElementById('resultadoPrevidenciaPorcentagem').innerText = `${porcentagemPrevidencia}%`;

    // Passo 3: Tirando a % dos honorários do valor atualizado com desconto de prioridade
    const valorMenosHonorarios = valorComDescontoPrioridade * (1 - percentHonorarios / 100);
    document.getElementById('resultadoHonorarios').innerText = formatarReais(valorMenosHonorarios);

    // Passo 4: Tirando a porcentagem da previdência do valor atualizado
    const descontoPrevidencia = valorMenosHonorarios * (porcentagemPrevidencia / 100);
    const valorMenosPrevidencia = valorMenosHonorarios - descontoPrevidencia;
    document.getElementById('resultadoPrevidencia').innerText = `Valor líquido: ${formatarReais(valorMenosPrevidencia)} \n Valor descontado: ${formatarReais(descontoPrevidencia)}`;

    // Passo 5: Aplicando o imposto de renda se necessário
    let valorAposImpostoRenda = valorMenosPrevidencia;
    let valorDescontoIR = 0;
    if (impostoRenda === 'sim') {
        valorDescontoIR = valorMenosPrevidencia * 0.275;
        valorAposImpostoRenda = valorMenosPrevidencia - valorDescontoIR;
        document.getElementById('resultadoImpostoRenda').innerText = `Valor líquido atualizado: ${formatarReais(valorAposImpostoRenda)} \n Valor descontado: ${formatarReais(valorDescontoIR)}`;
    } else {
        document.getElementById('resultadoImpostoRenda').innerText = `Valor líquido atualizado: ${formatarReais(valorAposImpostoRenda)} \n Valor descontado: ${formatarReais(0)}`;
    }

    // Passo 6: Calculando a proposta para o ano
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
    } else {
        document.getElementById('resultadoAno').innerText = `Ano inválido`;
    }
}
