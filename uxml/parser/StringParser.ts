import { isWhitespaceCharCode } from "./StringUtils";

export const NOT_FOUND = -1;

enum CharCode {
  Slash = 47,
  GreaterThan = 62,
}

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
    this.moveTo(this.position_ + 1);
  }

  public moveBy(chars: number): void {
    this.moveTo(this.position_ + chars);
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
    return this.data.charAt(this.position_);
  }

  public getNext(): string {
    return this.data.charAt(this.position_ + 1);
  }

  public isEnd(): boolean {
    return this.position_ === this.data.length;
  }

  public moveToNextNonWhitespaceChar(): void {
    for (let i = this.position_; i < this.data.length; i++) {
      if (!this.isWhitespaceAt(i)) {
        this.moveTo(i);
        return;
      }
    }
    this.moveTo(this.data.length);
  }

  private isWhitespaceAt(position: number): boolean {
    return isWhitespaceCharCode(this.data.charCodeAt(position));
  }

  public match(search: string): boolean {
    if (search.length === 0) {
      return false;
    }

    if (search.length === 1) {
      return this.data.charAt(this.position_) === search;
    }

    return this.data.substring(this.position_, this.position_ + search.length) === search;
  }

  public findFirst(search: string): number {
    return this.data.indexOf(search, this.position_);
  }

  public findFirstWhitespaceOrTagClosing(): number {
    for (let i = this.position_; i < this.data.length; i++) {
      const charCode = this.data.charCodeAt(i);
      if (isWhitespaceCharCode(charCode) ||
        charCode === CharCode.Slash ||
        charCode === CharCode.GreaterThan) {
        return i;
      }
    }
    return NOT_FOUND;
  }

  public substring(end: number): string {
    return this.data.substring(this.position_, end);
  }

  public extractText(end: number): string {
    let endOfText: number;
    for (endOfText = end - 1; endOfText >= this.position_; endOfText--) {
      if (!this.isWhitespaceAt(endOfText)) {
        break;
      }
    }
    return this.substring(endOfText + 1);
  }
}
