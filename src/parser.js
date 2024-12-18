import { AMPscriptFunctions } from './AMPscriptFunctions.js';

export class AMPscriptParser {
  constructor(script) {
    this.script = script;
    this.variables = {};
  }

  parse() {
    console.log("Iniciando o parsing...");
    const lines = this.script.split('\n');
    let conditionBlockActive = false;
    let conditionMet = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      console.log(`\nLinha ${index + 1}: "${trimmedLine}"`);

      if (trimmedLine.startsWith('%%[') || trimmedLine.startsWith(']%%')) {
        console.log("Ignorando bloco %%[ ou ]%%");
        return;
      }

      if (/^SET\s+@\w+\s+=/.test(trimmedLine)) {
        const match = trimmedLine.match(/^SET\s+@(\w+)\s+=\s+(.+)$/);
        if (match) {
          const [_, varName, value] = match;
          const evaluatedValue = this.evaluate(value.trim());
          this.variables[varName] = evaluatedValue;
          console.log(`Variável SET: @${varName} = ${evaluatedValue}`);
        }
      }

      if (/^IF\s+.+/i.test(trimmedLine)) {
        console.log(`Linha IF detectada: "${trimmedLine}"`);
        if (!conditionMet) {
          conditionBlockActive = true;
          const condition = trimmedLine.slice(3).replace(/\s+THEN\s*$/i, '').trim();
          console.log(`Condição limpa: "${condition}"`);
          conditionMet = this.evaluateCondition(condition);
          console.log(`Condição avaliada como: ${conditionMet}`);
        } else {
          console.log("Bloco IF ignorado porque uma condição anterior foi atendida.");
        }
      } else if (/^ELSEIF\s+.+/i.test(trimmedLine)) {
        console.log(`Linha ELSEIF detectada: "${trimmedLine}"`);
        if (conditionBlockActive && !conditionMet) {
          const condition = trimmedLine.slice(7).replace(/\s+THEN\s*$/i, '').trim();
          console.log(`Condição limpa: "${condition}"`);
          conditionMet = this.evaluateCondition(condition);
          console.log(`ELSEIF avaliada como: ${conditionMet}`);
        } else {
          console.log("ELSEIF ignorado porque a condição do IF foi atendida.");
        }
      } else if (/^ELSE$/i.test(trimmedLine)) {
        if (conditionBlockActive && !conditionMet) {
          conditionMet = true;
          console.log("ELSE ativado.");
        } else {
          console.log("ELSE ignorado porque uma condição anterior foi atendida.");
        }
      } else if (/^ENDIF$/i.test(trimmedLine)) {
        conditionBlockActive = false;
        console.log("Fim do bloco IF.");
      } else {
        if (!conditionBlockActive || conditionMet) {
          const result = this.evaluate(trimmedLine);
          console.log(`Executando linha: ${trimmedLine}, Resultado: ${result}`);
        } else {
          console.log("Linha ignorada devido à condição não atendida.");
        }
      }
    });

    console.log("\nParsing concluído. Variáveis finais:");
    console.log(this.variables);
  }

  evaluateCondition(condition) {
    console.log(`Avaliando condição: "${condition}"`);
    const operators = ['==', '>=', '<=', '>', '<'];
    let operator = operators.find(op => condition.includes(op));

    if (!operator) {
      throw new Error(`Operador inválido na condição: ${condition}`);
    }

    const [left, right] = condition.split(operator).map(part => this.evaluate(part.trim()));
    const leftValue = this.toNumberOrString(left);
    const rightValue = this.toNumberOrString(right);

    console.log(`Comparando: ${leftValue} ${operator} ${rightValue}`);
    switch (operator) {
      case '==': return leftValue === rightValue;
      case '>=': return leftValue >= rightValue;
      case '<=': return leftValue <= rightValue;
      case '>': return leftValue > rightValue;
      case '<': return leftValue < rightValue;
      default: return false;
    }
  }

  evaluate(expression) {
    console.log(`Avaliando expressão: "${expression}"`);
    const functionMatch = expression.match(/(\w+)\((.+)\)/);
    if (functionMatch) {
      const [_, functionName, args] = functionMatch;
      const method = AMPscriptFunctions[functionName];
      if (method) {
        const evaluatedArgs = args.split(',')
          .map(arg => this.evaluate(arg.trim()));
        const result = method(...evaluatedArgs);
        console.log(`Função: ${functionName}, Argumentos: ${evaluatedArgs}, Resultado: ${result}`);
        return result;
      }
    }

    if (expression.startsWith('@')) {
      const varName = expression.slice(1).trim();
      const result = this.variables[varName] || '';
      console.log(`Variável @${varName} = ${result}`);
      return result;
    }

    if (expression.startsWith('"') && expression.endsWith('"')) {
      const result = expression.slice(1, -1).replace(/@(\w+)/g, (_, varName) => {
        return this.variables[varName] || '';
      });
      console.log(`String processada: ${result}`);
      return result;
    }

    const result = this.toNumberOrString(expression);
    console.log(`Expressão numérica/literal: ${result}`);
    return result;
  }

  toNumberOrString(value) {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? value : parsedValue;
  }

  getVariables() {
    return this.variables;
  }
}

