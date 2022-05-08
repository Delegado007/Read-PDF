const { NodeCanvasFactory } = require('./canvas');
const fs = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const CMAP_URL = './../node_modules/pdfjs-dist/cmaps/';
const CMAP_PACKED = true;
const STANDARD_FONT_DATA_URL = './../node_modules/pdfjs-dist/standard_fonts/';


async function CreatePng(libros) {
  for (let index = 1; index < libros.length; index++) {
    const pdfPath = libros[index].ruta;
    const data = new Uint8Array(fs.readFileSync(pdfPath))

    const cargarPdf = pdfjsLib.getDocument({
      data,
      cMapUrl: CMAP_URL,
      cMapPacked: CMAP_PACKED,
      standardFontDataUrl: STANDARD_FONT_DATA_URL,
    });
    const pdfDocument = await cargarPdf.promise;
    console.log(pdfDocument);
    const page = await pdfDocument.getPage(1);
    const viewport = await page.getViewport({ scale: 1.5 });

    const canvasFactory = new NodeCanvasFactory();
    const canvasAndContext = canvasFactory.create(
      viewport.width,
      viewport.height
    );
    const renderContext = {
      canvasContext: canvasAndContext.context,
      viewport,
      canvasFactory,
    };

    const renderTask = page.render(renderContext);
    await renderTask.promise;
    // Convert the canvas to an image buffer.
    const image = canvasAndContext.canvas.toBuffer();
    const name = libros[index].fileName.slice(0, -4);
    console.log(name);
    fs.writeFile(`src/test/${name}.png`, image, function (error) {
      if (error) {
        console.error("Error: " + error);
      } else {

        console.log(
          "Finished converting first page of PDF file to a PNG image."
        );
      }
    });
    // Release page resources.
    page.cleanup();
  }
  console.log(libros);
}

module.exports = { CreatePng };