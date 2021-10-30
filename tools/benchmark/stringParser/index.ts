import { Event, Suite } from "benchmark";
import { StringParser } from "../../../uxml/parser/StringParser";

try {
  const data = "<!-- A test string used to benchmark StringParser -->";
  let parser: StringParser;
  const suite = new Suite("StringParser", {
    onStart: () => {
      console.log("Running Suite");
      parser = new StringParser(`${data} `);
    },
    onError: (event: Event) => {
      const error = (event.target as { error?: Error }).error;
      console.log("Error in Suite: ", error);
    },
    onAbort: () => console.log("Aborting Suite"),
    onCycle: (event: Event) => {
      console.log(String(event.target));
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
