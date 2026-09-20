/** 5 MiB cap on a human-corrected extraction (matches the pipeline extraction cap). */
export declare const EXTRACTED_TEXT_MAX_LENGTH: number;
/**
 * Body of `PUT /api/plugins/docs/documents/:id/extracted-text` — the human correction
 * flow: stores the markdown, sets `extractedTextEdited: true` (permanently protects it
 * from pipeline overwrite), forces `status: READY`, and re-enqueues from `docs.chunk`
 * when the document is in knowledge.
 */
export declare class UpdateExtractedTextDTO {
    readonly extractedText: string;
}
