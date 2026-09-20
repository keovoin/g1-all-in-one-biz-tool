/**
 * The wire shape and presentation rules of the Documents citation chips.
 *
 * Deliberately a plain `.ts` module rather than living inside `DocsCitationChips.tsx`: this is
 * the part with behaviour worth testing, and this package's Jest resolver does not resolve `.tsx`
 * module specifiers (`moduleFileExtensions` has no `tsx`), so logic buried in the component file
 * would be untestable.
 */
/**
 * The custom data part `@gauzy/plugin-docs` writes onto the chat stream after a `docs_search`
 * (`DOCS_CITATIONS_DATA_PART` in that plugin — the two strings are one contract).
 *
 * 🛑 Deliberately NOT imported from the docs plugin: this is a browser bundle and that package is
 * a NestJS backend plugin. The shape is small and stable, so it is mirrored here instead of
 * dragging a server dependency into the chat UI.
 */
export const DOCS_CITATIONS_PART_TYPE = 'data-docs-citations';
/** More chips than this under one answer is noise, not evidence. */
export const MAX_CHIPS = 8;
/** Used when no translator is supplied (harnesses, tests). */
const passthrough = (_key, fallback) => fallback;
/**
 * `{name} · {heading} · p.{page}` — every segment optional, joined only when present, so a hit
 * with no locator still reads as the document name rather than as stray separators.
 *
 * @param citation The citation to label.
 * @param translate The panel's translator.
 * @returns The chip label.
 */
export function citationLabel(citation, translate) {
    const t = translate ?? passthrough;
    const segments = [citation.name?.trim() || t('AI_ASSISTANT.CITATIONS.UNTITLED', 'Untitled document')];
    if (citation.heading?.trim())
        segments.push(citation.heading.trim());
    if (citation.sheet?.trim())
        segments.push(citation.sheet.trim());
    if (typeof citation.page === 'number' && citation.page > 0)
        segments.push(`p.${citation.page}`);
    return segments.join(' · ');
}
/**
 * The chips actually worth rendering: drops malformed entries, collapses the ones that would
 * render identically, and caps the row at {@link MAX_CHIPS}.
 *
 * Retrieval routinely returns several adjacent chunks of one section, and three identical
 * "Handbook · Expenses · p.4" chips read as a rendering bug rather than as three sources. Input
 * order is preserved (it arrives score-descending), so the strongest hit of each group survives.
 *
 * @param citations The citations from the data part.
 * @returns The de-duplicated, capped list.
 */
export function selectCitations(citations) {
    const seen = new Set();
    const unique = [];
    for (const citation of citations ?? []) {
        if (!citation?.documentId || !citation?.url)
            continue;
        const key = `${citation.url}|${citation.heading ?? ''}|${citation.sheet ?? ''}|${citation.page ?? ''}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        unique.push(citation);
        if (unique.length === MAX_CHIPS)
            break;
    }
    return unique;
}
//# sourceMappingURL=docs-citations.model.js.map