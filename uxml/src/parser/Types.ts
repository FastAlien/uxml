export interface XmlDeclaration {
  version: string;
  encoding?: string;
  standalone?: string;
}

export interface XmlAttribute {
  name: string;
  value: string;
}
