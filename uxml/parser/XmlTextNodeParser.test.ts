import {ParseError} from "./ParseError";
import {StringParser} from "./StringParser";
import {XmlTextNodeParser} from "./XmlTextNodeParser";

it("should throw ParseError if text node is not closed", () => {
  const parser = new XmlTextNodeParser();
  expect(() => parser.parse(new StringParser(""))).toThrow(ParseError);
  expect(() => parser.parse(new StringParser("test"))).toThrow(ParseError);
  expect(() => parser.parse(new StringParser("Very\tlong\ntest\rmessage "))).toThrow(ParseError);
});

it("should return empty string for empty text node", () => {
  const parser = new XmlTextNodeParser();
  expect(parser.parse(new StringParser("<"))).toEqual("");
});

it("should return empty string if node contains only white space characters", () => {
  const parser = new XmlTextNodeParser();
  expect(parser.parse(new StringParser(" <"))).toEqual("");
  expect(parser.parse(new StringParser("    <"))).toEqual("");
  expect(parser.parse(new StringParser(" \t\n\r<"))).toEqual("");
});

it("should trim white space characters from end of text node", () => {
  const parser = new XmlTextNodeParser();
  expect(parser.parse(new StringParser("test <"))).toEqual("test");
  expect(parser.parse(new StringParser("Very long test message <"))).toEqual("Very long test message");
});

it("should return string if text node is formatted properly", () => {
  const parser = new XmlTextNodeParser();
  expect(parser.parse(new StringParser("test<"))).toEqual("test");
  expect(parser.parse(new StringParser("Very long test message<"))).toEqual("Very long test message");
  expect(parser.parse(new StringParser("Very\tlong\ntest\rmessage\n123<"))).toEqual("Very\tlong\ntest\rmessage\n123");
});
