class AMPscriptFunctions {
  // Função CONCAT: Concatena argumentos mantendo espaços e caracteres especiais
  static CONCAT(...args) {
    return args.join(''); // Junta sem adicionar separadores extras
  }

  static UPPER(value) {
    return value.toUpperCase();
  }

  // Mais funções podem ser adicionadas aqui
}

module.exports = AMPscriptFunctions;
