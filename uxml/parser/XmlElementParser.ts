import { NOT_FOUND, StringParser } from "uxml/parser/StringParser";
import { XmlAttributes, XmlElement, XmlNode } from "uxml/parser/Types";
import { ParseError } from "uxml/parser/ParseError";
import { XmlAttributeParser } from "uxml/parser/XmlAttributeParser";

export class XmlElementParser {
  private attributeParser = new XmlAttributeParser();

  public parse(data: StringParser): XmlElement {
    const elements: XmlElement[] = [];

    while (!data.isEnd()) {
      data.moveToNextNonWhitespaceChar();
      if (!data.match("<")) {
        if (elements.length === 0) {
          throw new ParseError("Begin of XML element not found", data.position);
        }
        const text = this.parseTextNode(data);
        const lastElement = elements[elements.length - 1];
        if (!lastElement.children) {
          lastElement.children = [text];
        } else {
          lastElement.children.push(text);
        }
      }

      const next = data.getNext();
      if (next === "!") {
        this.skipComment(data);
      } else if (next === "/") {
        this.expectClosingTag(data);
        if (elements.length === 1) {
          return elements[0];
        }
        const element = elements.pop();
        if (!element) {
          throw new Error("Unable to pop element from stack");
        }
        const lastElement = elements[elements.length - 1];
        if (!lastElement.children) {
          lastElement.children = [element];
        } else {
          lastElement.children.push(element);
        }
      } else {
        data.advance();
        const element = {
          tagName: this.parseTagName(data),
          attributes: this.parseAttributes(data)
        };

        if (data.match(">")) {
          data.advance();
          elements.push(element);
        } else if (data.match("/>")) {
          data.moveBy(2);
          if (elements.length === 0) {
            return element;
          }
          const lastElement = elements[elements.length - 1];
          if (!lastElement.children) {
            lastElement.children = [element];
          } else {
            lastElement.children.push(element);
          }
        } else {
          throw new ParseError("XML element closing not found", data.position);
        }
      }
    }

    throw new ParseError("XML element not found", data.position);
  }

  private parseTag(data: StringParser): XmlElement {
    data.advance();
    const tagName = this.parseTagName(data);
    const attributes = this.parseAttributes(data);
    let children: XmlNode[] | undefined;

    if (data.match(">")) {
      data.advance();
      children = this.parseChildren(data);
      this.expectClosingTag(data);
    } else if (data.match("/>")) {
      data.moveBy(2);
    } else {
      throw new ParseError("XML element closing not found", data.position);
    }

    return {
      tagName,
      attributes,
      children
    };
  }

  private parseTagName(data: StringParser): string {
    const endOfTagName = data.findFirstOf(" \n\r\t/>");
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

  private parseAttributes(data: StringParser): XmlAttributes | undefined {
    data.moveToNextNonWhitespaceChar();
    let attributes: XmlAttributes | undefined;

    while (!data.isEnd() && data.isCurrentNotOneOf("/>")) {
      const { name, value } = this.attributeParser.parse(data);
      if (!attributes) {
        attributes = {
          [name]: value
        };
      } else {
        attributes[name] = value;
      }
      data.moveToNextNonWhitespaceChar();
    }

    return attributes;
  }

  private parseChildren(data: StringParser): XmlNode[] | undefined {
    data.moveToNextNonWhitespaceChar();
    let children: XmlNode[] | undefined;

    while (!data.isEnd() && !data.match("</")) {
      const child = this.parseNode(data);
      if (!children) {
        children = [child];
      } else {
        children.push(child);
      }
      data.moveToNextNonWhitespaceChar();
    }

    return children;
  }

  private parseNode(data: StringParser): XmlNode {
    if (data.match("<")) {
      return this.parse(data);
    }
    return this.parseTextNode(data);
  }

  private parseTextNode(data: StringParser): string {
    const nextTagMark = data.findFirst("<");
    if (nextTagMark === NOT_FOUND) {
      throw new ParseError("Incomplete text node", data.position);
    }
    const text = this.extractText(data, nextTagMark);
    data.moveTo(nextTagMark);
    return text;
  }

  private extractText(data: StringParser, end: number): string {
    let endOfText: number;
    for (endOfText = end - 1; endOfText > data.position; endOfText--) {
      if (!data.isWhitespaceAt(endOfText)) {
        break;
      }
    }
    return data.substring(endOfText + 1);
  }

  private expectClosingTag(data: StringParser): void {
    if (!data.match("</")) {
      throw new ParseError("Closing tag expected", data.position);
    }

    data.moveBy(2);
    data.moveToNextNonWhitespaceChar();

    const endOfClosingTag = data.findFirst(">");
    if (endOfClosingTag === NOT_FOUND) {
      throw new ParseError("Incomplete closing tag", data.position);
    }

    data.moveTo(endOfClosingTag + 1);
  }

  private skipComment(data: StringParser) {
    if (!data.match("<!--")) {
      throw new ParseError("Invalid comment opening", data.position);
    }
    const beginOfComment = data.position;
    data.moveBy(4);

    while (!data.isEnd()) {
      const nextMinus = data.findFirst("-");
      data.moveTo(nextMinus);
      if (data.match("-->")) {
        data.moveBy(3);
        return;
      }
    }

    throw new ParseError("Unclosed comment", beginOfComment);
  }
}
