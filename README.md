
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
    directoryFilter: ['!.git', '!node_modules'], // Carpetas a ignorar
    alwaysStat: true,
  })) {
    //push al array del archivo localizado
    array.push({ ruta: entry.fullPath, pages: "", fileName: entry.basename, size: entry.stats.size });
  }
  return array;
}
```
