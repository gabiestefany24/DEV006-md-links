const {
  pathExist,
  pathAbsoluta,
  readDirectory,
  readFile,
  getLinks,
  requestHttp,  
} = require("./functions");

//función mdLinks con parámetros path y option
module.exports = function mdLinks(path, options) {
  return new Promise((resolve, reject) => {
    if (!path) {
      reject("Debe agregar una ruta");
    } else {
      //path absolute
      const absoluta = pathAbsoluta(path);
      const validateOption = options.validate
      //path existe
      const exists = pathExist(absoluta);
        if (exists) {
        //leer directorio
        const archivos = readDirectory(absoluta);
        // const archivos = readContent(absoluta);
        //console.log(archivos);
        //leer archivo md y obtener enlaces
        const enlacesPromises = archivos.map((file) => {
          return readFile(file)
            .then((archivos) => {
              //console.log(archivos, 'ARCHIVOS');
              if (archivos) {
                //extraer links
                const obtenerLinks = getLinks(archivos.file, archivos.path);
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
          // console.log(arrayAplanar, 'ARRAY')
          if (options.validate) {
          
            resolve(requestHttp(arrayAplanar));
          } else {
            resolve(arrayAplanar);
            // console.log(arrayAplanar, 'esto es aplanar')
          }
        });
      } else {
        reject("La ruta especificada no existe");
      }
    }
  });
};


