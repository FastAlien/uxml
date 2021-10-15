import { NOT_FOUND, StringParser } from "parser/StringParser";
import { ParseError } from "parser/ParseError";
import { XmlAttribute } from "parser/Types";

export class XmlAttributeParser {
  public parse(data: StringParser): XmlAttribute {
    data.moveToNextNonWhitespaceChar();
    const name = this.parseAttributeName(data);

    if (!data.match("=")) {
      throw new ParseError("Missing equal sign after attribute name", data.position);
    }

    data.advance();
    const value = this.parseAttributeValue(data);
    return {
      name,
      value
    };
  }

  private parseAttributeName(data: StringParser): string {
    const endOfNamePosition = data.findFirstOf("= \t");
    if (endOfNamePosition === NOT_FOUND) {
      throw new ParseError("Invalid attribute format", data.position);
    }

    if (data.getCharAt(endOfNamePosition) !== "=") {
      throw new ParseError("Unexpected character in attribute name", endOfNamePosition);
    }

    const attributeName = data.substring(endOfNamePosition);
    if (!attributeName) {
      throw new ParseError("No attribute name", data.position);
    }

    data.moveTo(endOfNamePosition);
    return attributeName;
  }

  private parseAttributeValue(data: StringParser): string {
    if (!data.match("\"") && !data.match("'")) {
      throw new ParseError("Start of attribute value not found", data.position);
    }

    const attributeValueMark = data.getCurrent();
    data.advance();
    const closingDoubleQuotesPosition = data.findFirst(attributeValueMark);
    if (closingDoubleQuotesPosition === NOT_FOUND) {
      throw new ParseError("Closing mark for attribute value not found", data.position);
    }

    const value = data.substring(closingDoubleQuotesPosition);
    data.moveTo(closingDoubleQuotesPosition + 1);
    return value;
  }
}
