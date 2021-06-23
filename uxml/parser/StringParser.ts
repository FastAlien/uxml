import { NOT_FOUND, findFirst, findFirstNotOf, findFirstOf } from "uxml/common/StringUtils";

export { NOT_FOUND };

export class StringParser {
  private static readonly minWhitespaceCharCode = 32;
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
    if (position < 0) {
      this.position_ = 0;
    } else if (position > this.data.length) {
      this.position_ = this.data.length;
    } else {
      this.position_ = position;
    }
  }

  public getCurrent(): string {
    return this.data.charAt(this.position);
  }

  public getCharAt(position: number): string {
    return this.data.charAt(position);
  }

  public isCurrentOneOf(search: string): boolean {
    const current = this.getCurrent();
    for (let i = 0; i < search.length; i++) {
      if (current === search.charAt(i)) {
        return true;
      }
    }
    return false;
  }

  public isCurrentNotOneOf(search: string): boolean {
    const current = this.getCurrent();
    for (let i = 0; i < search.length; i++) {
      if (current === search.charAt(i)) {
        return false;
      }
    }
    return true;
  }

  public getNext(): string {
    return this.data.charAt(this.position + 1);
  }

  public isEnd(): boolean {
    return this.position_ === this.data.length;
  }

  public isWhitespaceAt(position: number): boolean {
    return this.data.charCodeAt(position) <= StringParser.minWhitespaceCharCode;
  }

  public moveToNextNonWhitespaceChar(): void {
    for (let i = this.position; i < this.data.length; i++) {
      if (!this.isWhitespaceAt(i)) {
        this.moveTo(i);
        return;
      }
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
