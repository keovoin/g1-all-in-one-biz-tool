import { type CitationTranslate, type IDocsCitation, type IDocsCitationsData } from '../docs-citations.model';
export { citationLabel, selectCitations, DOCS_CITATIONS_PART_TYPE, MAX_CHIPS, type CitationTranslate, type IDocsCitation, type IDocsCitationsData } from '../docs-citations.model';
export interface DocsCitationChipsProps {
    data: IDocsCitationsData;
    /** Opens one citation in the app (router navigation supplied by the panel). */
    onOpen?: (citation: IDocsCitation) => void;
    /** `t(key, fallback)` from the panel; omitted in the presentational harnesses. */
    translate?: CitationTranslate;
}
/**
 * DocsCitationChips
 *
 * Renders the sources behind an assistant answer as compact, clickable chips reading
 * `{name} · {heading} · p.{page}`, each deep-linking into the Documents hub.
 *
 * Why a data part rather than the tool result: the tool's return value goes to the MODEL, which
 * is free to paraphrase or invent a link. These chips are built from what retrieval actually
 * returned in the user's own RBAC scope, so a chip can never point at a document the user was
 * not allowed to see.
 */
export declare function DocsCitationChips({ data, onOpen, translate }: DocsCitationChipsProps): import("react/jsx-runtime").JSX.Element;
