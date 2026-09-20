import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NbButtonModule, NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from '@gauzy/ui-core/core';
import { DocumentsService } from '../../services/documents.service';
import { DocumentStaticViewComponent } from '../read-only/document-static-view.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
/**
 * Version history panel (UX spec §10.7, spec 05 §9.4): `DocumentVersion`
 * snapshots newest first; selecting one shows a read-only static render;
 * Restore is non-destructive (the server snapshots current content first) and
 * uses an inline two-step confirm stating exactly that.
 */
export class VersionHistoryPanelComponent {
    constructor() {
        this.closed = new EventEmitter();
        /** Emits the restored document — the editor reloads content from it. */
        this.restored = new EventEmitter();
        this.documentsService = inject(DocumentsService);
        this.toastrService = inject(ToastrService);
        this.translate = inject(TranslateService);
        this.cdr = inject(ChangeDetectorRef);
        this.versions = [];
        this.selected = null;
        this.selectedSnapshot = null;
        this.loading = false;
        this.loadError = false;
        this.restoring = false;
        this.confirmingRestore = false;
    }
    ngOnInit() {
        void this.load();
    }
    async load() {
        this.loading = true;
        this.loadError = false;
        this.cdr.markForCheck();
        try {
            const { items } = await firstValueFrom(this.documentsService.getVersions(this.documentId));
            this.versions = items ?? [];
        }
        catch {
            this.loadError = true;
        }
        finally {
            this.loading = false;
            this.cdr.markForCheck();
        }
    }
    async select(version) {
        this.selected = version;
        this.selectedSnapshot = null;
        this.confirmingRestore = false;
        this.cdr.markForCheck();
        try {
            // The list projection has no content columns — fetch the full snapshot.
            this.selectedSnapshot = await firstValueFrom(this.documentsService.getVersion(this.documentId, version.id));
        }
        catch {
            this.selectedSnapshot = version;
        }
        this.cdr.markForCheck();
    }
    async restore() {
        if (!this.selected || this.restoring)
            return;
        this.restoring = true;
        this.cdr.markForCheck();
        try {
            const document = await firstValueFrom(this.documentsService.restoreVersion(this.documentId, this.selected.id));
            this.toastrService.success(this.translate.instant('DOCS.TOASTS.UPDATED'));
            this.restored.emit(document);
            this.confirmingRestore = false;
            await this.load();
        }
        catch {
            this.toastrService.danger(this.translate.instant('DOCS.ERRORS.GENERIC_RETRY'));
        }
        finally {
            this.restoring = false;
            this.cdr.markForCheck();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: VersionHistoryPanelComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: VersionHistoryPanelComponent, isStandalone: true, selector: "gz-docs-version-history", inputs: { documentId: "documentId" }, outputs: { closed: "closed", restored: "restored" }, ngImport: i0, template: `
		<div class="gz-versions-panel" [nbSpinner]="loading" nbSpinnerStatus="primary">
			<div class="gz-versions-header">
				<h6>{{ 'DOCS.EDITOR.VERSION_HISTORY' | translate }}</h6>
				<button nbButton ghost size="tiny" type="button" (click)="closed.emit()">
					<nb-icon icon="close-outline"></nb-icon>
				</button>
			</div>

			<div class="gz-versions-error" *ngIf="loadError">
				{{ 'DOCS.ERRORS.PANEL_LOAD' | translate }}
				<button nbButton size="tiny" status="primary" type="button" (click)="load()">
					{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}
				</button>
			</div>

			<div class="gz-versions-empty" *ngIf="!loading && !loadError && !versions.length">
				{{ 'DOCS.EDITOR.NO_VERSIONS' | translate }}
			</div>

			<ul class="gz-versions-list" *ngIf="versions.length">
				<li *ngFor="let version of versions">
					<button
						type="button"
						class="gz-version-row"
						[class.active]="selected?.id === version.id"
						(click)="select(version)"
					>
						<span class="gz-version-name">{{ version.name }}</span>
						<span class="gz-version-meta">
							{{ version.lastSavedAt | date : 'medium' }}
							<ng-container *ngIf="version.createdBy?.fullName"> · {{ version.createdBy?.fullName }}</ng-container>
						</span>
					</button>
				</li>
			</ul>

			<div class="gz-version-preview" *ngIf="selected">
				<div class="gz-version-preview-actions">
					<ng-container *ngIf="!confirmingRestore; else confirmRestore">
						<button nbButton size="tiny" status="primary" type="button" (click)="confirmingRestore = true">
							{{ 'DOCS.EDITOR.RESTORE' | translate }}
						</button>
					</ng-container>
					<ng-template #confirmRestore>
						<span class="gz-version-confirm-text">{{ 'DOCS.EDITOR.RESTORE_CONFIRM' | translate }}</span>
						<button nbButton size="tiny" status="danger" type="button" [disabled]="restoring" (click)="restore()">
							{{ 'DOCS.EDITOR.RESTORE' | translate }}
						</button>
						<button nbButton size="tiny" ghost type="button" (click)="confirmingRestore = false">
							{{ 'DOCS.UPLOAD.CANCEL' | translate }}
						</button>
					</ng-template>
				</div>
				<gz-document-static-view
					[contentJson]="selectedSnapshot?.contentJson ?? null"
					[contentHtml]="selectedSnapshot?.contentHtml ?? null"
				></gz-document-static-view>
			</div>
		</div>
	`, isInline: true, styles: [".gz-versions-panel{display:flex;flex-direction:column;gap:.5rem;height:100%;overflow-y:auto}.gz-versions-header{display:flex;align-items:center;justify-content:space-between}.gz-versions-header h6{margin:0}.gz-versions-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.125rem;max-height:16rem;overflow-y:auto}.gz-version-row{display:flex;flex-direction:column;align-items:flex-start;gap:.125rem;width:100%;text-align:left;border:none;background:transparent;padding:.375rem .5rem;border-radius:.25rem;cursor:pointer;color:var(--text-basic-color)}.gz-version-row:hover{background:var(--background-basic-color-2)}.gz-version-row.active{background:var(--color-primary-transparent-100)}.gz-version-name{font-weight:600}.gz-version-meta{font-size:.75rem;color:var(--text-hint-color)}.gz-version-preview{border-top:1px solid var(--border-basic-color-3);padding-top:.5rem;display:flex;flex-direction:column;gap:.5rem}.gz-version-preview-actions{display:flex;align-items:center;gap:.375rem;flex-wrap:wrap}.gz-version-confirm-text{font-size:.75rem;color:var(--text-hint-color)}.gz-versions-empty,.gz-versions-error{color:var(--text-hint-color);font-size:.875rem;display:flex;align-items:center;gap:.5rem}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: NbSpinnerModule }, { kind: "directive", type: i2.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "component", type: DocumentStaticViewComponent, selector: "gz-document-static-view", inputs: ["contentJson", "contentHtml", "markdown"] }, { kind: "pipe", type: i1.DatePipe, name: "date" }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: VersionHistoryPanelComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-version-history', standalone: true, imports: [
                        CommonModule,
                        TranslateModule,
                        NbButtonModule,
                        NbCardModule,
                        NbIconModule,
                        NbSpinnerModule,
                        DocumentStaticViewComponent
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `
		<div class="gz-versions-panel" [nbSpinner]="loading" nbSpinnerStatus="primary">
			<div class="gz-versions-header">
				<h6>{{ 'DOCS.EDITOR.VERSION_HISTORY' | translate }}</h6>
				<button nbButton ghost size="tiny" type="button" (click)="closed.emit()">
					<nb-icon icon="close-outline"></nb-icon>
				</button>
			</div>

			<div class="gz-versions-error" *ngIf="loadError">
				{{ 'DOCS.ERRORS.PANEL_LOAD' | translate }}
				<button nbButton size="tiny" status="primary" type="button" (click)="load()">
					{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}
				</button>
			</div>

			<div class="gz-versions-empty" *ngIf="!loading && !loadError && !versions.length">
				{{ 'DOCS.EDITOR.NO_VERSIONS' | translate }}
			</div>

			<ul class="gz-versions-list" *ngIf="versions.length">
				<li *ngFor="let version of versions">
					<button
						type="button"
						class="gz-version-row"
						[class.active]="selected?.id === version.id"
						(click)="select(version)"
					>
						<span class="gz-version-name">{{ version.name }}</span>
						<span class="gz-version-meta">
							{{ version.lastSavedAt | date : 'medium' }}
							<ng-container *ngIf="version.createdBy?.fullName"> · {{ version.createdBy?.fullName }}</ng-container>
						</span>
					</button>
				</li>
			</ul>

			<div class="gz-version-preview" *ngIf="selected">
				<div class="gz-version-preview-actions">
					<ng-container *ngIf="!confirmingRestore; else confirmRestore">
						<button nbButton size="tiny" status="primary" type="button" (click)="confirmingRestore = true">
							{{ 'DOCS.EDITOR.RESTORE' | translate }}
						</button>
					</ng-container>
					<ng-template #confirmRestore>
						<span class="gz-version-confirm-text">{{ 'DOCS.EDITOR.RESTORE_CONFIRM' | translate }}</span>
						<button nbButton size="tiny" status="danger" type="button" [disabled]="restoring" (click)="restore()">
							{{ 'DOCS.EDITOR.RESTORE' | translate }}
						</button>
						<button nbButton size="tiny" ghost type="button" (click)="confirmingRestore = false">
							{{ 'DOCS.UPLOAD.CANCEL' | translate }}
						</button>
					</ng-template>
				</div>
				<gz-document-static-view
					[contentJson]="selectedSnapshot?.contentJson ?? null"
					[contentHtml]="selectedSnapshot?.contentHtml ?? null"
				></gz-document-static-view>
			</div>
		</div>
	`, styles: [".gz-versions-panel{display:flex;flex-direction:column;gap:.5rem;height:100%;overflow-y:auto}.gz-versions-header{display:flex;align-items:center;justify-content:space-between}.gz-versions-header h6{margin:0}.gz-versions-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.125rem;max-height:16rem;overflow-y:auto}.gz-version-row{display:flex;flex-direction:column;align-items:flex-start;gap:.125rem;width:100%;text-align:left;border:none;background:transparent;padding:.375rem .5rem;border-radius:.25rem;cursor:pointer;color:var(--text-basic-color)}.gz-version-row:hover{background:var(--background-basic-color-2)}.gz-version-row.active{background:var(--color-primary-transparent-100)}.gz-version-name{font-weight:600}.gz-version-meta{font-size:.75rem;color:var(--text-hint-color)}.gz-version-preview{border-top:1px solid var(--border-basic-color-3);padding-top:.5rem;display:flex;flex-direction:column;gap:.5rem}.gz-version-preview-actions{display:flex;align-items:center;gap:.375rem;flex-wrap:wrap}.gz-version-confirm-text{font-size:.75rem;color:var(--text-hint-color)}.gz-versions-empty,.gz-versions-error{color:var(--text-hint-color);font-size:.875rem;display:flex;align-items:center;gap:.5rem}\n"] }]
        }], propDecorators: { documentId: [{
                type: Input,
                args: [{ required: true }]
            }], closed: [{
                type: Output
            }], restored: [{
                type: Output
            }] } });
//# sourceMappingURL=version-history-panel.component.js.map