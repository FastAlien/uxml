import { StringParser } from "uxml/parser/StringParser";
import { XmlDeclaration } from "uxml/parser/Types";
import { XmlDeclarationParser } from "uxml/parser/XmlDeclarationParser";

it("should parse XML with version only", () => {
  const parser = new XmlDeclarationParser();
  expect(parser.parse(new StringParser("<?xml version=\"1.0\"?>")))
    .toEqual<XmlDeclaration>({
      version: "1.0"
    });

  expect(parser.parse(new StringParser("<?xml version=\"1.1\"?>")))
    .toEqual<XmlDeclaration>({
      version: "1.1"
    });
});

it("should parse XML with version and encoding", () => {
  const parser = new XmlDeclarationParser();
  expect(parser.parse(new StringParser("<?xml version=\"1.1\" encoding=\"utf-8\"?>")))
    .toEqual<XmlDeclaration>({
      version: "1.1",
      encoding: "utf-8"
    });
});

it("should parse XML with version, encoding and standalone", () => {
  const parser = new XmlDeclarationParser();
  expect(parser.parse(new StringParser("<?xml version=\"1.1\" encoding=\"utf-8\" standalone=\"yes\"?>")))
    .toEqual<XmlDeclaration>({
      version: "1.1",
      encoding: "utf-8",
      standalone: "yes"
    });
});
