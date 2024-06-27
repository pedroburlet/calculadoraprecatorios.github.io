document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const valorTJRJ = parseFloat(document.getElementById('valorTJRJ').value);
    const percentualHonorarios = parseFloat(document.getElementById('percentualHonorarios').value) / 100;
    const valorBrutoOficio = parseFloat(document.getElementById('valorBrutoOficio').value);
    const valorPrevidenciaOficio = parseFloat(document.getElementById('valorPrevidenciaOficio').value);
    const aplicarIR = document.getElementById('aplicarIR').value === 'sim';
    const descontoPrioridade = document.getElementById('descontoPrioridade').value === 'sim';
    const orcamento = parseInt(document.getElementById('orcamento').value);

    // Mapear os descontos baseados no ano do orçamento
    const descontos = {
        2021: 0.32,
        2022: 0.35,
        2023: 0.45,
        2024: 0.55,
        2025: 0.66
    };

    const descontoOrcamento = descontos[orcamento] || 0;

    // Calcular a porcentagem da previdência
    const porcentagemPrevidencia = valorPrevidenciaOficio / valorBrutoOficio;

    // Calcular os valores conforme os dados fornecidos
    const valorDescontadoHonorarios = valorTJRJ * percentualHonorarios;
    const valorDescontadoPrevidencia = valorTJRJ * porcentagemPrevidencia;

    let descontoIR = 0;
    if (aplicarIR) {
        descontoIR = valorTJRJ * 0.275; // Supondo 27.5% de IR
    }

    const valorLiquidoAtualizado = valorTJRJ - valorDescontadoHonorarios - valorDescontadoPrevidencia - descontoIR;
    const valorProposta = valorLiquidoAtualizado * (1 - descontoOrcamento);

    const resultado = `
        <p>1. Valor Menos Honorários: R$ ${valorDescontadoHonorarios.toFixed(2).replace('.', ',')}</p>
        <p>2. Porcentagem da Previdência: ${(porcentagemPrevidencia * 100).toFixed(2)}%</p>
        <p>3. Valor descontado Previdência: R$ ${valorDescontadoPrevidencia.toFixed(2).replace('.', ',')}</p>
        <p>4. Desconto Imposto de Renda: R$ ${descontoIR.toFixed(2).replace('.', ',')}</p>
        <p>5. Valor líquido atualizado: R$ ${valorLiquidoAtualizado.toFixed(2).replace('.', ',')}</p>
        <p>6. Valor proposta: R$ ${valorProposta.toFixed(2).replace('.', ',')}</p>
    `;

    document.getElementById('result').innerHTML = resultado;
});
