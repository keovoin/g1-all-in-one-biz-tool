import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDialogRef, NbInputModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
/**
 * Tiny URL prompt used by the slash commands Video / Embed (spec 05 §6.4).
 * Closes with the trimmed URL, or `null` on cancel.
 */
export class UrlPromptDialogComponent {
    constructor() {
        this.titleKey = 'DOCS.EDITOR.URL_PROMPT.TITLE';
        this.dialogRef = inject((NbDialogRef));
        this.url = '';
    }
    get isValid() {
        const trimmed = this.url.trim();
        return /^https?:\/\/.+/i.test(trimmed);
    }
    confirm() {
        if (this.isValid)
            this.dialogRef.close(this.url.trim());
    }
    cancel() {
        this.dialogRef.close(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UrlPromptDialogComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: UrlPromptDialogComponent, isStandalone: true, selector: "gz-docs-url-prompt-dialog", inputs: { titleKey: "titleKey" }, ngImport: i0, template: `
		<nb-card class="gz-url-dialog">
			<nb-card-header>{{ titleKey | translate }}</nb-card-header>
			<nb-card-body>
				<input
					nbInput
					fullWidth
					type="url"
					[placeholder]="'DOCS.EDITOR.URL_PROMPT.PLACEHOLDER' | translate"
					[(ngModel)]="url"
					(keydown.enter)="confirm()"
				/>
			</nb-card-body>
			<nb-card-footer class="gz-url-dialog-footer">
				<button nbButton ghost type="button" (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" type="button" [disabled]="!isValid" (click)="confirm()">
					{{ 'DOCS.EDITOR.URL_PROMPT.INSERT' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, isInline: true, styles: [".gz-url-dialog{min-width:24rem}.gz-url-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"], dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "ngmodule", type: NbInputModule }, { kind: "directive", type: i2.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UrlPromptDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-url-prompt-dialog', standalone: true, imports: [FormsModule, TranslateModule, NbButtonModule, NbCardModule, NbInputModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `
		<nb-card class="gz-url-dialog">
			<nb-card-header>{{ titleKey | translate }}</nb-card-header>
			<nb-card-body>
				<input
					nbInput
					fullWidth
					type="url"
					[placeholder]="'DOCS.EDITOR.URL_PROMPT.PLACEHOLDER' | translate"
					[(ngModel)]="url"
					(keydown.enter)="confirm()"
				/>
			</nb-card-body>
			<nb-card-footer class="gz-url-dialog-footer">
				<button nbButton ghost type="button" (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" type="button" [disabled]="!isValid" (click)="confirm()">
					{{ 'DOCS.EDITOR.URL_PROMPT.INSERT' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, styles: [".gz-url-dialog{min-width:24rem}.gz-url-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"] }]
        }], propDecorators: { titleKey: [{
                type: Input
            }] } });
//# sourceMappingURL=url-prompt-dialog.component.js.map