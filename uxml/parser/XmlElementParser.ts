import { NOT_FOUND, StringParser } from "uxml/parser/StringParser";
import { XmlElement, XmlNode } from "uxml/parser/Types";
import { ParseError } from "uxml/parser/ParseError";
import { XmlAttributesParser } from "./XmlAttributesParser";
import { XmlTextNodeParser } from "./XmlTextNodeParser";

export class XmlElementParser {
  private static readonly commentStart = "<!--";
  private static readonly commentEnd = "-->";
  private attributesParser = new XmlAttributesParser();
  private textNodeParser = new XmlTextNodeParser();
  private elements: XmlElement[] = [];

  public parse(data: StringParser): XmlElement {
    this.elements = [];
    data.moveToNextNonWhitespaceChar();

    while (!data.isEnd()) {
      if (data.getCurrent() === "<") {
        switch (data.getNext()) {
          case "!":
            this.parseCommentOrCDataSection(data);
            break;
          case "/":
            this.parseClosingTag(data);
            break;
          default:
            this.parseTag(data);
        }
        data.moveToNextNonWhitespaceChar();
      } else {
        this.parseTextNode(data);
      }
    }

    const element = this.elements.pop();
    if (!element) {
      throw new ParseError("XML element not found", data.position);
    }

    return element;
  }

  private parseTextNode(data: StringParser): void {
    if (this.elements.length === 0) {
      throw new ParseError("Begin of XML element not found", data.position);
    }
    const text = this.textNodeParser.parse(data);
    this.addChildToLastElement(text);
  }

  private addElement(element: XmlElement): void {
    if (this.elements.length === 0) {
      this.elements.push(element);
    } else {
      this.addChildToLastElement(element);
    }
  }

  private addChildToLastElement(child: XmlNode): void {
    const lastElement = this.elements[this.elements.length - 1];
    if (!lastElement.children) {
      lastElement.children = [child];
    } else {
      lastElement.children.push(child);
    }
  }

  private parseTag(data: StringParser): void {
    data.advance();
    const element: XmlElement = {
      tagName: this.parseTagName(data),
      attributes: this.attributesParser.parse(data)
    };

    if (data.getCurrent() === ">") {
      data.advance();
      this.elements.push(element);
    } else if (data.match("/>")) {
      data.moveBy(2);
      this.addElement(element);
    } else {
      throw new ParseError("XML element closing not found", data.position);
    }
  }

  private parseTagName(data: StringParser): string {
    const tagNameEnd = data.findFirstWhitespaceOrTagClosing();
    if (tagNameEnd === NOT_FOUND) {
      throw new ParseError("End of XML element tag name not found", data.position);
    }

    const tagName = data.substring(tagNameEnd);
    if (!tagName) {
      throw new ParseError("Tag name expected", data.position);
    }

    data.moveTo(tagNameEnd);
    return tagName;
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
    const element = this.elements.pop();
    if (!element) {
      throw new Error("Unable to pop element from stack");
    }
    this.addElement(element);
  }

  private parseCommentOrCDataSection(data: StringParser) {
    if (data.match(XmlElementParser.commentStart)) {
      this.skipComment(data);
    } else {
      this.parseTextNode(data);
    }
  }

  private skipComment(data: StringParser) {
    const begin = data.position;
    data.moveBy(XmlElementParser.commentStart.length);
    const end = data.findFirst(XmlElementParser.commentEnd);
    if (end === NOT_FOUND) {
      throw new ParseError("Unclosed comment", begin);
    }
    data.moveTo(end + XmlElementParser.commentEnd.length);
  }
}
