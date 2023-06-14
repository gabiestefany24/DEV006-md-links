const fs = require('fs');
const path = require('path');
const axios = require('axios');

const filePath = './lib/prueba.md';

//validar absoluta true o false 
const validarAbsoluta = path.isAbsolute(filePath);
if(validarAbsoluta == true){
  console.log('Es una ruta absoluta');
} else{
  console.log('Es una ruta relativa');
}

//resolver relativa a absoluta
const pathAbsoluta = path.resolve(filePath);
console.log('Ruta absoluta: ', pathAbsoluta);

//validar ruta existe
if (fs.existsSync(pathAbsoluta)) {
  console.log('La ruta existe.');
} else {
  console.log('La ruta no existe.');
} 

//leer los archivos de un directorio
const directorio = './lib'

function readDirectory(directorio) {
  const directory = fs.readdirSync(directorio);
    // console.log("Archivos en directorio: ");
    directory.forEach(file => {
    // console.log(file); 
    const rutaCompleta = path.join(directorio, file)
    const ruta = fs.statSync(rutaCompleta);
    if(ruta.isDirectory()){
      readDirectory(rutaCompleta);//Recursividad de directorio
    }else if (ruta.isFile()){
      const extension = path.extname(file);
      if(extension == '.md'){
      console.log('Archivo encontrado .md', rutaCompleta)
      }
    }
});
}
readDirectory(directorio);

//leer un archivo 
fs.readFile(filePath, 'utf8', (error, data) => {
    if (error) {
      console.error('Ocurrió un error al leer el archivo:', error);
    }
    console.log('Contenido archivo .md: ')
    console.log(data); 
    
    //condicionar solo links

   // Extraer links de archivo
    let links = [];
    const regEx = /\[([^\[\]]*?)\]\((https?:\/\/[^\s$.?#].[^\s]*)\)/gi;
    const matches = data.match(regEx);
    if(matches){
      links.push(...matches)
    } else {
      links.push('No links found')
    };

    console.log('Listado: ', links)


    // Validar los enlaces utilizando Axios
    const linkPromises = links.map((link) => {
      const url = link.match(/\(([^()]*)\)/)[1];
      return axios
        .get(url)
        .then((response) => ({
          href: url,
          text: link.match(/\[([^[\]]*)\]/)[1],
          file: filePath,
          status: response.status,
          ok: response.status >= 200 && response.status < 300 ? 'ok' : 'fail',
        }))
        .catch((error) => ({
          href: url,
          text: link.match(/\[([^[\]]*)\]/)[1],
          file: filePath,
          status: error.response ? error.response.status : 'Error',
          ok: 'fail',
        }));
    });
  
    Promise.all(linkPromises)
      .then((results) => {
        console.log('Resultados de validación: ');

      const validLinks = results.filter((result) => result.ok === 'ok');
      const invalidLinks = results.filter((result) => result.ok === 'fail');

      console.log('Enlaces válidos:');
      console.log(validLinks);
      
      console.log('Enlaces inválidos:');
      console.log(invalidLinks);
        
      })
      .catch((error) => {
        console.error('Ocurrió un error al validar los enlaces:', error);
      });
});
   

//exportar funciones
module.exports = {

}

