export const NOT_FOUND = -1;

export function findFirst(input: string, search: string, beginIndex = 0): number {
  for (let i = beginIndex; i < input.length; i++) {
    if (input.charAt(i) === search) {
      return i;
    }
  }
  return NOT_FOUND;
}

export function findFirstOf(input: string, search: string, beginIndex = 0): number {
  for (let i = beginIndex; i < input.length; i++) {
    const char = input.charAt(i);
    for (let j = 0; j < search.length; j++) {
      if (char === search.charAt(j)) {
        return i;
      }
    }
  }
  return NOT_FOUND;
}

export function findFirstNotOf(input: string, search: string, beginIndex = 0): number {
  for (let i = beginIndex; i < input.length; i++) {
    const char = input.charAt(i);
    for (let j = 0; j < search.length; j++) {
      if (char === search.charAt(j)) {
        break;
      }
      if (j === search.length - 1) {
        return i;
      }
    }
  }
  return NOT_FOUND;
}
