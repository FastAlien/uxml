import { ParseError } from "parser/ParseError";
import { StringParser } from "parser/StringParser";
import { XmlAttributeParser } from "parser/XmlAttributeParser";
import { XmlDeclaration } from "parser/Types";

const xmlDeclarationBegin = "<?xml";
const xmlDeclarationEnd = "?>";
const defaultVersion = "1.0";

enum AttributeNames {
  Version = "version",
  Encoding = "encoding",
  Standalone = "standalone"
}

type ParsedAttributes = Record<AttributeNames | string, string | undefined>;

export class XmlDeclarationParser {
  private attributeParser = new XmlAttributeParser();

  public parse(data: StringParser): XmlDeclaration {
    data.moveToNextNonWhitespaceChar();

    if (!data.match(xmlDeclarationBegin)) {
      throw new ParseError("XML declaration not found", data.position);
    }

    data.moveBy(xmlDeclarationBegin.length);
    const attributes = this.parseAttributes(data);

    data.moveToNextNonWhitespaceChar();
    if (!data.match(xmlDeclarationEnd)) {
      throw new ParseError("End of XML declaration not found", data.position);
    }

    data.moveBy(xmlDeclarationEnd.length);
    return {
      version: attributes[AttributeNames.Version] ?? defaultVersion,
      encoding: attributes[AttributeNames.Encoding],
      standalone: attributes[AttributeNames.Standalone]
    };
  }

  private parseAttributes(data: StringParser): ParsedAttributes {
    const attributes: ParsedAttributes = {};

    while (!data.isEnd() && !data.match(xmlDeclarationEnd)) {
      const { name, value } = this.attributeParser.parse(data);
      attributes[name] = value;
      data.moveToNextNonWhitespaceChar();
    }

    return attributes;
  }
}
