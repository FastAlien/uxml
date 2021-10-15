import { NOT_FOUND, findFirst, findFirstNotOf, findFirstOf } from "common/StringUtils";

export { NOT_FOUND } from "common/StringUtils";

export class StringParser {
  private readonly data: string;
  private position_ = 0;

  public constructor(data: string) {
    this.data = data;
  }

  public get position(): number {
    return this.position_;
  }

  public advance(): void {
    this.moveTo(this.position + 1);
  }

  public moveBy(chars: number): void {
    this.moveTo(this.position + chars);
  }

  public moveTo(position: number): void {
    this.position_ = Math.max(0, Math.min(position, this.data.length));
  }

  public getCurrent(): string {
    return this.data.charAt(this.position);
  }

  public getCharAt(position: number): string {
    return this.data.charAt(position);
  }

  public getNext(): string {
    return this.data.charAt(this.position + 1);
  }

  public isEnd(): boolean {
    return this.position_ === this.data.length;
  }

  public moveToNextNonWhitespaceChar(): void {
    const nonWhitespacePosition = findFirstNotOf(this.data, " \t\n\r", this.position);
    if (nonWhitespacePosition !== NOT_FOUND) {
      this.moveTo(nonWhitespacePosition);
    }
  }

  public match(search: string): boolean {
    if (search.length === 0) {
      return false;
    }

    if (search.length === 1) {
      return this.getCurrent() === search;
    }

    for (let i = 0; i < search.length; i++) {
      if (this.getCharAt(this.position + i) !== search.charAt(i)) {
        return false;
      }
    }

    return true;
  }

  public findFirst(search: string): number {
    return findFirst(this.data, search, this.position);
  }

  public findFirstOf(search: string): number {
    return findFirstOf(this.data, search, this.position);
  }

  public findFirstNotOf(search: string): number {
    return findFirstNotOf(this.data, search, this.position);
  }

  public substring(end: number): string {
    return this.data.substring(this.position, end);
  }
}
