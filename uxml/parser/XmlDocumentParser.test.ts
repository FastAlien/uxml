import { XmlDeclaration, XmlDocument } from "uxml/parser/Types";
import { XmlDocumentParser } from "uxml/parser/XmlDocumentParser";

const xmlDecl = "<?xml version=\"1.0\"?>\n";
const xmlDeclaration: XmlDeclaration = {
  version: "1.0"
};
const xmlDocumentWithRootOnly: XmlDocument = {
  ...xmlDeclaration,
  root: {
    tagName: "root"
  }
};

it("should parse XML without declaration", () => {
  const parser = new XmlDocumentParser();
  expect(parser.parse("<root/>"))
    .toEqual(xmlDocumentWithRootOnly);
});

it("should parse XML with declaration", () => {
  const parser = new XmlDocumentParser();
  expect(parser.parse(`${xmlDecl}<root/>`))
    .toEqual(xmlDocumentWithRootOnly);
});

it("should parse XML with root tag only", () => {
  const parser = new XmlDocumentParser();
  expect(parser.parse("<root/>"))
    .toEqual(xmlDocumentWithRootOnly);
  expect(parser.parse("<root></root>"))
    .toEqual(xmlDocumentWithRootOnly);
});
