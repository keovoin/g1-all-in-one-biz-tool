import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/theme";
import * as i3 from "@ngx-translate/core";
/**
 * Shared header component for workspace action pages.
 * Contains the logo and close button that appears in all workspace action templates.
 */
export class WorkspaceHeaderComponent {
    constructor() {
        this.showCloseButton = true;
        this.close = new EventEmitter();
    }
    /**
     * Handle close button click
     */
    onClose() {
        this.close.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceHeaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: WorkspaceHeaderComponent, isStandalone: false, selector: "ga-workspace-header", inputs: { title: "title", subtitle: "subtitle", showCloseButton: "showCloseButton" }, outputs: { close: "close" }, ngImport: i0, template: "<div class=\"svg-wrapper\">\n  <ngx-gauzy-logo [isAccordion]=\"false\" class=\"ever-logo-svg\"></ngx-gauzy-logo>\n  @if (showCloseButton) {\n    <button\n      nbButton\n      ghost\n      size=\"small\"\n      type=\"button\"\n      (click)=\"onClose()\"\n      class=\"close-button\"\n      aria-label=\"Close\"\n      >\n      <nb-icon icon=\"close-outline\"></nb-icon>\n    </button>\n  }\n</div>\n\n@if (title || subtitle) {\n  <div class=\"headings\">\n    <div class=\"headings-inner\">\n      @if (title) {\n        <h2 id=\"title\" class=\"title\">{{ title | translate }}</h2>\n      }\n      @if (subtitle) {\n        <p class=\"sub-title\">{{ subtitle | translate }}</p>\n      }\n    </div>\n  </div>\n}\n", styles: [".svg-wrapper{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}.svg-wrapper .ever-logo-svg{height:40px;width:auto}.svg-wrapper .close-button{border:none;background:transparent;color:var(--text-hint-color);cursor:pointer;padding:.5rem;border-radius:50%;transition:all .2s ease}.svg-wrapper .close-button:hover{background-color:var(--background-basic-color-2);color:var(--text-basic-color)}.svg-wrapper .close-button:focus-visible{outline:2px solid var(--text-basic-color);outline-offset:2px;background-color:var(--background-basic-color-2);color:var(--text-basic-color)}.svg-wrapper .close-button nb-icon{font-size:1.25rem}.headings{margin-bottom:1.5rem}.headings .headings-inner{text-align:center}.headings .headings-inner .title{margin:0 0 .5rem;font-size:1.75rem;font-weight:600;color:var(--text-basic-color);line-height:1.2}.headings .headings-inner .sub-title{margin:0;font-size:.875rem;color:var(--text-hint-color);line-height:1.4}\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i2.GauzyLogoComponent, selector: "ngx-gauzy-logo", inputs: ["controlled", "isAccordion", "isWorkspaceOpen"], outputs: ["onCollapsed", "onWorkspaceToggle"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceHeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-workspace-header', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"svg-wrapper\">\n  <ngx-gauzy-logo [isAccordion]=\"false\" class=\"ever-logo-svg\"></ngx-gauzy-logo>\n  @if (showCloseButton) {\n    <button\n      nbButton\n      ghost\n      size=\"small\"\n      type=\"button\"\n      (click)=\"onClose()\"\n      class=\"close-button\"\n      aria-label=\"Close\"\n      >\n      <nb-icon icon=\"close-outline\"></nb-icon>\n    </button>\n  }\n</div>\n\n@if (title || subtitle) {\n  <div class=\"headings\">\n    <div class=\"headings-inner\">\n      @if (title) {\n        <h2 id=\"title\" class=\"title\">{{ title | translate }}</h2>\n      }\n      @if (subtitle) {\n        <p class=\"sub-title\">{{ subtitle | translate }}</p>\n      }\n    </div>\n  </div>\n}\n", styles: [".svg-wrapper{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}.svg-wrapper .ever-logo-svg{height:40px;width:auto}.svg-wrapper .close-button{border:none;background:transparent;color:var(--text-hint-color);cursor:pointer;padding:.5rem;border-radius:50%;transition:all .2s ease}.svg-wrapper .close-button:hover{background-color:var(--background-basic-color-2);color:var(--text-basic-color)}.svg-wrapper .close-button:focus-visible{outline:2px solid var(--text-basic-color);outline-offset:2px;background-color:var(--background-basic-color-2);color:var(--text-basic-color)}.svg-wrapper .close-button nb-icon{font-size:1.25rem}.headings{margin-bottom:1.5rem}.headings .headings-inner{text-align:center}.headings .headings-inner .title{margin:0 0 .5rem;font-size:1.75rem;font-weight:600;color:var(--text-basic-color);line-height:1.2}.headings .headings-inner .sub-title{margin:0;font-size:.875rem;color:var(--text-hint-color);line-height:1.4}\n"] }]
        }], propDecorators: { title: [{
                type: Input
            }], subtitle: [{
                type: Input
            }], showCloseButton: [{
                type: Input
            }], close: [{
                type: Output
            }] } });
//# sourceMappingURL=workspace-header.component.js.map