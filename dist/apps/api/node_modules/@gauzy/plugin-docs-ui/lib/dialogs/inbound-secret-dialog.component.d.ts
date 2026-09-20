import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { IDocumentInboundAddressSecret } from '@gauzy/contracts';
import { ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
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
export declare class InboundSecretDialogComponent extends TranslationBaseComponent {
    readonly translateService: TranslateService;
    private readonly dialogRef;
    private readonly toastrService;
    /**
     * The one-time envelope. Held only for as long as the dialog is open and deliberately never
     * copied onto the page component or into any store.
     */
    secret: IDocumentInboundAddressSecret | null;
    constructor(translateService: TranslateService, dialogRef: NbDialogRef<InboundSecretDialogComponent>, toastrService: ToastrService);
    /**
     * Copies one field to the clipboard.
     *
     * A denied clipboard permission is swallowed, exactly as in `docs-row-actions.service.ts`:
     * the value is still selectable on screen (`user-select: all`), so there is nothing for the
     * user to do about a failure and nothing to roll back.
     */
    copy(value: string | null | undefined, messageKey: string): Promise<void>;
    /** The only way out. Closing IS the acknowledgement; there is nothing to cancel. */
    acknowledge(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InboundSecretDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InboundSecretDialogComponent, "gz-docs-inbound-secret-dialog", never, { "secret": { "alias": "secret"; "required": false; }; }, {}, never, never, true, never>;
}
