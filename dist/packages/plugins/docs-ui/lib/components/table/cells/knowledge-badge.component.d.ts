import { DocumentKnowledgeStatusEnum, DocumentReviewStatusEnum, IDocument } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * AI knowledge badge; a PENDING review overlays the amber review pill next to it.
 */
export declare class KnowledgeBadgeComponent {
    rowData: IDocument;
    value: DocumentKnowledgeStatusEnum;
    readonly reviewEnum: typeof DocumentReviewStatusEnum;
    get status(): DocumentKnowledgeStatusEnum;
    get isBusy(): boolean;
    get cssClass(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<KnowledgeBadgeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<KnowledgeBadgeComponent, "gz-docs-knowledge-badge", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}
