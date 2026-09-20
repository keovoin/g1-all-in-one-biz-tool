import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDialogRef, NbInputModule, NbToggleModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { normalizeInboundDomain, normalizeInboundLocalPart } from '../models/docs-inbound.model';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
import * as i4 from "@ngx-translate/core";
/**
 * Registers an inbound capture address on a domain the organization owns.
 *
 * Template-driven like every other form in this package (`category-dialog.component.ts`): a
 * disabled confirm plus a re-check inside `confirm()`, no reactive forms.
 *
 * The two fields are normalized with the same rules the server applies
 * (`capture/inbound-address.util.ts`), so the previewed address is the address that will
 * actually be created — lower-cased, with a stray leading `@` or trailing dot on the domain
 * already removed. The server re-validates regardless; this only avoids a submit that is
 * certain to 400.
 *
 * `senderAllowlist` is deliberately **not** collected here. It is editable per address on the
 * settings page, and asking for it up front would front-load a decision most tenants make after
 * they have seen the first message arrive.
 *
 * Standalone — opened from the lazily route-loaded inbound settings page.
 */
export class InboundDomainDialogComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
        this.domain = '';
        this.localPart = 'docs';
        this.importBodyAsNote = false;
    }
    /** The domain as the server will store it, or `null` while it is not yet valid. */
    get normalizedDomain() {
        return normalizeInboundDomain(this.domain);
    }
    /** The mailbox name as the server will store it, or `null` while it is not yet valid. */
    get normalizedLocalPart() {
        return normalizeInboundLocalPart(this.localPart);
    }
    /**
     * The address that will be created, or `''` while either half is still invalid.
     *
     * A plain string: it is only interpolated, so a fresh value per change-detection pass costs
     * a comparison, not a re-render. Nothing binds an object or an array to a getter here — that
     * is what wedged the hub's main thread once already.
     */
    get previewAddress() {
        const domain = this.normalizedDomain;
        const localPart = this.normalizedLocalPart;
        return domain && localPart ? `${localPart}@${domain}` : '';
    }
    get canConfirm() {
        return !!this.normalizedDomain && !!this.normalizedLocalPart;
    }
    confirm() {
        const domain = this.normalizedDomain;
        const localPart = this.normalizedLocalPart;
        // Re-checked rather than trusted from `canConfirm`: Enter reaches this without the
        // button, and the button's disabled state is a hint, not a guarantee.
        if (!domain || !localPart)
            return;
        const result = {
            domain,
            localPart,
            importBodyAsNote: this.importBodyAsNote
        };
        this.dialogRef.close(result);
    }
    cancel() {
        this.dialogRef.close(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InboundDomainDialogComponent, deps: [{ token: i1.NbDialogRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: InboundDomainDialogComponent, isStandalone: true, selector: "gz-docs-inbound-domain-dialog", ngImport: i0, template: `
		<nb-card class="docs-dialog docs-inbound-domain-dialog">
			<nb-card-header>{{ 'DOCS.INBOUND.DIALOG_TITLE' | translate }}</nb-card-header>
			<nb-card-body>
				<label class="label" for="docs-inbound-domain">{{ 'DOCS.INBOUND.DOMAIN' | translate }}</label>
				<input
					id="docs-inbound-domain"
					nbInput
					fullWidth
					type="text"
					maxlength="255"
					autocomplete="off"
					placeholder="{{ 'DOCS.INBOUND.DOMAIN_PLACEHOLDER' | translate }}"
					[(ngModel)]="domain"
					(keydown.enter)="confirm()"
				/>
				<div class="hint" [class.warn]="!!domain?.trim() && !normalizedDomain">
					{{
						(!!domain?.trim() && !normalizedDomain
							? 'DOCS.INBOUND.DOMAIN_INVALID'
							: 'DOCS.INBOUND.DOMAIN_HINT'
						) | translate
					}}
				</div>

				<label class="label" for="docs-inbound-local-part">{{ 'DOCS.INBOUND.LOCAL_PART' | translate }}</label>
				<input
					id="docs-inbound-local-part"
					nbInput
					fullWidth
					type="text"
					maxlength="64"
					autocomplete="off"
					placeholder="{{ 'DOCS.INBOUND.LOCAL_PART_PLACEHOLDER' | translate }}"
					[(ngModel)]="localPart"
					(keydown.enter)="confirm()"
				/>
				<div class="hint" [class.warn]="!!localPart?.trim() && !normalizedLocalPart">
					{{
						(!!localPart?.trim() && !normalizedLocalPart
							? 'DOCS.INBOUND.LOCAL_PART_INVALID'
							: 'DOCS.INBOUND.LOCAL_PART_HINT'
						) | translate
					}}
				</div>

				<div class="docs-inbound-preview" *ngIf="previewAddress">
					<span class="hint">{{ 'DOCS.INBOUND.RESULTING_ADDRESS' | translate }}</span>
					<code>{{ previewAddress }}</code>
				</div>

				<nb-toggle class="docs-inbound-toggle" labelPosition="end" [(ngModel)]="importBodyAsNote">
					{{ 'DOCS.INBOUND.IMPORT_BODY' | translate }}
				</nb-toggle>
				<div class="hint">{{ 'DOCS.INBOUND.IMPORT_BODY_HINT' | translate }}</div>

				<p class="hint warn">{{ 'DOCS.INBOUND.DIALOG_PENDING_NOTICE' | translate }}</p>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" [disabled]="!canConfirm" (click)="confirm()">
					{{ 'DOCS.INBOUND.ADD_CONFIRM' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, isInline: true, styles: [".docs-inbound-domain-dialog{width:30rem;max-width:92vw}.label{display:block;margin:.75rem 0 .25rem;font-weight:600}.hint{color:var(--text-hint-color);font-size:.75rem;margin-top:.25rem}.hint.warn{color:var(--text-warning-color)}.docs-inbound-preview{display:flex;align-items:center;gap:.5rem;margin-top:1rem}.docs-inbound-preview code{font-size:.8125rem;overflow-wrap:anywhere}.docs-inbound-toggle{display:block;margin-top:1rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.MaxLengthValidator, selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", inputs: ["maxlength"] }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "ngmodule", type: NbInputModule }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "ngmodule", type: NbToggleModule }, { kind: "component", type: i1.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InboundDomainDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-inbound-domain-dialog', imports: [CommonModule, FormsModule, TranslateModule, NbButtonModule, NbCardModule, NbInputModule, NbToggleModule], template: `
		<nb-card class="docs-dialog docs-inbound-domain-dialog">
			<nb-card-header>{{ 'DOCS.INBOUND.DIALOG_TITLE' | translate }}</nb-card-header>
			<nb-card-body>
				<label class="label" for="docs-inbound-domain">{{ 'DOCS.INBOUND.DOMAIN' | translate }}</label>
				<input
					id="docs-inbound-domain"
					nbInput
					fullWidth
					type="text"
					maxlength="255"
					autocomplete="off"
					placeholder="{{ 'DOCS.INBOUND.DOMAIN_PLACEHOLDER' | translate }}"
					[(ngModel)]="domain"
					(keydown.enter)="confirm()"
				/>
				<div class="hint" [class.warn]="!!domain?.trim() && !normalizedDomain">
					{{
						(!!domain?.trim() && !normalizedDomain
							? 'DOCS.INBOUND.DOMAIN_INVALID'
							: 'DOCS.INBOUND.DOMAIN_HINT'
						) | translate
					}}
				</div>

				<label class="label" for="docs-inbound-local-part">{{ 'DOCS.INBOUND.LOCAL_PART' | translate }}</label>
				<input
					id="docs-inbound-local-part"
					nbInput
					fullWidth
					type="text"
					maxlength="64"
					autocomplete="off"
					placeholder="{{ 'DOCS.INBOUND.LOCAL_PART_PLACEHOLDER' | translate }}"
					[(ngModel)]="localPart"
					(keydown.enter)="confirm()"
				/>
				<div class="hint" [class.warn]="!!localPart?.trim() && !normalizedLocalPart">
					{{
						(!!localPart?.trim() && !normalizedLocalPart
							? 'DOCS.INBOUND.LOCAL_PART_INVALID'
							: 'DOCS.INBOUND.LOCAL_PART_HINT'
						) | translate
					}}
				</div>

				<div class="docs-inbound-preview" *ngIf="previewAddress">
					<span class="hint">{{ 'DOCS.INBOUND.RESULTING_ADDRESS' | translate }}</span>
					<code>{{ previewAddress }}</code>
				</div>

				<nb-toggle class="docs-inbound-toggle" labelPosition="end" [(ngModel)]="importBodyAsNote">
					{{ 'DOCS.INBOUND.IMPORT_BODY' | translate }}
				</nb-toggle>
				<div class="hint">{{ 'DOCS.INBOUND.IMPORT_BODY_HINT' | translate }}</div>

				<p class="hint warn">{{ 'DOCS.INBOUND.DIALOG_PENDING_NOTICE' | translate }}</p>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton ghost (click)="cancel()">{{ 'DOCS.UPLOAD.CANCEL' | translate }}</button>
				<button nbButton status="primary" [disabled]="!canConfirm" (click)="confirm()">
					{{ 'DOCS.INBOUND.ADD_CONFIRM' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, styles: [".docs-inbound-domain-dialog{width:30rem;max-width:92vw}.label{display:block;margin:.75rem 0 .25rem;font-weight:600}.hint{color:var(--text-hint-color);font-size:.75rem;margin-top:.25rem}.hint.warn{color:var(--text-warning-color)}.docs-inbound-preview{display:flex;align-items:center;gap:.5rem;margin-top:1rem}.docs-inbound-preview code{font-size:.8125rem;overflow-wrap:anywhere}.docs-inbound-toggle{display:block;margin-top:1rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }] });
//# sourceMappingURL=inbound-domain-dialog.component.js.map