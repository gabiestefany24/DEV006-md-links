const fs = require("fs");
const path = require("path");

const {
  pathAbsoluta,
  readDirectory,
  readFile,
  getLinks,
  uniqueLinks,
  countBrokenLinks,
} = require("../functions.js");
const mdLinks = require("../index.js")


describe("pathAbsoluta", () => {
  test("devuelve la ruta absoluta si se proporciona una ruta relativa", () => {
    const filePath = "pruebatxt.txt";

    const resolvedPath = pathAbsoluta(filePath);

    expect(path.isAbsolute(resolvedPath)).toBe(true);
  });

  test("devuelve la ruta absoluta sin cambios si se proporciona una ruta absoluta", () => {
    const filePath = "C:\\Laboratoria\\Proyecto4\\lib\\pruebatxt.txt";

    const resolvedPath = pathAbsoluta(filePath);

    expect(resolvedPath).toBe(filePath);
  });
});

describe('readDirectory', () => {
  
  test('devuelve un array vacío con directorio vacío', () => {
    const directorioVacio = './directorio_vacio';
    jest.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true });
    jest.spyOn(fs, 'readdirSync').mockReturnValue([]);
    expect(readDirectory(directorioVacio)).toEqual([]);
  });


  test('devuelve un array con la ruta completa del archivo .md', () => {
    const archivoMd = './directorio/archivo.md';
    jest.spyOn(fs, 'statSync').mockReturnValueOnce({ isDirectory: () => false });
    jest.spyOn(path, 'extname').mockReturnValueOnce('.md');
    expect(readDirectory(archivoMd)).toEqual([archivoMd]);
  });

});

describe("readFile", () => {
  const resolvedPath = "../lib/prueba.md";

  it("debe devolver una promesa", () => {
    const result = readFile(resolvedPath);
    expect(result).toBeInstanceOf(Promise);
  });

  it("debe resolver con un objeto que contiene la ruta y el contenido del archivo", () => {
    return expect(readFile(resolvedPath)).resolves.toEqual({
      path: resolvedPath,
      file: expect.any(String),
    });
  });
});

describe("getLinks", () => {
  it("debe retornar un array de objetos con los links encontrados", () => {
    const data =
      "[link](https://docs.google.com/spreadsheets/d/1oleVJ6QXGO6nWxLqlm9dOEzc_geahDo2ZjJe8o_kXHo/edit#gid=1167361173)";
    const file = "../lib/pruebacarpeta/tercerdirectorio/gabriela.md";

    const result = getLinks(data, file);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      file: "../lib/pruebacarpeta/tercerdirectorio/gabriela.md",
      text: "link",
      href: "https://docs.google.com/spreadsheets/d/1oleVJ6QXGO6nWxLqlm9dOEzc_geahDo2ZjJe8o_kXHo/edit#gid=1167361173",
    });
  });

 });

describe("uniqueLinks", () => {
  test("devuelve un array con los enlaces únicos", () => {
    const links = [
      "https://www.example.com",
      "https://www.google.com",
      "https://www.example.com",
      "https://www.github.com",
      "https://www.google.com",
    ];

    const uniqueLinksArray = uniqueLinks(links);

    expect(uniqueLinksArray).toEqual([
      "https://www.example.com",
      "https://www.google.com",
      "https://www.github.com",
    ]);
  });

  test("devuelve un array vacío si no se proporcionan enlaces", () => {
    const links = [];

    const uniqueLinksArray = uniqueLinks(links);

    expect(uniqueLinksArray).toEqual([]);
  });
});

describe("countBrokenLinks", () => {
  test("devuelve el recuento correcto de enlaces rotos", () => {
    const links = [
      { message: "ok" },
      { message: "fail" },
      { message: "fail" },
      { message: "ok" },
      { message: "fail" },
    ];

    const brokenLinkCount = countBrokenLinks(links);

    expect(brokenLinkCount).toBe(3);
  });

  test("devuelve 0 si no hay enlaces rotos", () => {
    const links = [{ message: "ok" }, { message: "ok" }, { message: "ok" }];

    const brokenLinkCount = countBrokenLinks(links);

    expect(brokenLinkCount).toBe(0);
  });
});

describe("mdLinks", () => {

  test('debe lanzar un error si no se proporciona una ruta', () => {
    expect.assertions(1); // Asegura que se llame a una cantidad específica de aserciones dentro de la prueba

    return expect(mdLinks()).rejects.toMatch('Debe agregar una ruta');
  });

  test("devuelve una promesa", () =>{
   
    expect(mdLinks("C:\\Laboratoria\\Proyecto4\\lib\\prueba.md", {})).toBeInstanceOf(Promise);
  })

  test("deberia llamar pathExist", async () =>{
    const spyPathExist = jest.spyOn(fs, 'existsSync');

    // Simulamos que la ruta existe
    spyPathExist.mockReturnValueOnce(true);

    // Ejecutamos la función mdLinks con una ruta válida
    await mdLinks("C:\\Laboratoria\\Proyecto4\\lib\\prueba.md", { validate: true });

    // Verificamos si se llamó a pathExist con la ruta absoluta
    expect(spyPathExist).toHaveBeenCalledWith("C:\\Laboratoria\\Proyecto4\\lib\\prueba.md");
  })

  

  test('Rechazo de promesa cuando la ruta no existe', () => {
     
    const path = '/ruta/invalida/archivo.md';
    const options = { validate: true };
  
    return mdLinks(path, options).catch((error) => {
      expect(error).toBe('La ruta especificada no existe');
    });
  });

   
})
