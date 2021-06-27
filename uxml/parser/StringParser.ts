import { NOT_FOUND } from "uxml/common/StringUtils";

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

  public isCurrentNotOneOf(search: string): boolean {
    return search.indexOf(this.getCurrent()) === NOT_FOUND;
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
      return this.data.charAt(this.position) === search;
    }

    for (let i = 0; i < search.length; i++) {
      if (this.data.charCodeAt(this.position + i) !== search.charCodeAt(i)) {
        return false;
      }
    }

    return true;
  }

  public findFirst(search: string): number {
    return this.data.indexOf(search, this.position);
  }

  public findFirstWhitespaceOrTagClosing(): number {
    for (let i = this.position; i < this.data.length; i++) {
      const charCode = this.data.charCodeAt(i);
      if (charCode <= StringParser.minWhitespaceCharCode || charCode == 47 || charCode == 62) {
        return i;
      }
    }
    return NOT_FOUND;
  }

  public substring(end: number): string {
    return this.data.substring(this.position, end);
  }

  public extractText(end: number): string {
    let endOfText: number;
    for (endOfText = end - 1; endOfText > this.position; endOfText--) {
      if (!this.isWhitespaceAt(endOfText)) {
        break;
      }
    }
    return this.substring(endOfText + 1);
  }
}
