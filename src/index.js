const fs = require('fs')
const lecturaRecursiva = require('./readdirp');
const { convertPdfToImg } = require('./pruebaMagick');

const minadoDatos = async () => {
  const datos = await lecturaRecursiva.lecturaRecursiva()
  const { datosSinFallos, datosConFallos } = await lecturaRecursiva.loadPagesPdf(datos)
  const dataCorrecta = JSON.stringify(datosSinFallos)
  await fs.writeFile('datosSinFallos.json', dataCorrecta, () => {
    console.log("json creado");
  })
  const dataFallada = JSON.stringify(datosConFallos)
  await fs.writeFile('datosConFallos.json', dataFallada, () => {
    console.log("json creado");
  })
  convertPdfToImg(datosSinFallos)
}
minadoDatos()
