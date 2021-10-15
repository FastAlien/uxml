import { Suite, Target } from "benchmark";
import { Parser as Xml2JsParser } from "xml2js";
import { XmlDocumentParser } from "uxml/parser/XmlDocumentParser";
import { parse as fastXmlParse } from "fast-xml-parser";
import { readFileSync } from "fs";
import txml from "txml";

if (process.argv.length < 3 && process.argv.length > 4) {
  console.error("Incorrect number of parameters");
  process.exit(1);
}

const [, , xmlFile, option] = process.argv;
let benchmarkOtherLibs = false;

if (option) {
  switch (option) {
    case "--all":
      benchmarkOtherLibs = true;
      break;
    default:
      console.error("Unknown option: ", option);
      process.exit(1);
  }
}

try {
  const xmlData = readFileSync(xmlFile, "utf-8");
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

  const uxmlParser = new XmlDocumentParser();
  suite.add("uxml", () => uxmlParser.parse(xmlData));

  if (benchmarkOtherLibs) {
    suite.add("txml", () => txml.parse(xmlData));
    suite.add("fast-xml-parser", () => fastXmlParse(xmlData));
    const xml2jsParser = new Xml2JsParser();
    suite.add("xml2js", () => xml2jsParser.parseString(xmlData));
  }

  suite.run();
} catch (error) {
  console.error("Error running benchmark: ", error);
  process.exit(2);
}
