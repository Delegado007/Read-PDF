// Import the module
const readdirp = require("readdirp");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const { CreatePng } = require("./toPng");

let array = [];

async function loadPagesPdf(array) {
  for (let index = 1; index < array.length; index++) {
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
      console.log("EN LA RUTA ")
      console.error(error)
    }
  }
  return array;
}

readdirp("C:/Users/Delegado", {
  fileFilter: "*.pdf",
  directoryFilter: ['!.git', '!node_modules'],
  alwaysStat: true,
})
  .on("data", (entry) => {
    array.push({ ruta: entry.fullPath, pages: "", fileName: entry.basename, size: entry.stats.size });
  })
  // Optionally call stream.destroy() in `warn()` in order to abort and cause 'close' to be emitted
  // .on("warn", (error) => console.error("non-fatal error", error))
  .on("error", (error, fullPath) => {
    console.log("EN LA RUTA " + fullPath)
    console.error("fatal error", error)
  })
  .on("end", async () => {
    console.log(`Cantidad de PDF: ${array.length}`);
    const libros = await loadPagesPdf(array);
    // console.log(libros)
    CreatePng(libros);
  })


