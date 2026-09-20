import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NbButtonModule, NbIconModule, NbProgressBarModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { DocumentsService } from '../../services/documents.service';
import { AngularNodeViewComponent } from '../node-view/angular-node-view-renderer';
import { EditorUploadService } from '../services/editor-upload.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
/**
 * Node view for `fileAttachment` (spec 05 §6.2/§6.6): file-type icon, name,
 * humanized size, download + open-in-Documents actions; uploading placeholder
 * shows a progress bar, a failed upload flips to Retry / Remove; a card that
 * never resolved a `documentId` renders the "missing" state.
 */
export class FileAttachmentNodeViewComponent extends AngularNodeViewComponent {
    constructor() {
        super(...arguments);
        this.documentsService = inject(DocumentsService);
        this.uploadService = inject(EditorUploadService, { optional: true });
        this.router = inject(Router);
        this.changeDetectorRef = inject(ChangeDetectorRef);
        /** True while the signed download URL is being resolved (`OnPush` — flagged explicitly). */
        this.downloading = false;
    }
    get documentId() {
        return this.node().attrs['documentId'] ?? null;
    }
    get name() {
        return this.node().attrs['name'] || '';
    }
    get upload() {
        return this.uploadService?.getUpload(this.node().attrs['uploadId']);
    }
    /** No documentId and no live upload = orphaned placeholder / deleted target. */
    get isMissing() {
        return !this.documentId && !this.upload;
    }
    get humanSize() {
        const size = Number(this.node().attrs['size'] ?? 0);
        if (!size)
            return '';
        const units = ['B', 'KB', 'MB', 'GB'];
        const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
        return `${(size / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
    }
    get icon() {
        const mime = this.node().attrs['mimeType'] || '';
        if (mime.startsWith('image/'))
            return 'image-outline';
        if (mime.includes('pdf'))
            return 'file-text-outline';
        if (mime.includes('sheet') || mime.includes('csv'))
            return 'grid-outline';
        return 'file-outline';
    }
    /**
     * Downloads the attachment.
     *
     * 🛑 This was an `<a [href]>` straight at `GET /:id/download`. That route is a
     * JWT-guarded JSON endpoint answering `{ url }` — a plain navigation carries no
     * bearer token, so every attachment download landed on a 401. The signed
     * provider URL is resolved through the authenticated client first, then opened.
     */
    async download() {
        const id = this.documentId;
        if (!id || this.downloading)
            return;
        this.downloading = true;
        this.changeDetectorRef.markForCheck();
        try {
            const url = await firstValueFrom(this.documentsService.getDownloadUrl(id));
            if (url)
                window.open(url, '_blank', 'noopener');
        }
        catch {
            // A missing/expired blob is already reflected by the card's own states.
        }
        finally {
            this.downloading = false;
            this.changeDetectorRef.markForCheck();
        }
    }
    openInDocuments() {
        if (this.documentId) {
            void this.router.navigate(['/pages/documents'], { queryParams: { id: this.documentId } });
        }
    }
    retry() {
        const uploadId = this.node().attrs['uploadId'];
        if (uploadId)
            this.uploadService?.retry(this.editor(), uploadId);
    }
    remove() {
        const uploadId = this.node().attrs['uploadId'];
        if (uploadId)
            this.uploadService?.remove(this.editor(), uploadId);
        else
            this.deleteNode()();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FileAttachmentNodeViewComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: FileAttachmentNodeViewComponent, isStandalone: true, selector: "gz-file-attachment-node-view", usesInheritance: true, ngImport: i0, template: `
		<div
			class="gz-attachment-card"
			[class.selected]="selected()"
			[class.missing]="isMissing"
			tabindex="0"
			role="group"
		>
			<nb-icon class="gz-attachment-icon" [icon]="icon"></nb-icon>
			<div class="gz-attachment-meta">
				<span class="gz-attachment-name">{{ name }}</span>
				<span class="gz-attachment-size" *ngIf="!upload">{{ humanSize }}</span>
				<span class="gz-attachment-size" *ngIf="upload?.status === 'uploading'">
					{{ 'DOCS.EDITOR.ATTACHMENT.UPLOADING' | translate }}
				</span>
				<span class="gz-attachment-error" *ngIf="upload?.status === 'error'">
					{{ 'DOCS.EDITOR.ATTACHMENT.FAILED' | translate }}
				</span>
				<span class="gz-attachment-error" *ngIf="isMissing">
					{{ 'DOCS.EDITOR.ATTACHMENT.MISSING' | translate }}
				</span>
				<nb-progress-bar
					*ngIf="upload?.status === 'uploading'"
					[value]="upload?.progress ?? 0"
					size="tiny"
					status="primary"
				></nb-progress-bar>
			</div>
			<div class="gz-attachment-actions">
				<ng-container *ngIf="documentId">
					<button
						nbButton
						ghost
						size="tiny"
						type="button"
						[disabled]="downloading"
						(click)="download()"
						[attr.aria-label]="'DOCS.EDITOR.ATTACHMENT.DOWNLOAD' | translate"
					>
						<nb-icon icon="download-outline"></nb-icon>
					</button>
					<button
						nbButton
						ghost
						size="tiny"
						type="button"
						(click)="openInDocuments()"
						[attr.aria-label]="'DOCS.EDITOR.ATTACHMENT.OPEN' | translate"
					>
						<nb-icon icon="external-link-outline"></nb-icon>
					</button>
				</ng-container>
				<ng-container *ngIf="upload?.status === 'error'">
					<button nbButton ghost size="tiny" status="primary" type="button" (click)="retry()">
						{{ 'DOCS.EDITOR.ATTACHMENT.RETRY' | translate }}
					</button>
					<button nbButton ghost size="tiny" status="danger" type="button" (click)="remove()">
						{{ 'DOCS.EDITOR.ATTACHMENT.REMOVE' | translate }}
					</button>
				</ng-container>
			</div>
		</div>
	`, isInline: true, styles: [":host{display:block}.gz-attachment-card{display:flex;align-items:center;gap:.625rem;margin:.375rem 0;padding:.625rem .75rem;border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);background:var(--background-basic-color-1)}.gz-attachment-card.selected{outline:2px solid var(--color-primary-transparent-300)}.gz-attachment-card.missing{opacity:.55}.gz-attachment-icon{font-size:1.5rem;color:var(--text-hint-color)}.gz-attachment-meta{flex:1;min-width:0;display:flex;flex-direction:column;gap:.125rem}.gz-attachment-name{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gz-attachment-size{font-size:.75rem;color:var(--text-hint-color)}.gz-attachment-error{font-size:.75rem;color:var(--color-danger-default)}.gz-attachment-actions{display:flex;align-items:center;gap:.125rem}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: NbProgressBarModule }, { kind: "component", type: i2.NbProgressBarComponent, selector: "nb-progress-bar", inputs: ["value", "status", "size", "displayValue"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FileAttachmentNodeViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-file-attachment-node-view', standalone: true, imports: [CommonModule, TranslateModule, NbButtonModule, NbIconModule, NbProgressBarModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `
		<div
			class="gz-attachment-card"
			[class.selected]="selected()"
			[class.missing]="isMissing"
			tabindex="0"
			role="group"
		>
			<nb-icon class="gz-attachment-icon" [icon]="icon"></nb-icon>
			<div class="gz-attachment-meta">
				<span class="gz-attachment-name">{{ name }}</span>
				<span class="gz-attachment-size" *ngIf="!upload">{{ humanSize }}</span>
				<span class="gz-attachment-size" *ngIf="upload?.status === 'uploading'">
					{{ 'DOCS.EDITOR.ATTACHMENT.UPLOADING' | translate }}
				</span>
				<span class="gz-attachment-error" *ngIf="upload?.status === 'error'">
					{{ 'DOCS.EDITOR.ATTACHMENT.FAILED' | translate }}
				</span>
				<span class="gz-attachment-error" *ngIf="isMissing">
					{{ 'DOCS.EDITOR.ATTACHMENT.MISSING' | translate }}
				</span>
				<nb-progress-bar
					*ngIf="upload?.status === 'uploading'"
					[value]="upload?.progress ?? 0"
					size="tiny"
					status="primary"
				></nb-progress-bar>
			</div>
			<div class="gz-attachment-actions">
				<ng-container *ngIf="documentId">
					<button
						nbButton
						ghost
						size="tiny"
						type="button"
						[disabled]="downloading"
						(click)="download()"
						[attr.aria-label]="'DOCS.EDITOR.ATTACHMENT.DOWNLOAD' | translate"
					>
						<nb-icon icon="download-outline"></nb-icon>
					</button>
					<button
						nbButton
						ghost
						size="tiny"
						type="button"
						(click)="openInDocuments()"
						[attr.aria-label]="'DOCS.EDITOR.ATTACHMENT.OPEN' | translate"
					>
						<nb-icon icon="external-link-outline"></nb-icon>
					</button>
				</ng-container>
				<ng-container *ngIf="upload?.status === 'error'">
					<button nbButton ghost size="tiny" status="primary" type="button" (click)="retry()">
						{{ 'DOCS.EDITOR.ATTACHMENT.RETRY' | translate }}
					</button>
					<button nbButton ghost size="tiny" status="danger" type="button" (click)="remove()">
						{{ 'DOCS.EDITOR.ATTACHMENT.REMOVE' | translate }}
					</button>
				</ng-container>
			</div>
		</div>
	`, styles: [":host{display:block}.gz-attachment-card{display:flex;align-items:center;gap:.625rem;margin:.375rem 0;padding:.625rem .75rem;border:1px solid var(--border-basic-color-3);border-radius:var(--border-radius);background:var(--background-basic-color-1)}.gz-attachment-card.selected{outline:2px solid var(--color-primary-transparent-300)}.gz-attachment-card.missing{opacity:.55}.gz-attachment-icon{font-size:1.5rem;color:var(--text-hint-color)}.gz-attachment-meta{flex:1;min-width:0;display:flex;flex-direction:column;gap:.125rem}.gz-attachment-name{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gz-attachment-size{font-size:.75rem;color:var(--text-hint-color)}.gz-attachment-error{font-size:.75rem;color:var(--color-danger-default)}.gz-attachment-actions{display:flex;align-items:center;gap:.125rem}\n"] }]
        }] });
//# sourceMappingURL=file-attachment-node-view.component.js.map