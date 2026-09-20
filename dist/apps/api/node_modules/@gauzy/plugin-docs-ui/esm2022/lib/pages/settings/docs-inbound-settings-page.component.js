import { __decorate, __metadata } from "tslib";
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDialogService, NbIconModule, NbInputModule, NbSpinnerModule, NbToggleModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxPermissionsModule } from 'ngx-permissions';
import { catchError, filter, firstValueFrom, of, tap } from 'rxjs';
import { DocumentInboundAddressKindEnum, DocumentInboundDomainStatusEnum, PermissionsEnum } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { InboundDomainDialogComponent } from '../../dialogs/inbound-domain-dialog.component';
import { InboundSecretDialogComponent } from '../../dialogs/inbound-secret-dialog.component';
import { DOCS_INBOUND_ALLOWLIST_MAX, DOCS_INBOUND_STATUS_BADGES, DOCS_INBOUND_STATUS_HINT_KEYS, DOCS_INBOUND_STATUS_LABEL_KEYS, normalizeInboundAllowlistEntry, sameInboundAllowlist } from '../../models/docs-inbound.model';
import { DocumentInboundAddressService } from '../../services/document-inbound-address.service';
import { DocumentsService } from '../../services/documents.service';
import { DOCS_PERMISSIONS } from '../../docs-permission-groups';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "../../services/document-inbound-address.service";
import * as i3 from "../../services/documents.service";
import * as i4 from "@gauzy/ui-core/core";
import * as i5 from "@nebular/theme";
import * as i6 from "@angular/common";
import * as i7 from "@angular/forms";
import * as i8 from "ngx-permissions";
/**
 * Inbound email capture settings, registered at the `settings-sections` location so it renders
 * inside the core settings shell alongside the main Documents settings page.
 *
 * Two blocks, mirroring the two kinds of address (spec 07 §17.2):
 *
 *  1. **Shared address** (`PLATFORM`) — minted automatically by the server on first read. The
 *     address itself is the credential, so it is shown read-only with a copy button and can only
 *     be *rotated*, never edited. An empty list means the deployment has no inbound domain
 *     configured and there was nothing to mint — said plainly rather than shown as an error.
 *  2. **Tenant domains** (`CUSTOM_DOMAIN`) — added here, each with its DNS TXT record, a verify
 *     button and a status. Mail is REJECTED until the record verifies, and a `FAILED` row means
 *     a record that once verified has since disappeared; both facts are stated on the card,
 *     because "PENDING" on its own does not tell an administrator that mail is bouncing.
 *
 * Both kinds share the sender allowlist, the body-import preference and the active flag.
 *
 * 🛑 **The relay secret is returned exactly once** — on create and on rotate. It is handed
 * straight to {@link InboundSecretDialogComponent} and never stored on this component, in a
 * store, or in a toast.
 *
 * Standalone + lazily loaded: it provides its own services because it lives outside
 * `DocsUiModule`'s injector.
 */
