const { readFileSync } = require('fs');

class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}

class ServicoCalculoFatura {

  constructor(repo) {
    this.repo = repo; // Guarda o almoxarifado para uso interno
  }

  // Métodos de cálculo agora vivem aqui
  calcularTotalFatura(apresentacoes) {
    let totalFatura = 0;
    for (let apre of apresentacoes) {
      totalFatura += this.calcularTotalApresentacao(apre);
    }
    return totalFatura;
  }

  calcularTotalCreditos(apresentacoes) {
    let creditos = 0;
    for (let apre of apresentacoes) {
      creditos += this.calcularCredito(apre);
    }
    return creditos;
  }


  calcularCredito(apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (this.repo.getPeca(apre).tipo === "comedia")
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;
  }

  calcularTotalApresentacao(apre) {
    let total = 0;
    switch (this.repo.getPeca(apre).tipo) {
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
        throw new Error(`Peça desconhecida: ${this.repo.getPeca(apre).tipo}`);
    }
    return total;
  }
}


function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    {
      style: "currency", currency: "BRL",
      minimumFractionDigits: 2
    }).format(valor / 100);
}




//  FUNÇÃO PRINCIPAL AGORA APENAS ORQUESTRA AS CHAMADAS
function gerarFaturaStr(fatura, calc) {

  let faturaStr = `Fatura ${fatura.cliente}\n`;


  for (let apre of fatura.apresentacoes) {
    // As chamadas agora usam o objeto 'calc'
      faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
  }

  // As chamadas agora usam o objeto 'calc'
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
  return faturaStr;
}

// FUNÇÃO PARA GERAR FATURA EM HTML COMENTADA
/*
function gerarFaturaHTML(fatura, pecas) {
  let faturaHTML = `<html><p> Fatura ${fatura.cliente} </p>`;
  faturaHTML += "<ul>";
  for (let apre of fatura.apresentacoes) {
    // Reutilizamos as mesmas funções de cálculo!
    faturaHTML += `<li>  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos) </li>`;
  }
  faturaHTML += "</ul>";
  faturaHTML += `<p> Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))} </p>`;
  faturaHTML += `<p> Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} </p></html>`;
  return faturaHTML;
}*/

// BLOCO PRINCIPAL ATUALIZADO
const faturas = JSON.parse(readFileSync('./faturas.json'));

// 1. Criamos a instância da classe
const calc = new ServicoCalculoFatura(new Repositorio());

// Geração da fatura em string
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);

//DEIXANDO COMENTADO
/* Geração da fatura em HTML
const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log(faturaHTML); */