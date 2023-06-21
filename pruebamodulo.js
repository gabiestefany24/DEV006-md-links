const mdLinks = require('./index.js');

mdLinks('./lib/prueba.md', {validate: true})
  .then((results) =>{
    console.log(results, 'resultados')
   
  })
  .catch((error) => {
    console.log(error, 'Este es el error')
  });

