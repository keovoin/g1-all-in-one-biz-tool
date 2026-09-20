import { Component, Input } from '@angular/core';
import { DocumentKindEnum, DocumentVisibilityEnum } from '@gauzy/contracts';
import { sanitizeMediaUrl } from '../../../editor/read-only/safe-url.util';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
import * as i3 from "@gauzy/ui-core/shared";
import * as i4 from "@ngx-translate/core";
/**
 * Name cell: thumbnail or kind icon (Eva; per-mime variants for FILE), name with
 * summary/original-filename tooltip, and inline pills (archived, private,
 * locked, version).
 *
 * The leading slot is a FIXED-size box whatever it holds, so a row keeps its height and its
 * text alignment whether the document has a generated thumbnail or not — and gaining one on
 * a later poll never shifts the column.
 */
export class NameCellComponent {
    constructor() {
        this.visibilityEnum = DocumentVisibilityEnum;
        /** Set once the thumbnail failed to load (expired signed URL, deleted object). */
        this.thumbnailFailed = false;
    }
    /**
     * The row's preview image, or `null` when the kind icon should stand in.
     *
     * `thumbUrl` is the virtual column the backend resolves from `storageProvider` +
     * `thumbKey`, so it is absent on every document the thumbnail job has not processed
     * (folders and pages included) — the icon is the normal case, not the error case.
     *
     * 🛑 Sanitized before it is bound: the value comes from the storage provider and lands in
     * `<img [src]>`, where Angular's own check only refuses `javascript:`
     * (`editor/read-only/safe-url.util.ts` carries the full reasoning).
     */
    get thumbnailUrl() {
        if (!this.rowData?.thumbUrl || this.thumbnailFailed)
            return null;
        return sanitizeMediaUrl(this.rowData.thumbUrl);
    }
    /** Falls back to the kind icon instead of leaving a broken image in the column. */
    onThumbnailError() {
        this.thumbnailFailed = true;
    }
    get tooltip() {
        return this.rowData?.summary ?? this.rowData?.originalFilename ?? this.rowData?.name ?? '';
    }
    get icon() {
        switch (this.rowData?.kind) {
            case DocumentKindEnum.FOLDER:
                return 'folder-outline';
            case DocumentKindEnum.PAGE:
                return 'file-text-outline';
            default:
                return this.fileIcon(this.rowData?.mimeType);
        }
    }
    fileIcon(mimeType) {
        if (!mimeType)
            return 'file-outline';
        if (mimeType === 'application/pdf')
            return 'file-text-outline';
        if (mimeType.startsWith('image/'))
            return 'image-outline';
        if (mimeType.includes('spreadsheet') || mimeType.includes('csv') || mimeType.includes('excel'))
            return 'grid-outline';
        if (mimeType.includes('word') || mimeType.includes('opendocument.text'))
            return 'file-text-outline';
        return 'file-outline';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NameCellComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: NameCellComponent, isStandalone: false, selector: "gz-docs-name-cell", inputs: { rowData: "rowData", value: "value" }, ngImport: i0, template: `
		<div class="docs-name-cell" [nbTooltip]="tooltip" nbTooltipStatus="basic">
			<span class="docs-name-lead">
				<img
					*ngIf="thumbnailUrl as thumbnail; else leadIcon"
					class="docs-name-thumb"
					[src]="thumbnail"
					alt=""
					loading="lazy"
					(error)="onThumbnailError()"
				/>
				<ng-template #leadIcon>
					<span class="docs-name-icon" *ngIf="rowData?.icon; else evaIcon">{{ rowData.icon }}</span>
					<ng-template #evaIcon>
						<nb-icon [icon]="icon" size="small" [style.color]="rowData?.color || null"></nb-icon>
					</ng-template>
				</ng-template>
			</span>
			<span class="docs-name-text">{{ rowData?.name }}</span>
			<nb-badge *ngIf="rowData?.isArchived" status="basic" [text]="'DOCS.FILTERS.PRESET_ARCHIVED' | translate"></nb-badge>
			<nb-icon
				*ngIf="rowData?.visibility === visibilityEnum.PRIVATE"
				icon="eye-off-outline"
				size="tiny"
				[nbTooltip]="'DOCS.VISIBILITY.PRIVATE' | translate"
			></nb-icon>
			<nb-icon *ngIf="rowData?.isLocked" icon="lock-outline" size="tiny"></nb-icon>
			<span class="docs-name-version" *ngIf="rowData?.version > 1">v{{ rowData.version }}</span>
		</div>
	`, isInline: true, styles: [".docs-name-cell{display:flex;align-items:center;gap:.375rem;width:100%;max-width:100%;min-width:0}.docs-name-lead{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:1.5rem;height:1.5rem}.docs-name-thumb{width:100%;height:100%;object-fit:cover;border-radius:var(--docs-radius, .375rem);background:var(--background-basic-color-2)}.docs-name-text{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--docs-text, var(--text-basic-color))}.docs-name-cell nb-icon,.docs-name-version{flex:0 0 auto}.docs-name-cell nb-icon{font-size:.875rem;color:var(--docs-text-muted, var(--text-hint-color))}.docs-name-version{font-size:var(--docs-label-size, .6875rem);font-variant-numeric:tabular-nums;color:var(--docs-text-muted, var(--text-hint-color))}.docs-name-cell ::ng-deep nb-badge{position:static;display:inline-flex;align-items:center;flex:0 0 auto;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;transform:none}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "directive", type: i3.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NameCellComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-name-cell', template: `
		<div class="docs-name-cell" [nbTooltip]="tooltip" nbTooltipStatus="basic">
			<span class="docs-name-lead">
				<img
					*ngIf="thumbnailUrl as thumbnail; else leadIcon"
					class="docs-name-thumb"
					[src]="thumbnail"
					alt=""
					loading="lazy"
					(error)="onThumbnailError()"
				/>
				<ng-template #leadIcon>
					<span class="docs-name-icon" *ngIf="rowData?.icon; else evaIcon">{{ rowData.icon }}</span>
					<ng-template #evaIcon>
						<nb-icon [icon]="icon" size="small" [style.color]="rowData?.color || null"></nb-icon>
					</ng-template>
				</ng-template>
			</span>
			<span class="docs-name-text">{{ rowData?.name }}</span>
			<nb-badge *ngIf="rowData?.isArchived" status="basic" [text]="'DOCS.FILTERS.PRESET_ARCHIVED' | translate"></nb-badge>
			<nb-icon
				*ngIf="rowData?.visibility === visibilityEnum.PRIVATE"
				icon="eye-off-outline"
				size="tiny"
				[nbTooltip]="'DOCS.VISIBILITY.PRIVATE' | translate"
			></nb-icon>
			<nb-icon *ngIf="rowData?.isLocked" icon="lock-outline" size="tiny"></nb-icon>
			<span class="docs-name-version" *ngIf="rowData?.version > 1">v{{ rowData.version }}</span>
		</div>
	`, standalone: false, styles: [".docs-name-cell{display:flex;align-items:center;gap:.375rem;width:100%;max-width:100%;min-width:0}.docs-name-lead{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:1.5rem;height:1.5rem}.docs-name-thumb{width:100%;height:100%;object-fit:cover;border-radius:var(--docs-radius, .375rem);background:var(--background-basic-color-2)}.docs-name-text{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--docs-text, var(--text-basic-color))}.docs-name-cell nb-icon,.docs-name-version{flex:0 0 auto}.docs-name-cell nb-icon{font-size:.875rem;color:var(--docs-text-muted, var(--text-hint-color))}.docs-name-version{font-size:var(--docs-label-size, .6875rem);font-variant-numeric:tabular-nums;color:var(--docs-text-muted, var(--text-hint-color))}.docs-name-cell ::ng-deep nb-badge{position:static;display:inline-flex;align-items:center;flex:0 0 auto;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;transform:none}\n"] }]
        }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=name-cell.component.js.map