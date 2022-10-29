# Lectura Recursiva de PDF y conertidor a PNG

El proposito de este repositorio es lograr recorrer carpetas del sistema y ir identificando cuales archivos son del tipo PDF.

Una vez identificados los mismo seran agregados a un array para su analisis en cuanto accesibilidad y propiedades como tamaño y cantidad de carillas.

## Lectura recursiva

```javascript
const readdirp = require("readdirp");
let array = [];
const lecturaRecursiva = async () => {
  //Para leer todas las carpetas del disco C:/Users
  for await (const entry of readdirp("C:/Users", {
    fileFilter: "*.pdf", //Toma los datos de archivos con la extecion pdf
    directoryFilter: ["!.git", "!node_modules"], // Carpetas a ignorar
    alwaysStat: true,
  })) {
    //push al array del archivo localizado
    let sizeInteger = Number(entry.stats.size);
    let size = Math.trunc(sizeInteger / 1024);
    datos.push({
      ruta: entry.fullPath,
      pages: "",
      fileName: entry.basename,
      size: size,
    });
  }
  return array;
};
```

## Contabilizar páginas de los PDFs

Con el array de salida podemos recorrerlo y sacar el número de páginas que tiene cada archivo.
Usando pdfjs-dist

```bash
  npm i pdfjs-dist
```

Debe recibir un array con las rutas de los PDF a analizar

```javascript
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
let datosSinFallos = [];
let datosConFallos = [];

async function loadPagesPdf(data) {
  for (let index = 0; index < data.length; index++) {
    const pdfPath = data[index].ruta;
    const loadingTask = await pdfjsLib.getDocument(pdfPath);
    try {
      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;
      datosSinFallos.push({ ...data[index], pages: numPages });
    } catch (error) {
      datosConFallos.push(data[index]);
      console.log(`ERROR en la RUTA: ${data[index].ruta}`);
      console.error(error.message);
    }
  }
  return {
    datosSinFallos,
    datosConFallos,
  };
}
```

## Convirtiendo la primera pagina del pdf a png

Para ello vamos a necesitar tener instalado en nuestra PC el software [GraphicsMagick](http://www.graphicsmagick.org/download.html#download-sites).
Y también demos tener instalado el siguiente paquete:

```bash
  npm i child_process
```

Este paquete nos permite hacer uso de comandos con nuestra consola.

```javascript
const { exec } = require("child_process");

async function convertPdfToImg(list) {
  for (let index = 0; index < list.length; index++) {
    let outputFilePath = `./src/test/pagesPDF${list[index].pages}${list[index].fileName}sizePDF${list[index].size}.png`;
    await exec(
      `convert -density 150 -background white -alpha remove "${list[index].ruta}"[0] -quality 80 "${outputFilePath}"`,
      (err, info) => {
        if (err) throw err;
        console.log(info);
      }
    );
  }
  console.log(list.length);
}
module.exports = { convertPdfToImg };
```

Scripts disponibles:

```bash
  npm run dev
```

Ejecuta nodemon a nuestro index.js

```bash
  npm run start
```

Ejecuta node a nuestro index.js
