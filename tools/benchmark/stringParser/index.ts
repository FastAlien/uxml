import { BenchmarkSuite } from "../BenchmarkSuite";
import { StringParser } from "../../../uxml/parser/StringParser";

try {
  const data = "<!-- A test string used to benchmark StringParser -->";
  let parser: StringParser;
  const suite = new BenchmarkSuite("StringParser", {
    beforeEach: () => {
      parser = new StringParser(`${data} `);
    }
  });

  suite.add("compare current char", () => parser.getCurrent() === "<");
  suite.add("match 1 char negative", () => parser.match(">"));
  suite.add("match 1 char positive", () => parser.match("<"));
  suite.add("match 3 chars negative", () => parser.match("-->"));
  suite.add("match 3 chars positive", () => parser.match("<!-"));
  suite.add("match 4 chars negative", () => parser.match("--!>"));
  suite.add("match 4 chars positive", () => parser.match("<!--"));

  suite.run();
} catch (error) {
  console.error("Error running benchmark: ", error);
  process.exit(2);
}
