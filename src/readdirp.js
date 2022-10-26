const readdirp = require("readdirp");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const { CreatePng } = require("./toPng");

let array = [];

async function loadPagesPdf(array) {
  for (let index = 0; index < array.length; index++) {
    const pdfPath = array[index].ruta;
    const loadingTask = await pdfjsLib.getDocument(pdfPath);
    try {
      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;
      array[index] = {
        ...array[index],
        pages: numPages
      }
    } catch (error) {
      console.log(`ERROR en la RUTA: ${array[index].ruta}`)
      console.error(error.message)
    }
  }

  return array;
}

const lecturaRecursiva = async () => {
  for await (const entry of readdirp("C:/Users", {
    fileFilter: "*.pdf",
    directoryFilter: ['!.git', '!node_modules'],
    alwaysStat: true,
  })) {
    array.push({ ruta: entry.fullPath, pages: "", fileName: entry.basename, size: entry.stats.size });
  }
  return array
}

module.exports = {
  lecturaRecursiva,
  loadPagesPdf,
}


