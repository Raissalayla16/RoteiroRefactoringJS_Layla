const { readFileSync } = require('fs');

// Importando os módulos 
var Repositorio = require("./repositorio.js");
var ServicoCalculoFatura = require("./servico.js");
var gerarFaturaStr = require("./apresentacao.js");

// Programa Principal (main)
const faturas = JSON.parse(readFileSync('./faturas.json'));

const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);