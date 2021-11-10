export interface XmlDeclaration {
  version: string;
  encoding?: string;
  standalone?: string;
}

export interface XmlAttribute {
  name: string;
  value: string;
}

export interface XmlElement {
  tagName: string;
  attributes: XmlAttributes;
  children: XmlNode[];
}

export type XmlAttributes = Record<string, string>;
export type XmlNode = XmlElement | string;

export interface XmlDocument extends XmlDeclaration {
  root: XmlElement;
}
