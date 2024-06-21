function calcularProposta() {
    // Obtendo os valores do formulário
    const valorBrutoOficio = parseFloat(document.getElementById('valorBrutoOficio').value);
    const valorPrevidenciaOficio = parseFloat(document.getElementById('valorPrevidenciaOficio').value);
    const valorAtualizadoTJRJ = parseFloat(document.getElementById('valorAtualizadoTJRJ').value);
    const percentHonorarios = parseFloat(document.getElementById('percentHonorarios').value);
    const impostoRenda = document.getElementById('impostoRenda').value;
    const ano = parseInt(document.getElementById('ano').value);

    // Passo 1: Calculando e arredondando a porcentagem da previdência
    let porcentagemPrevidencia = (valorPrevidenciaOficio / valorBrutoOficio) * 100;
    porcentagemPrevidencia = Math.round(porcentagemPrevidencia);
    document.getElementById('resultadoPrevidenciaPorcentagem').innerText = `${porcentagemPrevidencia}%`;

    // Passo 2: Tirando a % dos honorários do valor atualizado
    const valorMenosHonorarios = valorAtualizadoTJRJ * (1 - percentHonorarios / 100);
    document.getElementById('resultadoHonorarios').innerText = `R$ ${valorMenosHonorarios.toFixed(2)}`;

    // Passo 3: Tirando a porcentagem da previdência do valor atualizado
    const valorMenosPrevidencia = valorMenosHonorarios * (1 - porcentagemPrevidencia / 100);
    document.getElementById('resultadoPrevidencia').innerText = `R$ ${valorMenosPrevidencia.toFixed(2)}`;

    // Passo 4: Aplicando o imposto de renda se necessário
    let valorAposImpostoRenda = valorMenosPrevidencia;
    let valorDescontoIR = 0;
    if (impostoRenda === 'sim') {
        valorDescontoIR = valorMenosPrevidencia * 0.275;
        valorAposImpostoRenda = valorMenosPrevidencia - valorDescontoIR;
        document.getElementById('resultadoImpostoRenda').innerText = `R$ ${valorAposImpostoRenda.toFixed(2)}`;
    } else {
        document.getElementById('resultadoImpostoRenda').innerText = `R$ ${valorAposImpostoRenda.toFixed(2)}`;
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
        document.getElementById('resultadoAno').innerText = `R$ ${valorProposta.toFixed(2)}`;
        document.getElementById('resultadoFinal').innerText = `R$ ${valorProposta.toFixed(2)}`;
    } else {
        document.getElementById('resultadoAno').innerText = `Ano inválido`;
        document.getElementById('resultadoFinal').innerText = `Ano inválido`;
    }
}
