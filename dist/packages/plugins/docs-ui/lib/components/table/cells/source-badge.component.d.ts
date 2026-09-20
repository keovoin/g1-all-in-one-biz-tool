import { DocumentSourceEnum, IDocument } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/** Source badge: Eva icon + label per DocumentSourceEnum. */
export declare class SourceBadgeComponent {
    rowData: IDocument;
    value: DocumentSourceEnum;
    get source(): DocumentSourceEnum | undefined;
    get icon(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<SourceBadgeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SourceBadgeComponent, "gz-docs-source-badge", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}
