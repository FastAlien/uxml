import { CharCode, StringParser } from "./StringParser";
import { XmlAttributeParser } from "./XmlAttributeParser";
import { XmlAttributes } from "./Types";

export class XmlAttributesParser {
  private attributeParser = new XmlAttributeParser();

  public parse(data: StringParser): XmlAttributes | undefined {
    let attributes: XmlAttributes | undefined;

    data.moveToNextNonWhitespaceChar();
    while (!data.isEnd() && !data.isCurrentCharCode(CharCode.Slash) && !data.isCurrentCharCode(CharCode.GreaterThan)) {
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
