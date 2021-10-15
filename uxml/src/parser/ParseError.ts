export class ParseError extends Error {
  public readonly position: number;

  public constructor(message: string, position: number) {
    super(message);
    this.position = position;
    // Workaround for TypeScript limitation in ES5.
    Object.setPrototypeOf(this, ParseError.prototype);
  }
}
