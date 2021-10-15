import { NOT_FOUND, StringParser } from "uxml/parser/StringParser";

describe("findFirst", () => {
  test("should return NOT_FOUND (-1) if character was not found", () => {
    expect(new StringParser("b").findFirst("z")).toBe(NOT_FOUND);
    expect(new StringParser("bbc").findFirst("z")).toBe(NOT_FOUND);
    expect(new StringParser("aaaaa").findFirst("z")).toBe(NOT_FOUND);
  });

  test("should return position of first found character", () => {
    expect(new StringParser("a").findFirst("a")).toBe(0);
    expect(new StringParser("abc").findFirst("a")).toBe(0);
    expect(new StringParser("aaaaa").findFirst("a")).toBe(0);
    expect(new StringParser("ba").findFirst("a")).toBe(1);
    expect(new StringParser("bac").findFirst("a")).toBe(1);
    expect(new StringParser("baaaa").findFirst("a")).toBe(1);
    expect(new StringParser("bbbba").findFirst("a")).toBe(4);
  });
});
