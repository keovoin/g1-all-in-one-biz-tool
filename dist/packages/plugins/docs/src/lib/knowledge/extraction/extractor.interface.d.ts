/**
 * The provider contract of the Documents extraction registry.
 *
 * Extraction converts every supported input into **normalized markdown** stored on
 * `document.extractedText`. Each format ships as its own provider class registered in the
 * module; third parties add providers via `ExtractionRegistryService.register()` — the
 * registry resolves providers in registration order, first match wins.
 */
import { ID } from '@gauzy/contracts';
/** Context handed to an extractor run (never the raw request — extractors are pure). */
export interface IDocumentExtractionContext {
    /** Original (client) filename — used for extension hints and sheet naming. */
    filename: string;
    /** Sniffed canonical MIME of the buffer. */
    mimeType: string;
    /** Cap on the produced markdown length in characters (`GAUZY_DOCS_MAX_EXTRACTED_CHARS`). */
    maxChars?: number;
    /** P1 (M5) — request the OCR path where supported. */
    forceOcr?: boolean;
    /**
     * Tenant snapshot of the run — the OCR path resolves provider credentials with it
     * (tenant BYOK → environment → platform), exactly as classification does. Absent on
     * pure-parsing calls, which never touch a provider.
     *
     * 🛑 It is a SNAPSHOT, never `RequestContext`: extraction runs on queue threads.
     */
    tenantId?: ID;
    /** Organization snapshot of the run — carried into the OCR cost-accounting event. */
    organizationId?: ID;
}
/** The result contract every extractor must honor (§4.1 of the AI-knowledge spec). */
export interface IDocumentExtractionResult {
    /**
     * Normalized markdown: UTF-8, LF line endings, no NUL bytes, no leading BOM.
     * Locator headings use the exact machine shapes `## Page N` / `## Sheet: <name>`.
     */
    markdown: string;
    /** Optional extraction metadata persisted under `document.metadata.extraction`. */
    metadata?: {
        pageCount?: number;
        truncated?: boolean;
        warnings?: string[];
        /** Approximate word count of the produced markdown. */
        wordCount?: number;
        /**
         * Set ONLY when the markdown came out of provider-vision OCR rather than a text
         * layer. Its presence is the provenance flag: `DocumentProcessingService` copies it
         * to `metadata.extraction.ocr` and gates the document for review, because a
         * transcription is inherently lower-confidence than parsed text.
         */
        ocr?: IDocumentOcrProvenance;
    };
}
/** What one OCR run transcribed, persisted under `metadata.extraction.ocr`. */
export interface IDocumentOcrProvenance {
    /** Total pages in the source (1 for images). */
    pageCount: number;
    /** Pages actually transcribed — below `pageCount` when the page cap bit. */
    pagesTranscribed: number;
    /** True when the page cap dropped pages from the transcription. */
    capped: boolean;
    /** AI provider id that served the transcription. */
    providerId: string;
    /** Vision model id that served the transcription. */
    model: string;
    /** ISO timestamp of the run. */
    transcribedAt: string;
}
/**
 * A single extraction provider. `supports` is consulted by the registry in provider
 * order; `extract` throws `DocsPermanentError` for corrupt/unsupported inputs and
 * `DocsTransientError` for retryable failures.
 */
export interface IDocumentExtractor {
    supports(mime: string, filename: string): boolean;
    extract(buffer: Buffer, ctx: IDocumentExtractionContext): Promise<IDocumentExtractionResult>;
}
/**
 * Shared markdown normalization every extractor applies before returning: strips NUL
 * bytes and a leading BOM, converts CRLF/CR to LF, and trims trailing whitespace lines.
 */
export declare function normalizeMarkdown(markdown: string): string;
/**
 * Applies the extracted-markdown size cap: truncates at the last line boundary before
 * `maxChars` and appends the honest truncation note (§4.2).
 */
export declare function capMarkdown(markdown: string, maxChars?: number): {
    markdown: string;
    truncated: boolean;
};
/**
 * Approximate word count of a markdown string (whitespace-delimited tokens).
 */
export declare function countWords(markdown: string): number;
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
export declare function escapeTableCell(value: string): string;
