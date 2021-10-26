import { ParseError } from "./ParseError";
import { StringParser } from "./StringParser";
import { XmlCDATASectionParser } from "./XmlCDATASectionParser";

describe("should throw ParseError if CDATA section is not closed properly", () => {
  const parser = new XmlCDATASectionParser();
  it.each([
    "",
    "test<",
    "test<",
    "test]<",
    "test]><",
    "test]] ><",
    "test] ]><",
    "test] ] ><"
  ])("Value: \"%s\"", value => {
    expect(() => parser.parse(new StringParser(value))).toThrow(ParseError);
  });
});

describe("should throw ParseError if text node is not closed properly", () => {
  const parser = new XmlCDATASectionParser();
  it.each([
    "]]>",
    "test]]>",
    "test]]> \t\n\r"
  ])("Value: \"%s\"", value => {
    expect(() => parser.parse(new StringParser(value))).toThrow(ParseError);
  });
});

it("should return empty string for empty CDATA section", () => {
  const parser = new XmlCDATASectionParser();
  expect(parser.parse(new StringParser("]]><"))).toEqual("");
});

describe("should not trim white space characters", () => {
  const parser = new XmlCDATASectionParser();
  it.each([
    " ",
    "    ",
    " \t\n\r",
    "  test ",
    " Very long test message ",
    " \t\n\rnVery\nlong\rtest message\t\n\r "
  ])("Value: \"%s\"", value => {
    expect(parser.parse(new StringParser(`${value}]]><`))).toEqual(value);
  });

});

describe("should return contents of CDATA section if it's formatted properly", () => {
  const parser = new XmlCDATASectionParser();
  it.each([
    "test",
    "<Person>",
    "<Name>John Smith</Name>",
    "\n\r<Person>\n\r\t<Name>John Smith</Name>\n\r</Person>\n\r"
  ])("Value: \"%s\"", value => {
    expect(parser.parse(new StringParser(`${value}]]><`))).toEqual(value);
  });
});
