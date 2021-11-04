import { NOT_FOUND, StringParser } from "./StringParser";
import { ParseError } from "./ParseError";

export class XmlCDATASectionParser {
  private static readonly delimiter = "]]>";

  public parse(data: StringParser): string {
    const beginPosition = data.position;
    const endPosition = data.findFirst(XmlCDATASectionParser.delimiter);
    if (endPosition === NOT_FOUND) {
      throw new ParseError("Unclosed CDATA section", beginPosition);
    }
    const text = data.substring(endPosition);
    data.moveTo(endPosition + XmlCDATASectionParser.delimiter.length);
    data.moveToNextNonWhitespaceChar();
    if (data.getCurrent() !== "<") {
      throw new ParseError("Unclosed text node", endPosition);
    }
    return text;
  }
}
