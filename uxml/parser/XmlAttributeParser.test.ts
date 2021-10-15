import { ParseError } from "uxml/parser/ParseError";
import { StringParser } from "uxml/parser/StringParser";
import { XmlAttribute } from "uxml/parser/Types";
import { XmlAttributeParser } from "uxml/parser/XmlAttributeParser";

test("should parse valid attribute without whitespace characters", () => {
  const parser = new XmlAttributeParser();
  const expected: XmlAttribute = {
    name: "encoding",
    value: "utf-8"
  };

  expect(parser.parse(new StringParser("encoding=\"utf-8\"")))
    .toStrictEqual(expected);
  expect(parser.parse(new StringParser("encoding='utf-8'")))
    .toStrictEqual(expected);
});

test("should parse valid attribute with whitespace characters", () => {
  const parser = new XmlAttributeParser();
  const expected: XmlAttribute = {
    name: "encoding",
    value: "utf-8"
  };

  expect(parser.parse(new StringParser(" \t\n\rencoding=\"utf-8\"\n\r\t ")))
    .toStrictEqual(expected);
  expect(parser.parse(new StringParser(" \t\n\rencoding='utf-8'\n\r\t ")))
    .toStrictEqual(expected);
});

test("should parse valid attribute with whitespace characters in value", () => {
  const parser = new XmlAttributeParser();
  const expected: XmlAttribute = {
    name: "encodings",
    value: "[ utf-8, utf-16 ]"
  };

  expect(parser.parse(new StringParser("encodings=\"[ utf-8, utf-16 ]\"")))
    .toStrictEqual(expected);
  expect(parser.parse(new StringParser("encodings='[ utf-8, utf-16 ]'")))
    .toStrictEqual(expected);
});

test("should parse valid attribute with long value", () => {
  const parser = new XmlAttributeParser();
  const expected: XmlAttribute = {
    name: "message",
    value: "A long message with whitespace characters and exclamation mark!"
  };

  expect(parser.parse(new StringParser(`${expected.name}="${expected.value}"`)))
    .toStrictEqual(expected);
});

test("should parse valid attribute with quotation mark in value", () => {
  const parser = new XmlAttributeParser();
  expect(parser.parse(new StringParser("encodings=\"'utf-8'\"")))
    .toStrictEqual({
      name: "encodings",
      value: "'utf-8'"
    });
  expect(parser.parse(new StringParser("encodings='\"utf-8\"'")))
    .toStrictEqual({
      name: "encodings",
      value: "\"utf-8\""
    });
});

test("should throw error if attribute value has missing quotation marks", () => {
  const parser = new XmlAttributeParser();

  expect(() => parser.parse(new StringParser("encoding=utf-8")))
    .toThrow(ParseError);

  expect(() => parser.parse(new StringParser("encoding=\"utf-8")))
    .toThrow(ParseError);
  expect(() => parser.parse(new StringParser("encoding=\"utf-8'")))
    .toThrow(ParseError);

  expect(() => parser.parse(new StringParser("encoding='utf-8")))
    .toThrow(ParseError);
  expect(() => parser.parse(new StringParser("encoding='utf-8\"")))
    .toThrow(ParseError);

  expect(() => parser.parse(new StringParser("encoding=utf-8\"")))
    .toThrow(ParseError);
  expect(() => parser.parse(new StringParser("encoding=utf-8'")))
    .toThrow(ParseError);
});

test("should throw error if attribute doesn't have a value", () => {
  const parser = new XmlAttributeParser();
  expect(() => parser.parse(new StringParser("encoding")))
    .toThrow(ParseError);

  expect(() => parser.parse(new StringParser("  encoding  ")))
    .toThrow(ParseError);

  expect(() => parser.parse(new StringParser("encoding encoding=\"utf-8\"")))
    .toThrow(ParseError);
});
