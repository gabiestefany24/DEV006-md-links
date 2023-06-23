const {
  pathExist,
  pathAbsoluta,
  readDirectory,
  readFile,
  getLinks,
  requestHttp,  
} = require("./functions");

//función mdLinks con parámetros path y option
//path: relativa o absoluta
//option: objeto con propiedad validate(false or true)
module.exports = function mdLinks(path, options) {
  return new Promise((resolve, reject) => {
    if (!path) {
      reject("Debe agregar una ruta");
    } else {
      //path absolute
      const absoluta = pathAbsoluta(path);
      //console.log(absoluta); //agregar texto para diferenciar
      const validateOption = options.validate
      //const validateOption = false
      //console.log(validateOption, 'Options');
      //path existe
      const exists = pathExist(absoluta);
      //console.log(exists);
      if (exists) {
        //leer directorio
        const archivos = readDirectory(absoluta);
        //console.log(archivos);
        //leer archivo md y obtener enlaces
        const enlacesPromises = archivos.map((file) => {
          return readFile(file)
            .then((archivos) => {
              // cambiar a archivo(un archivo)
              // console.log(archivos, 'ARCHIVOS');
              if (archivos) {
                //extraer links
                const obtenerLinks = getLinks(archivos.file, archivos.path);
                // const linksAsString = linksToString(links)
                // console.log(obtenerLinks, 'HASTA AQUI OBTENERLINKS');
                return obtenerLinks; //devolver los enlaces obtenidos
                // console.log(obtenerLinks, 'ESTO ES OBTENERLINKS')
              }
            })
            .catch((error) => {
              reject(error);
            });
        });

        Promise.all(enlacesPromises).then((enlaces) => {
          // console.log(enlaces, 'ENLACES')
          //definir constante con aplanar el array
          const arrayAplanar = enlaces.flat()
          // console.log(enlaces.flat())
          if (options.validate) {
            // console.log(arrayAplanar, 'ARRAY')
            resolve(requestHttp(arrayAplanar));
          } else {
            resolve(arrayAplanar);
          }
        });
      } else {
        reject("La ruta especificada no existe");
      }
    }
  });
};
