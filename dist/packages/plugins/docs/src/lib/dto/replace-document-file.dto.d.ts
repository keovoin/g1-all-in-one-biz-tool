/**
 * Form fields accompanying the single file of `POST /api/plugins/docs/documents/:id/file`
 * (R-UPL-05, replace-in-place).
 *
 * The document already exists, so nothing that identifies or classifies it is accepted here:
 * name, parent, visibility, categories, tags, links, comments and favorites are all preserved
 * by definition. The one decision left to the caller is whether the re-run may spend AI on
 * re-classification.
 */
export declare class ReplaceDocumentFileDTO {
    /**
     * Per-request override of the org setting `autoClassify` for the re-run. Omitted = follow
     * the organization default, exactly as on the upload endpoint.
     */
    readonly classifyWithAi?: boolean;
}
