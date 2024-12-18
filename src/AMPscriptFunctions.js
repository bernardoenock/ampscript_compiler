export class AMPscriptFunctions {
  static CONCAT(...args) {
    return args.join('');
  }

  static UPPER(value) {
    return value.toUpperCase();
  }

  static ADD(a, b) {
    return a + b;
  }

  static SUBTRACT(a, b) {
    return a - b;
  }

  static MULTIPLY(a, b) {
    return a * b;
  }

  static DIVIDE(a, b) {
    if (b === 0) throw new Error("Divisão por zero.");
    return a / b;
  }
}
