import { Event, Suite, Target } from "benchmark";
import { Parser as Xml2JsParser } from "xml2js";
import { XmlDocumentParser } from "uxml";
import { parse as fastXmlParse } from "fast-xml-parser";
import { readFileSync } from "fs";
import txml from "txml";

if (process.argv.length < 3 && process.argv.length > 4) {
  console.error("Incorrect number of parameters");
  process.exit(1);
}

const [, , xmlFile, option] = process.argv;
const enabledBenchmarks = {
  txml: false,
  fastXmlParser: false,
  xml2js: false
};

if (option) {
  switch (option) {
    case "--txml":
      enabledBenchmarks.txml = true;
      break;
    case "--all":
      enabledBenchmarks.txml = true;
      enabledBenchmarks.fastXmlParser = true;
      enabledBenchmarks.xml2js = true;
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
    onError: (event: Event) => {
      const error = (event.target as { error?: Error }).error;
      console.log("Error in Suite: ", error);
    },
    onAbort: () => console.log("Aborting Suite"),
    onComplete: () => {
      suite.forEach((target: Target) => {
        console.log(`${target.name} : ${target.hz} requests/second`);
      });
    }
  });

  const uxmlParser = new XmlDocumentParser();
  suite.add("uxml", () => uxmlParser.parse(xmlData));

  if (enabledBenchmarks.txml) {
    suite.add("txml", () => txml.parse(xmlData));
  }

  if (enabledBenchmarks.fastXmlParser) {
    suite.add("fast-xml-parser", () => fastXmlParse(xmlData));
  }

  if (enabledBenchmarks.xml2js) {
    const xml2jsParser = new Xml2JsParser();
    suite.add("xml2js", () => xml2jsParser.parseString(xmlData));
  }

  suite.run();
} catch (error) {
  console.error("Error running benchmark: ", error);
  process.exit(2);
}
