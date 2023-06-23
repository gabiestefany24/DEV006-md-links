#!/usr/bin/env node
const mdLinks = require("./index.js");
const { uniqueLinks, countBrokenLinks } = require("./functions.js");
const pathCli = process.argv[2];
let optionsValidate = process.argv.includes("--validate");
let optionsStats = process.argv.includes("--stats");

//const [,, ...args] = process.argv
//console.log(`Hello World ${args}`)

// mdLinks(pathCli, options)
//   .then((links) => {
if (optionsValidate && !optionsStats) {
  mdLinks(pathCli, { validate: true })
    .then((links) => {
      links.forEach((link) => {
        console.log(
          `${link.file} ${link.href} ${link.message} ${link.status} ${link.text}`
        );
      });
      return links;
    })
    .catch((error) => {
      console.log(error, "Este es el error de --validate");
    });
} else if (!optionsValidate && optionsStats) {
  mdLinks(pathCli, { stats: true })
    .then((links) => {
      const linksArray = Array.from(links);
      console.log("Total: ", links.length, "Únicos: ", linksArray.length);
      return links;
    })
    .catch((error) => {
      console.log(error, "Este es el error de --stats");
    });
} else if (optionsValidate && optionsStats) {
  mdLinks(pathCli, { stats: true, validate: true })
    .then((links) => {
      const brokenLinkCount = countBrokenLinks(links);
      const linksArray = Array.from(links);
      console.log(
        "Total: ",
        links.length,
        "Únicos: ",
        linksArray.length,
        "Broken: ",
        brokenLinkCount
      );
      return links;
    })
    .catch((error) => {
      console.log(error, "Este es el error de --stats--validate");
    });
} else if (!optionsValidate && !optionsStats) {
  mdLinks(pathCli, false)
    .then((links) => {
      links.forEach((link) => {
        console.log(`${link.href}`, "holaaaaa");
      });
      // return links;
    })
    .catch((error) => {
      console.log(error, "Este es el error de sin options");
    });
}
// })
// .catch((error) => {
//   console.log(error, "Este es el error en CLI");
// });
