function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatInput(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2);
    input.value = formatCurrency(parseFloat(value));
}

const currencyFields = ['valorTJRJ', 'valorBrutoOficio', 'valorPrevidenciaOficio'];

currencyFields.forEach(id => {
    document.getElementById(id).addEventListener('input', formatInput);
});

document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const valorTJRJ = parseFloat(document.getElementById('valorTJRJ').value.replace(/\D/g, '')) / 100;
    const percentualHonorarios = parseFloat(document.getElementById('percentualHonorarios').value.replace(',', '.')) / 100;
    const valorBrutoOficio = parseFloat(document.getElementById('valorBrutoOficio').value.replace(/\D/g, '')) / 100;
    const valorPrevidenciaOficio = parseFloat(document.getElementById('valorPrevidenciaOficio').value.replace(/\D/g, '')) / 100;
    const aplicarIR = document.getElementById('aplicarIR').value === 'sim';
    const descontoPrioridade = document.getElementById('descontoPrioridade').value === 'sim';
    const orcamento = parseInt(document.getElementById('orcamento').value);

    const descontos = {
        2021: 0.32,
        2022: 0.35,
        2023: 0.45,
        2024: 0.55,
        2025: 0.66
    };

    const descontoOrcamento = descontos[orcamento] || 0;

    const porcentagemPrevidencia = valorPrevidenciaOficio / valorBrutoOficio;

    const valorDescontadoHonorarios = valorTJRJ * percentualHonorarios;
    const valorDescontadoPrevidencia = valorTJRJ * porcentagemPrevidencia;

    let descontoIR = 0;
    if (aplicarIR) {
        descontoIR = valorTJRJ * 0.275; // Supondo 27.5% de IR
    }

    let valorLiquidoAtualizado = valorTJRJ - valorDescontadoHonorarios - valorDescontadoPrevidencia - descontoIR;

    // Descontar R$ 141.000,00 se Desconto Prioridade for "Sim"
    if (descontoPrioridade) {
        valorLiquidoAtualizado -= 141000;
    }

    let valorProposta = valorLiquidoAtualizado * (1 - descontoOrcamento);

    // Arredondar para o milhar anterior
    valorProposta = Math.floor(valorProposta / 1000) * 1000;

    const formatarReal = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const resultado = `
        <p>1. Valor descontado de Honorários: ${formatarReal(valorDescontadoHonorarios)}</p>
        <p>2. Porcentagem da Previdência: ${(porcentagemPrevidencia * 100).toFixed(2)}%</p>
        <p>3. Valor descontado Previdência: ${formatarReal(valorDescontadoPrevidencia)}</p>
        <p>4. Desconto Imposto de Renda: ${formatarReal(descontoIR)}</p>
        <p>5. Valor líquido atualizado: ${formatarReal(valorLiquidoAtualizado)}</p>
        <p>6. Valor proposta: ${formatarReal(valorProposta)}</p>
    `;

    document.getElementById('result').innerHTML = resultado;
});
