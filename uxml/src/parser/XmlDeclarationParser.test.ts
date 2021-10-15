import { StringParser } from "parser/StringParser";
import { XmlDeclaration } from "parser/Types";
import { XmlDeclarationParser } from "parser/XmlDeclarationParser";

test("should parse XML with version only", () => {
  const parser = new XmlDeclarationParser();
  const expected: XmlDeclaration = {
    version: "1.0"
  };
  expect(parser.parse(new StringParser("<?xml version=\"1.0\"?>")))
    .toEqual(expected);
});

test("should parse XML with version and encoding", () => {
  const parser = new XmlDeclarationParser();
  const expected: XmlDeclaration = {
    version: "1.0",
    encoding: "utf-8"
  };
  expect(parser.parse(new StringParser("<?xml version=\"1.0\" encoding=\"utf-8\"?>")))
    .toEqual(expected);
});

test("should parse XML with version, encoding and standalone", () => {
  const parser = new XmlDeclarationParser();
  const expected: XmlDeclaration = {
    version: "1.0",
    encoding: "utf-8",
    standalone: "yes"
  };
  expect(parser.parse(new StringParser("<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>")))
    .toEqual(expected);
});