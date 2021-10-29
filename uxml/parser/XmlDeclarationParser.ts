import { ParseError } from "uxml/parser/ParseError";
import { StringParser } from "uxml/parser/StringParser";
import { XmlAttributeParser } from "uxml/parser/XmlAttributeParser";
import { XmlDeclaration } from "uxml/parser/Types";

const xmlDeclarationBegin = "<?xml";
const xmlDeclarationEnd = "?>";
const defaultVersion = "1.0";

enum AttributeName {
  Version = "version",
  Encoding = "encoding",
  Standalone = "standalone"
}

type ParsedAttributes = Record<AttributeName | string, string | undefined>;

export class XmlDeclarationParser {
  private attributeParser = new XmlAttributeParser();

  public parse(data: StringParser): XmlDeclaration {
    data.moveToNextNonWhitespaceChar();

    if (!data.match(xmlDeclarationBegin)) {
      return {
        version: defaultVersion
      };
    }

    data.moveBy(xmlDeclarationBegin.length);
    const attributes = this.parseAttributes(data);

    data.moveToNextNonWhitespaceChar();
    if (!data.match(xmlDeclarationEnd)) {
      throw new ParseError("End of XML declaration not found", data.position);
    }

    const version = attributes[AttributeName.Version];
    if (!version) {
      throw new ParseError("XML declaration doesn't have version attribute", data.position);
    }

    data.moveBy(xmlDeclarationEnd.length);
    return {
      version,
      encoding: attributes[AttributeName.Encoding],
      standalone: attributes[AttributeName.Standalone]
    };
  }

  private parseAttributes(data: StringParser): ParsedAttributes {
    const attributes: ParsedAttributes = {};

    while (!data.isEnd() && data.getCurrent() !== "?") {
      const { name, value } = this.attributeParser.parse(data);
      attributes[name] = value;
      data.moveToNextNonWhitespaceChar();
    }

    return attributes;
  }
}
