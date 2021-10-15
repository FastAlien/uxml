import { NOT_FOUND, StringParser } from "uxml/parser/StringParser";
import { ParseError } from "uxml/parser/ParseError";
import { XmlAttribute } from "uxml/parser/Types";

export class XmlAttributeParser {
  public parse(data: StringParser): XmlAttribute {
    data.moveToNextNonWhitespaceChar();
    const name = this.parseAttributeName(data);
    data.advance();
    const value = this.parseAttributeValue(data);
    return {
      name,
      value
    };
  }

  private parseAttributeName(data: StringParser): string {
    const endOfNamePosition = data.findFirst("=");
    if (endOfNamePosition === NOT_FOUND) {
      throw new ParseError("Invalid attribute format", data.position);
    }

    const attributeName = data.substring(endOfNamePosition);
    if (!attributeName) {
      throw new ParseError("No attribute name", data.position);
    }

    data.moveTo(endOfNamePosition);
    return attributeName;
  }

  private parseAttributeValue(data: StringParser): string {
    const valueMark = data.getCurrent();
    if (valueMark !== "\"" && valueMark !== "'") {
      throw new ParseError("Start of attribute value not found", data.position);
    }
    data.advance();
    const closingValueMarkPosition = data.findFirst(valueMark);
    if (closingValueMarkPosition === NOT_FOUND) {
      throw new ParseError("Closing mark for attribute value not found", data.position);
    }

    const value = data.substring(closingValueMarkPosition);
    data.moveTo(closingValueMarkPosition + 1);
    return value;
  }
}
