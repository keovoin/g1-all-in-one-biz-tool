import { IDocument, IDocumentCategory } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class DocumentCategory extends TenantOrganizationBaseEntity implements IDocumentCategory {
    /**
     * Display name, unique per organization (case-insensitive, service-enforced).
     */
    name: string;
    /**
     * Kebab-case machine key, unique per tenant/organization.
     */
    slug: string;
    /**
     * Hex color for chips.
     */
    color?: string;
    /**
     * Eva icon name for chips (`nb-icon`).
     */
    icon?: string;
    /**
     * Shown in catalog management UI and used as classification hint text.
     */
    description?: string;
    /**
     * True for seeded defaults; system rows can be renamed/recolored but not deleted (service rule).
     */
    isSystem: boolean;
    /**
     * Documents assigned to this category — inverse side of `Document.categories`.
     * Deleting a category deletes only pivot rows, never documents.
     */
    documents?: IDocument[];
}
