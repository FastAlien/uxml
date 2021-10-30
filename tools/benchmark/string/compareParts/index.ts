import { Event, Suite } from "benchmark";
import { readFileSync } from "fs";

try {
  const xml = readFileSync(`${__dirname}/../../../../data/DashManifest.xml`, "utf-8");
  let data: string;
  const suite = new Suite("StringParser", {
    onStart: () => {
      console.log("Running Suite");
      data = `${xml} `;
    },
    onError: (event: Event) => {
      const error = (event.target as { error?: Error }).error;
      console.log("Error in Suite: ", error);
    },
    onAbort: () => console.log("Aborting Suite"),
    onCycle: (event: Event) => {
      console.log(String(event.target));
      data = `${xml} `;
    }
  });

  suite.add("String.substring - negative", () => data.substring(0, 3) === "###");
  suite.add("String.substring - positive", () => data.substring(0, 3) === "<?x");

  suite.add("String.startsWith - negative", () => data.startsWith("###"));
  suite.add("String.startsWith - positive", () => data.startsWith("<?x"));

  suite.add("String.indexOf - negative", () => data.indexOf("###") === 0);
  suite.add("String.indexOf - positive", () => data.indexOf("<?x") === 0);

  suite.run();
} catch (error) {
  console.error("Error running benchmark: ", error);
  process.exit(2);
}
