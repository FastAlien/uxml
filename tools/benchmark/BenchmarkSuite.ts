import { Event, Options, Suite } from "benchmark";

export interface BenchmarkSuiteOptions extends Omit<Options, "onCycle"> {
  beforeEach?: () => void;
  afterEach?: (event: Event) => void;
}

export class BenchmarkSuite extends Suite {
  public constructor(name: string, suiteOptions: BenchmarkSuiteOptions = {}) {
    super(name, {
      ...suiteOptions,
      onStart: () => {
        suiteOptions.onStart?.();
        suiteOptions.beforeEach?.();
      },
      onError: (event: Event) => {
        const error = (event.target as { error?: Error }).error;
        console.error("Error in Suite: ", error);
        suiteOptions.onError?.(event);
      },
      onCycle: (event: Event) => {
        if (suiteOptions.afterEach) {
          suiteOptions.afterEach?.(event);
        } else {
          console.log(String(event.target));
        }
        suiteOptions.beforeEach?.();
      }
    });
  }
}
