import { DocumentKindEnum, DocumentVisibilityEnum, ID, IDocumentCreateInput, ITag, JsonData } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '@gauzy/core';
/**
 * Create payload for `POST /api/plugins/docs/documents` — FOLDER and PAGE creation only
 * (`kind: FILE` is rejected by the handler: files enter through the upload endpoint).
 */
export declare class CreateDocumentDTO extends TenantOrganizationBaseDTO implements IDocumentCreateInput {
    readonly kind: DocumentKindEnum;
    readonly name: string;
    readonly parentId?: ID;
    readonly index?: number;
    readonly icon?: string;
    readonly color?: string;
    readonly description?: string;
    /** PAGE only. Canonical TipTap JSON document. */
    readonly contentJson?: JsonData;
    /** PAGE only. Render cache; sanitized server-side before storage. */
    readonly contentHtml?: string;
    readonly visibility?: DocumentVisibilityEnum;
    readonly categoryIds?: ID[];
    readonly tagIds?: ID[];
    /**
     * The tag shape `IDocumentCreateInput` publishes (`tags?: ITag[]`), accepted alongside
     * {@link tagIds} and folded into it by `resolveTagIds`.
     *
     * 🛑 Declaring only `tagIds` while the contracts interface promised `tags` made the two sides
     * incoherent: these routes validate with `forbidNonWhitelisted: true`, so the next caller
     * typed against `@gauzy/contracts` would have got a 400 naming a property its own interface
     * told it to send. Only the `id` of each entry is read — assigning an existing tag is the
     * operation, and a document write never creates a tag as a side effect.
     */
    readonly tags?: ITag[];
    readonly importToKnowledge?: boolean;
    /** Employee ids mentioned in the initial content. */
    readonly mentionEmployeeIds?: ID[];
}
