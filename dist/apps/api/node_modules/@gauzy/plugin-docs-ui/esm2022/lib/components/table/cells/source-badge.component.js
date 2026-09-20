import { Component, Input } from '@angular/core';
import { DocumentSourceEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
const SOURCE_ICONS = {
    [DocumentSourceEnum.UPLOAD]: 'upload-outline',
    [DocumentSourceEnum.EDITOR]: 'edit-2-outline',
    [DocumentSourceEnum.CHAT]: 'message-circle-outline',
    [DocumentSourceEnum.EMAIL]: 'email-outline',
    [DocumentSourceEnum.INTEGRATION]: 'link-2-outline',
    [DocumentSourceEnum.SYSTEM]: 'settings-2-outline',
    [DocumentSourceEnum.IMPORT]: 'download-outline'
};
/** Source badge: Eva icon + label per DocumentSourceEnum. */
export class SourceBadgeComponent {
    get source() {
        return this.value ?? this.rowData?.source;
    }
    get icon() {
        return this.source ? SOURCE_ICONS[this.source] ?? 'file-outline' : 'file-outline';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SourceBadgeComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: SourceBadgeComponent, isStandalone: false, selector: "gz-docs-source-badge", inputs: { rowData: "rowData", value: "value" }, ngImport: i0, template: `
		<span class="docs-source" *ngIf="source">
			<nb-icon [icon]="icon" size="tiny"></nb-icon>
			<span class="docs-source__label">{{ 'DOCS.SOURCE.' + source | translate }}</span>
		</span>
	`, isInline: true, styles: [".docs-source{display:inline-flex;align-items:center;gap:.25rem;max-width:100%;height:var(--gauzy-table-badge-height, 1.25rem);font-size:var(--docs-meta-size, .75rem);line-height:1;color:var(--docs-text-muted, var(--text-hint-color));white-space:nowrap;overflow:hidden}.docs-source__label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-source nb-icon{flex:0 0 auto;font-size:.875rem}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SourceBadgeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-source-badge', template: `
		<span class="docs-source" *ngIf="source">
			<nb-icon [icon]="icon" size="tiny"></nb-icon>
			<span class="docs-source__label">{{ 'DOCS.SOURCE.' + source | translate }}</span>
		</span>
	`, standalone: false, styles: [".docs-source{display:inline-flex;align-items:center;gap:.25rem;max-width:100%;height:var(--gauzy-table-badge-height, 1.25rem);font-size:var(--docs-meta-size, .75rem);line-height:1;color:var(--docs-text-muted, var(--text-hint-color));white-space:nowrap;overflow:hidden}.docs-source__label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-source nb-icon{flex:0 0 auto;font-size:.875rem}\n"] }]
        }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=source-badge.component.js.map