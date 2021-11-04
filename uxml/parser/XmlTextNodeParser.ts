import { NOT_FOUND, StringParser } from "./StringParser";
import { ParseError } from "./ParseError";

export class XmlTextNodeParser {
  public parse(data: StringParser): string {
    const nextTagBeginPosition = data.findFirst("<");
    if (nextTagBeginPosition === NOT_FOUND) {
      throw new ParseError("Unclosed text node", data.position);
    }
    const text = data.extractText(nextTagBeginPosition);
    data.moveTo(nextTagBeginPosition);
    return text;
  }
}
