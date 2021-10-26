import { NOT_FOUND, StringParser } from "./StringParser";
import { ParseError } from "./ParseError";

export class XmlCDATASectionParser {
  private static readonly delimiter = "]]>";

  public parse(data: StringParser): string {
    const begin = data.position;
    const end = data.findFirst(XmlCDATASectionParser.delimiter);
    if (end === NOT_FOUND) {
      throw new ParseError("Unclosed CDATA section", begin);
    }
    const text = data.substring(end);
    data.moveTo(end + XmlCDATASectionParser.delimiter.length);
    data.moveToNextNonWhitespaceChar();
    if (data.getCurrent() !== "<") {
      throw new ParseError("Unclosed text node", begin);
    }
    return text;
  }
}
