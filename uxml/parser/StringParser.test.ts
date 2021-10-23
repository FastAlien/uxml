import { NOT_FOUND, StringParser } from "uxml/parser/StringParser";

describe("moveTo", () => {
  it("should change position if value is >= 0 and <= string length", () => {
    const parser = new StringParser("test");
    parser.moveTo(0);
    expect(parser.position).toBe(0);
    parser.moveTo(4);
    expect(parser.position).toBe(4);
    parser.moveTo(2);
    expect(parser.position).toBe(2);
    parser.moveTo(3);
    expect(parser.position).toBe(3);
    parser.moveTo(0);
    expect(parser.position).toBe(0);
  });

  it("should change position to 0 if value is < 0", () => {
    const parser = new StringParser("test");
    parser.moveTo(-1);
    expect(parser.position).toBe(0);
    parser.moveTo(-100);
    expect(parser.position).toBe(0);
    parser.moveTo(-Number.MAX_SAFE_INTEGER);
    expect(parser.position).toBe(0);
  });

  it("should change position to string length if value is > string length", () => {
    const parser = new StringParser("test");
    parser.moveTo(5);
    expect(parser.position).toBe(4);
    parser.moveTo(100);
    expect(parser.position).toBe(4);
    parser.moveTo(Number.MAX_SAFE_INTEGER);
    expect(parser.position).toBe(4);
  });
});

describe("isEnd", () => {
  it("should return false if position is less than string length", () => {
    const parser = new StringParser("test");
    expect(parser.isEnd()).toBeFalsy();
    parser.moveTo(1);
    expect(parser.isEnd()).toBeFalsy();
    parser.moveTo(3);
    expect(parser.isEnd()).toBeFalsy();
  });

  it("should return true if position is equal to string length", () => {
    const parser = new StringParser("test");
    parser.moveTo(4);
    expect(parser.isEnd()).toBeTruthy();
  });
});

describe("findFirst", () => {
  it("should return NOT_FOUND (-1) if character was not found", () => {
    expect(new StringParser("b").findFirst("z")).toBe(NOT_FOUND);
    expect(new StringParser("bbc").findFirst("z")).toBe(NOT_FOUND);
    expect(new StringParser("aaaaa").findFirst("z")).toBe(NOT_FOUND);
  });

  it("should return position of first found character", () => {
    expect(new StringParser("a").findFirst("a")).toBe(0);
    expect(new StringParser("abc").findFirst("a")).toBe(0);
    expect(new StringParser("aaaaa").findFirst("a")).toBe(0);
    expect(new StringParser("ba").findFirst("a")).toBe(1);
    expect(new StringParser("bac").findFirst("a")).toBe(1);
    expect(new StringParser("baaaa").findFirst("a")).toBe(1);
    expect(new StringParser("bbbba").findFirst("a")).toBe(4);
  });
});
