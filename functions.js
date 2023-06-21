const fs = require('fs');
const path = require('path');
const axios = require('axios');

const filePath = './lib/prueba.md';

// //validar absoluta true o false 
// const validarAbsoluta = (filePath) => {
//   const isAbsolute = path.isAbsolute(filePath);
//   if (!isAbsolute){
//     //  console.log('Es una ruta relativa');
//   }
//   return filePath;
// }
// // validarAbsoluta(filePath);

//validar ruta existe
const pathExist = (resolveAbsolute) => {
  return fs.existsSync(resolveAbsolute);
}

//resolver relativa a absoluta
const pathAbsoluta = (filePath) => {
  if (!path.isAbsolute(filePath)){
    filePath = path.resolve(filePath);
  } return filePath
}
// pathAbsoluta(filePath);


//leer los archivos de un directorio
const directorio = './lib'

const readDirectory = (directorio) => {// cambiar nombre
  const archivos = [];
  if( fs.statSync(directorio).isDirectory()){
    const directory = fs.readdirSync(directorio);
    directory.forEach(file => {
      // console.log(file); 
      const rutaCompleta = path.join(directorio, file)
      if(fs.statSync(rutaCompleta).isDirectory()){
        const subdirectory = readDirectory(rutaCompleta);//Recursividad de directorio
        archivos.push(...subdirectory)
         } else if (path.extname(rutaCompleta) === '.md'){
          archivos.push(rutaCompleta)
        }
    })
  } else {
    const  extension = path.extname(directorio);
    if(extension === '.md'){
      archivos.push(directorio)
    }
  }    
return archivos
}
// readDirectory(directorio);

//leer un archivo 
const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    // archivos.forEach(archivo =>{
    fs.readFile(filePath, 'utf8', (error, data) => {

      if (error) {
        reject(error)       
        
      } else {
          // crear objeto(path, file) 
        resolve({
          path: filePath,
          file:data.toString()
        });
                
      }
    })   
    
  })
}
//expresiones regulares texto y url
// Extraer links de archivo

const getLinks = (data, file) => {
  const regEx = /\[([^\[\]]*?)\]\((https?:\/\/[^\s$.?#].[^\s]*)\)/gi;
  const matches = data.matchAll(regEx);
  let links = [];

  for (const match of matches) {
    const [, text, url] = match; 
    links.push({ file, text, url });
  }
  if (links.length === 0) {
    links.push('No links found')
  }
  // console.log('Listado: ', links)
  return links
}

const linksToString = (links) => {
  if (links.length === 0) {
    return 'No links found';
  }

  const linkStrings = links.map((link) => `href: ${link.url}\ntext: ${link.text}\n\n`);
  return linkStrings.join('');
};

//validate: false
function getLinkInfo(links, filePath) {
  const linkInfo = links.map((link) => ({
    href: link.url,
    text: link.text,
    file: filePath,
  }));

  return linkInfo;
}

// const requestHttp = (links) => {
//   const linkPromises = links.map((link) => {
//     const url = link.url;
//     return axios
//       .get(url, {
//         headers: { "Accept-Encoding": "gzip,deflate,compress" },
//       })
//       .then((response) => ({
//         href: url,
//         text: link.text,
//         file: filePath,
//         status: response.status,
//         message: response.status >= 200 && response.status < 300 ? 'ok' : 'fail',
//       }))
//       .catch((error) => {
//         if(error.code === 'ECONNREFUSED'){
//           return {
//             href: url,
//             text: link.text,
//             file: filePath,
//             status: 0,
//             message: 'Connection Refused',
//           };

//         } else {
//           throw error; 
//         }

        
//          //Devolver el error como una promesa rechazada
//       });
//   });
//   return Promise.all(linkPromises)
// };

const requestHttp = (links) => {
  const linkPromises = links.map((link) => {
    const url = link.url;
    return axios
      .get(url, {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      })
      .then((response) => ({
        href: url,
        text: link.text,
        file: filePath,
        status: response.status,
        message: (response.status >= 200 && response.status < 300) ? 'ok' : 'fail',
      }))
      .catch((error) => {
        return error; //Devolver el error como una promesa rechazada
      });
  });
  return Promise.all(linkPromises)
};


// const requestHttp = (links) => {
//   const linkPromises = links.map((link) => {
//     const url = link.match(/\(([^()]*)\)/)[1];
//     return axios
//       .get(url)
//       .then((response) => ({
//         href: url,
//         text: link.match(/\[([^[\]]*)\]/)[1],
//         file: filePath,
//         status: response.status,
//         message: response.status >= 200 && response.status < 300 ? 'ok' : 'fail',
//       }))
//       .catch((error) => {
//         return error; //Devolver el error como una promesa rechazada
//       });
//   });
//   return Promise.all(linkPromises)
// };
          

//exportar funciones
module.exports = {
  pathAbsoluta,
  pathExist,
  readDirectory,
  readFile,
  getLinks,
  linksToString,
  getLinkInfo,
  requestHttp,
}

