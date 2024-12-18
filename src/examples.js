export default async function insertExample(exampleNumber) {

  const exampleFiles = {
    1: 'examples/exampleCONCAT.txt',
    2: 'examples/exampleUPPER.txt',
    3: 'examples/exampleADD.txt',
    4: 'examples/exampleSUBTRACT.txt',
    5: 'examples/exampleMULTIPLY.txt',
    6: 'examples/exampleDIVIDE.txt',
  };

  const filePath = exampleFiles[exampleNumber];
  if (!filePath) {
    console.error(`Nenhum exemplo encontrado para o número: ${exampleNumber}`);
    return;
  }

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Erro ao carregar o arquivo: ${filePath}`);
    }

    const exampleCode = await response.text();

    document.getElementById('ampscriptInput').value = exampleCode;
  } catch (error) {
    console.error(`Erro ao carregar exemplo: ${error.message}`);
  }
}
