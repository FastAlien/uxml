const minWhitespaceCharCode = 32;

export function isWhitespaceCharCode(charCode: number): boolean {
  return charCode <= minWhitespaceCharCode;
}
