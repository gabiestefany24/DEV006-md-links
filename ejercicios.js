const fs = require('fs');
const path = require('path');

//unir dos rutas
const pathJoin = path.join(__dirname, './lib', '/pruebacarpeta');
console.log('Unir rutas: ', pathJoin);

//extraer la extensión
const extension = path.extname(filePath);
console.log('Extensión:', extension)