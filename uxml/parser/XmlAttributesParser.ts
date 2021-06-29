import { StringParser } from "./StringParser";
import { XmlAttributeParser } from "./XmlAttributeParser";
import { XmlAttributes } from "./Types";

export class XmlAttributesParser {
  private attributeParser = new XmlAttributeParser();

  public parse(data: StringParser): XmlAttributes | undefined {
    let attributes: XmlAttributes | undefined;

    while (!data.isEnd()) {
      data.moveToNextNonWhitespaceChar();
      if (data.isSlash() || data.isGreaterThan()) {
        break;
      }
      const { name, value } = this.attributeParser.parse(data);
      if (!attributes) {
        attributes = {
          [name]: value
        };
      } else {
        attributes[name] = value;
      }
    }

    return attributes;
  }
}
