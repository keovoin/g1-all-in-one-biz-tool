import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "../../tags-only/tags-only.component";
import * as i4 from "../../trust-html/trust-html.component";
export class GithubIssueTitleDescriptionComponent extends TranslationBaseComponent {
    constructor(translateService) {
        super(translateService);
        this.translateService = translateService;
    }
    /**
     *
     * @returns
     */
    openIssue() {
        if (!this.rowData) {
            return;
        }
        if (this.rowData?.html_url) {
            window.open(this.rowData.html_url, '_blank');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GithubIssueTitleDescriptionComponent, deps: [{ token: i1.TranslateService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: GithubIssueTitleDescriptionComponent, isStandalone: false, selector: "issue-title-description", inputs: { rowData: "rowData", value: "value" }, usesInheritance: true, ngImport: i0, template: "<div class=\"issue-details\">\n  <div class=\"issue-header\">\n    <div class=\"issue-labels\">\n      @if (rowData?.labels) {\n        <ga-only-tags\n          [value]=\"rowData?.labels\"\n          [rowData]=\"rowData\"\n        ></ga-only-tags>\n      }\n    </div>\n    <div class=\"issue-title\">\n      <a href=\"javascript:void(0)\" (click)=\"openIssue()\">\n        <nb-icon icon=\"eye-outline\" pack=\"eva\" [nbTooltip]=\"rowData?.title\"></nb-icon>\n        {{ rowData?.title }}\n      </a>\n    </div>\n  </div>\n  <div class=\"issue-body\">\n    <div class=\"issue-description\">\n      <ngx-security-trust-html\n        [value]=\"rowData?.body\"\n      ></ngx-security-trust-html>\n    </div>\n  </div>\n</div>\n", styles: [":host .issue-details{letter-spacing:0em;text-align:left}:host .issue-details .issue-header .issue-labels{font-size:14px;display:block;margin-top:15px}:host .issue-details .issue-header .issue-title{font-size:16px;font-weight:600;text-decoration:none;padding-top:10px}:host .issue-details .issue-header .issue-title a{color:var(--text-basic-color)}:host .issue-details .issue-header .issue-title a:hover{text-decoration:none}:host .issue-details .issue-body{margin-top:20px}:host .issue-details .issue-body .issue-description{font-size:14px;margin-top:10px;line-height:17px}\n"], dependencies: [{ kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i3.TagsOnlyComponent, selector: "ga-only-tags", inputs: ["value"] }, { kind: "component", type: i4.TrustHtmlLinkComponent, selector: "ngx-security-trust-html", inputs: ["value", "rowData"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GithubIssueTitleDescriptionComponent, decorators: [{
            type: Component,
            args: [{ selector: 'issue-title-description', standalone: false, template: "<div class=\"issue-details\">\n  <div class=\"issue-header\">\n    <div class=\"issue-labels\">\n      @if (rowData?.labels) {\n        <ga-only-tags\n          [value]=\"rowData?.labels\"\n          [rowData]=\"rowData\"\n        ></ga-only-tags>\n      }\n    </div>\n    <div class=\"issue-title\">\n      <a href=\"javascript:void(0)\" (click)=\"openIssue()\">\n        <nb-icon icon=\"eye-outline\" pack=\"eva\" [nbTooltip]=\"rowData?.title\"></nb-icon>\n        {{ rowData?.title }}\n      </a>\n    </div>\n  </div>\n  <div class=\"issue-body\">\n    <div class=\"issue-description\">\n      <ngx-security-trust-html\n        [value]=\"rowData?.body\"\n      ></ngx-security-trust-html>\n    </div>\n  </div>\n</div>\n", styles: [":host .issue-details{letter-spacing:0em;text-align:left}:host .issue-details .issue-header .issue-labels{font-size:14px;display:block;margin-top:15px}:host .issue-details .issue-header .issue-title{font-size:16px;font-weight:600;text-decoration:none;padding-top:10px}:host .issue-details .issue-header .issue-title a{color:var(--text-basic-color)}:host .issue-details .issue-header .issue-title a:hover{text-decoration:none}:host .issue-details .issue-body{margin-top:20px}:host .issue-details .issue-body .issue-description{font-size:14px;margin-top:10px;line-height:17px}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=issue-title-description.component.js.map