

const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

// Some PDFs need external cmaps.
// const CMAP_URL = "../../../node_modules/pdfjs-dist/cmaps/";
const CMAP_URL = './../node_modules/pdfjs-dist/cmaps/'
const CMAP_PACKED = true;

// Where the standard fonts are located.
// const STANDARD_FONT_DATA_URL =
//   "../../../node_modules/pdfjs-dist/standard_fonts/";
const STANDARD_FONT_DATA_URL = './../node_modules/pdfjs-dist/standard_fonts/'
// Loading file from file system into typed array.
const pdfPath = path.resolve(__dirname, 'test/prueba2.pdf');
const data = new Uint8Array(fs.readFileSync(pdfPath));

// Load the PDF file.
const loadingTask = pdfjsLib.getDocument({
  data,
  cMapUrl: CMAP_URL,
  cMapPacked: CMAP_PACKED,
  standardFontDataUrl: STANDARD_FONT_DATA_URL,
});

(async function () {
  try {
    const pdfDocument = await loadingTask.promise;
    console.log("# PDF document loaded.");
    // Get the first page.
    const title = await pdfDocument.loadingParams;
    console.log(title);
    const page = await pdfDocument.getPage(1);
    // Render the page on a Node canvas with 100% scale.
    const viewport = page.getViewport({ scale: 1.5 });
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
    fs.writeFile("output.png", image, function (error) {
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
  } catch (reason) {
    console.log(reason);
  }
})();