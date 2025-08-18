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
    const tipoPrecatório = document.getElementById('tipoPrecatório').value;

    let valorLiquidoAtualizado = valorTJRJ;
    const porcentagemPrevidencia = valorPrevidenciaOficio / valorBrutoOficio;
    
    const valorDescontadoHonorarios = valorTJRJ * percentualHonorarios;
    const valorDescontadoPrevidencia = valorTJRJ * porcentagemPrevidencia;
    let descontoIR = 0;
    
    if (aplicarIR) {
        descontoIR = valorTJRJ * 0.275;
    }

    valorLiquidoAtualizado -= (valorDescontadoHonorarios + valorDescontadoPrevidencia + descontoIR);

    if (descontoPrioridade) {
        valorLiquidoAtualizado -= 151000;
    }

    let valorProposta;

    if (tipoPrecatório === 'municipio') {
        // Se for Município, use 2025 e calcule com 60%
        valorProposta = valorLiquidoAtualizado * 0.60;
    } else {
        // Para o Estado, continue usando os cálculos atuais
        const descontos = {
            2022: 0.42,
            2023: 0.53,
            2024: 0.70,
            2025: 0.70,
            2026: 0.67,
            2027: 0.72
        };
        const descontoOrcamento = descontos[orcamento] || 0;
        valorProposta = valorLiquidoAtualizado * (1 - descontoOrcamento);
    }

    valorProposta = Math.floor(valorProposta / 1000) * 1000;

    const formatarReal = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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

