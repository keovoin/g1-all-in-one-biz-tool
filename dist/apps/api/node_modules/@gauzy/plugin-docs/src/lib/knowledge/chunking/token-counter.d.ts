/**
 * Token counting for the markdown chunker (§6 of the AI-knowledge spec).
 *
 * `js-tiktoken` with the `cl100k_base` encoding — the tokenizer family of the default
 * embedding model. If the tokenizer fails to load (exotic runtime), fall back to the
 * `ceil(chars / 4)` heuristic; the counter actually used is reported per run so drift is
 * diagnosable (`metadata.indexing.tokenCounter`).
 */
/** Which counter produced the token counts of a chunking run. */
export type TokenCounterKind = 'cl100k_base' | 'chars/4';
export interface ITokenCounter {
    /** The counter identity recorded in the index metadata. */
    readonly kind: TokenCounterKind;
    /** Counts the tokens of one string. */
    count(text: string): number;
}
/**
 * The `ceil(chars / 4)` fallback counter.
 */
export declare const heuristicTokenCounter: ITokenCounter;
/**
 * Resolves the process-wide token counter: `cl100k_base` when `js-tiktoken` loads,
 * else the chars/4 heuristic. The result is cached — encoder construction is expensive.
 */
export declare function getTokenCounter(): ITokenCounter;
/**
 * Test seam: resets the cached counter.
 */
export declare function resetTokenCounterCache(): void;
