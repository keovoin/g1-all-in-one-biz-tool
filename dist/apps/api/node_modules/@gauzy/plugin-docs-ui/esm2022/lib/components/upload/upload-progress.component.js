import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
/**
 * Per-file upload rows: name, size, progress bar, done/error state, retry,
 * dismiss and clear-finished.
 */
export class UploadProgressComponent {
    constructor() {
        this.items = [];
        this.retry = new EventEmitter();
        this.dismiss = new EventEmitter();
        this.clearFinished = new EventEmitter();
    }
    trackByKey(_, item) {
        return item.key;
    }
    humanize(bytes) {
        if (!bytes)
            return '';
        const units = ['B', 'KB', 'MB', 'GB'];
        const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
        const value = bytes / Math.pow(1024, exponent);
        return `${value >= 10 || exponent === 0 ? Math.round(value) : value.toFixed(1)} ${units[exponent]}`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UploadProgressComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: UploadProgressComponent, isStandalone: false, selector: "gz-docs-upload-progress", inputs: { items: "items" }, outputs: { retry: "retry", dismiss: "dismiss", clearFinished: "clearFinished" }, ngImport: i0, template: `
		<nb-card class="docs-upload-progress" *ngIf="items?.length" [attr.aria-label]="'DOCS.A11Y.UPLOAD_PROGRESS' | translate">
			<nb-card-header class="docs-upload-header">
				<span>{{ 'DOCS.UPLOAD.BUTTON' | translate }}</span>
				<button nbButton ghost size="tiny" (click)="clearFinished.emit()">
					{{ 'DOCS.UPLOAD.CLEAR_FINISHED' | translate }}
				</button>
			</nb-card-header>
			<nb-card-body>
				<div class="docs-upload-row" *ngFor="let item of items; trackBy: trackByKey">
					<div class="docs-upload-meta">
						<span class="docs-upload-name" [nbTooltip]="item.file.name">{{ item.file.name }}</span>
						<span class="docs-upload-size">{{ humanize(item.file.size) }}</span>
						<!-- Dedup notice (R-UPL-04) — advisory only, the upload still went through -->
						<span class="docs-upload-duplicate" *ngIf="item.duplicateOfId">
							<nb-icon icon="copy-outline" size="tiny"></nb-icon>
							{{
								item.duplicateOfName
									? ('DOCS.UPLOAD.DUPLICATE_NOTICE' | translate : { name: item.duplicateOfName })
									: ('DOCS.UPLOAD.DUPLICATE_NOTICE_UNKNOWN' | translate)
							}}
						</span>
					</div>
					<nb-progress-bar
						*ngIf="item.state === 'uploading'"
						[value]="item.progress"
						status="primary"
						size="tiny"
					></nb-progress-bar>
					<span class="docs-upload-state done" *ngIf="item.state === 'done'">
						<nb-icon icon="checkmark-circle-2-outline" size="tiny"></nb-icon>
						{{ 'DOCS.UPLOAD.PROGRESS_DONE' | translate }}
					</span>
					<span class="docs-upload-state error" *ngIf="item.state === 'error'" [nbTooltip]="item.error || ''">
						<nb-icon icon="alert-triangle-outline" size="tiny"></nb-icon>
						{{ 'DOCS.UPLOAD.PROGRESS_ERROR' | translate }}
					</span>
					<span class="docs-upload-actions">
						<button *ngIf="item.state === 'error'" nbButton ghost size="tiny" (click)="retry.emit(item.key)">
							{{ 'DOCS.UPLOAD.RETRY' | translate }}
						</button>
						<button nbButton ghost size="tiny" (click)="dismiss.emit(item.key)">
							<nb-icon icon="close-outline" size="tiny"></nb-icon>
						</button>
					</span>
				</div>
			</nb-card-body>
		</nb-card>
	`, isInline: true, styles: [":host{display:block;min-width:0}.docs-upload-progress{margin:0;border:0;border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18))}.docs-upload-header{display:flex;justify-content:space-between;align-items:center;gap:.5rem;padding:.5rem .75rem;font-size:var(--docs-label-size, .6875rem);font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--docs-text-muted, var(--text-hint-color))}.docs-upload-progress nb-card-body{padding:.25rem .75rem .5rem}.docs-upload-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(6rem,12rem) auto;align-items:center;gap:.75rem;padding:.25rem 0;font-size:var(--docs-body-size, .8125rem)}.docs-upload-meta{display:flex;align-items:baseline;gap:.5rem;min-width:0}.docs-upload-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-upload-size{flex:0 0 auto;color:var(--docs-text-muted, var(--text-hint-color));font-size:var(--docs-meta-size, .75rem);font-variant-numeric:tabular-nums}.docs-upload-duplicate{display:inline-flex;align-items:center;gap:.25rem;min-width:0;color:var(--color-warning-default);font-size:var(--docs-meta-size, .75rem);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.docs-upload-state{display:inline-flex;align-items:center;gap:.25rem;font-size:var(--docs-meta-size, .75rem);white-space:nowrap}.docs-upload-state.done{color:var(--color-success-default)}.docs-upload-state.error{color:var(--color-danger-default)}.docs-upload-actions{display:inline-flex;align-items:center;justify-content:flex-end;gap:.125rem}.docs-upload-progress button[nbButton]{display:inline-flex;align-items:center;gap:.25rem;height:1.5rem;min-height:1.5rem;padding-inline:.375rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem)}.docs-upload-progress button[nbButton] nb-icon{margin:0;font-size:.875rem}@media(max-width:575px){.docs-upload-row{grid-template-columns:minmax(0,1fr) auto}.docs-upload-row .docs-upload-actions{grid-column:2;grid-row:1}.docs-upload-row nb-progress-bar,.docs-upload-row .docs-upload-state{grid-column:1 / -1;grid-row:2}}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i2.NbProgressBarComponent, selector: "nb-progress-bar", inputs: ["value", "status", "size", "displayValue"] }, { kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UploadProgressComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-upload-progress', template: `
		<nb-card class="docs-upload-progress" *ngIf="items?.length" [attr.aria-label]="'DOCS.A11Y.UPLOAD_PROGRESS' | translate">
			<nb-card-header class="docs-upload-header">
				<span>{{ 'DOCS.UPLOAD.BUTTON' | translate }}</span>
				<button nbButton ghost size="tiny" (click)="clearFinished.emit()">
					{{ 'DOCS.UPLOAD.CLEAR_FINISHED' | translate }}
				</button>
			</nb-card-header>
			<nb-card-body>
				<div class="docs-upload-row" *ngFor="let item of items; trackBy: trackByKey">
					<div class="docs-upload-meta">
						<span class="docs-upload-name" [nbTooltip]="item.file.name">{{ item.file.name }}</span>
						<span class="docs-upload-size">{{ humanize(item.file.size) }}</span>
						<!-- Dedup notice (R-UPL-04) — advisory only, the upload still went through -->
						<span class="docs-upload-duplicate" *ngIf="item.duplicateOfId">
							<nb-icon icon="copy-outline" size="tiny"></nb-icon>
							{{
								item.duplicateOfName
									? ('DOCS.UPLOAD.DUPLICATE_NOTICE' | translate : { name: item.duplicateOfName })
									: ('DOCS.UPLOAD.DUPLICATE_NOTICE_UNKNOWN' | translate)
							}}
						</span>
					</div>
					<nb-progress-bar
						*ngIf="item.state === 'uploading'"
						[value]="item.progress"
						status="primary"
						size="tiny"
					></nb-progress-bar>
					<span class="docs-upload-state done" *ngIf="item.state === 'done'">
						<nb-icon icon="checkmark-circle-2-outline" size="tiny"></nb-icon>
						{{ 'DOCS.UPLOAD.PROGRESS_DONE' | translate }}
					</span>
					<span class="docs-upload-state error" *ngIf="item.state === 'error'" [nbTooltip]="item.error || ''">
						<nb-icon icon="alert-triangle-outline" size="tiny"></nb-icon>
						{{ 'DOCS.UPLOAD.PROGRESS_ERROR' | translate }}
					</span>
					<span class="docs-upload-actions">
						<button *ngIf="item.state === 'error'" nbButton ghost size="tiny" (click)="retry.emit(item.key)">
							{{ 'DOCS.UPLOAD.RETRY' | translate }}
						</button>
						<button nbButton ghost size="tiny" (click)="dismiss.emit(item.key)">
							<nb-icon icon="close-outline" size="tiny"></nb-icon>
						</button>
					</span>
				</div>
			</nb-card-body>
		</nb-card>
	`, standalone: false, styles: [":host{display:block;min-width:0}.docs-upload-progress{margin:0;border:0;border-radius:var(--docs-radius-lg, .5rem);background:var(--docs-surface, var(--background-basic-color-1));box-shadow:inset 0 0 0 1px var(--docs-hairline, rgba(126, 126, 143, .18))}.docs-upload-header{display:flex;justify-content:space-between;align-items:center;gap:.5rem;padding:.5rem .75rem;font-size:var(--docs-label-size, .6875rem);font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--docs-text-muted, var(--text-hint-color))}.docs-upload-progress nb-card-body{padding:.25rem .75rem .5rem}.docs-upload-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(6rem,12rem) auto;align-items:center;gap:.75rem;padding:.25rem 0;font-size:var(--docs-body-size, .8125rem)}.docs-upload-meta{display:flex;align-items:baseline;gap:.5rem;min-width:0}.docs-upload-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.docs-upload-size{flex:0 0 auto;color:var(--docs-text-muted, var(--text-hint-color));font-size:var(--docs-meta-size, .75rem);font-variant-numeric:tabular-nums}.docs-upload-duplicate{display:inline-flex;align-items:center;gap:.25rem;min-width:0;color:var(--color-warning-default);font-size:var(--docs-meta-size, .75rem);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.docs-upload-state{display:inline-flex;align-items:center;gap:.25rem;font-size:var(--docs-meta-size, .75rem);white-space:nowrap}.docs-upload-state.done{color:var(--color-success-default)}.docs-upload-state.error{color:var(--color-danger-default)}.docs-upload-actions{display:inline-flex;align-items:center;justify-content:flex-end;gap:.125rem}.docs-upload-progress button[nbButton]{display:inline-flex;align-items:center;gap:.25rem;height:1.5rem;min-height:1.5rem;padding-inline:.375rem;border-radius:var(--docs-radius, .375rem);font-size:var(--docs-meta-size, .75rem)}.docs-upload-progress button[nbButton] nb-icon{margin:0;font-size:.875rem}@media(max-width:575px){.docs-upload-row{grid-template-columns:minmax(0,1fr) auto}.docs-upload-row .docs-upload-actions{grid-column:2;grid-row:1}.docs-upload-row nb-progress-bar,.docs-upload-row .docs-upload-state{grid-column:1 / -1;grid-row:2}}\n"] }]
        }], propDecorators: { items: [{
                type: Input
            }], retry: [{
                type: Output
            }], dismiss: [{
                type: Output
            }], clearFinished: [{
                type: Output
            }] } });
//# sourceMappingURL=upload-progress.component.js.map