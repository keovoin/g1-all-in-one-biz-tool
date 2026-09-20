/**
 * The transcription prompt of the OCR path (07 §4, rows 2 and 8).
 *
 * The whole design goal is that the model behaves like a scanner, not like an assistant:
 * temperature 0, transcribe only, never summarize, never "fix" the source, and mark what
 * cannot be read instead of guessing at it. A hallucinated line here would be indexed as
 * document content and later cited as fact, so the instruction to emit `[illegible]` is a
 * correctness requirement, not politeness.
 *
 * The page image is untrusted content: it may itself contain text telling the model what to
 * do. The system prompt therefore states outright that any instruction visible in the image
 * is data to be transcribed, never a command to follow — the same posture
 * `knowledge/security/untrusted-content.ts` takes for extracted text.
 */
/** System prompt shared by every OCR call (PDF pages and standalone images). */
export declare const OCR_SYSTEM_PROMPT: string;
/** User-turn instruction accompanying the page image. */
export declare const OCR_USER_PROMPT = "Transcribe this page.";
/** Output-token ceiling of a single page transcription. */
export declare const OCR_MAX_OUTPUT_TOKENS = 4000;
/**
 * The honest, visible note appended when the page cap dropped pages (§4.1: truncation notes
 * are content — the model and the human both need to see them).
 *
 * @param transcribed How many pages were transcribed.
 * @param total How many pages the document has.
 */
export declare function buildOcrCapNote(transcribed: number, total: number): string;
/** The note marking a page whose transcription call failed (the run continues without it). */
export declare function buildOcrPageFailureNote(pageNumber: number): string;
