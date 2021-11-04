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
    const nameEndPosition = data.findFirst("=");
    if (nameEndPosition === NOT_FOUND) {
      throw new ParseError("Invalid attribute format", data.position);
    }

    const attributeName = data.substring(nameEndPosition);
    if (!attributeName) {
      throw new ParseError("No attribute name", data.position);
    }

    data.moveTo(nameEndPosition);
    return attributeName;
  }

  private parseAttributeValue(data: StringParser): string {
    const valueMark = data.getCurrent();
    if (valueMark !== "\"" && valueMark !== "'") {
      throw new ParseError("Start of attribute value not found", data.position);
    }
    data.advance();
    const valueEndPosition = data.findFirst(valueMark);
    if (valueEndPosition === NOT_FOUND) {
      throw new ParseError("End of attribute value not found", data.position);
    }

    const value = data.substring(valueEndPosition);
    data.moveTo(valueEndPosition + 1);
    return value;
  }
}
