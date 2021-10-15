import { NOT_FOUND, StringParser } from "parser/StringParser";
import { XmlAttributes, XmlElement, XmlNode } from "parser/Types";
import { ParseError } from "parser/ParseError";
import { XmlAttributeParser } from "parser/XmlAttributeParser";

export class XmlElementParser {
  private attributeParser = new XmlAttributeParser();

  public parse(data: StringParser): XmlElement {
    data.moveToNextNonWhitespaceChar();
    if (!data.match("<")) {
      throw new ParseError("Begin of XML element not found", data.position);
    }

    const tagName = this.parseTagName(data);
    const attributes = this.parseAttributes(data);
    let children: XmlNode[] | undefined;

    if (data.match(">")) {
      data.advance();
      children = this.parseChildren(data);
      this.expectClosingTag(data, tagName);
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

    data.advance();
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

    while (!data.isEnd() && data.getCurrent() !== "/" && data.getCurrent() !== ">") {
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

  private expectClosingTag(data: StringParser, tagName: string): void {
    if (!data.match("</")) {
      throw new ParseError("Closing tag expected", data.position);
    }

    data.moveBy(2);
    data.moveToNextNonWhitespaceChar();

    const endOfClosingTag = data.findFirstOf(" \t\r\n>");
    if (endOfClosingTag === NOT_FOUND) {
      throw new ParseError("Incomplete closing tag", data.position);
    }

    const closingTagName = data.substring(endOfClosingTag);
    if (closingTagName !== tagName) {
      throw new ParseError(`Expected closing tag for ${tagName}`, data.position);
    }

    data.moveTo(endOfClosingTag);
    data.moveToNextNonWhitespaceChar();

    if (!data.match(">")) {
      throw new ParseError("Incomplete closing tag", data.position);
    }

    data.advance();
  }
}
