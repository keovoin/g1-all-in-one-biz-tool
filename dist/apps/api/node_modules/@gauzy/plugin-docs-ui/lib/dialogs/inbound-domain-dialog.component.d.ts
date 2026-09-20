import { NbDialogRef } from '@nebular/theme';
import * as i0 from "@angular/core";
/** What the dialog resolves with on confirm (`null` on cancel). */
export interface IDocsInboundDomainDialogResult {
    domain: string;
    localPart: string;
    importBodyAsNote: boolean;
}
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
export declare class InboundDomainDialogComponent {
    private readonly dialogRef;
    domain: string;
    localPart: string;
    importBodyAsNote: boolean;
    constructor(dialogRef: NbDialogRef<InboundDomainDialogComponent>);
    /** The domain as the server will store it, or `null` while it is not yet valid. */
    get normalizedDomain(): string | null;
    /** The mailbox name as the server will store it, or `null` while it is not yet valid. */
    get normalizedLocalPart(): string | null;
    /**
     * The address that will be created, or `''` while either half is still invalid.
     *
     * A plain string: it is only interpolated, so a fresh value per change-detection pass costs
     * a comparison, not a re-render. Nothing binds an object or an array to a getter here — that
     * is what wedged the hub's main thread once already.
     */
    get previewAddress(): string;
    get canConfirm(): boolean;
    confirm(): void;
    cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InboundDomainDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InboundDomainDialogComponent, "gz-docs-inbound-domain-dialog", never, {}, {}, never, never, true, never>;
}
