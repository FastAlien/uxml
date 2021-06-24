import { XmlDocumentParser } from "uxml";
import { readFileSync } from "fs";

if (process.argv.length !== 3) {
  console.error("Please specify file to parse");
  process.exit(1);
}

const fileName = process.argv[2];

try {
  const xmlData = readFileSync(fileName, "utf-8");
  const parser = new XmlDocumentParser();
  const xml = parser.parse(xmlData);
  console.log(JSON.stringify(xml));
} catch (error) {
  console.error(`Error parsing file ${fileName}`, error);
  process.exit(2);
}
