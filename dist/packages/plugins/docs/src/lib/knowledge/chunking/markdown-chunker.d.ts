import { IDocumentChunkMetadata } from '@gauzy/contracts';
import { ITokenCounter, TokenCounterKind } from './token-counter';
/**
 * Heading-aware markdown chunker (§6 of the AI-knowledge spec).
 *
 * Pure, deterministic, zero-AI: the same input always produces byte-identical chunks —
 * this determinism is what makes contentHash short-circuits and locator backfills safe.
 *
 * - Blocks split at markdown headings (`#`–`###`) and blank-line paragraph boundaries.
 * - Blocks are greedily packed into ~`chunkTokens` windows; only a single block longer
 *   than a whole window is hard-split (at the last line boundary, else last space).
 * - `overlapTokens` are carried from the tail of the previous chunk, starting at a word
 *   boundary. The overlap is context only — locator metadata is derived from the chunk's
 *   anchor block, not the overlap tail.
 * - Oversized pipe tables split on row boundaries with the header + delimiter row
 *   repeated atop every slice; table slices get no generic overlap.
 * - Whole-document fast path: total ≤ `chunkTokens` ⇒ one verbatim chunk.
 * - Locator headings (`## Page N`, `## Sheet: <name>`) update `page`/`sheet` state and are
 *   excluded from `headingPath`.
 */
export interface IMarkdownChunk {
    /** 0-based position within the document. */
    chunkIndex: number;
    /** Chunk text (overlap prefix + anchored source slice). */
    content: string;
    /** Token count of `content` per the active counter. */
    tokenCount: number;
    /** Citation locators of the anchor block. */
    metadata: IDocumentChunkMetadata;
}
export interface IChunkingResult {
    chunks: IMarkdownChunk[];
    /** Which token counter produced the counts (recorded in `metadata.indexing.tokenCounter`). */
    tokenCounter: TokenCounterKind;
}
export interface IChunkingOptions {
    /** Target window size in tokens (default 512). */
    chunkTokens?: number;
    /** Overlap carried between consecutive chunks in tokens (default 64). */
    overlapTokens?: number;
    /** Token counter override (tests inject the deterministic heuristic). */
    counter?: ITokenCounter;
}
/**
 * Chunks normalized markdown into heading-aware token windows with locator metadata.
 *
 * @param markdown Normalized markdown (LF line endings — the extraction contract).
 * @param options Window/overlap sizes and an optional counter override.
 * @returns The deterministic chunk list plus the counter identity used.
 */
export declare function chunkMarkdown(markdown: string, options?: IChunkingOptions): IChunkingResult;
