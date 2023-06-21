const {
  //validarAbsoluta,
  pathExist,
  pathAbsoluta,
  readDirectory,
  readFile,
  getLinks,
  getLinkInfo,
  requestHttp,
  //linksToString,
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
              //console.log(archivos);
              if (archivos) {
                //extraer links
                const obtenerLinks = getLinks(archivos.file, archivos.path);
                // const linksAsString = linksToString(links)
                //console.log(obtenerLinks, 'HASTA AQUI OBTENERLINKS');
                return obtenerLinks; //devolver los enlaces obtenidos
              }
            })
            .catch((error) => {
              reject(error);
            });
        });
        //console.log(enlacesPromises, 'hola soy yo')

        Promise.all(enlacesPromises).then((enlaces) => {
          //definir constante con aplanar el array
          const arrayAplanar = enlaces.flat()
          // console.log(enlaces.flat())
          if (validateOption) {
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
