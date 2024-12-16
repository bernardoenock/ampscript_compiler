const path = require('path');
const fs = require('fs');
const AMPscriptParser = require(path.resolve(__dirname, 'parser.js'));
const AMPscriptCompiler = require(path.resolve(__dirname, 'compiler.js'));

const inputScript = fs.readFileSync('./examples/input.ampscript.txt', 'utf-8');

// Separar o script AMPscript do HTML
const match = inputScript.match(/%%\[\s*([\s\S]*?)\s*\]%%\s*([\s\S]*)/);
console.log('Conteúdo do arquivo:', inputScript);
console.log('MATCH:', match);
if (!match) {
  throw new Error('O arquivo de entrada não está no formato esperado.');
}

const ampscript = match[1];
const template = match[2];
console.log('AMPscript:', ampscript);
console.log('Template:', template); // Adicionado para depuração

// Processa a lógica AMPscript
const parser = new AMPscriptParser(ampscript);
parser.parse();

// Compila o HTML
const compiler = new AMPscriptCompiler(template, parser.getVariables());
const compiledHTML = compiler.compile();

// Salva a saída
fs.writeFileSync('./examples/output.html', compiledHTML);
console.log('HTML gerado com sucesso!');
