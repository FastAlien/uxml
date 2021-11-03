import { isWhitespaceCharCode } from "./StringUtils";

describe("isWhitespaceCharCode", () => {
  it("should return true if char code is whitespace", () => {
    const whitespaces = " \t\n\r";
    for (let i = 0; i < whitespaces.length; i++) {
      const charCode = whitespaces.charCodeAt(i);
      expect(isWhitespaceCharCode(charCode)).toBeTruthy();
    }
  });

  it("should return false if char code is not a whitespace", () => {
    // Whitespace characters have codes < 33.
    // 127 is "Delete" and we can assume it won't occur in XML file.
    for (let i = 33; i < 126; i++) {
      expect(isWhitespaceCharCode(i)).toBeFalsy();
    }
  });
});
