const readdirp = require("readdirp");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

let datos = [];
let datosSinFallos = [];
let datosConFallos = [];


async function loadPagesPdf(data) {
  for (let index = 0; index < data.length; index++) {
    const pdfPath = data[index].ruta;
    const loadingTask = await pdfjsLib.getDocument(pdfPath);
    try {
      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;
      datosSinFallos.push({ ...data[index], "pages": numPages })

    } catch (error) {

      datosConFallos.push(data[index])
      console.log(`ERROR en la RUTA: ${data[index].ruta}`)
      console.error(error.message)
    }
  }
  return {
    datosSinFallos,
    datosConFallos
  };
}

const lecturaRecursiva = async () => {

  for await (const entry of readdirp("C:/Users", {
    fileFilter: "*.pdf",
    directoryFilter: ['!.git', '!node_modules'],
    alwaysStat: true,
  })) {
    let sizeInteger = Number(entry.stats.size)
    let size = Math.trunc(sizeInteger / (1024))
    datos.push({ "ruta": entry.fullPath, "pages": "", "fileName": entry.basename, "size": size });
  }
  return datos
}

module.exports = {
  lecturaRecursiva,
  loadPagesPdf,
}


