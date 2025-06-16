const { readFileSync } = require('fs');


// ----> NOVA CLASSE DE SERVIÇO <----
class ServicoCalculoFatura {
  // Métodos de cálculo agora vivem aqui
  calcularTotalFatura(pecas, apresentacoes) {
    let totalFatura = 0;
    for (let apre of apresentacoes) {
      totalFatura += this.calcularTotalApresentacao(pecas, apre);
    }
    return totalFatura;
  }

  calcularTotalCreditos(pecas, apresentacoes) {
    let creditos = 0;
    for (let apre of apresentacoes) {
      creditos += this.calcularCredito(pecas, apre);
    }
    return creditos;
  }


  calcularCredito(pecas, apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(pecas, apre).tipo === "comedia")
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;
  }

  calcularTotalApresentacao(pecas, apre) {
    let total = 0;
    switch (getPeca(pecas, apre).tipo) {
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
        throw new Error(`Peça desconhecida: ${getPeca(pecas, apre).tipo}`);
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


function getPeca(pecas, apre) {
  return pecas[apre.id];
}



//  FUNÇÃO PRINCIPAL AGORA APENAS ORQUESTRA AS CHAMADAS
function gerarFaturaStr(fatura, pecas, calc) {

  let faturaStr = `Fatura ${fatura.cliente}\n`;


  for (let apre of fatura.apresentacoes) {
    // As chamadas agora usam o objeto 'calc'
    faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
  }

  // As chamadas agora usam o objeto 'calc'
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
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
const pecas = JSON.parse(readFileSync('./pecas.json'));

// 1. Criamos a instância da classe
const calc = new ServicoCalculoFatura();

// Geração da fatura em string
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
console.log(faturaStr);

//DEIXANDO COMENTADO
/* Geração da fatura em HTML
const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log(faturaHTML); */