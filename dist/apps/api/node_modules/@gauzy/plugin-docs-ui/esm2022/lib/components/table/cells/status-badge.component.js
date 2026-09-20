import { Component, Input } from '@angular/core';
import { DocumentStatusEnum, PermissionsEnum } from '@gauzy/contracts';
import { DOCS_PERMISSIONS } from '../../../docs-permission-groups';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "ngx-permissions";
import * as i3 from "@nebular/theme";
import * as i4 from "@ngx-translate/core";
/**
 * Processing status badge. UPLOADED folds into the "Processing" style with an
 * inline spinner; FAILED renders a red dot with the statusMessage tooltip and
 * an inline Retry link for DOCS_UPDATE holders.
 */
export class StatusBadgeComponent {
    constructor() {
        this.statusEnum = DocumentStatusEnum;
        this.permissions = PermissionsEnum;
        /**
         * Stable permission arrays for the template's `*ngxPermissionsOnly` gates.
         * 🛑 Never inline `[permissions.X]` in a binding — a fresh array each change-detection cycle
         * makes ngx-permissions re-validate forever and wedges the main thread.
         */
        this.docsPermissions = DOCS_PERMISSIONS;
    }
    get status() {
        return this.value ?? this.rowData?.status;
    }
    get isProcessing() {
        return this.status === DocumentStatusEnum.UPLOADED || this.status === DocumentStatusEnum.PROCESSING;
    }
    get cssClass() {
        if (this.isProcessing)
            return 'processing';
        return this.status === DocumentStatusEnum.READY ? 'ready' : 'failed';
    }
    get labelKey() {
        return `DOCS.STATUS.${this.isProcessing ? 'PROCESSING' : this.status}`;
    }
    get tooltip() {
        return this.status === DocumentStatusEnum.FAILED ? this.rowData?.statusMessage ?? '' : '';
    }
    onRetry(event) {
        event.stopPropagation();
        if (this.rowData && this.retryHandler)
            this.retryHandler(this.rowData);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StatusBadgeComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: StatusBadgeComponent, isStandalone: false, selector: "gz-docs-status-badge", inputs: { rowData: "rowData", value: "value" }, ngImport: i0, template: `
		<span class="docs-badge" [ngClass]="cssClass" [nbTooltip]="tooltip" nbTooltipStatus="basic">
			<nb-icon *ngIf="isProcessing" icon="loader-outline" size="tiny" class="docs-badge-spin"></nb-icon>
			<span class="docs-badge-dot" *ngIf="!isProcessing"></span>
			{{ labelKey | translate }}
			<a
				*ngxPermissionsOnly="docsPermissions.update"
				class="docs-badge-retry"
				href="javascript:void(0)"
				(click)="onRetry($event)"
				[hidden]="status !== statusEnum.FAILED"
				>{{ 'DOCS.UPLOAD.RETRY' | translate }}</a
			>
		</span>
	`, isInline: true, styles: [".docs-badge{display:inline-flex;align-items:center;gap:.25rem;max-width:100%;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:var(--docs-surface-sunken, var(--background-basic-color-2))}.docs-badge-dot{flex:0 0 auto;width:.375rem;height:.375rem;border-radius:50%;background:currentColor}.docs-badge.ready{color:var(--color-success-default)}.docs-badge.failed{color:var(--color-danger-default)}.docs-badge.processing{color:var(--color-info-default)}.docs-badge-spin{animation:docs-spin 1s linear infinite}@keyframes docs-spin{to{transform:rotate(360deg)}}.docs-badge-retry{margin-left:.125rem;font-weight:600;text-decoration:underline}.docs-badge nb-icon{font-size:.75rem}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: StatusBadgeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-status-badge', template: `
		<span class="docs-badge" [ngClass]="cssClass" [nbTooltip]="tooltip" nbTooltipStatus="basic">
			<nb-icon *ngIf="isProcessing" icon="loader-outline" size="tiny" class="docs-badge-spin"></nb-icon>
			<span class="docs-badge-dot" *ngIf="!isProcessing"></span>
			{{ labelKey | translate }}
			<a
				*ngxPermissionsOnly="docsPermissions.update"
				class="docs-badge-retry"
				href="javascript:void(0)"
				(click)="onRetry($event)"
				[hidden]="status !== statusEnum.FAILED"
				>{{ 'DOCS.UPLOAD.RETRY' | translate }}</a
			>
		</span>
	`, standalone: false, styles: [".docs-badge{display:inline-flex;align-items:center;gap:.25rem;max-width:100%;height:var(--gauzy-table-badge-height, 1.25rem);padding:0 var(--gauzy-table-chip-padding-x, .375rem);border-radius:var(--docs-radius, .375rem);font-size:var(--gauzy-table-chip-font-size, .6875rem);line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:var(--docs-surface-sunken, var(--background-basic-color-2))}.docs-badge-dot{flex:0 0 auto;width:.375rem;height:.375rem;border-radius:50%;background:currentColor}.docs-badge.ready{color:var(--color-success-default)}.docs-badge.failed{color:var(--color-danger-default)}.docs-badge.processing{color:var(--color-info-default)}.docs-badge-spin{animation:docs-spin 1s linear infinite}@keyframes docs-spin{to{transform:rotate(360deg)}}.docs-badge-retry{margin-left:.125rem;font-weight:600;text-decoration:underline}.docs-badge nb-icon{font-size:.75rem}\n"] }]
        }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=status-badge.component.js.map