import { JobPostStatusEnum } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class JobStatusComponent extends TranslationBaseComponent {
    constructor(translateService: TranslateService);
    rowData: any;
    value: string;
    /**
     * Get job status text and class
     *
     * @param status
     */
    getJobStatus(status: JobPostStatusEnum): {
        text: string;
        class: string;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<JobStatusComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<JobStatusComponent, "job-status", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}
