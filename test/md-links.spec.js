const fs = require("fs");
const path = require("path");

const {
  pathAbsoluta,
  readContent,
  readFile,
  getLinks,
  uniqueLinks,
  countBrokenLinks,
} = require("../functions.js");


// describe('mdLinks', () => {

//   it('should...', () => {
//     console.log('FIX ME!');
//   });

// });

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

describe('readContent', () => {
  // test('devuelve un array vacío sin contenido', () => {
  //   expect(readContent()).toEqual([]);
  // });

  test('devuelve un array vacío con directorio vacío', () => {
    const directorioVacio = './directorio_vacio';
    jest.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true });
    jest.spyOn(fs, 'readdirSync').mockReturnValue([]);
    expect(readContent(directorioVacio)).toEqual([]);
  });

  test('devuelve un array con la ruta completa del archivo .md', () => {
    const archivoMd = './directorio/archivo.md';
    jest.spyOn(fs, 'statSync').mockReturnValueOnce({ isDirectory: () => false });
    jest.spyOn(path, 'extname').mockReturnValueOnce('.md');
    expect(readContent(archivoMd)).toEqual([archivoMd]);
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

  it('debe devolver un array con "No se han encontrado links" si no se encuentran links', () => {
    const data = "No hay links";
    const file = 'example.txt';
    const expectedResult = [
      {
        file: 'example.txt',
        text: 'No links found',
        href: ''
      }
    ];
    const result = getLinks(data, file);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual(expectedResult);
   
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

