import { Suite, Target } from "benchmark";
import { Parser as Xml2JsParser } from "xml2js";
import { parse as fastXmlParse } from "fast-xml-parser";
import { readFileSync } from "fs";
import txml from "txml";

if (process.argv.length !== 3) {
  console.error("Incorrect number of parameters");
  process.exit(1);
}

const suite = new Suite("XML parser benchmark", {
  onStart: () => console.log("Running Suite"),
  onError: () => console.log("Error in Suite"),
  onAbort: () => console.log("Aborting Suite"),
  onComplete: () => {
    suite.forEach((target: Target) => {
      console.log(`${target.name} : ${target.hz} requests/second`);
    });
  }
});

const xmlFile = process.argv[2];
try {
  const xmlData = readFileSync(xmlFile, "utf-8");
  const xml2jsParser = new Xml2JsParser();

  suite.add("txml", () => txml.parse(xmlData))
    .add("fast-xml-parser", () => fastXmlParse(xmlData))
    .add("xml2js", () => xml2jsParser.parseString(xmlData))
    .run();
} catch (error) {
  console.error("Error running benchmark: ", error);
  process.exit(2);
}
