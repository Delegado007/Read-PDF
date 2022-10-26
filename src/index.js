const lecturaRecursiva = require('./readdirp');


const minadoDatos = async () => {
  const datos = await lecturaRecursiva.lecturaRecursiva()
  const datosConNumeroPaginas = await lecturaRecursiva.loadPagesPdf(datos)
  console.log(datosConNumeroPaginas.length)
}
minadoDatos()
