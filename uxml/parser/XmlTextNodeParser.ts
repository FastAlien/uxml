import { NOT_FOUND, StringParser } from "./StringParser";
import { ParseError } from "./ParseError";

export class XmlTextNodeParser {
  private static readonly cdataSectionStart = "<![CDATA[";
  private static readonly cdataSectionEnd = "]]>";

  public parse(data: StringParser): string {
    if (data.getCurrent() !== "<") {
      return this.parseText(data);
    }
    return this.parseCDATASection(data);
  }

  private parseText(data: StringParser): string {
    const nextTagBegin = data.findFirst("<");
    if (nextTagBegin === NOT_FOUND) {
      throw new ParseError("Unclosed text node", data.position);
    }
    const text = data.extractText(nextTagBegin);
    data.moveTo(nextTagBegin);
    return text;
  }

  private parseCDATASection(data: StringParser): string {
    if (!data.match(XmlTextNodeParser.cdataSectionStart)) {
      throw new ParseError("Incorrect tag name", data.position);
    }
    data.moveBy(XmlTextNodeParser.cdataSectionStart.length);
    const begin = data.position;
    const end = data.findFirst(XmlTextNodeParser.cdataSectionEnd);
    if (end === NOT_FOUND) {
      throw new ParseError("Unclosed CDATA section", begin);
    }
    const text = data.substring(end);
    data.moveTo(end + XmlTextNodeParser.cdataSectionEnd.length);
    data.moveToNextNonWhitespaceChar();
    if (data.getCurrent() !== "<") {
      throw new ParseError("Unclosed text node", begin);
    }
    return text;
  }
}