let DocsInboundSettingsPageComponent = class DocsInboundSettingsPageComponent extends TranslationBaseComponent {
    constructor(translateService, inboundService, documentsService, toastrService, dialogService, store) {
        super(translateService);
        this.translateService = translateService;
        this.inboundService = inboundService;
        this.documentsService = documentsService;
        this.toastrService = toastrService;
        this.dialogService = dialogService;
        this.store = store;
        /**
         * Stable permission arrays for the template's `*ngxPermissionsOnly` gates.
         * 🛑 Never inline `[permissions.X]` in a binding — a fresh array each change-detection cycle
         * makes ngx-permissions re-validate forever and wedges the main thread.
         */
        this.docsPermissions = DOCS_PERMISSIONS;
        /** The organization's PLATFORM row, or `null` when the deployment mints none. */
        this.platform = null;
        /**
         * The organization's CUSTOM_DOMAIN rows.
         *
         * A field, not a getter: the template iterates it and a getter would hand `*ngFor` a fresh
         * array on every change-detection pass.
         */
        this.customDomains = [];
        /** Deployment capabilities from `GET /settings` — used only for the "capture is off" banner. */
        this.capabilities = null;
        this.loading = false;
        this.loadError = false;
        /** True once the list answered 404 — this deployment predates the capture endpoints. */
        this.unsupported = false;
        /** True while `POST /inbound-addresses` is in flight. */
        this.adding = false;
        this.permissions = PermissionsEnum;
        this.kinds = DocumentInboundAddressKindEnum;
        this.statuses = DocumentInboundDomainStatusEnum;
        this.allowlistMax = DOCS_INBOUND_ALLOWLIST_MAX;
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), distinctUntilChange(), tap(() => void this.load()), untilDestroyed(this))
            .subscribe();
    }
    // ─── Loading ─────────────────────────────────────────────────
    async load() {
        this.loading = true;
        this.loadError = false;
        this.unsupported = false;
        try {
            // Only the address list is load-bearing. The capabilities probe drives one advisory
            // banner and degrades to "unknown" rather than failing the page.
            const [addresses, settings] = await Promise.all([
                firstValueFrom(this.inboundService.getAll()),
                firstValueFrom(this.documentsService.getSettings().pipe(catchError(() => of(null))))
            ]);
            this.capabilities = settings?.capabilities ?? null;
            await this.project(addresses ?? []);
        }
        catch (error) {
            // A 404 means the endpoints are not deployed — a notice, not an error the user can
            // act on (`share-dialog.component.ts` treats the P1 share routes the same way).
            if (error?.status === 404) {
                this.unsupported = true;
            }
            else {
                this.loadError = true;
            }
            this.platform = null;
            this.customDomains = [];
        }
        finally {
            this.loading = false;
        }
    }
    /**
     * Splits the wire rows into the two cards and fetches each custom domain's DNS record.
     *
     * One extra call per custom domain — a handful at most, and the record is only authoritative
     * server-side (the `_gauzy-docs` prefix is a backend constant). A failed probe leaves that
     * row's `verification` at `null`, which the template renders as "record unavailable" instead
     * of failing the whole page.
     */
    async project(addresses) {
        const rows = addresses.map((address) => this.toRow(address));
        await Promise.all(rows
            .filter((row) => row.address.kind === DocumentInboundAddressKindEnum.CUSTOM_DOMAIN && !!row.address.id)
            .map(async (row) => {
            row.verification = await firstValueFrom(this.inboundService
                .getVerification(row.address.id)
                .pipe(catchError(() => of(null))));
        }));
        this.platform = rows.find((row) => row.address.kind === DocumentInboundAddressKindEnum.PLATFORM) ?? null;
        this.customDomains = rows.filter((row) => row.address.kind === DocumentInboundAddressKindEnum.CUSTOM_DOMAIN);
    }
    /** Wire row → view row. The allowlist is copied so editing never mutates the response. */
    toRow(address) {
        const row = {
            address,
            verification: null,
            allowlist: [...(address.senderAllowlist ?? [])],
            allowlistDirty: false,
            allowlistEntry: '',
            busy: false,
            confirm: null
        };
        // Self-referential and built exactly once — see `IDocsInboundAddressRow.context`.
        row.context = { $implicit: row };
        return row;
    }
    // ─── Toggles (PUT /:id) ──────────────────────────────────────
    onImportBodyToggle(row, importBodyAsNote) {
        void this.patch(row, { importBodyAsNote });
    }
    onActiveToggle(row, isActive) {
        void this.patch(row, { isActive });
    }
    /**
     * Partial update of one address.
     *
     * Optimistic, and it must be: `nb-toggle` is bound through `[checked]`, so if the row were
     * left untouched while the request flew, the binding value would not change and Angular
     * would never push the old state back — a failed save would leave a toggle showing the
     * opposite of what the server holds. The snapshot is restored on error for the same reason
     * (`docs-settings-page.component.ts:161-181`).
     */
    async patch(row, input) {
        if (row.busy || !row.address.id)
            return;
        const previous = row.address;
        row.address = { ...previous, ...input };
        row.busy = true;
        try {
            row.address = await firstValueFrom(this.inboundService.update(previous.id, input));
            // Adopt the server's echo of the allowlist only when this call was ABOUT the
            // allowlist; a toggle save must not silently discard an unsaved draft.
            this.syncAllowlist(row, input.senderAllowlist !== undefined);
            this.toastrService.success(this.getTranslation('DOCS.TOASTS.UPDATED'));
        }
        catch (error) {
            row.address = previous; // revert
            this.syncAllowlist(row, false);
            this.toastrService.danger(error);
        }
        finally {
            row.busy = false;
        }
    }
    // ─── Sender allowlist ────────────────────────────────────────
    /**
     * Can the typed entry be added? Guards the Add button and is re-checked in
     * {@link addAllowlistEntry} — Enter reaches the handler without the button.
     */
    canAddAllowlistEntry(row) {
        if (row.busy || row.allowlist.length >= DOCS_INBOUND_ALLOWLIST_MAX)
            return false;
        const entry = normalizeInboundAllowlistEntry(row.allowlistEntry);
        return !!entry && !row.allowlist.includes(entry);
    }
    addAllowlistEntry(row) {
        const entry = normalizeInboundAllowlistEntry(row.allowlistEntry);
        if (!entry || !this.canAddAllowlistEntry(row))
            return;
        // A NEW array — but only here, where the contents genuinely changed. `*ngFor` re-renders
        // on identity, so rebuilding this anywhere else would re-render the chips continuously.
        row.allowlist = [...row.allowlist, entry];
        row.allowlistEntry = '';
        this.syncAllowlist(row, false);
    }
    removeAllowlistEntry(row, entry) {
        if (row.busy)
            return;
        row.allowlist = row.allowlist.filter((candidate) => candidate !== entry);
        this.syncAllowlist(row, false);
    }
    /**
     * Persists the draft.
     *
     * An empty array is sent as an empty array, not omitted: that is how the list is *cleared*,
     * and the server reads a cleared list as "accept any sender that passes SPF/DKIM".
     */
    async saveAllowlist(row) {
        if (!row.allowlistDirty)
            return;
        await this.patch(row, { senderAllowlist: row.allowlist });
    }
    /**
     * Re-derives {@link IDocsInboundAddressRow.allowlistDirty} against the server's value.
     *
     * @param adopt When true, the draft is replaced by the server's list (after a successful
     * allowlist save). Otherwise the draft is left alone and only the dirty flag is recomputed —
     * so adding an entry and removing it again correctly reads as clean.
     */
    syncAllowlist(row, adopt) {
        const saved = row.address.senderAllowlist ?? [];
        if (adopt) {
            row.allowlist = [...saved];
        }
        row.allowlistDirty = !sameInboundAllowlist(row.allowlist, saved);
    }
    // ─── Domain verification ─────────────────────────────────────
    /**
     * Re-checks the TXT record.
     *
     * 🛑 A missing record is a **200**, not a failure: the endpoint answers with the unchanged
     * (or degraded) status plus a `message`. Reading the status rather than assuming success is
     * the whole point — a `catch`-only implementation would report "verified" for every failure.
     */
    async verify(row) {
        if (row.busy || !row.address.id)
            return;
        row.busy = true;
        try {
            const verification = await firstValueFrom(this.inboundService.verify(row.address.id));
            row.verification = verification;
            // The badge and the "mail is rejected" copy read the row, not the descriptor, so the
            // status has to land on both or the card would contradict itself.
            row.address = {
                ...row.address,
                domainStatus: verification.status,
                domainVerifiedAt: verification.verifiedAt ?? null,
                domainLastCheckedAt: verification.lastCheckedAt ?? null
            };
            if (verification.status === DocumentInboundDomainStatusEnum.VERIFIED) {
                this.toastrService.success(this.getTranslation('DOCS.INBOUND.TOAST_VERIFIED'));
            }
            else {
                // Not an error — DNS simply has not propagated yet. The server says why.
                this.toastrService.warning(verification.message || this.getTranslation('DOCS.INBOUND.TOAST_NOT_VERIFIED'));
            }
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            row.busy = false;
        }
    }
    // ─── Adding a tenant domain ──────────────────────────────────
    async addDomain() {
        if (this.adding)
            return;
        const result = await firstValueFrom(this.dialogService.open(InboundDomainDialogComponent).onClose);
        if (!result)
            return;
        this.adding = true;
        try {
            const created = await firstValueFrom(this.inboundService.create(result));
            // 🛑 Before anything else. `created.secret` is the only copy of the relay secret that
            // will ever exist; a reload or a navigation between here and the reveal destroys it.
            await this.revealSecret(created.secret);
            this.toastrService.success(this.getTranslation('DOCS.INBOUND.TOAST_ADDED'));
            await this.load();
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            this.adding = false;
        }
    }
    // ─── Rotation (inline two-step confirm) ──────────────────────
    /** Arms the inline confirmation strip for one irreversible action. */
    askConfirm(row, confirm) {
        row.confirm = row.busy ? null : confirm;
    }
    cancelConfirm(row) {
        row.confirm = null;
    }
    /**
     * Issues a new relay secret. The previous one stops working immediately, so the relay has to
     * be updated with the value the dialog shows — which is why the warning is stated inline,
     * before the click, rather than only in the reveal dialog afterwards.
     *
     * Offered for `CUSTOM_DOMAIN` only. A `PLATFORM` row has no per-address secret — deliveries to
     * it are authenticated by the deployment-wide relay signature instead.
     *
     * 🛑 Not because rotating one would *break* capture: the webhook gate is an OR
     * (`inbound-email.service.ts` — `if (!globalSignatureOk && !perAddressSecretOk) throw`), so an
     * address secret on a PLATFORM row leaves the global signature working. It is hidden because
     * it would be **inert**: the platform relay never sends the per-address secret header, so the
     * button would hand out a one-time secret that nothing ever presents — a credential the user
     * is told to store and act on, which in fact does nothing.
     */
    async rotateSecret(row) {
        row.confirm = null;
        if (row.busy || !row.address.id)
            return;
        row.busy = true;
        try {
            const secret = await firstValueFrom(this.inboundService.rotateSecret(row.address.id));
            await this.revealSecret(secret);
            this.toastrService.success(this.getTranslation('DOCS.INBOUND.TOAST_SECRET_ROTATED'));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            row.busy = false;
        }
    }
    /**
     * Mints a new PLATFORM address. The old one stops resolving at once — anything still mailing
     * it will bounce — so this is a two-step action with the consequence spelled out.
     */
    async rotateAddress(row) {
        row.confirm = null;
        if (row.busy || !row.address.id)
            return;
        row.busy = true;
        try {
            row.address = await firstValueFrom(this.inboundService.rotateAddress(row.address.id));
            this.syncAllowlist(row, true);
            this.toastrService.success(this.getTranslation('DOCS.INBOUND.TOAST_ADDRESS_ROTATED'));
        }
        catch (error) {
            this.toastrService.danger(error);
        }
        finally {
            row.busy = false;
        }
    }
    /**
     * Puts the one-time secret in front of the user and waits for the acknowledgement.
     *
     * `closeOnEsc`/`closeOnBackdropClick` are off on purpose: the plaintext cannot be asked for
     * again, so a reflexive Esc must not be able to throw it away.
     */
    async revealSecret(secret) {
        await firstValueFrom(this.dialogService.open(InboundSecretDialogComponent, {
            context: { secret },
            closeOnEsc: false,
            closeOnBackdropClick: false
        }).onClose);
    }
    // ─── Clipboard ───────────────────────────────────────────────
    /**
     * Copies a value and confirms with a toast.
     *
     * A denied clipboard permission is swallowed, as everywhere else in this package
     * (`docs-row-actions.service.ts:232-240`): every value copied here is also selectable on
     * screen, so a failure leaves the user no worse off and nothing to roll back.
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
    // ─── Template helpers ────────────────────────────────────────
    statusLabelKey(status) {
        return DOCS_INBOUND_STATUS_LABEL_KEYS[status] ?? 'DOCS.INBOUND.STATUS_PENDING';
    }
    statusHintKey(status) {
        return (DOCS_INBOUND_STATUS_HINT_KEYS[status] ??
            'DOCS.INBOUND.STATUS_PENDING_HINT');
    }
    statusBadge(status) {
        return DOCS_INBOUND_STATUS_BADGES[status] ?? 'warning';
    }
    trackByRowId(_, row) {
        return String(row.address.id);
    }
    /** Entries are unique within a list (duplicates are refused on add), so the value is the key. */
    trackByEntry(_, entry) {
        return entry;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsInboundSettingsPageComponent, deps: [{ token: i1.TranslateService }, { token: i2.DocumentInboundAddressService }, { token: i3.DocumentsService }, { token: i4.ToastrService }, { token: i5.NbDialogService }, { token: i4.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DocsInboundSettingsPageComponent, isStandalone: true, selector: "gz-docs-inbound-settings-page", providers: [DocumentInboundAddressService, DocumentsService], usesInheritance: true, ngImport: i0, template: "<div class=\"docs-inbound\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<div class=\"docs-inbound-header\">\n\t\t<h4>{{ 'DOCS.INBOUND.TITLE' | translate }}</h4>\n\t\t<p class=\"muted\">{{ 'DOCS.INBOUND.SUBTITLE' | translate }}</p>\n\t</div>\n\n\t<!-- Endpoints absent (deployment predates the capture routes) \u2014 a notice, never an error. -->\n\t<nb-card *ngIf=\"unsupported\" class=\"docs-inbound-card\">\n\t\t<nb-card-body class=\"docs-inbound-notice\">\n\t\t\t<nb-icon icon=\"info-outline\" status=\"info\"></nb-icon>\n\t\t\t<span>{{ 'DOCS.INBOUND.UNSUPPORTED' | translate }}</span>\n\t\t</nb-card-body>\n\t</nb-card>\n\n\t<!-- Load error -->\n\t<nb-card *ngIf=\"loadError\" class=\"docs-inbound-card\">\n\t\t<nb-card-body class=\"docs-inbound-notice\">\n\t\t\t<nb-icon icon=\"alert-triangle-outline\" status=\"danger\"></nb-icon>\n\t\t\t<span>{{ 'DOCS.INBOUND.LOAD_ERROR' | translate }}</span>\n\t\t\t<button nbButton size=\"small\" (click)=\"load()\">{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}</button>\n\t\t</nb-card-body>\n\t</nb-card>\n\n\t<!-- Capture switched off deployment-wide: addresses can be prepared, but nothing is accepted. -->\n\t<nb-card *ngIf=\"capabilities && capabilities.inboundEmailEnabled === false\" class=\"docs-inbound-card\">\n\t\t<nb-card-body class=\"docs-inbound-notice\">\n\t\t\t<nb-icon icon=\"alert-triangle-outline\" status=\"warning\"></nb-icon>\n\t\t\t<span>{{ 'DOCS.INBOUND.DISABLED' | translate }}</span>\n\t\t</nb-card-body>\n\t</nb-card>\n\n\t<ng-container *ngIf=\"!unsupported && !loadError\">\n\t\t<!-- 1. The shared platform address (minted server-side; the address IS the credential) -->\n\t\t<nb-card class=\"docs-inbound-card\">\n\t\t\t<nb-card-header>{{ 'DOCS.INBOUND.PLATFORM' | translate }}</nb-card-header>\n\t\t\t<nb-card-body>\n\t\t\t\t<ng-container *ngIf=\"platform as row; else noPlatform\">\n\t\t\t\t\t<div class=\"docs-inbound-address-row\">\n\t\t\t\t\t\t<code class=\"docs-inbound-address\">{{ row.address.address }}</code>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.INBOUND.COPY_ADDRESS' | translate\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.INBOUND.COPY_ADDRESS' | translate\"\n\t\t\t\t\t\t\t(click)=\"copy(row.address.address, 'DOCS.INBOUND.TOAST_ADDRESS_COPIED')\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"clipboard-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"hint\">{{ 'DOCS.INBOUND.PLATFORM_HINT' | translate }}</p>\n\n\t\t\t\t\t<dl class=\"docs-inbound-meta\">\n\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.MESSAGES' | translate }}</dt>\n\t\t\t\t\t\t<dd>{{ row.address.messageCount ?? 0 }}</dd>\n\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.LAST_MESSAGE' | translate }}</dt>\n\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\trow.address.lastMessageAt\n\t\t\t\t\t\t\t\t\t? (row.address.lastMessageAt | date : 'medium')\n\t\t\t\t\t\t\t\t\t: ('DOCS.INBOUND.NEVER' | translate)\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</dd>\n\t\t\t\t\t</dl>\n\n\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.manage\">\n\t\t\t\t\t\t<!-- Shared controls: allowlist, body import, active flag. -->\n\t\t\t\t\t\t<ng-container *ngTemplateOutlet=\"addressControls; context: row.context\"></ng-container>\n\n\t\t\t\t\t\t<!-- Rotating a PLATFORM address REPLACES it: two-step, with the consequence up front. -->\n\t\t\t\t\t\t<div class=\"docs-inbound-danger\">\n\t\t\t\t\t\t\t<ng-container *ngIf=\"row.confirm !== 'address'; else confirmRotateAddress\">\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\tstatus=\"warning\"\n\t\t\t\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t\t\t\t(click)=\"askConfirm(row, 'address')\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"sync-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t{{ 'DOCS.INBOUND.ROTATE_ADDRESS' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<div class=\"hint warn\">{{ 'DOCS.INBOUND.ROTATE_ADDRESS_WARNING' | translate }}</div>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t<ng-template #confirmRotateAddress>\n\t\t\t\t\t\t\t\t<div class=\"hint warn\">{{ 'DOCS.INBOUND.ROTATE_ADDRESS_WARNING' | translate }}</div>\n\t\t\t\t\t\t\t\t<div class=\"docs-inbound-confirm\">\n\t\t\t\t\t\t\t\t\t<button nbButton ghost size=\"small\" (click)=\"cancelConfirm(row)\">\n\t\t\t\t\t\t\t\t\t\t{{ 'DOCS.UPLOAD.CANCEL' | translate }}\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t\t\t\t\t(click)=\"rotateAddress(row)\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t{{ 'DOCS.INBOUND.ROTATE_CONFIRM' | translate }}\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</ng-container>\n\t\t\t\t</ng-container>\n\n\t\t\t\t<ng-template #noPlatform>\n\t\t\t\t\t<p class=\"muted\">{{ 'DOCS.INBOUND.NO_PLATFORM' | translate }}</p>\n\t\t\t\t</ng-template>\n\t\t\t</nb-card-body>\n\t\t</nb-card>\n\n\t\t<!-- 2. Tenant-owned domains -->\n\t\t<nb-card class=\"docs-inbound-card\">\n\t\t\t<nb-card-header class=\"docs-inbound-card-header\">\n\t\t\t\t<span>{{ 'DOCS.INBOUND.CUSTOM' | translate }}</span>\n\t\t\t\t<button\n\t\t\t\t\t*ngxPermissionsOnly=\"docsPermissions.manage\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t[disabled]=\"adding\"\n\t\t\t\t\t(click)=\"addDomain()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.INBOUND.ADD_DOMAIN' | translate }}\n\t\t\t\t</button>\n\t\t\t</nb-card-header>\n\t\t\t<nb-card-body>\n\t\t\t\t<p class=\"hint\">{{ 'DOCS.INBOUND.CUSTOM_HINT' | translate }}</p>\n\t\t\t\t<p class=\"muted\" *ngIf=\"!customDomains.length\">{{ 'DOCS.INBOUND.NO_CUSTOM' | translate }}</p>\n\n\t\t\t\t<div class=\"docs-inbound-domain\" *ngFor=\"let row of customDomains; trackBy: trackByRowId\">\n\t\t\t\t\t<div class=\"docs-inbound-address-row\">\n\t\t\t\t\t\t<code class=\"docs-inbound-address\">{{ row.address.address }}</code>\n\t\t\t\t\t\t<span class=\"docs-inbound-status\" [ngClass]=\"'is-' + statusBadge(row.address.domainStatus)\">\n\t\t\t\t\t\t\t{{ statusLabelKey(row.address.domainStatus) | translate }}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.INBOUND.COPY_ADDRESS' | translate\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.INBOUND.COPY_ADDRESS' | translate\"\n\t\t\t\t\t\t\t(click)=\"copy(row.address.address, 'DOCS.INBOUND.TOAST_ADDRESS_COPIED')\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"clipboard-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<!-- States what happens to MAIL, not just what happened to the record. -->\n\t\t\t\t\t<div class=\"hint\" [class.warn]=\"row.address.domainStatus !== statuses.VERIFIED\">\n\t\t\t\t\t\t{{ statusHintKey(row.address.domainStatus) | translate }}\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<!-- DNS TXT record -->\n\t\t\t\t\t<div class=\"docs-inbound-verification\">\n\t\t\t\t\t\t<div class=\"label\">{{ 'DOCS.INBOUND.VERIFICATION' | translate }}</div>\n\n\t\t\t\t\t\t<ng-container *ngIf=\"row.verification as verification; else noRecord\">\n\t\t\t\t\t\t\t<dl class=\"docs-inbound-record\">\n\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.RECORD_TYPE' | translate }}</dt>\n\t\t\t\t\t\t\t\t<dd><code>{{ verification.recordType }}</code></dd>\n\n\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.RECORD_NAME' | translate }}</dt>\n\t\t\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t\t\t<code>{{ verification.recordName }}</code>\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.INBOUND.COPY_RECORD_NAME' | translate\"\n\t\t\t\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.INBOUND.COPY_RECORD_NAME' | translate\"\n\t\t\t\t\t\t\t\t\t\t(click)=\"copy(verification.recordName, 'DOCS.INBOUND.TOAST_RECORD_COPIED')\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t<nb-icon icon=\"clipboard-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</dd>\n\n\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.RECORD_VALUE' | translate }}</dt>\n\t\t\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t\t\t<code>{{ verification.recordValue }}</code>\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.INBOUND.COPY_RECORD_VALUE' | translate\"\n\t\t\t\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.INBOUND.COPY_RECORD_VALUE' | translate\"\n\t\t\t\t\t\t\t\t\t\t(click)=\"copy(verification.recordValue, 'DOCS.INBOUND.TOAST_RECORD_COPIED')\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t<nb-icon icon=\"clipboard-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</dd>\n\t\t\t\t\t\t\t</dl>\n\n\t\t\t\t\t\t\t<div class=\"hint\">{{ 'DOCS.INBOUND.VERIFY_HINT' | translate }}</div>\n\t\t\t\t\t\t\t<div class=\"hint\" *ngIf=\"verification.message\">{{ verification.message }}</div>\n\n\t\t\t\t\t\t\t<dl class=\"docs-inbound-meta\">\n\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.LAST_CHECKED' | translate }}</dt>\n\t\t\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\t\t\tverification.lastCheckedAt\n\t\t\t\t\t\t\t\t\t\t\t? (verification.lastCheckedAt | date : 'medium')\n\t\t\t\t\t\t\t\t\t\t\t: ('DOCS.INBOUND.NEVER_CHECKED' | translate)\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t</dd>\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"verification.verifiedAt\">\n\t\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.VERIFIED_AT' | translate }}</dt>\n\t\t\t\t\t\t\t\t\t<dd>{{ verification.verifiedAt | date : 'medium' }}</dd>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</dl>\n\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t*ngxPermissionsOnly=\"docsPermissions.manage\"\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t\t\t(click)=\"verify(row)\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<nb-icon icon=\"checkmark-circle-2-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t{{ 'DOCS.INBOUND.VERIFY' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</ng-container>\n\n\t\t\t\t\t\t<ng-template #noRecord>\n\t\t\t\t\t\t\t<p class=\"muted\">{{ 'DOCS.INBOUND.NO_RECORD' | translate }}</p>\n\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<dl class=\"docs-inbound-meta\">\n\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.MESSAGES' | translate }}</dt>\n\t\t\t\t\t\t<dd>{{ row.address.messageCount ?? 0 }}</dd>\n\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.LAST_MESSAGE' | translate }}</dt>\n\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\trow.address.lastMessageAt\n\t\t\t\t\t\t\t\t\t? (row.address.lastMessageAt | date : 'medium')\n\t\t\t\t\t\t\t\t\t: ('DOCS.INBOUND.NEVER' | translate)\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</dd>\n\t\t\t\t\t</dl>\n\n\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.manage\">\n\t\t\t\t\t\t<!-- Shared controls: allowlist, body import, active flag. -->\n\t\t\t\t\t\t<ng-container *ngTemplateOutlet=\"addressControls; context: row.context\"></ng-container>\n\n\t\t\t\t\t\t<!-- The relay secret is per-address, so rotating it is a CUSTOM_DOMAIN action only. -->\n\t\t\t\t\t\t<div class=\"docs-inbound-danger\">\n\t\t\t\t\t\t\t<ng-container *ngIf=\"row.confirm !== 'secret'; else confirmRotateSecret\">\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\tstatus=\"warning\"\n\t\t\t\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t\t\t\t(click)=\"askConfirm(row, 'secret')\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"sync-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t{{ 'DOCS.INBOUND.ROTATE_SECRET' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<div class=\"hint warn\">{{ 'DOCS.INBOUND.ROTATE_SECRET_WARNING' | translate }}</div>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t<ng-template #confirmRotateSecret>\n\t\t\t\t\t\t\t\t<div class=\"hint warn\">{{ 'DOCS.INBOUND.ROTATE_SECRET_WARNING' | translate }}</div>\n\t\t\t\t\t\t\t\t<div class=\"docs-inbound-confirm\">\n\t\t\t\t\t\t\t\t\t<button nbButton ghost size=\"small\" (click)=\"cancelConfirm(row)\">\n\t\t\t\t\t\t\t\t\t\t{{ 'DOCS.UPLOAD.CANCEL' | translate }}\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t\t\t\t\t(click)=\"rotateSecret(row)\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t{{ 'DOCS.INBOUND.ROTATE_CONFIRM' | translate }}\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</ng-container>\n\t\t\t\t</div>\n\t\t\t</nb-card-body>\n\t\t</nb-card>\n\t</ng-container>\n\n\t<!--\n\t\tShared per-address controls. Rendered through `ngTemplateOutlet` with the row's OWN,\n\t\tpre-built context object (`IDocsInboundAddressRow.context`) \u2014 an inline\n\t\t`context: { $implicit: row }` would allocate a fresh context every change-detection pass.\n\t-->\n\t<ng-template #addressControls let-row>\n\t\t<div class=\"docs-inbound-controls\">\n\t\t\t<!-- Sender allowlist: empty = accept anything that passed SPF/DKIM. -->\n\t\t\t<div class=\"docs-inbound-allowlist\">\n\t\t\t\t<div class=\"label\">{{ 'DOCS.INBOUND.ALLOWLIST' | translate }}</div>\n\n\t\t\t\t<div class=\"docs-inbound-chips\" *ngIf=\"row.allowlist.length; else allowlistEmpty\">\n\t\t\t\t\t<span class=\"docs-inbound-chip\" *ngFor=\"let entry of row.allowlist; trackBy: trackByEntry\">\n\t\t\t\t\t\t<code>{{ entry }}</code>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.INBOUND.ALLOWLIST_REMOVE' | translate\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.INBOUND.ALLOWLIST_REMOVE' | translate\"\n\t\t\t\t\t\t\t(click)=\"removeAllowlistEntry(row, entry)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</span>\n\t\t\t\t</div>\n\t\t\t\t<ng-template #allowlistEmpty>\n\t\t\t\t\t<p class=\"muted\">{{ 'DOCS.INBOUND.ALLOWLIST_EMPTY' | translate }}</p>\n\t\t\t\t</ng-template>\n\n\t\t\t\t<div class=\"docs-inbound-allowlist-field\">\n\t\t\t\t\t<input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfieldSize=\"small\"\n\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\tmaxlength=\"320\"\n\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.INBOUND.ALLOWLIST' | translate\"\n\t\t\t\t\t\tplaceholder=\"{{ 'DOCS.INBOUND.ALLOWLIST_PLACEHOLDER' | translate }}\"\n\t\t\t\t\t\t[(ngModel)]=\"row.allowlistEntry\"\n\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t(keydown.enter)=\"addAllowlistEntry(row)\"\n\t\t\t\t\t/>\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t[disabled]=\"!canAddAllowlistEntry(row)\"\n\t\t\t\t\t\t(click)=\"addAllowlistEntry(row)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'DOCS.INBOUND.ALLOWLIST_ADD' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t[disabled]=\"!row.allowlistDirty || row.busy\"\n\t\t\t\t\t\t(click)=\"saveAllowlist(row)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"hint\">{{ 'DOCS.INBOUND.ALLOWLIST_HINT' | translate }}</div>\n\t\t\t\t<div class=\"hint warn\" *ngIf=\"row.allowlist.length >= allowlistMax\">\n\t\t\t\t\t{{ 'DOCS.INBOUND.ALLOWLIST_FULL' | translate : { max: allowlistMax } }}\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"docs-inbound-row\">\n\t\t\t\t<nb-toggle\n\t\t\t\t\tlabelPosition=\"end\"\n\t\t\t\t\t[checked]=\"!!row.address.importBodyAsNote\"\n\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t(checkedChange)=\"onImportBodyToggle(row, $event)\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'DOCS.INBOUND.IMPORT_BODY' | translate }}\n\t\t\t\t</nb-toggle>\n\t\t\t\t<div class=\"hint\">{{ 'DOCS.INBOUND.IMPORT_BODY_HINT' | translate }}</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"docs-inbound-row\">\n\t\t\t\t<nb-toggle\n\t\t\t\t\tlabelPosition=\"end\"\n\t\t\t\t\t[checked]=\"row.address.isActive !== false\"\n\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t(checkedChange)=\"onActiveToggle(row, $event)\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'DOCS.INBOUND.ACTIVE' | translate }}\n\t\t\t\t</nb-toggle>\n\t\t\t\t<div class=\"hint\">{{ 'DOCS.INBOUND.ACTIVE_HINT' | translate }}</div>\n\t\t\t</div>\n\t\t</div>\n\t</ng-template>\n</div>\n", styles: ["@charset \"UTF-8\";:host{display:block}.docs-inbound{display:flex;flex-direction:column;gap:1rem;padding:1rem;min-height:12rem}.docs-inbound-header h4{margin:0}.muted{color:var(--text-hint-color);margin:0}.hint{color:var(--text-hint-color);font-size:.75rem;margin-top:.25rem}.hint.warn{color:var(--text-warning-color)}.label{display:block;margin-bottom:.25rem;font-weight:600}.docs-inbound-card{margin:0}.docs-inbound-card-header{display:flex;align-items:center;justify-content:space-between;gap:.75rem}.docs-inbound-notice{display:flex;align-items:center;gap:.5rem}.docs-inbound-address-row{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}.docs-inbound-address{padding:.375rem .5rem;border:1px solid var(--divider-color);border-radius:.25rem;font-size:.875rem;overflow-wrap:anywhere}.docs-inbound-status{padding:.125rem .5rem;border-radius:.75rem;font-size:.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:.02em;border:1px solid currentColor}.docs-inbound-status.is-success{color:var(--text-success-color)}.docs-inbound-status.is-warning{color:var(--text-warning-color)}.docs-inbound-status.is-danger{color:var(--text-danger-color)}.docs-inbound-domain{padding:1rem 0}.docs-inbound-domain+.docs-inbound-domain{border-top:1px solid var(--divider-color)}.docs-inbound-verification{margin-top:1rem;padding:.75rem;border:1px solid var(--divider-color);border-radius:.25rem}.docs-inbound-record{display:grid;grid-template-columns:auto 1fr;gap:.25rem 1rem;margin:0 0 .5rem}.docs-inbound-record dt{color:var(--text-hint-color);font-size:.75rem;text-transform:uppercase}.docs-inbound-record dd{display:flex;align-items:center;gap:.375rem;margin:0;min-width:0}.docs-inbound-record dd code{font-size:.8125rem;overflow-wrap:anywhere}.docs-inbound-meta{display:grid;grid-template-columns:auto 1fr;gap:.25rem 1rem;margin:.75rem 0 0}.docs-inbound-meta dt{color:var(--text-hint-color)}.docs-inbound-meta dd{margin:0}.docs-inbound-controls,.docs-inbound-row,.docs-inbound-allowlist{margin-top:1rem}.docs-inbound-chips{display:flex;flex-wrap:wrap;gap:.375rem;margin-bottom:.5rem}.docs-inbound-chip{display:inline-flex;align-items:center;gap:.25rem;padding:.125rem .25rem .125rem .5rem;border:1px solid var(--divider-color);border-radius:1rem}.docs-inbound-chip code{font-size:.8125rem}.docs-inbound-allowlist-field{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}.docs-inbound-allowlist-field input{flex:1 1 16rem;min-width:12rem}.docs-inbound-danger{margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--divider-color)}.docs-inbound-confirm{display:flex;align-items:center;gap:.5rem;margin-top:.5rem}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i6.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i6.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i7.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i7.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i7.MaxLengthValidator, selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", inputs: ["maxlength"] }, { kind: "directive", type: i7.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NgxPermissionsModule }, { kind: "directive", type: i8.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i5.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i5.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i5.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i5.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i5.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: NbInputModule }, { kind: "directive", type: i5.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "ngmodule", type: NbSpinnerModule }, { kind: "directive", type: i5.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "ngmodule", type: NbToggleModule }, { kind: "component", type: i5.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "ngmodule", type: NbTooltipModule }, { kind: "directive", type: i5.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i6.DatePipe, name: "date" }, { kind: "pipe", type: i1.TranslatePipe, name: "translate" }] }); }
};
DocsInboundSettingsPageComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TranslateService,
        DocumentInboundAddressService,
        DocumentsService,
        ToastrService,
        NbDialogService,
        Store])
], DocsInboundSettingsPageComponent);
export { DocsInboundSettingsPageComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsInboundSettingsPageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-docs-inbound-settings-page', imports: [
                        CommonModule,
                        FormsModule,
                        TranslateModule,
                        NgxPermissionsModule,
                        NbButtonModule,
                        NbCardModule,
                        NbIconModule,
                        NbInputModule,
                        NbSpinnerModule,
                        NbToggleModule,
                        NbTooltipModule
                    ], providers: [DocumentInboundAddressService, DocumentsService], template: "<div class=\"docs-inbound\" [nbSpinner]=\"loading\" nbSpinnerStatus=\"primary\">\n\t<div class=\"docs-inbound-header\">\n\t\t<h4>{{ 'DOCS.INBOUND.TITLE' | translate }}</h4>\n\t\t<p class=\"muted\">{{ 'DOCS.INBOUND.SUBTITLE' | translate }}</p>\n\t</div>\n\n\t<!-- Endpoints absent (deployment predates the capture routes) \u2014 a notice, never an error. -->\n\t<nb-card *ngIf=\"unsupported\" class=\"docs-inbound-card\">\n\t\t<nb-card-body class=\"docs-inbound-notice\">\n\t\t\t<nb-icon icon=\"info-outline\" status=\"info\"></nb-icon>\n\t\t\t<span>{{ 'DOCS.INBOUND.UNSUPPORTED' | translate }}</span>\n\t\t</nb-card-body>\n\t</nb-card>\n\n\t<!-- Load error -->\n\t<nb-card *ngIf=\"loadError\" class=\"docs-inbound-card\">\n\t\t<nb-card-body class=\"docs-inbound-notice\">\n\t\t\t<nb-icon icon=\"alert-triangle-outline\" status=\"danger\"></nb-icon>\n\t\t\t<span>{{ 'DOCS.INBOUND.LOAD_ERROR' | translate }}</span>\n\t\t\t<button nbButton size=\"small\" (click)=\"load()\">{{ 'DOCS.ERRORS.GENERIC_RETRY' | translate }}</button>\n\t\t</nb-card-body>\n\t</nb-card>\n\n\t<!-- Capture switched off deployment-wide: addresses can be prepared, but nothing is accepted. -->\n\t<nb-card *ngIf=\"capabilities && capabilities.inboundEmailEnabled === false\" class=\"docs-inbound-card\">\n\t\t<nb-card-body class=\"docs-inbound-notice\">\n\t\t\t<nb-icon icon=\"alert-triangle-outline\" status=\"warning\"></nb-icon>\n\t\t\t<span>{{ 'DOCS.INBOUND.DISABLED' | translate }}</span>\n\t\t</nb-card-body>\n\t</nb-card>\n\n\t<ng-container *ngIf=\"!unsupported && !loadError\">\n\t\t<!-- 1. The shared platform address (minted server-side; the address IS the credential) -->\n\t\t<nb-card class=\"docs-inbound-card\">\n\t\t\t<nb-card-header>{{ 'DOCS.INBOUND.PLATFORM' | translate }}</nb-card-header>\n\t\t\t<nb-card-body>\n\t\t\t\t<ng-container *ngIf=\"platform as row; else noPlatform\">\n\t\t\t\t\t<div class=\"docs-inbound-address-row\">\n\t\t\t\t\t\t<code class=\"docs-inbound-address\">{{ row.address.address }}</code>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.INBOUND.COPY_ADDRESS' | translate\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.INBOUND.COPY_ADDRESS' | translate\"\n\t\t\t\t\t\t\t(click)=\"copy(row.address.address, 'DOCS.INBOUND.TOAST_ADDRESS_COPIED')\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"clipboard-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"hint\">{{ 'DOCS.INBOUND.PLATFORM_HINT' | translate }}</p>\n\n\t\t\t\t\t<dl class=\"docs-inbound-meta\">\n\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.MESSAGES' | translate }}</dt>\n\t\t\t\t\t\t<dd>{{ row.address.messageCount ?? 0 }}</dd>\n\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.LAST_MESSAGE' | translate }}</dt>\n\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\trow.address.lastMessageAt\n\t\t\t\t\t\t\t\t\t? (row.address.lastMessageAt | date : 'medium')\n\t\t\t\t\t\t\t\t\t: ('DOCS.INBOUND.NEVER' | translate)\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</dd>\n\t\t\t\t\t</dl>\n\n\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.manage\">\n\t\t\t\t\t\t<!-- Shared controls: allowlist, body import, active flag. -->\n\t\t\t\t\t\t<ng-container *ngTemplateOutlet=\"addressControls; context: row.context\"></ng-container>\n\n\t\t\t\t\t\t<!-- Rotating a PLATFORM address REPLACES it: two-step, with the consequence up front. -->\n\t\t\t\t\t\t<div class=\"docs-inbound-danger\">\n\t\t\t\t\t\t\t<ng-container *ngIf=\"row.confirm !== 'address'; else confirmRotateAddress\">\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\tstatus=\"warning\"\n\t\t\t\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t\t\t\t(click)=\"askConfirm(row, 'address')\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"sync-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t{{ 'DOCS.INBOUND.ROTATE_ADDRESS' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<div class=\"hint warn\">{{ 'DOCS.INBOUND.ROTATE_ADDRESS_WARNING' | translate }}</div>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t<ng-template #confirmRotateAddress>\n\t\t\t\t\t\t\t\t<div class=\"hint warn\">{{ 'DOCS.INBOUND.ROTATE_ADDRESS_WARNING' | translate }}</div>\n\t\t\t\t\t\t\t\t<div class=\"docs-inbound-confirm\">\n\t\t\t\t\t\t\t\t\t<button nbButton ghost size=\"small\" (click)=\"cancelConfirm(row)\">\n\t\t\t\t\t\t\t\t\t\t{{ 'DOCS.UPLOAD.CANCEL' | translate }}\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t\t\t\t\t(click)=\"rotateAddress(row)\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t{{ 'DOCS.INBOUND.ROTATE_CONFIRM' | translate }}\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</ng-container>\n\t\t\t\t</ng-container>\n\n\t\t\t\t<ng-template #noPlatform>\n\t\t\t\t\t<p class=\"muted\">{{ 'DOCS.INBOUND.NO_PLATFORM' | translate }}</p>\n\t\t\t\t</ng-template>\n\t\t\t</nb-card-body>\n\t\t</nb-card>\n\n\t\t<!-- 2. Tenant-owned domains -->\n\t\t<nb-card class=\"docs-inbound-card\">\n\t\t\t<nb-card-header class=\"docs-inbound-card-header\">\n\t\t\t\t<span>{{ 'DOCS.INBOUND.CUSTOM' | translate }}</span>\n\t\t\t\t<button\n\t\t\t\t\t*ngxPermissionsOnly=\"docsPermissions.manage\"\n\t\t\t\t\tnbButton\n\t\t\t\t\tsize=\"small\"\n\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t[disabled]=\"adding\"\n\t\t\t\t\t(click)=\"addDomain()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t{{ 'DOCS.INBOUND.ADD_DOMAIN' | translate }}\n\t\t\t\t</button>\n\t\t\t</nb-card-header>\n\t\t\t<nb-card-body>\n\t\t\t\t<p class=\"hint\">{{ 'DOCS.INBOUND.CUSTOM_HINT' | translate }}</p>\n\t\t\t\t<p class=\"muted\" *ngIf=\"!customDomains.length\">{{ 'DOCS.INBOUND.NO_CUSTOM' | translate }}</p>\n\n\t\t\t\t<div class=\"docs-inbound-domain\" *ngFor=\"let row of customDomains; trackBy: trackByRowId\">\n\t\t\t\t\t<div class=\"docs-inbound-address-row\">\n\t\t\t\t\t\t<code class=\"docs-inbound-address\">{{ row.address.address }}</code>\n\t\t\t\t\t\t<span class=\"docs-inbound-status\" [ngClass]=\"'is-' + statusBadge(row.address.domainStatus)\">\n\t\t\t\t\t\t\t{{ statusLabelKey(row.address.domainStatus) | translate }}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.INBOUND.COPY_ADDRESS' | translate\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.INBOUND.COPY_ADDRESS' | translate\"\n\t\t\t\t\t\t\t(click)=\"copy(row.address.address, 'DOCS.INBOUND.TOAST_ADDRESS_COPIED')\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"clipboard-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<!-- States what happens to MAIL, not just what happened to the record. -->\n\t\t\t\t\t<div class=\"hint\" [class.warn]=\"row.address.domainStatus !== statuses.VERIFIED\">\n\t\t\t\t\t\t{{ statusHintKey(row.address.domainStatus) | translate }}\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<!-- DNS TXT record -->\n\t\t\t\t\t<div class=\"docs-inbound-verification\">\n\t\t\t\t\t\t<div class=\"label\">{{ 'DOCS.INBOUND.VERIFICATION' | translate }}</div>\n\n\t\t\t\t\t\t<ng-container *ngIf=\"row.verification as verification; else noRecord\">\n\t\t\t\t\t\t\t<dl class=\"docs-inbound-record\">\n\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.RECORD_TYPE' | translate }}</dt>\n\t\t\t\t\t\t\t\t<dd><code>{{ verification.recordType }}</code></dd>\n\n\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.RECORD_NAME' | translate }}</dt>\n\t\t\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t\t\t<code>{{ verification.recordName }}</code>\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.INBOUND.COPY_RECORD_NAME' | translate\"\n\t\t\t\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.INBOUND.COPY_RECORD_NAME' | translate\"\n\t\t\t\t\t\t\t\t\t\t(click)=\"copy(verification.recordName, 'DOCS.INBOUND.TOAST_RECORD_COPIED')\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t<nb-icon icon=\"clipboard-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</dd>\n\n\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.RECORD_VALUE' | translate }}</dt>\n\t\t\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t\t\t<code>{{ verification.recordValue }}</code>\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.INBOUND.COPY_RECORD_VALUE' | translate\"\n\t\t\t\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.INBOUND.COPY_RECORD_VALUE' | translate\"\n\t\t\t\t\t\t\t\t\t\t(click)=\"copy(verification.recordValue, 'DOCS.INBOUND.TOAST_RECORD_COPIED')\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t<nb-icon icon=\"clipboard-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</dd>\n\t\t\t\t\t\t\t</dl>\n\n\t\t\t\t\t\t\t<div class=\"hint\">{{ 'DOCS.INBOUND.VERIFY_HINT' | translate }}</div>\n\t\t\t\t\t\t\t<div class=\"hint\" *ngIf=\"verification.message\">{{ verification.message }}</div>\n\n\t\t\t\t\t\t\t<dl class=\"docs-inbound-meta\">\n\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.LAST_CHECKED' | translate }}</dt>\n\t\t\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\t\t\tverification.lastCheckedAt\n\t\t\t\t\t\t\t\t\t\t\t? (verification.lastCheckedAt | date : 'medium')\n\t\t\t\t\t\t\t\t\t\t\t: ('DOCS.INBOUND.NEVER_CHECKED' | translate)\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t</dd>\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"verification.verifiedAt\">\n\t\t\t\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.VERIFIED_AT' | translate }}</dt>\n\t\t\t\t\t\t\t\t\t<dd>{{ verification.verifiedAt | date : 'medium' }}</dd>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</dl>\n\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t*ngxPermissionsOnly=\"docsPermissions.manage\"\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t\t\t(click)=\"verify(row)\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<nb-icon icon=\"checkmark-circle-2-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t{{ 'DOCS.INBOUND.VERIFY' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</ng-container>\n\n\t\t\t\t\t\t<ng-template #noRecord>\n\t\t\t\t\t\t\t<p class=\"muted\">{{ 'DOCS.INBOUND.NO_RECORD' | translate }}</p>\n\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<dl class=\"docs-inbound-meta\">\n\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.MESSAGES' | translate }}</dt>\n\t\t\t\t\t\t<dd>{{ row.address.messageCount ?? 0 }}</dd>\n\t\t\t\t\t\t<dt>{{ 'DOCS.INBOUND.LAST_MESSAGE' | translate }}</dt>\n\t\t\t\t\t\t<dd>\n\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\trow.address.lastMessageAt\n\t\t\t\t\t\t\t\t\t? (row.address.lastMessageAt | date : 'medium')\n\t\t\t\t\t\t\t\t\t: ('DOCS.INBOUND.NEVER' | translate)\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</dd>\n\t\t\t\t\t</dl>\n\n\t\t\t\t\t<ng-container *ngxPermissionsOnly=\"docsPermissions.manage\">\n\t\t\t\t\t\t<!-- Shared controls: allowlist, body import, active flag. -->\n\t\t\t\t\t\t<ng-container *ngTemplateOutlet=\"addressControls; context: row.context\"></ng-container>\n\n\t\t\t\t\t\t<!-- The relay secret is per-address, so rotating it is a CUSTOM_DOMAIN action only. -->\n\t\t\t\t\t\t<div class=\"docs-inbound-danger\">\n\t\t\t\t\t\t\t<ng-container *ngIf=\"row.confirm !== 'secret'; else confirmRotateSecret\">\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\tstatus=\"warning\"\n\t\t\t\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t\t\t\t(click)=\"askConfirm(row, 'secret')\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"sync-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t{{ 'DOCS.INBOUND.ROTATE_SECRET' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<div class=\"hint warn\">{{ 'DOCS.INBOUND.ROTATE_SECRET_WARNING' | translate }}</div>\n\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t<ng-template #confirmRotateSecret>\n\t\t\t\t\t\t\t\t<div class=\"hint warn\">{{ 'DOCS.INBOUND.ROTATE_SECRET_WARNING' | translate }}</div>\n\t\t\t\t\t\t\t\t<div class=\"docs-inbound-confirm\">\n\t\t\t\t\t\t\t\t\t<button nbButton ghost size=\"small\" (click)=\"cancelConfirm(row)\">\n\t\t\t\t\t\t\t\t\t\t{{ 'DOCS.UPLOAD.CANCEL' | translate }}\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t\t\t\t\t(click)=\"rotateSecret(row)\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t{{ 'DOCS.INBOUND.ROTATE_CONFIRM' | translate }}\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</ng-container>\n\t\t\t\t</div>\n\t\t\t</nb-card-body>\n\t\t</nb-card>\n\t</ng-container>\n\n\t<!--\n\t\tShared per-address controls. Rendered through `ngTemplateOutlet` with the row's OWN,\n\t\tpre-built context object (`IDocsInboundAddressRow.context`) \u2014 an inline\n\t\t`context: { $implicit: row }` would allocate a fresh context every change-detection pass.\n\t-->\n\t<ng-template #addressControls let-row>\n\t\t<div class=\"docs-inbound-controls\">\n\t\t\t<!-- Sender allowlist: empty = accept anything that passed SPF/DKIM. -->\n\t\t\t<div class=\"docs-inbound-allowlist\">\n\t\t\t\t<div class=\"label\">{{ 'DOCS.INBOUND.ALLOWLIST' | translate }}</div>\n\n\t\t\t\t<div class=\"docs-inbound-chips\" *ngIf=\"row.allowlist.length; else allowlistEmpty\">\n\t\t\t\t\t<span class=\"docs-inbound-chip\" *ngFor=\"let entry of row.allowlist; trackBy: trackByEntry\">\n\t\t\t\t\t\t<code>{{ entry }}</code>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.INBOUND.ALLOWLIST_REMOVE' | translate\"\n\t\t\t\t\t\t\t[nbTooltip]=\"'DOCS.INBOUND.ALLOWLIST_REMOVE' | translate\"\n\t\t\t\t\t\t\t(click)=\"removeAllowlistEntry(row, entry)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</span>\n\t\t\t\t</div>\n\t\t\t\t<ng-template #allowlistEmpty>\n\t\t\t\t\t<p class=\"muted\">{{ 'DOCS.INBOUND.ALLOWLIST_EMPTY' | translate }}</p>\n\t\t\t\t</ng-template>\n\n\t\t\t\t<div class=\"docs-inbound-allowlist-field\">\n\t\t\t\t\t<input\n\t\t\t\t\t\tnbInput\n\t\t\t\t\t\tfieldSize=\"small\"\n\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\tmaxlength=\"320\"\n\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t\t[attr.aria-label]=\"'DOCS.INBOUND.ALLOWLIST' | translate\"\n\t\t\t\t\t\tplaceholder=\"{{ 'DOCS.INBOUND.ALLOWLIST_PLACEHOLDER' | translate }}\"\n\t\t\t\t\t\t[(ngModel)]=\"row.allowlistEntry\"\n\t\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t\t(keydown.enter)=\"addAllowlistEntry(row)\"\n\t\t\t\t\t/>\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t[disabled]=\"!canAddAllowlistEntry(row)\"\n\t\t\t\t\t\t(click)=\"addAllowlistEntry(row)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'DOCS.INBOUND.ALLOWLIST_ADD' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<button\n\t\t\t\t\t\tnbButton\n\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t[disabled]=\"!row.allowlistDirty || row.busy\"\n\t\t\t\t\t\t(click)=\"saveAllowlist(row)\"\n\t\t\t\t\t>\n\t\t\t\t\t\t{{ 'BUTTONS.SAVE' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"hint\">{{ 'DOCS.INBOUND.ALLOWLIST_HINT' | translate }}</div>\n\t\t\t\t<div class=\"hint warn\" *ngIf=\"row.allowlist.length >= allowlistMax\">\n\t\t\t\t\t{{ 'DOCS.INBOUND.ALLOWLIST_FULL' | translate : { max: allowlistMax } }}\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"docs-inbound-row\">\n\t\t\t\t<nb-toggle\n\t\t\t\t\tlabelPosition=\"end\"\n\t\t\t\t\t[checked]=\"!!row.address.importBodyAsNote\"\n\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t(checkedChange)=\"onImportBodyToggle(row, $event)\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'DOCS.INBOUND.IMPORT_BODY' | translate }}\n\t\t\t\t</nb-toggle>\n\t\t\t\t<div class=\"hint\">{{ 'DOCS.INBOUND.IMPORT_BODY_HINT' | translate }}</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"docs-inbound-row\">\n\t\t\t\t<nb-toggle\n\t\t\t\t\tlabelPosition=\"end\"\n\t\t\t\t\t[checked]=\"row.address.isActive !== false\"\n\t\t\t\t\t[disabled]=\"row.busy\"\n\t\t\t\t\t(checkedChange)=\"onActiveToggle(row, $event)\"\n\t\t\t\t>\n\t\t\t\t\t{{ 'DOCS.INBOUND.ACTIVE' | translate }}\n\t\t\t\t</nb-toggle>\n\t\t\t\t<div class=\"hint\">{{ 'DOCS.INBOUND.ACTIVE_HINT' | translate }}</div>\n\t\t\t</div>\n\t\t</div>\n\t</ng-template>\n</div>\n", styles: ["@charset \"UTF-8\";:host{display:block}.docs-inbound{display:flex;flex-direction:column;gap:1rem;padding:1rem;min-height:12rem}.docs-inbound-header h4{margin:0}.muted{color:var(--text-hint-color);margin:0}.hint{color:var(--text-hint-color);font-size:.75rem;margin-top:.25rem}.hint.warn{color:var(--text-warning-color)}.label{display:block;margin-bottom:.25rem;font-weight:600}.docs-inbound-card{margin:0}.docs-inbound-card-header{display:flex;align-items:center;justify-content:space-between;gap:.75rem}.docs-inbound-notice{display:flex;align-items:center;gap:.5rem}.docs-inbound-address-row{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}.docs-inbound-address{padding:.375rem .5rem;border:1px solid var(--divider-color);border-radius:.25rem;font-size:.875rem;overflow-wrap:anywhere}.docs-inbound-status{padding:.125rem .5rem;border-radius:.75rem;font-size:.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:.02em;border:1px solid currentColor}.docs-inbound-status.is-success{color:var(--text-success-color)}.docs-inbound-status.is-warning{color:var(--text-warning-color)}.docs-inbound-status.is-danger{color:var(--text-danger-color)}.docs-inbound-domain{padding:1rem 0}.docs-inbound-domain+.docs-inbound-domain{border-top:1px solid var(--divider-color)}.docs-inbound-verification{margin-top:1rem;padding:.75rem;border:1px solid var(--divider-color);border-radius:.25rem}.docs-inbound-record{display:grid;grid-template-columns:auto 1fr;gap:.25rem 1rem;margin:0 0 .5rem}.docs-inbound-record dt{color:var(--text-hint-color);font-size:.75rem;text-transform:uppercase}.docs-inbound-record dd{display:flex;align-items:center;gap:.375rem;margin:0;min-width:0}.docs-inbound-record dd code{font-size:.8125rem;overflow-wrap:anywhere}.docs-inbound-meta{display:grid;grid-template-columns:auto 1fr;gap:.25rem 1rem;margin:.75rem 0 0}.docs-inbound-meta dt{color:var(--text-hint-color)}.docs-inbound-meta dd{margin:0}.docs-inbound-controls,.docs-inbound-row,.docs-inbound-allowlist{margin-top:1rem}.docs-inbound-chips{display:flex;flex-wrap:wrap;gap:.375rem;margin-bottom:.5rem}.docs-inbound-chip{display:inline-flex;align-items:center;gap:.25rem;padding:.125rem .25rem .125rem .5rem;border:1px solid var(--divider-color);border-radius:1rem}.docs-inbound-chip code{font-size:.8125rem}.docs-inbound-allowlist-field{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}.docs-inbound-allowlist-field input{flex:1 1 16rem;min-width:12rem}.docs-inbound-danger{margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--divider-color)}.docs-inbound-confirm{display:flex;align-items:center;gap:.5rem;margin-top:.5rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.TranslateService }, { type: i2.DocumentInboundAddressService }, { type: i3.DocumentsService }, { type: i4.ToastrService }, { type: i5.NbDialogService }, { type: i4.Store }] });
//# sourceMappingURL=docs-inbound-settings-page.component.js.map