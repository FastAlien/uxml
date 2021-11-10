import { ParseError } from "./ParseError";
import { StringParser } from "./StringParser";
import { XmlElement } from "./Types";
import { XmlElementParser } from "./XmlElementParser";

it("should parse XML element without attributes and children", () => {
  const parser = new XmlElementParser();
  const expected: XmlElement = {
    tagName: "Person",
    attributes: {},
    children: []
  };

  expect(parser.parse(new StringParser("<Person/>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<Person />")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<Person\n/>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<Person></Person>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<Person>\n</Person>")))
    .toEqual(expected);
});

it("should parse XML element with one attribute and no children", () => {
  const parser = new XmlElementParser();
  const expected: XmlElement = {
    tagName: "Person",
    attributes: { firstName: "John" },
    children: []
  };

  expect(parser.parse(new StringParser("<Person firstName=\"John\"/>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<Person firstName=\"John\" />")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<Person\n  firstName=\"John\"\n/>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<Person\n  firstName=\"John\"\n></Person>")))
    .toEqual(expected);
});

it("should parse XML element with attributes and no children", () => {
  const parser = new XmlElementParser();
  const expected: XmlElement = {
    tagName: "Person",
    attributes: {
      firstName: "John",
      lastName: "Smith Johnson",
      phoneNumber: "00 123 456 789"
    },
    children: []
  };

  expect(parser.parse(new StringParser("<Person firstName=\"John\" lastName=\"Smith Johnson\" phoneNumber=\"00 123 456 789\"/>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<Person\n  firstName=\"John\"\n  lastName=\"Smith Johnson\"\n  phoneNumber=\"00 123 456 789\"/>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<Person firstName=\"John\" lastName=\"Smith Johnson\" phoneNumber=\"00 123 456 789\"></Person>")))
    .toEqual(expected);
});

it("should parse XML element with one child and no attributes", () => {
  const parser = new XmlElementParser();
  const expected: XmlElement = {
    tagName: "People",
    attributes: {},
    children: [
      { tagName: "Person", attributes: {}, children: [] }
    ]
  };

  expect(parser.parse(new StringParser("<People><Person/></People>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<People><Person></Person></People>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<People>\n  <Person/>\n</People>")))
    .toEqual(expected);
});

it("should parse XML element with children and no attributes", () => {
  const parser = new XmlElementParser();
  const expected: XmlElement = {
    tagName: "People",
    attributes: {},
    children: [
      { tagName: "FirstChild", attributes: {}, children: [] },
      { tagName: "SecondChild", attributes: {}, children: [] },
      { tagName: "ThirdChild", attributes: {}, children: [] }
    ]
  };

  expect(parser.parse(new StringParser("<People><FirstChild/><SecondChild/><ThirdChild/></People>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<People><FirstChild></FirstChild><SecondChild></SecondChild><ThirdChild/></People>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<People>\n  <FirstChild/>\n  <SecondChild/>\n  <ThirdChild/>\n</People>")))
    .toEqual(expected);
});

it("should parse XML element with nested children and no attributes", () => {
  const parser = new XmlElementParser();
  const expected: XmlElement = {
    tagName: "Root",
    attributes: {},
    children: [
      {
        tagName: "FirstLevel",
        attributes: {},
        children: [
          {
            tagName: "SecondLevel",
            attributes: {},
            children: [
              { tagName: "ThirdLevel", attributes: {}, children: [] }
            ]
          }
        ]
      },
      { tagName: "SecondChild", attributes: {}, children: [] },
      { tagName: "ThirdChild", attributes: {},children: [] }
    ]
  };

  expect(parser.parse(new StringParser("<Root><FirstLevel><SecondLevel><ThirdLevel/></SecondLevel></FirstLevel><SecondChild/><ThirdChild/></Root>")))
    .toEqual(expected);
});

it("should parse XML element with one text node child", () => {
  const parser = new XmlElementParser();
  const expected: XmlElement = {
    tagName: "Person",
    attributes: {},
    children: [
      {
        tagName: "Name",
        attributes: {},
        children: [
          "John Smith Johnson"
        ]
      }
    ]
  };

  expect(parser.parse(new StringParser("<Person><Name>John Smith Johnson</Name></Person>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<Person>\n  <Name>John Smith Johnson</Name>\n</Person>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<Person>\n  <Name>\n  \tJohn Smith Johnson\n  \n\t\n</Name>\n</Person>")))
    .toEqual(expected);
});

it("should parse XML element with comments", () => {
  const parser = new XmlElementParser();
  const expected: XmlElement = {
    tagName: "Person",
    attributes: {},
    children: [
      {
        tagName: "Name",
        attributes: {},
        children: [
          "John Smith Johnson"
        ]
      }
    ]
  };

  expect(parser.parse(new StringParser("<!-- Comment line --><Person><Name>John Smith Johnson</Name></Person>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<!-- Comment line -->\n<Person><!-- Comment line -->\n  <Name>John Smith Johnson</Name>\n</Person>")))
    .toEqual(expected);
  expect(parser.parse(new StringParser("<!--\nComment\nline\n-->\n<Person><!--\nComment\nline\n-->\n  <Name>John Smith Johnson</Name>\n</Person>")))
    .toEqual(expected);
});

it("should parse XML element with one text node child containing CDATA section", () => {
  const parser = new XmlElementParser();
  const text = "\n<Person>\n\tJohn Smith Johnson\n</Person>\n";
  const expected: XmlElement = {
    tagName: "Person",
    attributes: {},
    children: [
      {
        tagName: "Name",
        attributes: {},
        children: [
          text
        ]
      }
    ]
  };

  expect(parser.parse(new StringParser(`<Person><Name><![CDATA[${text}]]></Name></Person>`)))
    .toEqual(expected);
  expect(parser.parse(new StringParser(`<Person><Name><![cdata[${text}]]></Name></Person>`)))
    .toEqual(expected);
  expect(parser.parse(new StringParser(`<Person><Name><![CData[${text}]]></Name></Person>`)))
    .toEqual(expected);
});

it("should throw ParseError if closing tag doesn't have matching begin tag", () => {
  const parser = new XmlElementParser();
  expect(() => parser.parse(new StringParser("</Person>")))
    .toThrow(ParseError);
  expect(() => parser.parse(new StringParser("<Person></Name></Person>")))
    .toThrow(ParseError);
});
