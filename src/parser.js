const AMPscriptFunctions = require('./AMPscriptFunctions.js');

class AMPscriptParser {
  constructor(script) {
    this.script = script;
    this.variables = {};
  }

  parse() {
    const lines = this.script.split('\n');

    lines.forEach((line) => {
      if (line.startsWith('%%[')) return; // Começo do bloco AMPscript
      if (line.startsWith(']%%')) return; // Fim do bloco AMPscript

      if (line.includes('SET')) {
        const match = line.match(/SET @(\w+) = (.+)/);
        if (match) {
          const [_, varName, value] = match;
          this.variables[varName] = this.evaluate(value.trim());
        }
      }
    });
  }

  evaluate(expression) {
    // Identifica funções como CONCAT, UPPER, etc.
    const functionMatch = expression.match(/(\w+)\((.+)\)/);
    if (functionMatch) {
      const [_, functionName, args] = functionMatch;
      const method = AMPscriptFunctions[functionName];
      if (method) {
        const evaluatedArgs = args.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/) // Divide, preservando vírgulas em strings
          .map((arg) => this.evaluate(arg.trim()));
        return method(...evaluatedArgs); // Chama a função correspondente
      }
    }

    // Substitui variáveis no formato @name
    if (expression.startsWith('@')) {
      const varName = expression.slice(1);
      return this.variables[varName] || '';
    }

    // Trata strings com aspas e substitui variáveis dentro delas
    if (expression.startsWith('"') && expression.endsWith('"')) {
      return expression.slice(1, -1).replace(/@(\w+)/g, (_, varName) => {
        return this.variables[varName] || '';
      });
    }

    return expression; // Retorna literal
  }

  getVariables() {
    return this.variables;
  }
}

module.exports = AMPscriptParser;
