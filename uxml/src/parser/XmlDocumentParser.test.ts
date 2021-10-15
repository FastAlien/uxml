import { XmlDeclaration, XmlDocument } from "parser/Types";
import { XmlDocumentParser } from "parser/XmlDocumentParser";

const xmlDecl = "<?xml version=\"1.0\"?>\n";
const xmlDeclaration: XmlDeclaration = {
  version: "1.0"
};

test("should parse XML with root tag only", () => {
  const parser = new XmlDocumentParser();
  const expected: XmlDocument = {
    ...xmlDeclaration,
    root: {
      tagName: "root"
    }
  };
  expect(parser.parse(`${xmlDecl}<root/>`))
    .toEqual(expected);
  expect(parser.parse(`${xmlDecl}<root></root>`))
    .toEqual(expected);
});

test("should parse XML with root tag only", () => {
  const parser = new XmlDocumentParser();
  const expected: XmlDocument = {
    ...xmlDeclaration,
    root: {
      tagName: "root"
    }
  };
  expect(parser.parse(`${xmlDecl}<root/>`))
    .toEqual(expected);
  expect(parser.parse(`${xmlDecl}<root></root>`))
    .toEqual(expected);
});
