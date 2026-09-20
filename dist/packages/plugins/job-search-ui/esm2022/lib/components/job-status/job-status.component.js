import { Component, Input } from '@angular/core';
import { JobPostStatusEnum } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@gauzy/ui-core/shared";
export class JobStatusComponent extends TranslationBaseComponent {
    constructor(translateService) {
        super(translateService);
    }
    /**
     * Get job status text and class
     *
     * @param status
     */
    getJobStatus(status) {
        let badgeClass, badgeText;
        switch (status.toLowerCase()) {
            case JobPostStatusEnum.CLOSED.toLowerCase():
                badgeClass = 'danger';
                badgeText = this.getTranslation('JOBS.CLOSED');
                break;
            case JobPostStatusEnum.OPEN.toLowerCase():
                badgeClass = 'success';
                badgeText = this.getTranslation('JOBS.OPEN');
                break;
            case JobPostStatusEnum.APPLIED.toLowerCase():
                badgeClass = 'primary';
                badgeText = this.getTranslation('JOBS.APPLIED');
                break;
            default:
                badgeClass = 'default';
                badgeText = status;
                break;
        }
        return {
            text: badgeText,
            class: badgeClass
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobStatusComponent, deps: [{ token: i1.TranslateService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: JobStatusComponent, isStandalone: false, selector: "job-status", inputs: { rowData: "rowData", value: "value" }, providers: [], usesInheritance: true, ngImport: i0, template: "<div>\n\t<ga-status-badge [value]=\"getJobStatus(rowData?.jobPost?.jobStatus)\"></ga-status-badge>\n</div>\n", styles: [":host div{display:inline-block;width:fit-content}\n"], dependencies: [{ kind: "component", type: i2.StatusBadgeComponent, selector: "ga-status-badge", inputs: ["value", "layout"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobStatusComponent, decorators: [{
            type: Component,
            args: [{ selector: 'job-status', providers: [], standalone: false, template: "<div>\n\t<ga-status-badge [value]=\"getJobStatus(rowData?.jobPost?.jobStatus)\"></ga-status-badge>\n</div>\n", styles: [":host div{display:inline-block;width:fit-content}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=job-status.component.js.map