"use strict";
/**
 * The provider contract of the Documents extraction registry.
 *
 * Extraction converts every supported input into **normalized markdown** stored on
 * `document.extractedText`. Each format ships as its own provider class registered in the
 * module; third parties add providers via `ExtractionRegistryService.register()` — the
 * registry resolves providers in registration order, first match wins.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeMarkdown = normalizeMarkdown;
exports.capMarkdown = capMarkdown;
exports.countWords = countWords;
exports.escapeTableCell = escapeTableCell;
/** NUL, as a code unit rather than a literal control character inside a pattern. */
const NUL = String.fromCharCode(0);
/**
 * Drops trailing spaces and tabs from every line.
 *
 * Deliberately NOT `/[ \t]+$/gm`: that pattern restarts the trailing-run match at every
 * position inside a run of spaces, which makes it quadratic in the length of the run.
 * This normalizer runs over UNTRUSTED extracted document text on the request thread, so a
 * single long line of spaces in an uploaded file was enough to stall it (~19s for an 80 KB
 * run, measured locally). Splitting on newlines and walking each line backwards touches
 * every character at most twice.
 *
 * Only spaces and tabs are removed - `String.prototype.trimEnd` would additionally strip
 * vertical tab, form feed and Unicode spaces, which the original pattern preserved.
 */
function trimTrailingSpacesAndTabs(text) {
    return text
        .split('\n')
        .map((line) => {
        let end = line.length;
        while (end > 0 && (line[end - 1] === ' ' || line[end - 1] === '\t'))
            end--;
        return end === line.length ? line : line.slice(0, end);
    })
        .join('\n');
}
/**
 * Shared markdown normalization every extractor applies before returning: strips NUL
 * bytes and a leading BOM, converts CRLF/CR to LF, and trims trailing whitespace lines.
 */
function normalizeMarkdown(markdown) {
    const normalized = (markdown ?? '')
        .replace(/^\uFEFF/, '')
        .split(NUL)
        .join('')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');
    return trimTrailingSpacesAndTabs(normalized).trim();
}
/**
 * Applies the extracted-markdown size cap: truncates at the last line boundary before
 * `maxChars` and appends the honest truncation note (§4.2).
 */
function capMarkdown(markdown, maxChars) {
    if (!maxChars || markdown.length <= maxChars) {
        return { markdown, truncated: false };
    }
    const slice = markdown.slice(0, maxChars);
    const lastLineBreak = slice.lastIndexOf('\n');
    const cut = lastLineBreak > 0 ? slice.slice(0, lastLineBreak) : slice;
    return {
        markdown: `${cut}\n\n_Truncated: the extracted text exceeded the configured size limit._`,
        truncated: true
    };
}
/**
 * Approximate word count of a markdown string (whitespace-delimited tokens).
 */
function countWords(markdown) {
    if (!markdown) {
        return 0;
    }
    const matches = markdown.match(/\S+/g);
    return matches ? matches.length : 0;
}
/**
 * Every character a markdown reader treats as a line ending inside a table row.
 *
 * The old pattern was `/\r?\n/g`, which requires an LF — but CommonMark counts a LONE CR as a
 * line ending, so a bare `\r` walked through and split the row. U+2028 / U+2029 end a line for
 * enough renderers (and for downstream line-splitting consumers) to be worth folding in too;
 * they are written as escapes so no invisible byte lives in this source file.
 *
 * The `\r\n` alternative comes first so a CRLF collapses to ONE space, exactly as it always did.
 */
const CELL_LINE_BREAKS = /\r\n|[\r\n\u2028\u2029]/g;
/**
 * Escapes a cell value for a GitHub-style pipe table: pipes and line breaks neutralized.
 *
 * 🛑 The backslash is escaped FIRST, and that order is the whole point. This used to be
 * `.replace(/\|/g, '\\|')` alone, so a cell whose *data* already contained `\|` came out as
 * `\\|` — markdown reads that as "an escaped backslash, then a LIVE column separator", and one
 * crafted value silently restructured the table (CodeQL `js/incomplete-sanitization`). Escaping
 * the escape character first makes the encoding total: after this pass every `\` and every `|`
 * in the output is one the function put there. A trailing backslash is covered by the same
 * rule — unescaped, it would have escaped the table's own closing delimiter.
 *
 * Cell values come from attacker-supplied uploads (CSV/XLSX/DOCX/HTML), so this is the only
 * thing keeping the extracted markdown's table structure faithful to the source data.
 */
function escapeTableCell(value) {
    return (value ?? '').replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(CELL_LINE_BREAKS, ' ').trim();
}
//# sourceMappingURL=extractor.interface.js.map