import { NOT_FOUND, StringParser } from "./StringParser";
import { ParseError } from "./ParseError";

export class XmlTextNodeParser {
  public parse(data: StringParser): string {
    const nextTagBegin = data.findFirst("<");
    if (nextTagBegin === NOT_FOUND) {
      throw new ParseError("Incomplete text node", data.position);
    }
    const text = data.extractText(nextTagBegin);
    data.moveTo(nextTagBegin);
    return text;
  }
}
