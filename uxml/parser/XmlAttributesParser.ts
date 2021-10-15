import { StringParser } from "./StringParser";
import { XmlAttributeParser } from "./XmlAttributeParser";
import { XmlAttributes } from "./Types";

export class XmlAttributesParser {
  private attributeParser = new XmlAttributeParser();

  public parse(data: StringParser): XmlAttributes | undefined {
    let attributes: XmlAttributes | undefined;

    data.moveToNextNonWhitespaceChar();
    while (!data.isEnd()) {
      const current = data.getCurrent();
      if (current === "/" || current === ">") {
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
      data.moveToNextNonWhitespaceChar();
    }

    return attributes;
  }
}
