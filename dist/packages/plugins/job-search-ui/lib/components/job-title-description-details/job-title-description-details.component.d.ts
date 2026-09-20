import { EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class JobTitleDescriptionDetailsComponent extends TranslationBaseComponent {
    constructor(translateService: TranslateService);
    rowData: any;
    hideJobIcon: boolean;
    value: string | number;
    hideJobEvent: EventEmitter<any>;
    /**
     * Icon with link to Job Post
     *
     * @returns
     */
    openJob(): void;
    /**
     * Updates job visibility
     *
     */
    hideJob(event: Event): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobTitleDescriptionDetailsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<JobTitleDescriptionDetailsComponent, "job-title-description-details", never, { "rowData": { "alias": "rowData"; "required": false; }; "hideJobIcon": { "alias": "hideJobIcon"; "required": false; }; }, { "hideJobEvent": "hideJobEvent"; }, never, never, false, never>;
}
