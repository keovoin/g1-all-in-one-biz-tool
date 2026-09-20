import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class GithubIssueTitleDescriptionComponent extends TranslationBaseComponent {
    readonly translateService: TranslateService;
    rowData: any;
    value: string | number;
    constructor(translateService: TranslateService);
    /**
     *
     * @returns
     */
    openIssue(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GithubIssueTitleDescriptionComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GithubIssueTitleDescriptionComponent, "issue-title-description", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}
