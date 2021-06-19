import { StringParser } from "parser/StringParser";
import { XmlDeclarationParser } from "parser/XmlDeclarationParser";
import { XmlDocument } from "parser/Types";
import { XmlElementParser } from "./XmlElementParser";

export class XmlDocumentParser {
  private declarationParser = new XmlDeclarationParser();
  private elementParser = new XmlElementParser();

  public parse(data: string): XmlDocument {
    const dataParser = new StringParser(data);
    const declaration = this.declarationParser.parse(dataParser);
    const root = this.elementParser.parse(dataParser);
    return {
      ...declaration,
      root
    };
  }
}
