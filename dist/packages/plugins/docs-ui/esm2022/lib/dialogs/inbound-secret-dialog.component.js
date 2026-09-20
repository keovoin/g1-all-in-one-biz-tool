import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NbButtonModule, NbCardModule, NbDialogRef, NbIconModule } from '@nebular/theme';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "@nebular/theme";
import * as i3 from "@gauzy/ui-core/core";
/**
 * One-time reveal of an inbound address's relay secret.
 *
 * The server stores only a SHA-256 of this value, so the plaintext exists exactly twice in its
 * whole life: in the `POST /inbound-addresses` (or `/rotate-secret`) response, and on this
 * screen. Nothing can ever recover it again — losing it means rotating, which invalidates the
 * secret the relay is currently using.
 *
 * That is why this is a modal with a single acknowledging button rather than a toast or an
 * inline panel, and why the caller opens it with `closeOnEsc: false` and
 * `closeOnBackdropClick: false`: a reflexive Esc must not be able to destroy a value that
 * cannot be asked for again.
 *
 * Standalone — it is opened from the (lazily route-loaded) inbound settings page, which lives
 * outside `DocsUiModule`'s injector.
 */
export class InboundSecretDialogComponent extends TranslationBaseComponent {
    constructor(translateService, dialogRef, toastrService) {
        super(translateService);
        this.translateService = translateService;
        this.dialogRef = dialogRef;
        this.toastrService = toastrService;
        /**
         * The one-time envelope. Held only for as long as the dialog is open and deliberately never
         * copied onto the page component or into any store.
         */
        this.secret = null;
    }
    /**
     * Copies one field to the clipboard.
     *
     * A denied clipboard permission is swallowed, exactly as in `docs-row-actions.service.ts`:
     * the value is still selectable on screen (`user-select: all`), so there is nothing for the
     * user to do about a failure and nothing to roll back.
     */
    async copy(value, messageKey) {
        if (!value)
            return;
        try {
            await navigator.clipboard.writeText(value);
            this.toastrService.success(this.getTranslation(messageKey));
        }
        catch {
            // Clipboard permission denied / unavailable — nothing to roll back.
        }
    }
    /** The only way out. Closing IS the acknowledgement; there is nothing to cancel. */
    acknowledge() {
        this.dialogRef.close(true);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InboundSecretDialogComponent, deps: [{ token: i1.TranslateService }, { token: i2.NbDialogRef }, { token: i3.ToastrService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: InboundSecretDialogComponent, isStandalone: true, selector: "gz-docs-inbound-secret-dialog", inputs: { secret: "secret" }, usesInheritance: true, ngImport: i0, template: `
		<nb-card class="docs-dialog docs-inbound-secret-dialog">
			<nb-card-header>{{ 'DOCS.INBOUND.SECRET_TITLE' | translate }}</nb-card-header>
			<nb-card-body>
				<div class="docs-inbound-secret-warning">
					<nb-icon icon="alert-triangle-outline" status="warning"></nb-icon>
					<span>{{ 'DOCS.INBOUND.SECRET_WARNING' | translate }}</span>
				</div>

				<label class="label">{{ 'DOCS.INBOUND.ADDRESS' | translate }}</label>
				<div class="docs-inbound-secret-value">
					<code>{{ secret?.address }}</code>
					<button
						nbButton
						ghost
						size="small"
						[attr.aria-label]="'DOCS.INBOUND.COPY_ADDRESS' | translate"
						(click)="copy(secret?.address, 'DOCS.INBOUND.TOAST_ADDRESS_COPIED')"
					>
						<nb-icon icon="clipboard-outline"></nb-icon>
					</button>
				</div>

				<label class="label">{{ 'DOCS.INBOUND.SECRET_LABEL' | translate }}</label>
				<div class="docs-inbound-secret-value">
					<code class="docs-inbound-secret-plaintext">{{ secret?.webhookSecret }}</code>
					<button
						nbButton
						status="primary"
						size="small"
						[attr.aria-label]="'DOCS.INBOUND.COPY_SECRET' | translate"
						(click)="copy(secret?.webhookSecret, 'DOCS.INBOUND.TOAST_SECRET_COPIED')"
					>
						<nb-icon icon="clipboard-outline"></nb-icon>
						{{ 'DOCS.INBOUND.COPY_SECRET' | translate }}
					</button>
				</div>
				<p class="hint">{{ 'DOCS.INBOUND.SECRET_HINT' | translate }}</p>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton status="primary" (click)="acknowledge()">
					{{ 'DOCS.INBOUND.SECRET_ACK' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, isInline: true, styles: [".docs-inbound-secret-dialog{width:34rem;max-width:92vw}.docs-inbound-secret-warning{display:flex;align-items:flex-start;gap:.5rem;margin-bottom:1rem;color:var(--text-warning-color)}.label{display:block;margin:.75rem 0 .25rem;font-weight:600}.docs-inbound-secret-value{display:flex;align-items:center;gap:.5rem}.docs-inbound-secret-value code{flex:1 1 auto;padding:.375rem .5rem;border:1px solid var(--divider-color);border-radius:.25rem;font-size:.8125rem;overflow-wrap:anywhere}.docs-inbound-secret-plaintext{-webkit-user-select:all;user-select:all}.hint{color:var(--text-hint-color);font-size:.75rem;margin-top:.25rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i2.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i2.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i2.NbCardFooterComponent, selector: "nb-card-footer" }, { kind: "component", type: i2.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i2.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InboundSecretDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-inbound-secret-dialog', imports: [CommonModule, TranslateModule, NbButtonModule, NbCardModule, NbIconModule], template: `
		<nb-card class="docs-dialog docs-inbound-secret-dialog">
			<nb-card-header>{{ 'DOCS.INBOUND.SECRET_TITLE' | translate }}</nb-card-header>
			<nb-card-body>
				<div class="docs-inbound-secret-warning">
					<nb-icon icon="alert-triangle-outline" status="warning"></nb-icon>
					<span>{{ 'DOCS.INBOUND.SECRET_WARNING' | translate }}</span>
				</div>

				<label class="label">{{ 'DOCS.INBOUND.ADDRESS' | translate }}</label>
				<div class="docs-inbound-secret-value">
					<code>{{ secret?.address }}</code>
					<button
						nbButton
						ghost
						size="small"
						[attr.aria-label]="'DOCS.INBOUND.COPY_ADDRESS' | translate"
						(click)="copy(secret?.address, 'DOCS.INBOUND.TOAST_ADDRESS_COPIED')"
					>
						<nb-icon icon="clipboard-outline"></nb-icon>
					</button>
				</div>

				<label class="label">{{ 'DOCS.INBOUND.SECRET_LABEL' | translate }}</label>
				<div class="docs-inbound-secret-value">
					<code class="docs-inbound-secret-plaintext">{{ secret?.webhookSecret }}</code>
					<button
						nbButton
						status="primary"
						size="small"
						[attr.aria-label]="'DOCS.INBOUND.COPY_SECRET' | translate"
						(click)="copy(secret?.webhookSecret, 'DOCS.INBOUND.TOAST_SECRET_COPIED')"
					>
						<nb-icon icon="clipboard-outline"></nb-icon>
						{{ 'DOCS.INBOUND.COPY_SECRET' | translate }}
					</button>
				</div>
				<p class="hint">{{ 'DOCS.INBOUND.SECRET_HINT' | translate }}</p>
			</nb-card-body>
			<nb-card-footer class="docs-dialog-footer">
				<button nbButton status="primary" (click)="acknowledge()">
					{{ 'DOCS.INBOUND.SECRET_ACK' | translate }}
				</button>
			</nb-card-footer>
		</nb-card>
	`, styles: [".docs-inbound-secret-dialog{width:34rem;max-width:92vw}.docs-inbound-secret-warning{display:flex;align-items:flex-start;gap:.5rem;margin-bottom:1rem;color:var(--text-warning-color)}.label{display:block;margin:.75rem 0 .25rem;font-weight:600}.docs-inbound-secret-value{display:flex;align-items:center;gap:.5rem}.docs-inbound-secret-value code{flex:1 1 auto;padding:.375rem .5rem;border:1px solid var(--divider-color);border-radius:.25rem;font-size:.8125rem;overflow-wrap:anywhere}.docs-inbound-secret-plaintext{-webkit-user-select:all;user-select:all}.hint{color:var(--text-hint-color);font-size:.75rem;margin-top:.25rem}.docs-dialog-footer{display:flex;justify-content:flex-end;gap:.5rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.NbDialogRef }, { type: i3.ToastrService }], propDecorators: { secret: [{
                type: Input
            }] } });
//# sourceMappingURL=inbound-secret-dialog.component.js.map