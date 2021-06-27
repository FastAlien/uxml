import { StringParser } from "./StringParser";
import { XmlAttributeParser } from "./XmlAttributeParser";
import { XmlAttributes } from "./Types";

export class XmlAttributesParser {
  private attributeParser = new XmlAttributeParser();

  public parse(data: StringParser): XmlAttributes | undefined {
    data.moveToNextNonWhitespaceChar();
    let attributes: XmlAttributes | undefined;

    while (!data.isEnd() && data.isCurrentNotOneOf("/>")) {
      const { name, value } = this.attributeParser.parse(data);
      if (!attributes) {
        attributes = {
          [name]: value
        };
      } else {
        attributes[name] = value;
      }
      data.moveToNextNonWhitespaceChar();
    }

    return attributes;
  }
}
