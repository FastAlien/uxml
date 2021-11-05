import { Event, Suite } from "benchmark";
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

enum TestName {
  uxml = "uxml",
  txml = "txml",
  fastXmlParser = "fast-xml-parser",
  xml2js = "xml2js"
}

try {
  const xml = readFileSync(xmlFile, "utf-8");
  let uxmlHz = 0;
  let xmlData: string;
  const suite = new Suite("XML parser benchmark", {
    onStart: () => {
      console.log("Running Suite");
      xmlData = `${xml} `;
    },
    onError: (event: Event) => {
      const error = (event.target as { error?: Error }).error;
      console.error("Error in Suite: ", error);
    },
    onAbort: () => console.log("Aborting Suite"),
    onCycle: (event: Event) => {
      if (event.target.hz == null) {
        console.error("Unable to read test results");
        return;
      }
      if (event.target.name === TestName.uxml) {
        uxmlHz = event.target.hz;
      }
      const percentOfUxmlResult = event.target.hz / uxmlHz * 100;
      console.log(`${event.target}, ${percentOfUxmlResult.toFixed(2)}%`);
      xmlData = `${xml} `;
    }
  });

  const uxmlParser = new XmlDocumentParser();
  suite.add(TestName.uxml, () => uxmlParser.parse(xmlData));

  if (enabledBenchmarks.txml) {
    suite.add(TestName.txml, () => txml.parse(xmlData));
  }

  if (enabledBenchmarks.fastXmlParser) {
    suite.add(TestName.fastXmlParser, () => fastXmlParse(xmlData));
  }

  if (enabledBenchmarks.xml2js) {
    const xml2jsParser = new Xml2JsParser();
    suite.add(TestName.xml2js, () => xml2jsParser.parseString(xmlData));
  }

  suite.run();
} catch (error) {
  console.error("Error running benchmark: ", error);
  process.exit(2);
}
