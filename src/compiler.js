class AMPscriptCompiler {
  constructor(template, variables) {
    this.template = template;
    this.variables = variables;
  }

  compile() {
    if (!this.template || typeof this.template !== 'string') {
      throw new Error('Template inválido ou não fornecido.');
    }

    let compiledHTML = this.template;

    Object.keys(this.variables).forEach((key) => {
      const regex = new RegExp(`%%=v\\(@${key}\\)=%%`, 'g');
      compiledHTML = compiledHTML.replace(regex, this.variables[key]);
    });

    return compiledHTML;
  }
}

module.exports = AMPscriptCompiler;