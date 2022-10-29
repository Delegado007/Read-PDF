const { exec } = require("child_process");

async function convertPdfToImg(list) {
  for (let index = 0; index < list.length; index++) {
    let outputFilePath = `./src/test/pagesPDF${list[index].pages}${list[index].fileName}sizePDF${list[index].size}.png`
    await exec(`convert -density 150 -background white -alpha remove "${list[index].ruta}"[0] -quality 80 "${outputFilePath}"`, (err, info) => {
      if (err) throw err
      console.log(info)
    })
  }
  console.log(list.length)
}
module.exports = { convertPdfToImg }

// convert -density 300 -background white -alpha remove -quality 80 ./src/test/jesus.pdf[0] ./src/test/out.jpg