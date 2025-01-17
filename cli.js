#!/usr/bin/env node
const mdLinks = require("./index.js");
const { uniqueLinks, countBrokenLinks } = require("./functions.js");

let pathCli = process.argv[2];
let optionsValidate = process.argv.includes("--validate");
let optionsStats = process.argv.includes("--stats");


if (optionsValidate && !optionsStats) {
  mdLinks(pathCli, { validate: true })
    .then((links) => {
      if (links.length === 0) {
        console.log('No se encuentran links') 
      }
      links.forEach((link) => {
        console.log(
          `${link.file} ${link.href} ${link.message} ${link.status} ${link.text}`
        );
      });
      return links;
      //console.log(links, 'ESTO ES LINKS DE VALIDATE')
    })
    .catch((error) => {
      console.log(error, "Este es el error de --validate");
    });
} else if (!optionsValidate && optionsStats) {
  mdLinks(pathCli, { stats: true })
    .then((links) => {
      if (links.length === 0) {
        console.log('No se encuentran links') 
      }
      const uniqueLinksArray = uniqueLinks(links);;
      console.log("Total: ", links.length, "Únicos: ", uniqueLinksArray.length);
      return links;
    })
    .catch((error) => {
      console.log(error, "Este es el error de --stats");
    });
} else if (optionsValidate && optionsStats) {
  mdLinks(pathCli, { stats: true, validate: true })
    .then((links) => {
      if (links.length === 0) {
        console.log('No se encuentran links') 
      }
      const brokenLinkCount = countBrokenLinks(links);
      const uniqueLinksArray = uniqueLinks(links);
      console.log(
        "Total: ",
        links.length,
        "Únicos: ",
        uniqueLinksArray.length,
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
      if (links.length === 0) {
        console.log('No se encuentran links') 
      }
      links.forEach((link) => {
        console.log(`${link.file} ${link.href} ${link.text}`);
      });
      return links;
      // console.log(links)
    })
    .catch((error) => {
      console.log(error, "Este es el error de sin options");
    });
}

