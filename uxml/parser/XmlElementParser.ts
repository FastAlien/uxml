import { NOT_FOUND, StringParser } from "uxml/parser/StringParser";
import { XmlElement, XmlNode } from "uxml/parser/Types";
import { ParseError } from "uxml/parser/ParseError";
import { XmlAttributesParser } from "./XmlAttributesParser";

export class XmlElementParser {
  private attributesParser = new XmlAttributesParser();
  private elements: XmlElement[] = [];

  public parse(data: StringParser): XmlElement {
    this.elements = [];

    while (!data.isEnd()) {
      data.moveToNextNonWhitespaceChar();
      if (!data.match("<")) {
        if (this.elements.length === 0) {
          throw new ParseError("Begin of XML element not found", data.position);
        }
        this.parseTextNode(data);
        continue;
      }

      const next = data.getNext();
      if (next === "!") {
        this.skipComment(data);
      } else if (next === "/") {
        this.parseClosingTag(data);
        const element = this.elements.pop();
        if (!element) {
          throw new Error("Unable to pop element from stack");
        }
        if (this.elements.length === 0) {
          return element;
        }
        this.addChildToLastElement(element);
      } else {
        data.advance();
        const element: XmlElement = {
          tagName: this.parseTagName(data),
          attributes: this.attributesParser.parse(data)
        };

        if (data.match(">")) {
          data.advance();
          this.elements.push(element);
        } else if (data.match("/>")) {
          data.moveBy(2);
          if (this.elements.length === 0) {
            return element;
          }
          this.addChildToLastElement(element);
        } else {
          throw new ParseError("XML element closing not found", data.position);
        }
      }
    }

    throw new ParseError("XML element not found", data.position);
  }

  private addChildToLastElement(child: XmlNode) {
    const lastElement = this.elements[this.elements.length - 1];
    if (!lastElement.children) {
      lastElement.children = [child];
    } else {
      lastElement.children.push(child);
    }
  }

  private parseTagName(data: StringParser): string {
    const endOfTagName = data.findFirstWhitespaceOrTagClosing();
    if (endOfTagName === NOT_FOUND) {
      throw new ParseError("End of XML element tag name not found", data.position);
    }

    const tagName = data.substring(endOfTagName);
    if (!tagName) {
      throw new ParseError("Tag name expected", data.position);
    }

    data.moveTo(endOfTagName);
    return tagName;
  }

  private parseTextNode(data: StringParser): void {
    const nextTagMark = data.findFirst("<");
    if (nextTagMark === NOT_FOUND) {
      throw new ParseError("Incomplete text node", data.position);
    }
    const text = data.extractText(nextTagMark);
    this.addChildToLastElement(text);
    data.moveTo(nextTagMark);
  }

  private parseClosingTag(data: StringParser): void {
    const begin = data.position;
    data.moveBy(2);
    data.moveToNextNonWhitespaceChar();
    const end = data.findFirst(">");
    if (end === NOT_FOUND) {
      throw new ParseError("Incomplete closing tag", begin);
    }
    data.moveTo(end + 1);
  }

  private skipComment(data: StringParser) {
    const begin = data.position;
    data.moveBy(2);
    if (!data.match("--")) {
      throw new ParseError("Invalid comment opening", begin);
    }
    data.moveBy(2);

    const end = data.findFirst("-->");
    if (end === NOT_FOUND) {
      throw new ParseError("Unclosed comment", begin);
    }
    data.moveTo(end + 3);
  }
}
