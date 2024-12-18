import { AMPscriptFunctions } from './AMPscriptFunctions.js';

export class AMPscriptParser {
  constructor(script) {
    this.script = script;
    this.variables = {};
  }

  parse() {
    const lines = this.script.split('\n');
    let conditionBlockActive = false;
    let conditionMet = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('%%[') || trimmedLine.startsWith(']%%')) {
        return;
      }

      if (/^SET\s+@\w+\s+=/.test(trimmedLine)) {
        const match = trimmedLine.match(/^SET\s+@(\w+)\s+=\s+(.+)$/);
        if (match) {
          const [_, varName, value] = match;
          const evaluatedValue = this.evaluate(value.trim());
          this.variables[varName] = evaluatedValue;
        }
      }

      if (/^IF\s+.+/i.test(trimmedLine)) {
        if (!conditionMet) {
          conditionBlockActive = true;
          const condition = trimmedLine.slice(3).replace(/\s+THEN\s*$/i, '').trim();
          conditionMet = this.evaluateCondition(condition);
        } else {
        }
      } else if (/^ELSEIF\s+.+/i.test(trimmedLine)) {
        if (conditionBlockActive && !conditionMet) {
          const condition = trimmedLine.slice(7).replace(/\s+THEN\s*$/i, '').trim();
          conditionMet = this.evaluateCondition(condition);
        }
      } else if (/^ELSE$/i.test(trimmedLine)) {
        if (conditionBlockActive && !conditionMet) {
          conditionMet = true;
        } else {
        }
      } else if (/^ENDIF$/i.test(trimmedLine)) {
        conditionBlockActive = false;
      } else {
        if (!conditionBlockActive || conditionMet) {
          const result = this.evaluate(trimmedLine);
        }
      }
    });
  }

  evaluateCondition(condition) {
    const operators = ['==', '>=', '<=', '>', '<'];
    let operator = operators.find(op => condition.includes(op));

    if (!operator) {
      throw new Error(`Operador inválido na condição: ${condition}`);
    }

    const [left, right] = condition.split(operator).map(part => this.evaluate(part.trim()));
    const leftValue = this.toNumberOrString(left);
    const rightValue = this.toNumberOrString(right);

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
    const functionMatch = expression.match(/(\w+)\((.+)\)/);
    if (functionMatch) {
      const [_, functionName, args] = functionMatch;
      const method = AMPscriptFunctions[functionName];
      if (method) {
        const evaluatedArgs = args.split(',')
          .map(arg => this.evaluate(arg.trim()));
        const result = method(...evaluatedArgs);
        return result;
      }
    }

    if (expression.startsWith('@')) {
      const varName = expression.slice(1).trim();
      const result = this.variables[varName] || '';
      return result;
    }

    if (expression.startsWith('"') && expression.endsWith('"')) {
      const result = expression.slice(1, -1).replace(/@(\w+)/g, (_, varName) => {
        return this.variables[varName] || '';
      });
      return result;
    }

    const result = this.toNumberOrString(expression);
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
