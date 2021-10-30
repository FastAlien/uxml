import { ParseError } from "uxml/parser/ParseError";
import { StringParser } from "uxml/parser/StringParser";
import { XmlAttributeParser } from "uxml/parser/XmlAttributeParser";
import { XmlDeclaration } from "uxml/parser/Types";

enum AttributeName {
  Version = "version",
  Encoding = "encoding",
  Standalone = "standalone"
}

type ParsedAttributes = Record<AttributeName | string, string | undefined>;

export class XmlDeclarationParser {
  private static readonly xmlDeclarationBegin = "<?xml";
  private static readonly xmlDeclarationEnd = "?>";
  private static readonly defaultVersion = "1.0";
  private attributeParser = new XmlAttributeParser();

  public parse(data: StringParser): XmlDeclaration {
    data.moveToNextNonWhitespaceChar();

    if (!data.match(XmlDeclarationParser.xmlDeclarationBegin)) {
      return {
        version: XmlDeclarationParser.defaultVersion
      };
    }

    data.moveBy(XmlDeclarationParser.xmlDeclarationBegin.length);
    const attributes = this.parseAttributes(data);

    data.moveToNextNonWhitespaceChar();
    if (!data.match(XmlDeclarationParser.xmlDeclarationEnd)) {
      throw new ParseError("End of XML declaration not found", data.position);
    }

    const version = attributes[AttributeName.Version];
    if (!version) {
      throw new ParseError("XML declaration doesn't have version attribute", data.position);
    }

    data.moveBy(XmlDeclarationParser.xmlDeclarationEnd.length);
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
