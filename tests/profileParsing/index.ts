import { XmlDocumentParser } from "uxml";
import { readFileSync } from "fs";

if (process.argv.length !== 4 && process.argv.length) {
  console.error("Incorrect number of parameters");
  process.exit(1);
}

const [, , xmlFile, iterationsArgument] = process.argv;

try {
  const iterations = Number.parseInt(iterationsArgument);
  const xmlData = readFileSync(xmlFile, "utf-8");
  const parser = new XmlDocumentParser();

  console.log(`Running ${iterations} iterations...`);

  for (let i = 0; i < iterations; i++) {
    parser.parse(xmlData);
  }

} catch (error) {
  console.error("Error running test: ", error);
  process.exit(2);
}
