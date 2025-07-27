const { formatarMoeda } = require('./util.js');

function gerarFaturaStr(fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
    return faturaStr;
}


function gerarFaturaHTML(fatura, calc) {
    let faturaHTML = `<p>Fatura ${fatura.cliente}</p>\n`;
    faturaHTML += "<ul>\n";
    for (let apre of fatura.apresentacoes) {
        const peca = calc.repo.getPeca(apre);
        const valor = formatarMoeda(calc.calcularTotalApresentacao(apre));
        faturaHTML += `  <li>${peca.nome}: ${valor} (${apre.audiencia} assentos)</li>\n`;
    }
    faturaHTML += "</ul>\n";
    faturaHTML += `<p>Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}</p>\n`;
    faturaHTML += `<p>Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)}</p>\n`;
    return faturaHTML;
}

// Exporta as duas funções em um objeto
module.exports = { gerarFaturaStr, gerarFaturaHTML };