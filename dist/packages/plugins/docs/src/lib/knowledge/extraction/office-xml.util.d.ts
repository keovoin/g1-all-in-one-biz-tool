/** One parsed element. */
export interface IXmlNode {
    /** Qualified tag name as written, e.g. `a:t`. */
    name: string;
    /** Tag name without its namespace prefix, e.g. `t`. */
    localName: string;
    /** Attributes keyed by their qualified name, values entity-decoded. */
    attributes: Record<string, string>;
    /** Child elements, in document order. */
    children: IXmlNode[];
    /**
     * The element's own text content, in document order, with each child element's position
     * represented by the child itself — see {@link IXmlNode.content}.
     */
    content: (string | IXmlNode)[];
}
/**
 * Parses an XML document into an element tree.
 *
 * @param xml The XML source.
 * @returns The root element.
 * @throws DocsPermanentError when the document is not well-formed enough to walk — a malformed
 *         part will not become well-formed on a retry.
 */
export declare function parseXml(xml: string): IXmlNode;
/**
 * Every descendant (depth-first, document order) whose local name matches.
 *
 * @param node The subtree root.
 * @param localName The unprefixed tag name to match.
 * @returns The matching descendants.
 */
export declare function findAll(node: IXmlNode, localName: string): IXmlNode[];
/**
 * The first descendant whose local name matches, or undefined.
 *
 * @param node The subtree root.
 * @param localName The unprefixed tag name to match.
 */
export declare function findFirst(node: IXmlNode, localName: string): IXmlNode | undefined;
/**
 * Reads an attribute by local name, so a part that writes `table:name` and one that writes
 * `name` both resolve.
 *
 * @param node The element.
 * @param localName The unprefixed attribute name.
 */
export declare function attribute(node: IXmlNode, localName: string): string | undefined;
/**
 * Concatenates every text node in the subtree, in document order.
 *
 * `replacements` maps a local element name to the literal it stands for, which is how the
 * formats' non-text glyph elements come through: OpenDocument writes a tab as `<text:tab/>` and
 * a line break as `<text:line-break/>`, and PresentationML writes a break as `<a:br/>`. Without
 * this, `"Name\tRole"` would extract as `"NameRole"`.
 *
 * @param node The subtree root.
 * @param replacements Local element name → the text it contributes.
 * @returns The concatenated text.
 */
export declare function textContent(node: IXmlNode, replacements?: Record<string, string>): string;
