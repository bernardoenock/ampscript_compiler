import { AMPscriptParser } from './parser.js';
import { AMPscriptCompiler } from './compiler.js';

export default function compileAMPscript() {
  const inputScript = document.getElementById('ampscriptInput').value.toString();

  const match = inputScript.match(/%%\[\s*([\s\S]*?)\s*\]%%\s*([\s\S]*)/);

  if (!match) {
    alert('O texto de entrada não está no formato esperado.');
    return;
  }

  const ampscript = match[1];
  const template = match[2];

  const parser = new AMPscriptParser(ampscript);
  parser.parse();

  const compiler = new AMPscriptCompiler(template, parser.getVariables());
  const compiledHTML = compiler.compile();

  const outputContainer = document.getElementById('outputHTML');
  outputContainer.innerHTML = compiledHTML;
}