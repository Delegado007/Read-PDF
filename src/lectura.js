// Import the module
const readdirp = require("readdirp");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
console.time("timepo");
let array = [];

readdirp("C:/Users/Delegado", {
  fileFilter: "*.pdf",
  alwaysStat: true,
})
  .on("data", (entry) => {
    array.push({ ruta: entry.fullPath, paginas: "" });
  })
  // Optionally call stream.destroy() in `warn()` in order to abort and cause 'close' to be emitted
  // .on("warn", (error) => console.error("non-fatal error", error))
  .on("error", (error) => console.error("fatal error", error))
  .on("end", () => {
    console.log(`Cantidad de PDF: ${array.length}`);
    for (let index = 0; index < array.length; index++) {
      const pdfPath = array[index].ruta;
      const loadingTask = pdfjsLib.getDocument(pdfPath);
      loadingTask.promise
        .then(function (doc) {
          const numPages = doc.numPages;
          array[index] = { ruta: pdfPath, paginas: numPages };

          return true;
        })
        .then(
          function () {
            console.log(array);
          },
          function (err) {
            console.error("Error: " + err);
          }
        );
    }

    console.timeEnd("timepo");
  });