const fs = require("fs");
const path = require("path");
const axios = require("axios");




//resolver relativa a absoluta

const pathAbsoluta = (filePath) => {
  let resolvedPath = filePath; // Variable local para almacenar el valor resuelto

  if (!path.isAbsolute(filePath)) {
    resolvedPath = path.resolve(filePath); // Asignar el valor resuelto a la variable local
  }

  return resolvedPath; // Devolver la variable local
};


//validar ruta existe
const pathExist = (resolveAbsolute) => {
  return fs.existsSync(resolveAbsolute);
};


//leer los archivos de un directorio


const readDirectory = (directorio) => {
  // cambiar nombre
  const archivos = [];
  if (fs.statSync(directorio).isDirectory()) {
    const directory = fs.readdirSync(directorio);
    directory.forEach((file) => {//archivo o directorio
      // console.log(file);
      const rutaCompleta = path.join(directorio, file);//concatena el nombre del directorio actual con el nombre del archivo o subdirectorio para formar la ruta completa
      if (fs.statSync(rutaCompleta).isDirectory()) {
        const subdirectory = readDirectory(rutaCompleta); //Recursividad de directorio
        archivos.push(...subdirectory);
      } else if (path.extname(rutaCompleta) === ".md") {
        archivos.push(rutaCompleta);
      }
    });
  } else {
    const extension = path.extname(directorio);
    if (extension === ".md") {
      archivos.push(directorio);
    }
  }
  return archivos;
};



//leer un archivo
const readFile = (resolvedPath) => {
  return new Promise((resolve, reject) => {
      fs.readFile(resolvedPath, "utf8", (error, data) => {
      if (error) {
        reject(error);
      } else {
        // crear objeto(path, file)
        resolve({
          path: resolvedPath,
          file: data.toString(),
        });
      }
    });
  });
};
//expresiones regulares texto y url
// Extraer links de archivo

const getLinks = (data, file) => {
  const regEx = /\[([^\[\]]*?)\]\((https?:\/\/[^\s$.?#].[^\s]*)\)/gi;
  const matches = data.matchAll(regEx);
  let links = [];

  for (const match of matches) {
    const [, text, href] = match;
    links.push({ file, text, href });
  }

  //console.log(links)
  return links;
};


const requestHttp = (links) => {
  
  const linkPromises = links.map((link) => {
  //  console.log(link)
    return axios
      .get(link.href)
      .then((response) => 
      
      ({
        href: link.href,
        text: link.text,
        file: link.file,
        status: response.status,
        message: 'ok'
        
      })
      )
      .catch((error) => ( {
        // console.log(error.response.statusCode)
        // console.log(error.status)
         
          href:link.href,
          text: link.text,
          file: link.file,
          status: error.response.status,
          message: 'fail'
                 
      }));
   
  });
  return Promise.all(linkPromises);
};

const uniqueLinks = (links) => {
  const uniqueLinksSet = new Set();

  links.forEach((link) => {
    if (!uniqueLinksSet.has(link)) {
      uniqueLinksSet.add(link);
    }
  });

  return Array.from(uniqueLinksSet);
};

const countBrokenLinks = (links) => {
  let brokenLinkCount = 0;

  links.forEach((link) => {
    if (link.message === "fail") {
      brokenLinkCount++;
    }
  });

  return brokenLinkCount;
};



//exportar funciones
module.exports = {
  pathAbsoluta,
  pathExist,
  readDirectory,
  readFile,
  getLinks,
  requestHttp,
  uniqueLinks,
  countBrokenLinks
};
