/**
 * The 11 seeded system categories — created per organization with `isSystem: true`.
 * The AI classifier's category vocabulary is always read from the live catalog at
 * classification time, never from this list.
 */
export interface IDefaultDocumentCategory {
    name: string;
    slug: string;
    color: string;
    icon: string;
}
export declare const DEFAULT_DOCUMENT_CATEGORIES: IDefaultDocumentCategory[];
