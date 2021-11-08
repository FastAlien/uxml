import { BenchmarkSuite } from "../../BenchmarkSuite";
import { readFileSync } from "fs";

try {
  const xml = readFileSync(`${__dirname}/../../../../data/DashManifest.xml`, "utf-8");
  let data: string;
  const suite = new BenchmarkSuite("StringParser", {
    beforeEach: () => {
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
