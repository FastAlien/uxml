import { StringParser } from "./StringParser";
import { XmlAttributeParser } from "./XmlAttributeParser";
import { XmlAttributes } from "./Types";

export class XmlAttributesParser {
  private attributeParser = new XmlAttributeParser();

  public parse(data: StringParser): XmlAttributes {
    const attributes: XmlAttributes = {};

    data.moveToNextNonWhitespaceChar();
    while (!data.isEnd()) {
      const current = data.getCurrent();
      if (current === "/" || current === ">") {
        break;
      }
      const { name, value } = this.attributeParser.parse(data);
      attributes[name] = value;
      data.moveToNextNonWhitespaceChar();
    }

    return attributes;
  }
}
