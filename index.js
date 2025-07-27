const { readFileSync } = require('fs');

class ServicoCalculoFatura {
	calcularCredito(pecas, apre) {
		let creditos = 0;
		creditos += Math.max(apre.audiencia - 30, 0);
		if (pecas[apre.id].tipo === "comedia") {
			creditos += Math.floor(apre.audiencia / 5);
		}
		return creditos;
	}

	calcularTotalCreditos(pecas, apresentacoes) {
		let totalCreditos = 0;
		for (let apre of apresentacoes) {
			totalCreditos += this.calcularCredito(pecas, apre);
		}
		return totalCreditos;
	}

	calcularTotalApresentacao(pecas, apre) {
		const peca = pecas[apre.id];
		let total = 0;

		switch (peca.tipo) {
			case "tragedia":
				total = 40000;
				if (apre.audiencia > 30) {
					total += 1000 * (apre.audiencia - 30);
				}
				break;
			case "comedia":
				total = 30000;
				if (apre.audiencia > 20) {
					total += 10000 + 500 * (apre.audiencia - 20);
				}
				total += 300 * apre.audiencia;
				break;
			default:
				throw new Error(`Peça desconhecida: ${peca.tipo}`);
		}
		return total;
	}

	calcularTotalFatura(pecas, apresentacoes) {
		let total = 0;
		for (let apre of apresentacoes) {
			total += this.calcularTotalApresentacao(pecas, apre);
		}
		return total;
	}
}



function formatarMoeda(valor) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency", currency: "BRL", minimumFractionDigits: 2
	}).format(valor / 100);
}

function getPeca(pecas, apresentacao) {
	return pecas[apresentacao.id];
}

function gerarFaturaStr(fatura, pecas, calc) {
	let faturaStr = `Fatura ${fatura.cliente}\n`;
	for (let apre of fatura.apresentacoes) {
		faturaStr += `  ${pecas[apre.id].nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
	}
	faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
	faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
	return faturaStr;
}

function gerarFaturaHTML(fatura, pecas, calc) {
	let faturaHTML = `<p>Fatura ${fatura.cliente}</p>\n`;
	faturaHTML += "<ul>\n";
	for (let apre of fatura.apresentacoes) {
		const peca = pecas[apre.id];
		const valor = formatarMoeda(calc.calcularTotalApresentacao(pecas, apre));
		faturaHTML += `  <li>${peca.nome}: ${valor} (${apre.audiencia} assentos)</li>\n`;
	}
	faturaHTML += "</ul>\n";
	faturaHTML += `<p>Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))}</p>\n`;
	faturaHTML += `<p>Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)}</p>\n`;
	return faturaHTML;
}


const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
const faturaHTML = gerarFaturaHTML(faturas, pecas, calc);

console.log(faturaStr);
console.log(faturaHTML);