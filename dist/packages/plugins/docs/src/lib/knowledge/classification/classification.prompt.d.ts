/**
 * Classification prompt assembly (§5 of the AI-knowledge spec) — pure functions.
 */
/**
 * Builds the head/middle/tail sample of the extracted markdown: 60% head, 20% centered
 * middle, 20% tail with visible `[… omitted …]` markers — long documents are not
 * classified blind past page 1.
 *
 * @param markdown The normalized extracted markdown.
 * @param maxChars The total sample budget (`GAUZY_DOCS_CLASSIFY_SAMPLE_CHARS`).
 */
export declare function sampleMarkdown(markdown: string, maxChars: number): string;
export interface IClassificationPromptInput {
    /** `slug: description` lines of the tenant's category catalog. */
    catalogLines: string;
    /** The original client filename (or the document name). */
    originalFilename: string;
    /** The head/middle/tail sample of the extracted markdown (NOT yet fenced). */
    sampledMarkdown: string;
}
/**
 * Builds the system + user messages of the classification call. The document sample is
 * neutralized and fenced as untrusted content (§5.4 / §18.1).
 */
export declare function buildClassificationPrompt(input: IClassificationPromptInput): {
    system: string;
    user: string;
};
/** The parsed, clamped classification result. */
export interface IClassificationOutput {
    categories: string[];
    suggestedTags: string[];
    summary: string | null;
    language: string | null;
    confidence: number | null;
}
/**
 * Lenient strict-JSON parser (safety net of §5.2): tolerates code fences and stray prose,
 * clamps and dedupes every field, drops unknown catalog slugs (never auto-created).
 *
 * @param raw The raw model output.
 * @param validSlugs The tenant catalog slugs (lowercase).
 * @returns The clamped output, or `null` when no usable JSON object was found.
 */
export declare function parseClassificationOutput(raw: string, validSlugs: string[]): IClassificationOutput | null;
