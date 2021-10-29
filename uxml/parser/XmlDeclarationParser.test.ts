import { ParseError } from "./ParseError";
import { StringParser } from "uxml/parser/StringParser";
import { XmlDeclaration } from "uxml/parser/Types";
import { XmlDeclarationParser } from "uxml/parser/XmlDeclarationParser";

const defaultXmlDeclaration: XmlDeclaration = {
  version: "1.0"
};

it("should return version 1.0 if XML doesn't contain declaration", () => {
  const parser = new XmlDeclarationParser();
  expect(parser.parse(new StringParser("")))
    .toEqual<XmlDeclaration>(defaultXmlDeclaration);
});

it("should throw ParseError if XML declaration doesn't have version attribute", () => {
  const parser = new XmlDeclarationParser();
  expect(() => parser.parse(new StringParser("<?xml?>")))
    .toThrow(ParseError);
  expect(() => parser.parse(new StringParser("<?xml ?>")))
    .toThrow(ParseError);
});

it("should throw ParseError if XML declaration is not ended properly", () => {
  const parser = new XmlDeclarationParser();
  expect(() => parser.parse(new StringParser("<?xml")))
    .toThrow(ParseError);
  expect(() => parser.parse(new StringParser("<?xml version=\"1.0\"")))
    .toThrow(ParseError);
  expect(() => parser.parse(new StringParser("<?xml version=\"1.0\"?")))
    .toThrow(ParseError);
  expect(() => parser.parse(new StringParser("<?xml version=\"1.0\">")))
    .toThrow(ParseError);
  expect(() => parser.parse(new StringParser("<?xml version=\"1.0\"/>")))
    .toThrow(ParseError);
});

it("should parse XML declaration with version only", () => {
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

it("should parse XML declaration with version and encoding", () => {
  const parser = new XmlDeclarationParser();
  expect(parser.parse(new StringParser("<?xml version=\"1.1\" encoding=\"utf-8\"?>")))
    .toEqual<XmlDeclaration>({
      version: "1.1",
      encoding: "utf-8"
    });
});

it("should parse XML declaration with version, encoding and standalone", () => {
  const parser = new XmlDeclarationParser();
  expect(parser.parse(new StringParser("<?xml version=\"1.1\" encoding=\"utf-8\" standalone=\"yes\"?>")))
    .toEqual<XmlDeclaration>({
      version: "1.1",
      encoding: "utf-8",
      standalone: "yes"
    });
});
