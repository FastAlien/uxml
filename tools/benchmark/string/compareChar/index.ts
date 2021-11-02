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

  suite.add("String.charAt", () => data.charAt(0) === "<");
  suite.add("String.charCodeAt", () => data.charCodeAt(0) === 60);

  suite.run();
} catch (error) {
  console.error("Error running benchmark: ", error);
  process.exit(2);
}
