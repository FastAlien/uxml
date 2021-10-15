import { NOT_FOUND, findFirst, findFirstNotOf, findFirstOf } from "common/StringUtils";

describe("findFirst", () => {
  test("should return NOT_FOUND (-1) if character was not found", () => {
    expect(findFirst("b", "z")).toBe(NOT_FOUND);
    expect(findFirst("bbc", "z")).toBe(NOT_FOUND);
    expect(findFirst("aaaaa", "z")).toBe(NOT_FOUND);
  });

  test("should return position of first found character", () => {
    expect(findFirst("a", "a")).toBe(0);
    expect(findFirst("abc", "a")).toBe(0);
    expect(findFirst("aaaaa", "a")).toBe(0);
    expect(findFirst("ba", "a")).toBe(1);
    expect(findFirst("bac", "a")).toBe(1);
    expect(findFirst("baaaa", "a")).toBe(1);
    expect(findFirst("bbbba", "a")).toBe(4);
  });
});

describe("findFirstOf", () => {
  test("should return NOT_FOUND (-1) if any of specified characters were not found", () => {
    expect(findFirstOf("b", "dz")).toBe(NOT_FOUND);
    expect(findFirstOf("bbc", "dz")).toBe(NOT_FOUND);
    expect(findFirstOf("aaaaa", "dz")).toBe(NOT_FOUND);
  });

  test("should return position of first found character", () => {
    expect(findFirstOf("a", "az")).toBe(0);
    expect(findFirstOf("abc", "az")).toBe(0);
    expect(findFirstOf("aaaaa", "az")).toBe(0);

    expect(findFirstOf("a", "za")).toBe(0);
    expect(findFirstOf("abc", "za")).toBe(0);
    expect(findFirstOf("aaaaa", "za")).toBe(0);

    expect(findFirstOf("ba", "az")).toBe(1);
    expect(findFirstOf("bac", "az")).toBe(1);
    expect(findFirstOf("baaaa", "az")).toBe(1);
    expect(findFirstOf("bbbba", "az")).toBe(4);

    expect(findFirstOf("ba", "za")).toBe(1);
    expect(findFirstOf("bac", "za")).toBe(1);
    expect(findFirstOf("baaaa", "za")).toBe(1);
    expect(findFirstOf("bbbba", "za")).toBe(4);
  });
});

describe("findFirstNotOf", () => {
  test("should return NOT_FOUND (-1) if all specified characters are found", () => {
    expect(findFirstNotOf("b", "b")).toBe(NOT_FOUND);
    expect(findFirstNotOf("bbc", "bc")).toBe(NOT_FOUND);
    expect(findFirstNotOf("abcdeabcde", "abcde")).toBe(NOT_FOUND);
  });

  test("should return position of first found character", () => {
    expect(findFirstNotOf("a", "b")).toBe(0);
    expect(findFirstNotOf("abc", "b")).toBe(0);
    expect(findFirstNotOf("aaaaa", "b")).toBe(0);

    expect(findFirstNotOf("ab", "ac")).toBe(1);
    expect(findFirstNotOf("aba", "ac")).toBe(1);
    expect(findFirstNotOf("aaaab", "ac")).toBe(4);

    expect(findFirstNotOf("abc", "bc")).toBe(0);
    expect(findFirstNotOf("abc", "ab")).toBe(2);
    expect(findFirstNotOf("abcabc", "ab")).toBe(2);
    expect(findFirstNotOf("abcabcx", "abc")).toBe(6);

    expect(findFirstNotOf("xabcabc", "abc")).toBe(0);
    expect(findFirstNotOf("abcxabc", "abc")).toBe(3);
    expect(findFirstNotOf("abcxabcx", "abc")).toBe(3);
    expect(findFirstNotOf("aabbccx", "abc")).toBe(6);
  });
});
