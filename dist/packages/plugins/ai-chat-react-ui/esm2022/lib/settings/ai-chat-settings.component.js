import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NbBadgeModule, NbButtonModule, NbCardModule, NbDialogService, NbFormFieldModule, NbIconModule, NbInputModule, NbSpinnerModule, NbToastrService, NbToggleModule, NbTooltipModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EMPTY, forkJoin, of } from 'rxjs';
import { catchError, filter, finalize, switchMap } from 'rxjs/operators';
import { ChatSidebarService, Store } from '@gauzy/ui-core/core';
import { ConfirmComponent } from '@gauzy/ui-core/shared';
import { AiChatAvailabilityService } from '../ai-chat-availability.service';
import { AiChatSettingsService } from './ai-chat-settings.service';
import { PROVIDER_LOGOS } from './provider-logos';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@nebular/theme";
import * as i4 from "@ng-select/ng-select";
import * as i5 from "@ngx-translate/core";
/** Sentinel select value meaning "type a custom model id". */
const CUSTOM_MODEL = '__custom__';
/** Presentation of each chat notice: Nebular status, icon and i18n keys. */
const CHAT_NOTICES = {
    ready: {
        status: 'success',
        icon: 'checkmark-circle-2-outline',
        title: 'AI_CHAT_UI.SETTINGS.STATUS.READY_TITLE',
        hint: 'AI_CHAT_UI.SETTINGS.STATUS.READY_HINT'
    },
    'no-permission': {
        status: 'warning',
        icon: 'lock-outline',
        title: 'AI_CHAT_UI.SETTINGS.STATUS.NO_PERMISSION_TITLE',
        hint: 'AI_CHAT_UI.SETTINGS.STATUS.NO_PERMISSION_HINT'
    },
    'globally-disabled': {
        status: 'warning',
        icon: 'slash-outline',
        title: 'AI_CHAT_UI.SETTINGS.STATUS.GLOBALLY_DISABLED_TITLE',
        hint: 'AI_CHAT_UI.SETTINGS.STATUS.GLOBALLY_DISABLED_HINT'
    },
    'credentials-unusable': {
        status: 'danger',
        icon: 'alert-triangle-outline',
        title: 'AI_CHAT_UI.SETTINGS.STATUS.CREDENTIALS_UNUSABLE_TITLE',
        hint: 'AI_CHAT_UI.SETTINGS.STATUS.CREDENTIALS_UNUSABLE_HINT'
    },
    unreachable: {
        status: 'info',
        icon: 'question-mark-circle-outline',
        title: 'AI_CHAT_UI.SETTINGS.STATUS.UNREACHABLE_TITLE',
        hint: 'AI_CHAT_UI.SETTINGS.STATUS.UNREACHABLE_HINT'
    }
};
/** sessionStorage key holding the in-flight Connect (PKCE) state. */
const CONNECT_SESSION_KEY = 'gauzy_ai_provider_connect';
/**
 * AiChatSettingsComponent
 *
 * Per-tenant "AI Providers" (BYOK) settings, structured like the
 * Integrations page as three views on one route (query-param driven, so
 * the browser back button and deep links work):
 *
 * - **list** (default): providers that are already configured (tenant key
 *   or server env) with status/default badges, quick enable toggle and
 *   Configure/Delete actions, plus a "+ Add AI Provider" button.
 * - **catalog** (`?add=1`, or `?add=voice` for the speech-capable subset —
 *   the "+ Add AI Voice Provider" button): all registered providers as logo
 *   cards in their defined order with capability chips (Chat / Speech-to-text
 *   / Local) — click one to configure it.
 * - **config** (`?provider=<id>`): the credential form for one provider
 *   (API key, base URL, default model, enabled, default provider; for
 *   speech-capable providers also the speech model and "use as default voice
 *   provider"), plus a "Connect" button for providers that support a connect
 *   flow (OpenRouter PKCE) and a "Get API key" link. Local servers may be
 *   saved without an API key.
 *
 * The list view also has a **Voice (dictation)** section: which configured
 * providers can transcribe and which one is the tenant's voice default.
 *
 * The OpenRouter PKCE callback also lands here (`?code=...`): the code +
 * the sessionStorage verifier are exchanged server-side for an API key.
 *
 * Requires the `AI_CHAT_SETTINGS` permission (route guard + backend).
 */
export class AiChatSettingsComponent {
    constructor() {
        /** Select value meaning "type a custom model id" (used by the template). */
        this.CUSTOM_MODEL = CUSTOM_MODEL;
        /** Whether the initial config + credentials load is in flight. */
        this.loading = signal(true, ...(ngDevMode ? [{ debugName: "loading" }] : []));
        /** Provider id whose credential is currently being saved (or `null`). */
        this.saving = signal(null, ...(ngDevMode ? [{ debugName: "saving" }] : []));
        /** Provider id whose credential is currently being deleted (or `null`). */
        this.deleting = signal(null, ...(ngDevMode ? [{ debugName: "deleting" }] : []));
        /** True while a Connect (PKCE) exchange is being completed. */
        this.connecting = signal(false, ...(ngDevMode ? [{ debugName: "connecting" }] : []));
        /** Providers registered on the backend, in their defined display order. */
        this.providers = signal([], ...(ngDevMode ? [{ debugName: "providers" }] : []));
        /** The tenant's current default provider id (from the backend config). */
        this.defaultProviderId = signal(null, ...(ngDevMode ? [{ debugName: "defaultProviderId" }] : []));
        /** The tenant's current default VOICE (dictation) provider id (from the backend config). */
        this.defaultVoiceProviderId = signal(null, ...(ngDevMode ? [{ debugName: "defaultVoiceProviderId" }] : []));
        /** Whether the backend can transcribe for this tenant right now (`config.speechConfigured`). */
        this.speechConfigured = signal(false, ...(ngDevMode ? [{ debugName: "speechConfigured" }] : []));
        /** Current view: driven by the route query params. */
        this.view = signal('list', ...(ngDevMode ? [{ debugName: "view" }] : []));
        /** What the catalog view offers (`?add=1` → all, `?add=voice` → speech-capable only). */
        this.catalogFilter = signal('all', ...(ngDevMode ? [{ debugName: "catalogFilter" }] : []));
        /** Provider selected in the config view. */
        this.selectedProviderId = signal(null, ...(ngDevMode ? [{ debugName: "selectedProviderId" }] : []));
        /**
         * Live model catalogues, indexed by provider id, fetched when a provider's config view opens.
         *
         * Absent until then — {@link modelsFor} falls back to the curated list carried by `/config`, so
         * the picker is never empty while this is loading or if it fails.
         */
        this.modelCatalogues = signal(new Map(), ...(ngDevMode ? [{ debugName: "modelCatalogues" }] : []));
        /**
         * Provider ids whose catalogue is in flight.
         *
         * A SET, not one id. Switching from provider A to B before A returns had A's completion clear the
         * single slot, dropping B's spinner while B was still loading — and leaving A's guard open, so
         * going back to A fired a duplicate request.
         */
        this.loadingModels = signal(new Set(), ...(ngDevMode ? [{ debugName: "loadingModels" }] : []));
        /**
         * Memoised picker items per provider, so `[items]` is referentially stable across change
         * detection. Plain map, not a signal: it is a cache of a derived value, never a source of truth.
         */
        this.modelOptionsCache = new Map();
        /**
         * Per-provider generation counter, bumped by {@link invalidateCatalogue}.
         *
         * Dropping the cached entry is not enough on its own: a fetch that was already in flight when the
         * credential changed still resolves, and storing THAT answer re-caches the pre-change list — and
         * the `has(providerId)` guard then blocks the refetch it was invalidated for. A response whose
         * generation no longer matches is discarded instead.
         */
        this.catalogueGeneration = new Map();
        /** The provider object for the config view. */
        this.selectedProvider = computed(() => this.providers().find((provider) => provider.id === this.selectedProviderId()) ?? null, ...(ngDevMode ? [{ debugName: "selectedProvider" }] : []));
        /** Providers that are configured (tenant key or server env) — the list view rows. */
        this.configuredProviders = computed(() => this.providers().filter((provider) => provider.configured), ...(ngDevMode ? [{ debugName: "configuredProviders" }] : []));
        /**
         * Providers that can transcribe AND have credentials — the "Voice (dictation)" rows.
         *
         * Not `configured`: that is the CHAT verdict, and a voice-only provider (Deepgram, a local
         * whisper server) is never chat-configured. `credentialSource` is emitted whenever credentials
         * resolve, capability aside, so it is the speech-side "configured". Sorted so the tenant's voice
         * default leads — that is the order dictation tries them in.
         */
        this.voiceProviders = computed(() => {
            const voiceDefault = this.defaultVoiceProviderId();
            return this.providers()
                .filter((provider) => provider.speechCapable && !!provider.credentialSource)
                .sort((a, b) => (a.id === voiceDefault ? -1 : b.id === voiceDefault ? 1 : 0));
        }, ...(ngDevMode ? [{ debugName: "voiceProviders" }] : []));
        /** All speech-capable providers (configured or not) — the voice catalog. */
        this.speechCapableProviders = computed(() => this.providers().filter((provider) => provider.speechCapable), ...(ngDevMode ? [{ debugName: "speechCapableProviders" }] : []));
        /** Providers offered by the catalog view under the current filter. */
        this.catalogProviders = computed(() => this.catalogFilter() === 'voice' ? this.speechCapableProviders() : this.providers(), ...(ngDevMode ? [{ debugName: "catalogProviders" }] : []));
        /**
         * Tenant credentials indexed by provider id (API keys masked).
         * A signal because {@link chatNotice} has to react to it: a saved-but-unusable
         * credential is exactly the case the notice exists to explain.
         */
        this.credentialsByProvider = signal(new Map(), ...(ngDevMode ? [{ debugName: "credentialsByProvider" }] : []));
        /** Per-provider reactive forms indexed by provider id. */
        this.forms = new Map();
        /** Provider ids whose API key input is shown as plain text. */
        this.revealedKeys = new Set();
        /** Radio control: which provider is the tenant's default for chat. */
        this.defaultProviderControl = new FormControl(null);
        /**
         * Which provider is the tenant's default for VOICE (dictation). Independent of the chat default:
         * a tenant may chat through Anthropic and dictate through a local whisper server. `null` means
         * "no pin" — dictation then walks the speech-capable providers in order.
         */
        this.voiceDefaultControl = new FormControl(null);
        this.fb = inject(FormBuilder);
        this.store = inject(Store);
        this.availability = inject(AiChatAvailabilityService);
        this.chatSidebar = inject(ChatSidebarService);
        this.settingsService = inject(AiChatSettingsService);
        this.dialogService = inject(NbDialogService);
        this.toastrService = inject(NbToastrService);
        this.translateService = inject(TranslateService);
        this.cdr = inject(ChangeDetectorRef);
        this.router = inject(Router);
        this.route = inject(ActivatedRoute);
        // Angular's own teardown rather than @ngneat/until-destroy: that package is
        // not a dependency of this plugin, and takeUntilDestroyed does the same job.
        this.destroyRef = inject(DestroyRef);
        /**
         * Which notice (if any) to show about the chat itself — the answer to
         * "I configured a provider, so where is the chat?".
         *
         * Stays `null` while the page is loading, while the availability check is
         * still pending, and for a brand-new tenant that has configured nothing yet
         * (the empty state already tells that user what to do).
         */
        this.chatNotice = computed(() => {
            const status = this.availability.status();
            if (this.loading() || !status.resolved) {
                return null;
            }
            // Read the count off the SAME verdict that produced `status.reason`.
            // `AiChatAvailabilityService` and this component each call
            // `/api/ai-chat/config` on their own — and after save/delete/toggle both
            // `load()` and `refresh()` fire independently — so pairing this
            // component's `configuredProviders()` with the service's `reason` let the
            // notice combine two different snapshots (a fresh "no usable provider"
            // verdict with a stale count, say) and contradict the list below it.
            const configuredCount = status.configuredProviders;
            // The saved-credential rows have no counterpart on the verdict: the
            // service never calls `/credentials`, so this page is the only source for
            // "a credential row exists", not a second opinion on the same question.
            // …and only rows of CHAT-capable providers count here: a tenant whose only saved
            // credential is a voice-only provider (Speaches, Deepgram, …) has configured dictation,
            // not chat, and must not be told its "saved credentials cannot be used".
            const providersById = new Map(this.providers().map((provider) => [provider.id, provider]));
            const credentialCount = [...this.credentialsByProvider().keys()].filter((providerId) => providersById.get(providerId)?.chatCapable !== false).length;
            // `unreachable` is exempt from the "nothing configured yet, stay quiet"
            // gate below. In that state the service's call FAILED, so it reports
            // `configuredProviders: 0` meaning "unknown", not "none" — and a tenant
            // configured purely through server env has no credential rows either, so
            // the gate would swallow the one notice that explains why chat is missing.
            if (status.reason === 'unreachable') {
                return 'unreachable';
            }
            if (!configuredCount && !credentialCount) {
                return null;
            }
            if (status.available) {
                return 'ready';
            }
            switch (status.reason) {
                case 'no-permission':
                    return 'no-permission';
                case 'globally-disabled':
                    return 'globally-disabled';
                // No `unreachable` case: it is decided above the "nothing configured"
                // gate, so control flow has already narrowed it out of `reason` here.
                case 'no-providers':
                    // A credential row exists but the server can use none of them: the
                    // credential is disabled, or its stored key no longer decrypts
                    // (ENCRYPTION_KEY changed). Without this the row silently vanishes
                    // from the list and the page looks like nothing was ever saved.
                    return configuredCount === 0 && credentialCount > 0 ? 'credentials-unusable' : null;
                default:
                    return null;
            }
        }, ...(ngDevMode ? [{ debugName: "chatNotice" }] : []));
        /** Presentation (status, icon, i18n keys) of the current chat notice. */
        this.chatNoticeMeta = computed(() => {
            const kind = this.chatNotice();
            return kind ? CHAT_NOTICES[kind] : null;
        }, ...(ngDevMode ? [{ debugName: "chatNoticeMeta" }] : []));
        /**
         * Search a model by its ID as well as its label.
         *
         * ng-select's default search only looks at the label, and on the routing providers the label is a
         * display name ("Anthropic: Claude Sonnet 5") while the id is the slug
         * (`anthropic/claude-sonnet-5`). Pasting the id you were handed — the thing the empty-state text
         * tells you to type — matched nothing and reported the model as absent while it sat in the list.
         */
        this.searchModel = (term, model) => {
            // "Custom model…" always survives. It is the escape hatch for a model that is NOT in the list,
            // so filtering it out on a search that matches nothing leaves the not-found text telling the
            // user to pick an option that is no longer on screen.
            if (model.id === CUSTOM_MODEL) {
                return true;
            }
            const needle = term.toLowerCase();
            return model.id.toLowerCase().includes(needle) || (model.label ?? '').toLowerCase().includes(needle);
        };
        /** Memoised speech-model picker items per provider (see {@link modelOptionsCache}). */
        this.speechModelOptionsCache = new Map();
    }
    ngOnInit() {
        // Complete an in-flight Connect flow when the provider redirected back
        // with ?code=... and we still hold the PKCE verifier for this session.
        const code = this.route.snapshot.queryParamMap.get('code');
        const pending = this.readConnectSession();
        if (code && pending) {
            // The exchange stores the key for the CURRENT tenant/organization, so
            // refuse to complete a flow that was started in a different workspace.
            // Compare exactly (null included): a flow started with no organization
            // must not complete under one selected mid-flight.
            const tenantChanged = (pending.tenantId ?? null) !== (this.store.user?.tenantId ?? null);
            const organizationChanged = (pending.organizationId ?? null) !== (this.store.organizationId ?? null);
            if (tenantChanged || organizationChanged) {
                sessionStorage.removeItem(CONNECT_SESSION_KEY);
                this.toastrService.danger(this.translateService.instant('AI_CHAT_UI.SETTINGS.TOASTR.CONNECT_WORKSPACE_MISMATCH'), this.translateService.instant('AI_CHAT_UI.SETTINGS.TOASTR.ERROR_TITLE'));
                void this.router.navigate([], { relativeTo: this.route, queryParams: {} });
                this.load();
            }
            else {
                this.completeConnect(pending.providerId, code, pending.verifier);
            }
        }
        else if (code) {
            // ?code= arrived but the PKCE session is gone (page reloaded, other
            // tab, or expired) — tell the user instead of failing silently, and
            // strip the stale one-time code from the URL.
            this.toastrService.warning(this.translateService.instant('AI_CHAT_UI.SETTINGS.TOASTR.CONNECT_SESSION_EXPIRED'), this.translateService.instant('AI_CHAT_UI.SETTINGS.TOASTR.ERROR_TITLE'));
            void this.router.navigate([], { relativeTo: this.route, queryParams: {} });
            this.load();
        }
        else {
            this.load();
        }
        // The memoised picker items freeze the TRANSLATED "Custom model…" label, and neither of the
        // cache's other invalidations (a credential change, a new source array) fires on a language
        // switch — so without this the sentinel keeps rendering in the previous language.
        this.translateService.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.modelOptionsCache.clear();
            this.speechModelOptionsCache.clear();
            this.cdr.markForCheck();
        });
        // Keep the view in sync with the query params (back/forward navigation).
        this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const providerId = params.get('provider');
            if (providerId) {
                this.selectedProviderId.set(providerId);
                this.view.set('config');
                // The two exclusive "default" controls are page-wide: an UNSAVED toggle made in one
                // provider's config must not leak into the next one's — start from what is saved.
                this.syncExclusiveControls();
                // Only this view needs the catalogue, and only for this one provider.
                this.loadModels(providerId);
            }
            else if (params.get('add') !== null) {
                this.view.set('catalog');
                this.catalogFilter.set(params.get('add') === 'voice' ? 'voice' : 'all');
            }
            else {
                this.view.set('list');
            }
            this.cdr.markForCheck();
        });
    }
    // ── Navigation between the three views ─────────────────────────────
    showList() {
        void this.router.navigate([], { relativeTo: this.route, queryParams: {} });
    }
    showCatalog() {
        void this.router.navigate([], { relativeTo: this.route, queryParams: { add: 1 } });
    }
    /** The catalog narrowed to providers that can transcribe — the "+ Add AI Voice Provider" flow. */
    showVoiceCatalog() {
        void this.router.navigate([], { relativeTo: this.route, queryParams: { add: 'voice' } });
    }
    showConfigure(providerId) {
        void this.router.navigate([], { relativeTo: this.route, queryParams: { provider: providerId } });
    }
    /**
     * Back from the config view: to the voice catalog for a voice-only provider (that is where the
     * user came from), otherwise to the full catalog.
     */
    backFromConfigure(provider) {
        if (this.isVoiceOnly(provider) || this.catalogFilter() === 'voice') {
            this.showVoiceCatalog();
        }
        else {
            this.showCatalog();
        }
    }
    /** True for a provider that transcribes but cannot chat (Deepgram, a local whisper server …). */
    isVoiceOnly(provider) {
        return provider.speechCapable && provider.chatCapable === false;
    }
    /** True when a speech-capable provider has credentials — i.e. it can serve dictation now. */
    isVoiceConfigured(provider) {
        return provider.speechCapable && !!provider.credentialSource;
    }
    // ── Data loading ───────────────────────────────────────────────────
    /**
     * Loads the provider configuration and tenant credentials, then
     * (re)builds one credential form per registered provider.
     */
    load() {
        this.loading.set(true);
        // Each call fails soft so one failing does NOT blank the whole page:
        // `/config` (registered providers) and `/credentials` (saved tenant keys)
        // are independent — the catalog must still render when the credentials
        // call fails (keys just aren't pre-filled), and vice versa.
        forkJoin({
            config: this.settingsService.getConfig().pipe(catchError((error) => {
                this.showError(error);
                return of(null);
            })),
            credentials: this.settingsService.getCredentials().pipe(catchError((error) => {
                // Surface the failure — otherwise saved keys silently look
                // unconfigured (toggles/delete disappear) on a transient error.
                this.showError(error);
                return of({ items: [], total: 0 });
            }))
        })
            .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
            .subscribe(({ config, credentials }) => {
            this.credentialsByProvider.set(new Map((credentials?.items ?? []).map((credential) => [credential.providerId, credential])));
            this.providers.set(config?.providers ?? []);
            this.defaultProviderId.set(config?.defaultProvider ?? null);
            this.defaultVoiceProviderId.set(config?.defaultVoiceProvider ?? null);
            this.speechConfigured.set(config?.speechConfigured ?? false);
            this.buildForms();
            // Unknown ?provider= deep link → fall back to the catalog
            // instead of a blank config view.
            if (this.view() === 'config' && this.providers().length && !this.selectedProvider()) {
                this.showCatalog();
            }
            this.cdr.markForCheck();
        });
    }
    // ── Chat availability ──────────────────────────────────────────────
    /**
     * Re-evaluates whether the chat is now available.
     *
     * Saving/deleting/connecting a credential flips the backend verdict but
     * emits nothing the sidebar registration listens to, so without this call
     * the chat only appears after a full page reload.
     */
    refreshChatAvailability() {
        this.availability.refresh();
    }
    /** Expands the chat sidebar, so "where is the chat?" is one click away. */
    openChat() {
        this.chatSidebar.expand();
    }
    // ── Template helpers ───────────────────────────────────────────────
    /**
     * The brand mark bundled for a provider, or `null` when none is bundled.
     *
     * @param providerId Registered provider id, e.g. `openai`.
     * @returns The mark to draw in the provider's tile, `null` to fall back to
     * the monogram tile (see {@link tileMonogram}).
     */
    providerLogo(providerId) {
        // Own-property lookup rather than a bare index: provider ids come from
        // the backend, and an id such as "constructor" would otherwise resolve
        // to something off `Object.prototype` and blow up the tile.
        return Object.hasOwn(PROVIDER_LOGOS, providerId) ? PROVIDER_LOGOS[providerId] : null;
    }
    /**
     * Initials for the fallback monogram tile, drawn only for providers that
     * ship no brand mark — a provider contributed by a future plugin, say.
     * Rendering initials keeps that tile from collapsing into an empty box.
     *
     * @param provider The provider to label.
     * @returns Up to two uppercase initials, one per leading word of the label
     * (so "Vercel AI Gateway" reads "VA", not "VE").
     */
    tileMonogram(provider) {
        // Everything here comes off the wire, so nothing is assumed present: a
        // provider that somehow arrives without a label AND without an id must
        // still render a tile rather than throw and blank the whole page.
        const id = provider?.id ?? '';
        const words = (provider?.label || id)
            .trim()
            .split(/[\s_-]+/)
            .filter(Boolean);
        const initials = words
            .slice(0, 2)
            .map((word) => word.charAt(0))
            .join('');
        return (initials || id.slice(0, 2) || '?').toUpperCase();
    }
    // ── Model catalogue (config view) ──────────────────────────────────
    /**
     * Fetches a provider's model catalogue for the picker.
     *
     * Fails soft in both directions: an error leaves the curated list in place (the endpoint itself
     * already degrades to curated rather than erroring, so this only catches transport failures), and
     * a second visit to the same provider re-uses what was already fetched instead of re-calling an
     * upstream API on every back-and-forth between the list and the config view.
     */
    loadModels(providerId) {
        if (this.modelCatalogues().has(providerId) || this.loadingModels().has(providerId)) {
            return;
        }
        const generation = this.catalogueGeneration.get(providerId) ?? 0;
        this.loadingModels.update((current) => new Set(current).add(providerId));
        this.settingsService
            .getProviderModels(providerId)
            .pipe(takeUntilDestroyed(this.destroyRef), catchError(() => of(null)), finalize(() => {
            this.loadingModels.update((current) => {
                const next = new Set(current);
                next.delete(providerId);
                return next;
            });
            this.cdr.markForCheck();
        }))
            .subscribe((catalogue) => {
            // A credential changed while this was in flight, so this answer is about a key that is
            // no longer configured. Dropping it leaves the map empty, which is what makes the next
            // visit fetch again.
            if (!catalogue || (this.catalogueGeneration.get(providerId) ?? 0) !== generation) {
                return;
            }
            this.modelCatalogues.update((current) => new Map(current).set(providerId, catalogue));
            this.reconcileModelSelection(providerId);
            this.cdr.markForCheck();
        });
    }
    /** Whether this provider's catalogue is being fetched right now. */
    isLoadingModels(providerId) {
        return this.loadingModels().has(providerId);
    }
    /**
     * Forget a provider's cached catalogue, so the next visit re-fetches it.
     *
     * Called whenever the CREDENTIAL changes, because the catalogue depends on it. Without this, the
     * flow the whole feature exists to fix reappears one step later: a provider running on the shared
     * free key shows the free-tier list, the user saves their own key in that very form, and on
     * returning they are still offered the four free models — the cached answer to a question that no
     * longer applies.
     */
    invalidateCatalogue(providerId) {
        this.catalogueGeneration.set(providerId, (this.catalogueGeneration.get(providerId) ?? 0) + 1);
        this.modelOptionsCache.delete(providerId);
        this.modelCatalogues.update((current) => {
            if (!current.has(providerId)) {
                return current;
            }
            const next = new Map(current);
            next.delete(providerId);
            return next;
        });
    }
    /**
     * The models to offer for a provider: the fetched catalogue when there is one, else the curated
     * list that came with `/config`.
     */
    modelsFor(provider) {
        const catalogue = this.modelCatalogues().get(provider.id);
        return catalogue?.models.length ? catalogue.models : provider.models;
    }
    /**
     * Picker items: the models plus the "Custom model…" sentinel.
     *
     * The sentinel stays even with a live catalogue. Providers ship models faster than any catalogue
     * endpoint reflects them, and a paid model can be addressable by a key long before it is listed —
     * so there has to be a way to type an id in by hand.
     */
    modelOptions(provider) {
        // Memoised per (provider, source list). The template binds this into ng-select's `[items]`, and
        // a fresh array on every change-detection pass makes ng-select rebuild its ItemsList each time
        // — which resets the keyboard-marked item, so arrow keys could not move through the list at
        // all. Keyed on the array identity rather than deep equality: `modelsFor` returns either the
        // catalogue's array or the provider's, both of which are stable until they are replaced.
        const models = this.modelsFor(provider);
        const cached = this.modelOptionsCache.get(provider.id);
        if (cached && cached.source === models) {
            return cached.options;
        }
        const options = [
            ...models,
            {
                id: CUSTOM_MODEL,
                label: this.translateService.instant('AI_CHAT_UI.SETTINGS.FORM.DEFAULT_MODEL_CUSTOM'),
                providerId: provider.id
            }
        ];
        this.modelOptionsCache.set(provider.id, { source: models, options });
        return options;
    }
    /**
     * The note under the model picker explaining where its list came from, or `null` when the list is
     * live and complete (the ordinary case needs no explanation).
     */
    modelSourceKey(provider) {
        // Before anything catalogue-shaped: a placeholder provider (chat routing not implemented; its
        // catalogue is deliberately empty) must not fall through to the 'curated' advice below, which
        // tells the user to save an API key — the one remedy that cannot help here. Checked first and
        // independent of the fetch, because the provider is a placeholder whether or not the catalogue
        // has arrived.
        if (provider.chatCapable === false) {
            return 'AI_CHAT_UI.SETTINGS.FORM.MODELS_NOT_CHAT_CAPABLE';
        }
        const catalogue = this.modelCatalogues().get(provider.id);
        if (!catalogue) {
            return null;
        }
        if (catalogue.source === 'platform') {
            // An EMPTY platform list is not "limited to the free models" — it means the free list could
            // not be determined, and the server will refuse every model until it can. Saying the former
            // in front of an empty dropdown reads as a UI bug.
            return catalogue.models.length
                ? 'AI_CHAT_UI.SETTINGS.FORM.MODELS_PLATFORM'
                : 'AI_CHAT_UI.SETTINGS.FORM.MODELS_PLATFORM_UNAVAILABLE';
        }
        if (catalogue.source === 'curated') {
            // A custom base URL means the server DELIBERATELY made no request: the key belongs to that
            // endpoint, not to the vendor. Reporting that as "could not be loaded just now" invites a
            // retry for a fetch that was never attempted and never will be.
            if (this.getCredential(provider.id)?.baseUrl) {
                return 'AI_CHAT_UI.SETTINGS.FORM.MODELS_CUSTOM_ENDPOINT';
            }
            // The remaining two situations need opposite advice. Telling a user whose key IS saved to
            // "save an API key" reads as the page not knowing what it is doing.
            return provider.configured
                ? 'AI_CHAT_UI.SETTINGS.FORM.MODELS_CURATED_UNAVAILABLE'
                : 'AI_CHAT_UI.SETTINGS.FORM.MODELS_CURATED_NO_KEY';
        }
        return catalogue.stale ? 'AI_CHAT_UI.SETTINGS.FORM.MODELS_STALE' : null;
    }
    /**
     * Re-decides "known model vs custom" once the catalogue arrives.
     *
     * {@link buildForms} runs before the fetch and can only compare against the curated list, so a
     * saved model that is real but simply not curated starts out shown as a custom id. Left alone it
     * would stay that way — a text box next to a dropdown that in fact contains the very model.
     */
    reconcileModelSelection(providerId) {
        const form = this.forms.get(providerId);
        if (!form || form.controls.defaultModel.value !== CUSTOM_MODEL) {
            return;
        }
        const typed = form.controls.customModel.value?.trim();
        if (!typed) {
            return;
        }
        const known = this.modelCatalogues()
            .get(providerId)
            ?.models.some((model) => model.id === typed);
        if (known) {
            form.patchValue({ defaultModel: typed, customModel: '' }, { emitEvent: false });
        }
    }
    // ── Speech model picker (config view, speech-capable providers) ────
    /**
     * Picker items for the speech model: the provider's speech catalogue plus the "Custom…"
     * sentinel. Memoised per provider like {@link modelOptions}, for the same ng-select reason.
     */
    speechModelOptions(provider) {
        const models = provider.speechModels ?? [];
        const cached = this.speechModelOptionsCache.get(provider.id);
        if (cached && cached.source === models) {
            return cached.options;
        }
        const options = [
            ...models,
            {
                id: CUSTOM_MODEL,
                label: this.translateService.instant('AI_CHAT_UI.SETTINGS.FORM.SPEECH_MODEL_CUSTOM'),
                providerId: provider.id
            }
        ];
        this.speechModelOptionsCache.set(provider.id, { source: models, options });
        return options;
    }
    /**
     * Whether the API key input may be left blank for this provider — local servers
     * (`requiresApiKey: false`), or an existing credential whose stored key is kept on a blank
     * update.
     */
    isApiKeyOptional(provider) {
        return provider.requiresApiKey === false || !!this.getCredential(provider.id);
    }
    /** Placeholder for the base URL input: the provider's conventional address, else a generic one. */
    baseUrlPlaceholder(provider) {
        return provider.defaultBaseUrl ?? this.translateService.instant('AI_CHAT_UI.SETTINGS.FORM.BASE_URL_PLACEHOLDER');
    }
    /** Returns the credential form for a provider. */
    getForm(providerId) {
        return this.forms.get(providerId);
    }
    /** Returns the tenant credential (masked) for a provider, if any. */
    getCredential(providerId) {
        return this.credentialsByProvider().get(providerId);
    }
    /** Whether the API key input of a provider is shown as plain text. */
    isKeyRevealed(providerId) {
        return this.revealedKeys.has(providerId);
    }
    /** Toggles the API key input of a provider between password and plain text. */
    toggleKeyReveal(providerId) {
        if (!this.revealedKeys.delete(providerId)) {
            this.revealedKeys.add(providerId);
        }
    }
    /**
     * Returns the translation key for a provider's configuration badge.
     *
     * Every credential source needs its OWN badge. This used to branch on 'environment' and fall
     * through to TENANT_KEY, which meant a tenant running on the shared platform key was told it had
     * entered its own — the one message that is both false and the opposite of the nudge we want,
     * since bringing your own key is exactly how you escape the shared rate limit.
     */
    getBadgeKey(provider) {
        if (!provider.configured) {
            return 'AI_CHAT_UI.SETTINGS.BADGE.NOT_CONFIGURED';
        }
        switch (provider.credentialSource) {
            case 'environment':
                return 'AI_CHAT_UI.SETTINGS.BADGE.SERVER_ENV';
            case 'platform':
                return 'AI_CHAT_UI.SETTINGS.BADGE.PLATFORM_FREE';
            default:
                return 'AI_CHAT_UI.SETTINGS.BADGE.TENANT_KEY';
        }
    }
    /** Returns the badge status color for a provider's configuration state. */
    getBadgeStatus(provider) {
        if (!provider.configured) {
            return 'basic';
        }
        switch (provider.credentialSource) {
            case 'environment':
                return 'info';
            // Working, but not the end state we want the user to sit on: it is rate limited and
            // shared. 'warning' reads as "usable, with a caveat" rather than "all set".
            case 'platform':
                return 'warning';
            default:
                return 'success';
        }
    }
    /** True when this provider is running on the shared, product-supplied free key. */
    isOnPlatformKey(provider) {
        return provider.configured && provider.credentialSource === 'platform';
    }
    /**
     * Credential badge for the VOICE rows: same sources as {@link getBadgeKey}, but keyed on
     * "credentials resolve" rather than on the chat verdict — a voice-only provider is never
     * chat-`configured` and would otherwise always read "Not configured" while transcribing fine.
     */
    getVoiceBadgeKey(provider) {
        if (!provider.credentialSource) {
            return 'AI_CHAT_UI.SETTINGS.BADGE.NOT_CONFIGURED';
        }
        switch (provider.credentialSource) {
            case 'environment':
                return 'AI_CHAT_UI.SETTINGS.BADGE.SERVER_ENV';
            case 'platform':
                return 'AI_CHAT_UI.SETTINGS.BADGE.PLATFORM_FREE';
            default:
                return provider.requiresApiKey === false && !this.getCredential(provider.id)?.apiKey
                    ? 'AI_CHAT_UI.SETTINGS.BADGE.TENANT_URL'
                    : 'AI_CHAT_UI.SETTINGS.BADGE.TENANT_KEY';
        }
    }
    /** Badge status colour for the voice rows (see {@link getVoiceBadgeKey}). */
    getVoiceBadgeStatus(provider) {
        if (!provider.credentialSource) {
            return 'basic';
        }
        switch (provider.credentialSource) {
            case 'environment':
                return 'info';
            case 'platform':
                return 'warning';
            default:
                return 'success';
        }
    }
    // ── List view actions ──────────────────────────────────────────────
    /**
     * Quick enable/disable of a provider's tenant credential from the list.
     * Only available for tenant-key rows (env credentials have no toggle).
     */
    toggleEnabled(provider, enabled) {
        const credential = this.getCredential(provider.id);
        if (!credential?.id) {
            return;
        }
        this.saving.set(provider.id);
        this.settingsService
            .updateCredential(credential.id, { providerId: provider.id, enabled })
            .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(null)))
            .subscribe({
            next: () => {
                // Disabling a tenant key can hand the provider back to the shared platform key, which
                // has a different (narrower) model list.
                this.invalidateCatalogue(provider.id);
                this.load();
                // Disabling the last enabled credential takes the chat away —
                // and enabling one brings it back. Both must be reflected now.
                this.refreshChatAvailability();
            },
            error: (error) => {
                this.showError(error);
                this.load();
            }
        });
    }
    // ── Connect (PKCE) flow ────────────────────────────────────────────
    /**
     * Starts the provider's Connect flow: generates a PKCE verifier +
     * S256 challenge, stashes the verifier in sessionStorage and sends the
     * browser to the provider's authorize page. The provider redirects back
     * to this page with `?code=...`.
     */
    async connect(provider) {
        if (provider.connectType !== 'openrouter-pkce' || !provider.connectAuthorizeUrl) {
            return;
        }
        try {
            const verifier = this.base64Url(crypto.getRandomValues(new Uint8Array(48)));
            const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
            const challenge = this.base64Url(new Uint8Array(digest));
            // Bind the pending flow to the workspace (tenant + organization) it
            // was started in so a mid-flight switch can't store the key elsewhere.
            sessionStorage.setItem(CONNECT_SESSION_KEY, JSON.stringify({
                providerId: provider.id,
                verifier,
                tenantId: this.store.user?.tenantId ?? null,
                organizationId: this.store.organizationId ?? null
            }));
            // The authorize page comes from the provider definition (backend
            // config) so additional connect-capable providers need no UI change.
            const callbackUrl = `${location.origin}${location.pathname}#/pages/settings/ai`;
            const authorizeUrl = `${provider.connectAuthorizeUrl}?callback_url=${encodeURIComponent(callbackUrl)}` +
                `&code_challenge=${challenge}&code_challenge_method=S256`;
            location.assign(authorizeUrl);
        }
        catch (error) {
            this.showError(error);
        }
    }
    /**
     * Completes a Connect flow after the provider redirected back with a
     * code: the backend exchanges code + verifier for an API key and stores
     * it as the tenant credential.
     */
    completeConnect(providerId, code, verifier) {
        this.connecting.set(true);
        sessionStorage.removeItem(CONNECT_SESSION_KEY);
        this.settingsService
            .connectCredential({
            providerId,
            code,
            codeVerifier: verifier,
            organizationId: this.store.organizationId ?? undefined
        })
            .pipe(takeUntilDestroyed(this.destroyRef), 
        // ONLY the spinner is reset here. `finalize` runs on ANY termination —
        // including the completion `takeUntilDestroyed` injects when the component
        // is destroyed — so the URL cleanup must NOT live in it: a relative
        // `router.navigate()` issued from a destroyed component still resolves
        // against its populated route snapshot, which would drag the user back
        // to /pages/settings/ai from whatever settings page they moved on to.
        // `next`/`error` are the handlers that are genuinely skipped after
        // teardown, so the navigation lives there instead.
        finalize(() => this.connecting.set(false)))
            .subscribe({
            next: () => {
                this.toastrService.success(this.translateService.instant('AI_CHAT_UI.SETTINGS.TOASTR.CONNECTED', {
                    provider: this.providerLabel(providerId)
                }), this.translateService.instant('AI_CHAT_UI.SETTINGS.TOASTR.SUCCESS_TITLE'));
                this.finishConnect();
            },
            error: (error) => {
                this.showError(error);
                this.finishConnect();
            }
        });
    }
    /**
     * Strips the one-time `?code=...` from the URL and reloads the page data
     * after a Connect exchange settled (either way).
     */
    finishConnect() {
        void this.router.navigate([], { relativeTo: this.route, queryParams: {} });
        // Connect writes a tenant key, so the catalogue it replaces is now wrong. Unconditional
        // because this also runs on the failure path, where re-fetching costs one call and being
        // wrong costs the user their full model list.
        const pending = this.selectedProviderId();
        if (pending) {
            this.invalidateCatalogue(pending);
        }
        this.load();
        // A successful Connect changes the chat's verdict, so the gate has to be
        // re-evaluated or the chat stays hidden until a full reload.
        this.refreshChatAvailability();
    }
    readConnectSession() {
        try {
            const raw = sessionStorage.getItem(CONNECT_SESSION_KEY);
            if (!raw)
                return null;
            const parsed = JSON.parse(raw);
            return parsed?.providerId && parsed?.verifier ? parsed : null;
        }
        catch {
            return null;
        }
    }
    base64Url(bytes) {
        return btoa(String.fromCharCode(...bytes))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, '');
    }
    providerLabel(providerId) {
        return this.providers().find((p) => p.id === providerId)?.label ?? providerId;
    }
    // ── Save / delete (config view) ────────────────────────────────────
    /**
     * Saves the credential of a provider: `POST` (upsert) when the tenant has
     * no credential yet, `PUT` when one exists. A blank API key on update
     * keeps the stored key.
     */
    save(provider) {
        const form = this.getForm(provider.id);
        if (!form || form.invalid) {
            form?.markAllAsTouched();
            return;
        }
        const value = form.getRawValue();
        const apiKey = value.apiKey?.trim();
        const defaultModel = (value.defaultModel === CUSTOM_MODEL ? value.customModel : value.defaultModel)?.trim();
        const speechModel = (value.speechModel === CUSTOM_MODEL ? value.customSpeechModel : value.speechModel)?.trim();
        const payload = {
            providerId: provider.id,
            baseUrl: value.baseUrl?.trim() || undefined,
            enabled: value.enabled,
            isDefault: this.defaultProviderControl.value === provider.id,
            // `null`, not `undefined`, when cleared: JSON drops `undefined`, so "back to the provider
            // default" could never be persisted over a previously saved model.
            defaultModel: defaultModel || null,
            // Voice: only meaningful for speech-capable providers, but harmless (false / unset) otherwise.
            isVoiceDefault: provider.speechCapable && this.voiceDefaultControl.value === provider.id,
            speechModel: provider.speechCapable ? speechModel || null : undefined,
            organizationId: this.store.organizationId ?? undefined
        };
        const credential = this.getCredential(provider.id);
        // On create the key goes in whenever typed; a local server may legitimately be saved without
        // one (`requiresApiKey: false`) — the backend rejects a key-less create for every other provider.
        const request$ = credential?.id
            ? this.settingsService.updateCredential(credential.id, apiKey ? { ...payload, apiKey } : payload)
            : this.settingsService.upsertCredential({
                ...payload,
                ...(apiKey ? { apiKey } : {})
            });
        this.saving.set(provider.id);
        request$
            .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(null)))
            .subscribe({
            next: () => {
                this.toastrService.success(this.translateService.instant('AI_CHAT_UI.SETTINGS.TOASTR.SAVED', { provider: provider.label }), this.translateService.instant('AI_CHAT_UI.SETTINGS.TOASTR.SUCCESS_TITLE'));
                // The saved key IS the catalogue's input — a tenant key that just replaced the shared
                // free one unlocks the provider's full list.
                this.invalidateCatalogue(provider.id);
                this.load();
                // The very first provider turns the chat on — the list view the
                // user lands on must already say so.
                this.refreshChatAvailability();
                // Navigates: without the `takeUntilDestroyed(this.destroyRef)` above, a save that
                // resolves after the user left would yank them back to this page.
                this.showList();
            },
            error: (error) => this.showError(error)
        });
    }
    /** Deletes the tenant credential of a provider after confirmation. */
    delete(provider) {
        const credential = this.getCredential(provider.id);
        if (!credential?.id) {
            return;
        }
        this.dialogService
            .open(ConfirmComponent, {
            context: {
                data: {
                    title: this.translateService.instant('AI_CHAT_UI.SETTINGS.DELETE_CONFIRM.TITLE'),
                    message: this.translateService.instant('AI_CHAT_UI.SETTINGS.DELETE_CONFIRM.MESSAGE', {
                        provider: provider.label
                    })
                }
            }
        })
            .onClose.pipe(filter(Boolean), switchMap(() => {
            this.deleting.set(provider.id);
            return this.settingsService.deleteCredential(credential.id).pipe(finalize(() => this.deleting.set(null)), catchError((error) => {
                this.showError(error);
                return EMPTY;
            }));
        }), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
            this.toastrService.success(this.translateService.instant('AI_CHAT_UI.SETTINGS.TOASTR.DELETED', { provider: provider.label }), this.translateService.instant('AI_CHAT_UI.SETTINGS.TOASTR.SUCCESS_TITLE'));
            // Removing the tenant key drops the provider back to whatever resolves next. Delete does
            // not navigate away, so nothing else would re-fetch: without this the config view keeps
            // showing the curated fallback, with no hint, looking like a complete live list.
            this.invalidateCatalogue(provider.id);
            if (this.view() === 'config' && this.selectedProviderId() === provider.id) {
                this.loadModels(provider.id);
            }
            this.load();
            // Deleting the last credential takes the chat away again.
            this.refreshChatAvailability();
        });
    }
    /**
     * Builds one reactive form per registered provider, prefilled from the
     * tenant's existing credential (if any). The API key is required only
     * on create — on update a blank value keeps the stored key.
     */
    buildForms() {
        this.forms = new Map(this.providers().map((provider) => {
            const credential = this.getCredential(provider.id);
            // Against the catalogue when one has already been fetched, so a save-and-return does
            // not demote a perfectly ordinary model back to "custom".
            const knownModel = this.modelsFor(provider).some((model) => model.id === credential?.defaultModel);
            const knownSpeechModel = (provider.speechModels ?? []).some((model) => model.id === credential?.speechModel);
            // The key is required on create — except for providers that run without one (local
            // servers), where the base URL is the whole credential.
            const keyRequired = !credential && provider.requiresApiKey !== false;
            // A generic gateway has no default host, so its base URL is required; local servers get
            // their conventional address prefilled (a key-less credential needs SOMETHING to save,
            // and it is what the user will most likely keep). Cloud providers are NOT prefilled: a
            // stored base URL would switch their model catalogue to "custom endpoint" mode.
            const prefilledBaseUrl = credential?.baseUrl ?? (provider.local ? (provider.defaultBaseUrl ?? '') : '');
            return [
                provider.id,
                this.fb.nonNullable.group({
                    apiKey: this.fb.nonNullable.control('', keyRequired ? [Validators.required] : []),
                    baseUrl: this.fb.nonNullable.control(prefilledBaseUrl, [
                        Validators.pattern(/^https?:\/\/.+/),
                        ...(provider.requiresBaseUrl ? [Validators.required] : [])
                    ]),
                    // `null`, not `''`. ng-select accepts '' as a real value in single-select mode and
                    // fabricates a selected item for it, so the "Provider default" placeholder never
                    // rendered and the field sat blank with a clear (x) button on it.
                    defaultModel: this.fb.control(credential?.defaultModel ? (knownModel ? credential.defaultModel : CUSTOM_MODEL) : null),
                    customModel: this.fb.nonNullable.control(knownModel ? '' : (credential?.defaultModel ?? '')),
                    enabled: this.fb.nonNullable.control(credential?.enabled ?? true),
                    speechModel: this.fb.control(credential?.speechModel ? (knownSpeechModel ? credential.speechModel : CUSTOM_MODEL) : null),
                    customSpeechModel: this.fb.nonNullable.control(knownSpeechModel ? '' : (credential?.speechModel ?? ''))
                })
            ];
        }));
        this.syncExclusiveControls();
    }
    /** Points the two page-wide exclusive controls at whatever the SAVED credentials say. */
    syncExclusiveControls() {
        const credentials = [...this.credentialsByProvider().values()];
        const defaultCredential = credentials.find((credential) => credential.isDefault);
        this.defaultProviderControl.setValue(defaultCredential?.providerId ?? null, { emitEvent: false });
        const voiceDefaultCredential = credentials.find((credential) => credential.isVoiceDefault);
        this.voiceDefaultControl.setValue(voiceDefaultCredential?.providerId ?? null, { emitEvent: false });
    }
    /**
     * Toggle handler for "Use as default voice provider": exclusive (ticking here unticks the
     * previous voice default), and unticking clears the pin — the toggle is only ever ON for the
     * provider currently held by the control, so `false` can only mean "this one, off".
     */
    setVoiceDefault(provider, checked) {
        this.voiceDefaultControl.setValue(checked ? provider.id : null);
    }
    /**
     * Shows an error toast including the backend's actual message (e.g. a
     * misconfigured ENCRYPTION_KEY or a rejected Connect exchange) so
     * failures are diagnosable instead of a generic "something went wrong".
     */
    showError(error) {
        const serverMessage = this.extractErrorMessage(error);
        this.toastrService.danger(serverMessage || this.translateService.instant('AI_CHAT_UI.SETTINGS.TOASTR.ERROR'), this.translateService.instant('AI_CHAT_UI.SETTINGS.TOASTR.ERROR_TITLE'), { duration: 8000 });
    }
    extractErrorMessage(error) {
        const message = error?.error?.message ?? error?.message;
        if (Array.isArray(message))
            return message.join('; ');
        if (typeof message === 'string' && message.trim()) {
            const status = error?.status ? ` (HTTP ${error.status})` : '';
            return `${message}${status}`;
        }
        return null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AiChatSettingsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: AiChatSettingsComponent, isStandalone: true, selector: "gz-ai-chat-settings", ngImport: i0, template: "<!--\n\tProvider tile, shared by the list rows, the catalog cards and the config\n\theader so one provider looks identical wherever it appears. Draws the\n\tbundled brand mark when there is one and falls back to a monogram when\n\tthere is not, so a tile is never an empty box.\n-->\n<ng-template #providerTile let-provider let-large=\"large\">\n\t@if (providerLogo(provider.id); as logo) {\n\t\t<span class=\"tile brand\" [class.large]=\"large\" [style.color]=\"logo.brandColor\">\n\t\t\t<svg\n\t\t\t\tclass=\"mark\"\n\t\t\t\t[attr.viewBox]=\"logo.viewBox\"\n\t\t\t\tpreserveAspectRatio=\"xMidYMid meet\"\n\t\t\t\taria-hidden=\"true\"\n\t\t\t\tfocusable=\"false\"\n\t\t\t>\n\t\t\t\t<g [attr.transform]=\"logo.transform\">\n\t\t\t\t\t@for (path of logo.paths; track $index) {\n\t\t\t\t\t\t<path [attr.d]=\"path\"></path>\n\t\t\t\t\t}\n\t\t\t\t</g>\n\t\t\t</svg>\n\t\t</span>\n\t} @else {\n\t\t<span class=\"tile monogram\" [class.large]=\"large\" aria-hidden=\"true\">{{ tileMonogram(provider) }}</span>\n\t}\n</ng-template>\n\n<nb-card class=\"ai-chat-settings\" [nbSpinner]=\"loading() || connecting()\" nbSpinnerStatus=\"primary\">\n\t<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 LIST VIEW (default) \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\n\t@if (view() === 'list') {\n\t\t<nb-card-header>\n\t\t\t<div class=\"page-header\">\n\t\t\t\t<div>\n\t\t\t\t\t<h5>{{ 'AI_CHAT_UI.SETTINGS.TITLE' | translate }}</h5>\n\t\t\t\t\t<p class=\"description\">{{ 'AI_CHAT_UI.SETTINGS.DESCRIPTION' | translate }}</p>\n\t\t\t\t</div>\n\t\t\t\t<!-- Header actions only once something is configured: with an empty list\n\t\t\t\t     the centred call-to-action below is the single obvious next step,\n\t\t\t\t     and showing both put two identical green buttons on one screen. -->\n\t\t\t\t@if (configuredProviders().length || voiceProviders().length) {\n\t\t\t\t\t<div class=\"header-actions\">\n\t\t\t\t\t\t<button nbButton status=\"success\" (click)=\"showCatalog()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.ADD_PROVIDER' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button nbButton outline status=\"success\" (click)=\"showVoiceCatalog()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"mic-outline\"></nb-icon>\n\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.ADD_VOICE_PROVIDER' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</div>\n\t\t</nb-card-header>\n\t\t<nb-card-body>\n\t\t\t<!-- Where is the chat? Answer it here \u2014 configuring a provider is the\n\t\t\t     only place the user learns whether the chat turned on, and why not. -->\n\t\t\t@if (chatNoticeMeta(); as notice) {\n\t\t\t\t<div class=\"chat-notice\" [ngClass]=\"notice.status\" role=\"status\">\n\t\t\t\t\t<nb-icon [icon]=\"notice.icon\" [status]=\"notice.status\"></nb-icon>\n\t\t\t\t\t<div class=\"notice-text\">\n\t\t\t\t\t\t<span class=\"notice-title\">{{ notice.title | translate }}</span>\n\t\t\t\t\t\t<span class=\"notice-hint\">{{ notice.hint | translate }}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t@if (chatNotice() === 'ready') {\n\t\t\t\t\t\t<button nbButton size=\"small\" status=\"success\" class=\"notice-action\" (click)=\"openChat()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"message-circle-outline\"></nb-icon>\n\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.STATUS.OPEN_CHAT' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t}\n\n\t\t\t@if (!loading() && !configuredProviders().length && !voiceProviders().length) {\n\t\t\t\t<div class=\"empty-state\">\n\t\t\t\t\t<span class=\"empty-illustration\" aria-hidden=\"true\">\n\t\t\t\t\t\t<nb-icon icon=\"cube-outline\"></nb-icon>\n\t\t\t\t\t</span>\n\t\t\t\t\t<h6 class=\"empty-title\">{{ 'AI_CHAT_UI.SETTINGS.LIST.EMPTY_TITLE' | translate }}</h6>\n\t\t\t\t\t<p class=\"empty-hint\">{{ 'AI_CHAT_UI.SETTINGS.LIST.EMPTY' | translate }}</p>\n\t\t\t\t\t<div class=\"empty-actions\">\n\t\t\t\t\t\t<button nbButton status=\"success\" size=\"medium\" (click)=\"showCatalog()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.ADD_PROVIDER' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button nbButton outline status=\"success\" size=\"medium\" (click)=\"showVoiceCatalog()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"mic-outline\"></nb-icon>\n\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.ADD_VOICE_PROVIDER' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<!-- Name the providers on offer so the empty state teaches what this\n\t\t\t\t\t     page is for, instead of only asking for a click. -->\n\t\t\t\t\t<p class=\"empty-providers\">{{ 'AI_CHAT_UI.SETTINGS.LIST.EMPTY_PROVIDERS' | translate }}</p>\n\t\t\t\t</div>\n\t\t\t}\n\n\t\t\t@if (configuredProviders().length) {\n\t\t\t\t<div class=\"provider-rows\">\n\t\t\t\t\t<div class=\"row-head\">\n\t\t\t\t\t\t<span>{{ 'AI_CHAT_UI.SETTINGS.LIST.NAME' | translate }}</span>\n\t\t\t\t\t\t<span>{{ 'AI_CHAT_UI.SETTINGS.LIST.SOURCE' | translate }}</span>\n\t\t\t\t\t\t<span>{{ 'AI_CHAT_UI.SETTINGS.LIST.ENABLED' | translate }}</span>\n\t\t\t\t\t\t<span class=\"actions-col\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t@for (provider of configuredProviders(); track provider.id) {\n\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t<span class=\"cell name\">\n\t\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t\t\t[ngTemplateOutlet]=\"providerTile\"\n\t\t\t\t\t\t\t\t\t[ngTemplateOutletContext]=\"{ $implicit: provider }\"\n\t\t\t\t\t\t\t\t></ng-container>\n\t\t\t\t\t\t\t\t<span class=\"label\">\n\t\t\t\t\t\t\t\t\t{{ provider.label }}\n\t\t\t\t\t\t\t\t\t@if (defaultProviderId() === provider.id) {\n\t\t\t\t\t\t\t\t\t\t<span class=\"default-chip\">{{\n\t\t\t\t\t\t\t\t\t\t\t'AI_CHAT_UI.SETTINGS.LIST.DEFAULT' | translate\n\t\t\t\t\t\t\t\t\t\t}}</span>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class=\"cell\">\n\t\t\t\t\t\t\t\t<nb-badge\n\t\t\t\t\t\t\t\t\tclass=\"static-badge\"\n\t\t\t\t\t\t\t\t\t[text]=\"getBadgeKey(provider) | translate\"\n\t\t\t\t\t\t\t\t\t[status]=\"getBadgeStatus(provider)\"\n\t\t\t\t\t\t\t\t></nb-badge>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class=\"cell\">\n\t\t\t\t\t\t\t\t@if (getCredential(provider.id)?.id) {\n\t\t\t\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\t\t[checked]=\"getCredential(provider.id)?.enabled ?? false\"\n\t\t\t\t\t\t\t\t\t\t[disabled]=\"saving() === provider.id\"\n\t\t\t\t\t\t\t\t\t\t(checkedChange)=\"toggleEnabled(provider, $event)\"\n\t\t\t\t\t\t\t\t\t></nb-toggle>\n\t\t\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t\t\t\t<span class=\"env-note\">{{ 'AI_CHAT_UI.SETTINGS.LIST.VIA_ENV' | translate }}</span>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class=\"cell actions-col\">\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\t(click)=\"showConfigure(provider.id)\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"settings-2-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.CONFIGURE' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t@if (getCredential(provider.id)) {\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\t\t(click)=\"delete(provider)\"\n\t\t\t\t\t\t\t\t\t\t[disabled]=\"deleting() === provider.id\"\n\t\t\t\t\t\t\t\t\t\t[nbSpinner]=\"deleting() === provider.id\"\n\t\t\t\t\t\t\t\t\t\tnbSpinnerSize=\"tiny\"\n\t\t\t\t\t\t\t\t\t\tnbSpinnerStatus=\"danger\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t<nb-icon icon=\"trash-2-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t}\n\n\t\t\t<!-- \u2500\u2500 Voice (dictation) \u2500\u2500\n\t\t\t     Which configured providers can transcribe, and which one is the tenant's voice\n\t\t\t     default. Shown whenever the page has SOMETHING configured: a tenant with a chat\n\t\t\t     provider but no voice provider needs to learn here why dictation is off. -->\n\t\t\t@if (!loading() && (configuredProviders().length || voiceProviders().length)) {\n\t\t\t\t<section class=\"voice-section\" aria-labelledby=\"ai-chat-voice-title\">\n\t\t\t\t\t<div class=\"section-head\">\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<h6 id=\"ai-chat-voice-title\">\n\t\t\t\t\t\t\t\t<nb-icon icon=\"mic-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.VOICE.TITLE' | translate }}\n\t\t\t\t\t\t\t</h6>\n\t\t\t\t\t\t\t<p class=\"description\">{{ 'AI_CHAT_UI.SETTINGS.VOICE.DESCRIPTION' | translate }}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t@if (voiceProviders().length) {\n\t\t\t\t\t\t<div class=\"provider-rows\">\n\t\t\t\t\t\t\t<div class=\"row-head\">\n\t\t\t\t\t\t\t\t<span>{{ 'AI_CHAT_UI.SETTINGS.LIST.NAME' | translate }}</span>\n\t\t\t\t\t\t\t\t<span>{{ 'AI_CHAT_UI.SETTINGS.LIST.SOURCE' | translate }}</span>\n\t\t\t\t\t\t\t\t<span>{{ 'AI_CHAT_UI.SETTINGS.VOICE.MODEL' | translate }}</span>\n\t\t\t\t\t\t\t\t<span class=\"actions-col\"></span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t@for (provider of voiceProviders(); track provider.id) {\n\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t<span class=\"cell name\">\n\t\t\t\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t\t\t\t\t[ngTemplateOutlet]=\"providerTile\"\n\t\t\t\t\t\t\t\t\t\t\t[ngTemplateOutletContext]=\"{ $implicit: provider }\"\n\t\t\t\t\t\t\t\t\t\t></ng-container>\n\t\t\t\t\t\t\t\t\t\t<span class=\"label\">\n\t\t\t\t\t\t\t\t\t\t\t{{ provider.label }}\n\t\t\t\t\t\t\t\t\t\t\t@if (defaultVoiceProviderId() === provider.id) {\n\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"default-chip voice\">{{\n\t\t\t\t\t\t\t\t\t\t\t\t\t'AI_CHAT_UI.SETTINGS.VOICE.DEFAULT' | translate\n\t\t\t\t\t\t\t\t\t\t\t\t}}</span>\n\t\t\t\t\t\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"fallback-chip\">{{\n\t\t\t\t\t\t\t\t\t\t\t\t\t'AI_CHAT_UI.SETTINGS.VOICE.FALLBACK' | translate\n\t\t\t\t\t\t\t\t\t\t\t\t}}</span>\n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t@if (provider.local) {\n\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"capability-chip local\">{{\n\t\t\t\t\t\t\t\t\t\t\t\t\t'AI_CHAT_UI.SETTINGS.BADGE.LOCAL' | translate\n\t\t\t\t\t\t\t\t\t\t\t\t}}</span>\n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<span class=\"cell\">\n\t\t\t\t\t\t\t\t\t\t<nb-badge\n\t\t\t\t\t\t\t\t\t\t\tclass=\"static-badge\"\n\t\t\t\t\t\t\t\t\t\t\t[text]=\"getVoiceBadgeKey(provider) | translate\"\n\t\t\t\t\t\t\t\t\t\t\t[status]=\"getVoiceBadgeStatus(provider)\"\n\t\t\t\t\t\t\t\t\t\t></nb-badge>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<span class=\"cell speech-model\">\n\t\t\t\t\t\t\t\t\t\t{{ getCredential(provider.id)?.speechModel || provider.defaultSpeechModel || '\u2014' }}\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<span class=\"cell actions-col\">\n\t\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\t\t\t(click)=\"showConfigure(provider.id)\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t<nb-icon icon=\"settings-2-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.CONFIGURE' | translate }}\n\t\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t} @else {\n\t\t\t\t\t\t<div class=\"voice-empty\">\n\t\t\t\t\t\t\t<nb-icon icon=\"mic-off-outline\" status=\"warning\"></nb-icon>\n\t\t\t\t\t\t\t<div class=\"notice-text\">\n\t\t\t\t\t\t\t\t<span class=\"notice-title\">{{ 'AI_CHAT_UI.SETTINGS.VOICE.EMPTY' | translate }}</span>\n\t\t\t\t\t\t\t\t<span class=\"notice-hint\">{{ 'AI_CHAT_UI.SETTINGS.VOICE.EMPTY_HINT' | translate }}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<button nbButton size=\"small\" status=\"success\" class=\"notice-action\" (click)=\"showVoiceCatalog()\">\n\t\t\t\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.VOICE.ADD' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</section>\n\t\t\t}\n\t\t</nb-card-body>\n\t}\n\n\t<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 CATALOG VIEW (?add=1) \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\n\t@if (view() === 'catalog') {\n\t\t<nb-card-header>\n\t\t\t<div class=\"page-header\">\n\t\t\t\t<div>\n\t\t\t\t\t<button nbButton ghost size=\"small\" class=\"back\" (click)=\"showList()\">\n\t\t\t\t\t\t<nb-icon icon=\"arrow-back-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.BACK' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t@if (catalogFilter() === 'voice') {\n\t\t\t\t\t\t<h5>{{ 'AI_CHAT_UI.SETTINGS.CATALOG.VOICE_TITLE' | translate }}</h5>\n\t\t\t\t\t\t<p class=\"description\">{{ 'AI_CHAT_UI.SETTINGS.CATALOG.VOICE_DESCRIPTION' | translate }}</p>\n\t\t\t\t\t} @else {\n\t\t\t\t\t\t<h5>{{ 'AI_CHAT_UI.SETTINGS.CATALOG.TITLE' | translate }}</h5>\n\t\t\t\t\t\t<p class=\"description\">{{ 'AI_CHAT_UI.SETTINGS.CATALOG.DESCRIPTION' | translate }}</p>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</nb-card-header>\n\t\t<nb-card-body>\n\t\t\t@if (!loading() && !catalogProviders().length) {\n\t\t\t\t<p class=\"empty-state\">\n\t\t\t\t\t{{\n\t\t\t\t\t\t(catalogFilter() === 'voice'\n\t\t\t\t\t\t\t? 'AI_CHAT_UI.SETTINGS.CATALOG.NO_VOICE_PROVIDERS'\n\t\t\t\t\t\t\t: 'AI_CHAT_UI.SETTINGS.NO_PROVIDERS'\n\t\t\t\t\t\t) | translate\n\t\t\t\t\t}}\n\t\t\t\t</p>\n\t\t\t}\n\t\t\t<div class=\"catalog-grid\">\n\t\t\t\t@for (provider of catalogProviders(); track provider.id) {\n\t\t\t\t\t<button type=\"button\" class=\"catalog-card\" (click)=\"showConfigure(provider.id)\">\n\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t[ngTemplateOutlet]=\"providerTile\"\n\t\t\t\t\t\t\t[ngTemplateOutletContext]=\"{ $implicit: provider, large: true }\"\n\t\t\t\t\t\t></ng-container>\n\t\t\t\t\t\t<span class=\"name\">{{ provider.label }}</span>\n\t\t\t\t\t\t<!-- Capability chips: what this provider can do for the tenant. -->\n\t\t\t\t\t\t<span class=\"capabilities\">\n\t\t\t\t\t\t\t@if (provider.chatCapable !== false) {\n\t\t\t\t\t\t\t\t<span class=\"capability-chip chat\">{{ 'AI_CHAT_UI.SETTINGS.BADGE.CHAT' | translate }}</span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t@if (provider.speechCapable) {\n\t\t\t\t\t\t\t\t<span class=\"capability-chip speech\">\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"mic-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.BADGE.SPEECH' | translate }}\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t@if (provider.local) {\n\t\t\t\t\t\t\t\t<span class=\"capability-chip local\">{{ 'AI_CHAT_UI.SETTINGS.BADGE.LOCAL' | translate }}</span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t@if (catalogFilter() === 'voice' ? isVoiceConfigured(provider) : provider.configured) {\n\t\t\t\t\t\t\t<span class=\"configured\">\n\t\t\t\t\t\t\t\t<nb-icon icon=\"checkmark-circle-2\" status=\"success\"></nb-icon>\n\t\t\t\t\t\t\t\t{{ (catalogFilter() === 'voice' ? getVoiceBadgeKey(provider) : getBadgeKey(provider)) | translate }}\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t\t@if (provider.connectType) {\n\t\t\t\t\t\t\t<span class=\"connect-chip\">{{\n\t\t\t\t\t\t\t\t'AI_CHAT_UI.SETTINGS.CATALOG.SUPPORTS_CONNECT' | translate\n\t\t\t\t\t\t\t}}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</button>\n\t\t\t\t}\n\t\t\t</div>\n\t\t</nb-card-body>\n\t}\n\n\t<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 CONFIG VIEW (?provider=<id>) \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\n\t@if (view() === 'config' && selectedProvider(); as provider) {\n\t\t<nb-card-header>\n\t\t\t<div class=\"page-header\">\n\t\t\t\t<div>\n\t\t\t\t\t<button nbButton ghost size=\"small\" class=\"back\" (click)=\"backFromConfigure(provider)\">\n\t\t\t\t\t\t<nb-icon icon=\"arrow-back-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.BACK' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<div class=\"config-title\">\n\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t[ngTemplateOutlet]=\"providerTile\"\n\t\t\t\t\t\t\t[ngTemplateOutletContext]=\"{ $implicit: provider }\"\n\t\t\t\t\t\t></ng-container>\n\t\t\t\t\t\t<h5>{{ provider.label }}</h5>\n\t\t\t\t\t\t<nb-badge\n\t\t\t\t\t\t\tclass=\"static-badge\"\n\t\t\t\t\t\t\t[text]=\"(isVoiceOnly(provider) ? getVoiceBadgeKey(provider) : getBadgeKey(provider)) | translate\"\n\t\t\t\t\t\t\t[status]=\"isVoiceOnly(provider) ? getVoiceBadgeStatus(provider) : getBadgeStatus(provider)\"\n\t\t\t\t\t\t></nb-badge>\n\t\t\t\t\t\t<span class=\"capabilities\">\n\t\t\t\t\t\t\t@if (provider.speechCapable) {\n\t\t\t\t\t\t\t\t<span class=\"capability-chip speech\">\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"mic-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.BADGE.SPEECH' | translate }}\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t@if (provider.local) {\n\t\t\t\t\t\t\t\t<span class=\"capability-chip local\">{{ 'AI_CHAT_UI.SETTINGS.BADGE.LOCAL' | translate }}</span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t@if (isVoiceOnly(provider)) {\n\t\t\t\t\t\t<p class=\"platform-notice\">{{ 'AI_CHAT_UI.SETTINGS.FORM.VOICE_ONLY_NOTICE' | translate }}</p>\n\t\t\t\t\t}\n\t\t\t\t\t@if (isOnPlatformKey(provider)) {\n\t\t\t\t\t\t<!-- The badge alone would leave the user wondering why a provider they never\n\t\t\t\t\t\t     configured is working. Say it plainly, and point at the way out. -->\n\t\t\t\t\t\t<p class=\"platform-notice\">{{ 'AI_CHAT_UI.SETTINGS.PLATFORM_NOTICE' | translate }}</p>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</nb-card-header>\n\t\t<nb-card-body>\n\t\t\t<!-- Connect flow (providers that support it) -->\n\t\t\t@if (provider.connectType) {\n\t\t\t\t<div class=\"connect-box\">\n\t\t\t\t\t<button nbButton status=\"primary\" (click)=\"connect(provider)\">\n\t\t\t\t\t\t<nb-icon icon=\"flash-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.CONNECT.BUTTON' | translate: { provider: provider.label } }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<span class=\"hint\">{{ 'AI_CHAT_UI.SETTINGS.CONNECT.HINT' | translate }}</span>\n\t\t\t\t\t<div class=\"divider\">\n\t\t\t\t\t\t<span>{{ 'AI_CHAT_UI.SETTINGS.CONNECT.OR_MANUAL' | translate }}</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t}\n\n\t\t\t@if (getForm(provider.id); as form) {\n\t\t\t\t<form [formGroup]=\"form\" (ngSubmit)=\"save(provider)\" class=\"config-form\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" [for]=\"'apiKey-' + provider.id\">\n\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\t(provider.requiresApiKey === false\n\t\t\t\t\t\t\t\t\t? 'AI_CHAT_UI.SETTINGS.FORM.API_KEY_LABEL_OPTIONAL'\n\t\t\t\t\t\t\t\t\t: 'AI_CHAT_UI.SETTINGS.FORM.API_KEY'\n\t\t\t\t\t\t\t\t) | translate\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t@if (provider.apiKeysUrl) {\n\t\t\t\t\t\t\t\t<a\n\t\t\t\t\t\t\t\t\tclass=\"get-key\"\n\t\t\t\t\t\t\t\t\t[href]=\"provider.apiKeysUrl\"\n\t\t\t\t\t\t\t\t\ttarget=\"_blank\"\n\t\t\t\t\t\t\t\t\trel=\"noopener noreferrer\"\n\t\t\t\t\t\t\t\t\t>{{ 'AI_CHAT_UI.SETTINGS.FORM.GET_KEY' | translate }} \u2197</a\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<nb-form-field>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t[id]=\"'apiKey-' + provider.id\"\n\t\t\t\t\t\t\t\tformControlName=\"apiKey\"\n\t\t\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t\t\t\t[type]=\"isKeyRevealed(provider.id) ? 'text' : 'password'\"\n\t\t\t\t\t\t\t\t[placeholder]=\"\n\t\t\t\t\t\t\t\t\tgetCredential(provider.id)?.apiKey ||\n\t\t\t\t\t\t\t\t\t('AI_CHAT_UI.SETTINGS.FORM.API_KEY_PLACEHOLDER' | translate)\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbSuffix\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t(click)=\"toggleKeyReveal(provider.id)\"\n\t\t\t\t\t\t\t\t[attr.aria-label]=\"\n\t\t\t\t\t\t\t\t\t(isKeyRevealed(provider.id)\n\t\t\t\t\t\t\t\t\t\t? 'AI_CHAT_UI.SETTINGS.FORM.HIDE_KEY'\n\t\t\t\t\t\t\t\t\t\t: 'AI_CHAT_UI.SETTINGS.FORM.SHOW_KEY'\n\t\t\t\t\t\t\t\t\t) | translate\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t\t\t\t[icon]=\"isKeyRevealed(provider.id) ? 'eye-off-outline' : 'eye-outline'\"\n\t\t\t\t\t\t\t\t></nb-icon>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</nb-form-field>\n\t\t\t\t\t\t@if (provider.requiresApiKey === false) {\n\t\t\t\t\t\t\t<span class=\"hint\">{{ 'AI_CHAT_UI.SETTINGS.FORM.API_KEY_OPTIONAL' | translate }}</span>\n\t\t\t\t\t\t} @else if (getCredential(provider.id)) {\n\t\t\t\t\t\t\t<span class=\"hint\">{{ 'AI_CHAT_UI.SETTINGS.FORM.API_KEY_KEEP' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t\t@if (form.controls.apiKey.touched && form.controls.apiKey.hasError('required')) {\n\t\t\t\t\t\t\t<span class=\"error\">{{ 'AI_CHAT_UI.SETTINGS.FORM.API_KEY_REQUIRED' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" [for]=\"'baseUrl-' + provider.id\">\n\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\t(provider.requiresBaseUrl\n\t\t\t\t\t\t\t\t\t? 'AI_CHAT_UI.SETTINGS.FORM.BASE_URL_REQUIRED_LABEL'\n\t\t\t\t\t\t\t\t\t: 'AI_CHAT_UI.SETTINGS.FORM.BASE_URL'\n\t\t\t\t\t\t\t\t) | translate\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t[id]=\"'baseUrl-' + provider.id\"\n\t\t\t\t\t\t\tformControlName=\"baseUrl\"\n\t\t\t\t\t\t\ttype=\"url\"\n\t\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t\t\t[placeholder]=\"baseUrlPlaceholder(provider)\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t@if (provider.requiresBaseUrl) {\n\t\t\t\t\t\t\t<span class=\"hint\">{{ 'AI_CHAT_UI.SETTINGS.FORM.BASE_URL_GATEWAY_HINT' | translate }}</span>\n\t\t\t\t\t\t} @else if (provider.local) {\n\t\t\t\t\t\t\t<span class=\"hint\">{{ 'AI_CHAT_UI.SETTINGS.FORM.BASE_URL_LOCAL_HINT' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t\t@if (form.controls.baseUrl.touched && form.controls.baseUrl.hasError('required')) {\n\t\t\t\t\t\t\t<span class=\"error\">{{ 'AI_CHAT_UI.SETTINGS.FORM.BASE_URL_REQUIRED' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t\t@if (form.controls.baseUrl.touched && form.controls.baseUrl.hasError('pattern')) {\n\t\t\t\t\t\t\t<span class=\"error\">{{ 'AI_CHAT_UI.SETTINGS.FORM.BASE_URL_INVALID' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<!-- \u2500\u2500 Voice / speech-to-text (speech-capable providers) \u2500\u2500 -->\n\t\t\t\t\t@if (provider.speechCapable) {\n\t\t\t\t\t\t<div class=\"form-group voice-group\">\n\t\t\t\t\t\t\t<label class=\"label\" [for]=\"'ai-chat-speech-model-' + provider.id\">\n\t\t\t\t\t\t\t\t<span class=\"label-with-icon\">\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"mic-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.FORM.SPEECH_MODEL' | translate }}\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<ng-select\n\t\t\t\t\t\t\t\tclass=\"model-select\"\n\t\t\t\t\t\t\t\t[labelForId]=\"'ai-chat-speech-model-' + provider.id\"\n\t\t\t\t\t\t\t\tformControlName=\"speechModel\"\n\t\t\t\t\t\t\t\tbindValue=\"id\"\n\t\t\t\t\t\t\t\tbindLabel=\"label\"\n\t\t\t\t\t\t\t\t[items]=\"speechModelOptions(provider)\"\n\t\t\t\t\t\t\t\t[clearable]=\"true\"\n\t\t\t\t\t\t\t\t[searchable]=\"true\"\n\t\t\t\t\t\t\t\t[searchFn]=\"searchModel\"\n\t\t\t\t\t\t\t\t[placeholder]=\"\n\t\t\t\t\t\t\t\t\tprovider.defaultSpeechModel || ('AI_CHAT_UI.SETTINGS.FORM.SPEECH_MODEL_NONE' | translate)\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t[notFoundText]=\"'AI_CHAT_UI.SETTINGS.FORM.MODELS_NOT_FOUND' | translate\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<ng-template ng-option-tmp let-model=\"item\">\n\t\t\t\t\t\t\t\t\t<span class=\"model-label\">{{ model.label }}</span>\n\t\t\t\t\t\t\t\t\t<span class=\"model-id\">\n\t\t\t\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\t\t\t\tmodel.id === CUSTOM_MODEL\n\t\t\t\t\t\t\t\t\t\t\t\t? ('AI_CHAT_UI.SETTINGS.FORM.CUSTOM_SPEECH_MODEL_PLACEHOLDER' | translate)\n\t\t\t\t\t\t\t\t\t\t\t\t: model.id\n\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t\t\t</ng-select>\n\t\t\t\t\t\t\t<span class=\"hint\">{{ 'AI_CHAT_UI.SETTINGS.FORM.SPEECH_MODEL_HINT' | translate }}</span>\n\t\t\t\t\t\t\t@if (form.controls.speechModel.value === CUSTOM_MODEL) {\n\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\tclass=\"custom-model\"\n\t\t\t\t\t\t\t\t\t[id]=\"'ai-chat-custom-speech-model-' + provider.id\"\n\t\t\t\t\t\t\t\t\tformControlName=\"customSpeechModel\"\n\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t\t\t\t\t[attr.aria-label]=\"'AI_CHAT_UI.SETTINGS.FORM.CUSTOM_SPEECH_MODEL_PLACEHOLDER' | translate\"\n\t\t\t\t\t\t\t\t\t[placeholder]=\"'AI_CHAT_UI.SETTINGS.FORM.CUSTOM_SPEECH_MODEL_PLACEHOLDER' | translate\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t<label class=\"voice-default-toggle\">\n\t\t\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\t[checked]=\"voiceDefaultControl.value === provider.id\"\n\t\t\t\t\t\t\t\t\t(checkedChange)=\"setVoiceDefault(provider, $event)\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.FORM.USE_AS_VOICE_DEFAULT' | translate }}\n\t\t\t\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<span class=\"hint\">{{ 'AI_CHAT_UI.SETTINGS.FORM.USE_AS_VOICE_DEFAULT_HINT' | translate }}</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\n\t\t\t\t\t<!-- The chat model picker + chat default are meaningless for a voice-only provider. -->\n\t\t\t\t\t@if (!isVoiceOnly(provider)) {\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\" [for]=\"'ai-chat-model-' + provider.id\">\n\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.FORM.DEFAULT_MODEL' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<ng-select\n\t\t\t\t\t\t\t\tclass=\"model-select\"\n\t\t\t\t\t\t\t\t[labelForId]=\"'ai-chat-model-' + provider.id\"\n\t\t\t\t\t\t\t\tformControlName=\"defaultModel\"\n\t\t\t\t\t\t\t\tbindValue=\"id\"\n\t\t\t\t\t\t\t\tbindLabel=\"label\"\n\t\t\t\t\t\t\t\t[items]=\"modelOptions(provider)\"\n\t\t\t\t\t\t\t\t[loading]=\"isLoadingModels(provider.id)\"\n\t\t\t\t\t\t\t\t[clearable]=\"true\"\n\t\t\t\t\t\t\t\t[searchable]=\"true\"\n\t\t\t\t\t\t\t\t[searchFn]=\"searchModel\"\n\t\t\t\t\t\t\t\t[virtualScroll]=\"true\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'AI_CHAT_UI.SETTINGS.FORM.DEFAULT_MODEL_NONE' | translate\"\n\t\t\t\t\t\t\t\t[notFoundText]=\"'AI_CHAT_UI.SETTINGS.FORM.MODELS_NOT_FOUND' | translate\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<!--\n\t\t\t\t\t\t\t\t\tEvery row is two lines, including the \"Custom model\u2026\" sentinel: ng-select's\n\t\t\t\t\t\t\t\t\tvirtual scroll measures one item and applies that height to all of them, so a\n\t\t\t\t\t\t\t\t\tsingle short row would smear the scroll offset across a 250-entry list.\n\t\t\t\t\t\t\t\t-->\n\t\t\t\t\t\t\t\t<ng-template ng-option-tmp let-model=\"item\">\n\t\t\t\t\t\t\t\t\t<span class=\"model-label\">{{ model.label }}</span>\n\t\t\t\t\t\t\t\t\t<span class=\"model-id\">\n\t\t\t\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\t\t\t\tmodel.id === CUSTOM_MODEL\n\t\t\t\t\t\t\t\t\t\t\t\t? ('AI_CHAT_UI.SETTINGS.FORM.CUSTOM_MODEL_PLACEHOLDER' | translate)\n\t\t\t\t\t\t\t\t\t\t\t\t: model.id\n\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t\t\t</ng-select>\n\t\t\t\t\t\t\t@if (modelSourceKey(provider); as sourceKey) {\n\t\t\t\t\t\t\t\t<span class=\"hint\">{{ sourceKey | translate }}</span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t@if (form.controls.defaultModel.value === CUSTOM_MODEL) {\n\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\tclass=\"custom-model\"\n\t\t\t\t\t\t\t\t\t[id]=\"'ai-chat-custom-model-' + provider.id\"\n\t\t\t\t\t\t\t\t\tformControlName=\"customModel\"\n\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t\t\t\t\t[attr.aria-label]=\"'AI_CHAT_UI.SETTINGS.FORM.CUSTOM_MODEL_PLACEHOLDER' | translate\"\n\t\t\t\t\t\t\t\t\t[placeholder]=\"'AI_CHAT_UI.SETTINGS.FORM.CUSTOM_MODEL_PLACEHOLDER' | translate\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\n\t\t\t\t\t<div class=\"form-group toggles\">\n\t\t\t\t\t\t<nb-toggle formControlName=\"enabled\" status=\"primary\">\n\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.FORM.ENABLED' | translate }}\n\t\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t\t@if (!isVoiceOnly(provider)) {\n\t\t\t\t\t\t\t<label class=\"default-radio\">\n\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\ttype=\"radio\"\n\t\t\t\t\t\t\t\t\tname=\"defaultProvider\"\n\t\t\t\t\t\t\t\t\t[value]=\"provider.id\"\n\t\t\t\t\t\t\t\t\t[checked]=\"defaultProviderControl.value === provider.id\"\n\t\t\t\t\t\t\t\t\t(change)=\"defaultProviderControl.setValue(provider.id)\"\n\t\t\t\t\t\t\t\t\t[attr.aria-label]=\"\n\t\t\t\t\t\t\t\t\t\t('AI_CHAT_UI.SETTINGS.FORM.USE_AS_DEFAULT' | translate) + ': ' + provider.label\n\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.FORM.USE_AS_DEFAULT' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"actions\">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\ttype=\"submit\"\n\t\t\t\t\t\t\t[disabled]=\"saving() === provider.id\"\n\t\t\t\t\t\t\t[nbSpinner]=\"saving() === provider.id\"\n\t\t\t\t\t\t\tnbSpinnerSize=\"tiny\"\n\t\t\t\t\t\t\tnbSpinnerStatus=\"control\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.SAVE' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t@if (getCredential(provider.id)) {\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\t(click)=\"delete(provider)\"\n\t\t\t\t\t\t\t\t[disabled]=\"deleting() === provider.id\"\n\t\t\t\t\t\t\t\t[nbSpinner]=\"deleting() === provider.id\"\n\t\t\t\t\t\t\t\tnbSpinnerSize=\"tiny\"\n\t\t\t\t\t\t\t\tnbSpinnerStatus=\"danger\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.DELETE' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</form>\n\t\t\t}\n\t\t</nb-card-body>\n\t}\n</nb-card>\n", styles: [":host{display:block}.ai-chat-settings .page-header{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:1rem}.ai-chat-settings .page-header h5{margin:0}.ai-chat-settings .page-header .description{margin:.25rem 0 0;font-size:.875rem;opacity:.7}.ai-chat-settings .page-header .back{margin:0 0 .5rem -.5rem;opacity:.8}.ai-chat-settings .page-header .header-actions{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:flex-end;min-width:0}.ai-chat-settings .capabilities{display:inline-flex;flex-wrap:wrap;gap:.25rem;justify-content:center}.ai-chat-settings .capability-chip{display:inline-flex;align-items:center;gap:.2rem;font-size:.6875rem;font-weight:600;letter-spacing:.02em;padding:.125rem .5rem;border-radius:1rem;background:var(--color-basic-transparent-200);color:var(--text-hint-color);white-space:nowrap}.ai-chat-settings .capability-chip nb-icon{font-size:.8125rem;width:.8125rem;height:.8125rem}.ai-chat-settings .capability-chip.speech{background:var(--color-info-transparent-200);color:var(--color-info-700)}.ai-chat-settings .capability-chip.local{background:var(--color-warning-transparent-200);color:var(--color-warning-800)}.ai-chat-settings .tile{display:inline-flex;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;border-radius:.5rem;flex-shrink:0;-webkit-user-select:none;user-select:none}.ai-chat-settings .tile.large{width:3.5rem;height:3.5rem;border-radius:.75rem}.ai-chat-settings .tile.brand{background:var(--color-basic-transparent-100);border:1px solid var(--color-basic-transparent-200);padding:.375rem;color:var(--text-basic-color)}.ai-chat-settings .tile.brand.large{padding:.625rem}.ai-chat-settings .tile.brand .mark{width:100%;height:100%;fill:currentColor}.ai-chat-settings .tile.monogram{background:var(--color-basic-transparent-200);border:1px solid var(--color-basic-transparent-300);color:var(--text-basic-color);font-weight:700;font-size:.8125rem;letter-spacing:.02em}.ai-chat-settings .tile.monogram.large{font-size:1.125rem}.ai-chat-settings .static-badge{position:static;white-space:nowrap}.ai-chat-settings .chat-notice{display:flex;align-items:center;gap:.75rem;margin-bottom:1rem;padding:.625rem .875rem;border:1px solid var(--color-basic-transparent-300);border-radius:var(--border-radius);background:var(--color-basic-transparent-100)}.ai-chat-settings .chat-notice>nb-icon{font-size:1.25rem;width:1.25rem;height:1.25rem;flex-shrink:0}.ai-chat-settings .chat-notice .notice-text{display:flex;flex-direction:column;gap:.125rem;min-width:0}.ai-chat-settings .chat-notice .notice-title{font-size:.875rem;font-weight:600;color:var(--text-basic-color)}.ai-chat-settings .chat-notice .notice-hint{font-size:.75rem;color:var(--text-hint-color)}.ai-chat-settings .chat-notice .notice-action{margin-left:auto;flex-shrink:0}.ai-chat-settings .chat-notice.success{border-color:var(--color-success-transparent-300);background:var(--color-success-transparent-100)}.ai-chat-settings .chat-notice.warning{border-color:var(--color-warning-transparent-300);background:var(--color-warning-transparent-100)}.ai-chat-settings .chat-notice.danger{border-color:var(--color-danger-transparent-300);background:var(--color-danger-transparent-100)}.ai-chat-settings .chat-notice.info{border-color:var(--color-info-transparent-300);background:var(--color-info-transparent-100)}.ai-chat-settings .empty-state{display:flex;flex-direction:column;align-items:center;gap:.5rem;min-height:22rem;justify-content:center;text-align:center}.ai-chat-settings .empty-state p{margin:0}.ai-chat-settings .empty-state .empty-illustration{display:inline-flex;align-items:center;justify-content:center;width:3.5rem;height:3.5rem;margin-bottom:.5rem;border-radius:50%;background:var(--color-basic-transparent-200)}.ai-chat-settings .empty-state .empty-illustration nb-icon{font-size:1.75rem;width:1.75rem;height:1.75rem;color:var(--text-hint-color)}.ai-chat-settings .empty-state .empty-title{margin:0;font-size:1rem;font-weight:600;color:var(--text-basic-color)}.ai-chat-settings .empty-state .empty-hint{max-width:26rem;color:var(--text-hint-color)}.ai-chat-settings .empty-state button{margin-top:.75rem}.ai-chat-settings .empty-state .empty-actions{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center}.ai-chat-settings .empty-state .empty-providers{margin-top:.75rem;font-size:.75rem;color:var(--text-hint-color);opacity:.75}.ai-chat-settings .voice-section{margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--color-basic-transparent-300)}.ai-chat-settings .voice-section .section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:.5rem}.ai-chat-settings .voice-section .section-head h6{display:inline-flex;align-items:center;gap:.375rem;margin:0;font-size:.9375rem;font-weight:600}.ai-chat-settings .voice-section .section-head h6 nb-icon{font-size:1rem;width:1rem;height:1rem}.ai-chat-settings .voice-section .section-head .description{margin:.25rem 0 0;font-size:.8125rem;opacity:.7}.ai-chat-settings .voice-section .speech-model{font-family:var(--font-family-mono, monospace);font-size:.75rem;opacity:.8;word-break:break-all}.ai-chat-settings .voice-section .fallback-chip{margin-left:.5rem;font-size:.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;padding:.125rem .5rem;border-radius:1rem;background:var(--color-basic-transparent-200);color:var(--text-hint-color)}.ai-chat-settings .voice-section .capability-chip{margin-left:.375rem}.ai-chat-settings .voice-section .voice-empty{display:flex;align-items:center;gap:.75rem;padding:.625rem .875rem;border:1px solid var(--color-warning-transparent-300);border-radius:var(--border-radius);background:var(--color-warning-transparent-100)}.ai-chat-settings .voice-section .voice-empty>nb-icon{font-size:1.25rem;width:1.25rem;height:1.25rem;flex-shrink:0}.ai-chat-settings .voice-section .voice-empty .notice-text{display:flex;flex-direction:column;gap:.125rem;min-width:0}.ai-chat-settings .voice-section .voice-empty .notice-title{font-size:.875rem;font-weight:600;color:var(--text-basic-color)}.ai-chat-settings .voice-section .voice-empty .notice-hint{font-size:.75rem;color:var(--text-hint-color)}.ai-chat-settings .voice-section .voice-empty .notice-action{margin-left:auto;flex-shrink:0}.ai-chat-settings .provider-rows{display:flex;flex-direction:column;min-width:0;overflow-x:auto}.ai-chat-settings .provider-rows .row-head,.ai-chat-settings .provider-rows .row{display:grid;grid-template-columns:minmax(14rem,1.4fr) minmax(9rem,1fr) minmax(7rem,.7fr) auto;gap:1rem;align-items:center;padding:.75rem .5rem}.ai-chat-settings .provider-rows .row-head{font-size:.75rem;text-transform:uppercase;letter-spacing:.04em;opacity:.6;border-bottom:1px solid var(--color-basic-transparent-300)}.ai-chat-settings .provider-rows .row{border-bottom:1px solid var(--color-basic-transparent-200)}.ai-chat-settings .provider-rows .row:last-child{border-bottom:none}.ai-chat-settings .provider-rows .cell.name{display:inline-flex;align-items:center;gap:.75rem;font-weight:600}.ai-chat-settings .provider-rows .default-chip{margin-left:.5rem;font-size:.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;padding:.125rem .5rem;border-radius:1rem;background:var(--color-success-transparent-200);color:var(--color-success-800)}.ai-chat-settings .provider-rows .env-note{font-size:.75rem;opacity:.6}.ai-chat-settings .provider-rows .actions-col{display:inline-flex;align-items:center;gap:.25rem;justify-content:flex-end}.ai-chat-settings .catalog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(11rem,1fr));gap:1rem}.ai-chat-settings .catalog-card{display:flex;flex-direction:column;align-items:center;gap:.625rem;padding:1.5rem 1rem 1.25rem;border:1px solid var(--color-basic-transparent-300);border-radius:.75rem;background:transparent;cursor:pointer;transition:border-color .12s ease,transform .12s ease,box-shadow .12s ease;color:inherit;font:inherit}.ai-chat-settings .catalog-card:hover,.ai-chat-settings .catalog-card:focus-visible{border-color:var(--color-primary-default);transform:translateY(-2px);box-shadow:0 4px 16px var(--color-primary-transparent-200);outline:none}.ai-chat-settings .catalog-card .name{font-weight:600}.ai-chat-settings .catalog-card .configured{display:inline-flex;align-items:center;gap:.25rem;font-size:.75rem;color:var(--color-success-800)}.ai-chat-settings .catalog-card .configured nb-icon{font-size:.9375rem}.ai-chat-settings .catalog-card .connect-chip{font-size:.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;padding:.125rem .5rem;border-radius:1rem;background:var(--color-primary-transparent-200);color:var(--color-primary-700)}:host-context(.nb-theme-gauzy-dark) .ai-chat-settings .default-chip,:host-context(.nb-theme-gauzy-dark) .ai-chat-settings .configured,:host-context(.nb-theme-dark) .ai-chat-settings .default-chip,:host-context(.nb-theme-dark) .ai-chat-settings .configured,:host-context(.nb-theme-cosmic) .ai-chat-settings .default-chip,:host-context(.nb-theme-cosmic) .ai-chat-settings .configured,:host-context(.nb-theme-material-dark) .ai-chat-settings .default-chip,:host-context(.nb-theme-material-dark) .ai-chat-settings .configured{color:var(--color-success-300)}:host-context(.nb-theme-gauzy-dark) .ai-chat-settings .connect-chip,:host-context(.nb-theme-dark) .ai-chat-settings .connect-chip,:host-context(.nb-theme-cosmic) .ai-chat-settings .connect-chip,:host-context(.nb-theme-material-dark) .ai-chat-settings .connect-chip{color:var(--color-primary-300)}:host-context(.nb-theme-gauzy-dark) .ai-chat-settings .capability-chip.speech,:host-context(.nb-theme-dark) .ai-chat-settings .capability-chip.speech,:host-context(.nb-theme-cosmic) .ai-chat-settings .capability-chip.speech,:host-context(.nb-theme-material-dark) .ai-chat-settings .capability-chip.speech{color:var(--color-info-300)}:host-context(.nb-theme-gauzy-dark) .ai-chat-settings .capability-chip.local,:host-context(.nb-theme-dark) .ai-chat-settings .capability-chip.local,:host-context(.nb-theme-cosmic) .ai-chat-settings .capability-chip.local,:host-context(.nb-theme-material-dark) .ai-chat-settings .capability-chip.local{color:var(--color-warning-300)}.ai-chat-settings .config-title{display:flex;align-items:center;gap:.75rem}.ai-chat-settings .platform-notice{margin:.5rem 0 0;max-width:42rem;font-size:.75rem;line-height:1.4;opacity:.85}.ai-chat-settings .connect-box{display:flex;flex-direction:column;align-items:flex-start;gap:.5rem;margin-bottom:1.25rem}.ai-chat-settings .connect-box .hint{font-size:.75rem;opacity:.7}.ai-chat-settings .connect-box .divider{align-self:stretch;display:flex;align-items:center;gap:.75rem;margin-top:.75rem;font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;opacity:.6}.ai-chat-settings .connect-box .divider:before,.ai-chat-settings .connect-box .divider:after{content:\"\";flex:1;border-top:1px solid var(--color-basic-transparent-300)}.ai-chat-settings .config-form{max-width:34rem}.ai-chat-settings .form-group{margin-bottom:1rem}.ai-chat-settings .form-group .label{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:.25rem}.ai-chat-settings .form-group .get-key{font-size:.75rem;text-decoration:none}.ai-chat-settings .form-group .get-key:hover{text-decoration:underline}.ai-chat-settings .form-group .hint{display:block;margin-top:.25rem;font-size:.75rem;opacity:.7}.ai-chat-settings .form-group .error{display:block;margin-top:.25rem;font-size:.75rem;color:var(--color-danger-default)}.ai-chat-settings .form-group .custom-model{margin-top:.5rem}.ai-chat-settings .form-group .model-select,.ai-chat-settings .form-group .model-select .model-label{display:block}.ai-chat-settings .form-group .model-select .model-id{display:block;font-size:.6875rem;font-family:var(--font-family-mono, monospace);opacity:.6}.ai-chat-settings .form-group.toggles{display:flex;flex-wrap:wrap;align-items:center;gap:1rem}.ai-chat-settings .form-group.voice-group{padding:.75rem .875rem;border:1px solid var(--color-info-transparent-300);border-radius:var(--border-radius);background:var(--color-info-transparent-100)}.ai-chat-settings .form-group.voice-group .label-with-icon{display:inline-flex;align-items:center;gap:.375rem}.ai-chat-settings .form-group.voice-group .voice-default-toggle{display:block;margin:.75rem 0 0}.ai-chat-settings .form-group .default-radio{display:inline-flex;align-items:center;gap:.375rem;margin:0;cursor:pointer}.ai-chat-settings .form-group .default-radio input[type=radio]{accent-color:var(--color-primary-default);width:1rem;height:1rem;margin:0;cursor:pointer}.ai-chat-settings .actions{display:flex;align-items:center;gap:.5rem}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: NbBadgeModule }, { kind: "component", type: i3.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: NbCardModule }, { kind: "component", type: i3.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i3.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i3.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "ngmodule", type: NbFormFieldModule }, { kind: "component", type: i3.NbFormFieldComponent, selector: "nb-form-field" }, { kind: "directive", type: i3.NbSuffixDirective, selector: "[nbSuffix]" }, { kind: "ngmodule", type: NbIconModule }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "ngmodule", type: NbInputModule }, { kind: "directive", type: i3.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "ngmodule", type: NbSpinnerModule }, { kind: "directive", type: i3.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "ngmodule", type: NbToggleModule }, { kind: "component", type: i3.NbToggleComponent, selector: "nb-toggle", inputs: ["checked", "disabled", "status", "labelPosition"], outputs: ["checkedChange"] }, { kind: "ngmodule", type: NbTooltipModule }, { kind: "ngmodule", type: 
                // The model list runs to hundreds of entries on the routing providers, so the picker has to be
                // searchable — nb-select is not.
                NgSelectModule }, { kind: "component", type: i4.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "directive", type: i4.NgOptionTemplateDirective, selector: "[ng-option-tmp]" }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AiChatSettingsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-ai-chat-settings', imports: [
                        CommonModule,
                        ReactiveFormsModule,
                        TranslateModule,
                        NbBadgeModule,
                        NbButtonModule,
                        NbCardModule,
                        NbFormFieldModule,
                        NbIconModule,
                        NbInputModule,
                        NbSpinnerModule,
                        NbToggleModule,
                        NbTooltipModule,
                        // The model list runs to hundreds of entries on the routing providers, so the picker has to be
                        // searchable — nb-select is not.
                        NgSelectModule
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "<!--\n\tProvider tile, shared by the list rows, the catalog cards and the config\n\theader so one provider looks identical wherever it appears. Draws the\n\tbundled brand mark when there is one and falls back to a monogram when\n\tthere is not, so a tile is never an empty box.\n-->\n<ng-template #providerTile let-provider let-large=\"large\">\n\t@if (providerLogo(provider.id); as logo) {\n\t\t<span class=\"tile brand\" [class.large]=\"large\" [style.color]=\"logo.brandColor\">\n\t\t\t<svg\n\t\t\t\tclass=\"mark\"\n\t\t\t\t[attr.viewBox]=\"logo.viewBox\"\n\t\t\t\tpreserveAspectRatio=\"xMidYMid meet\"\n\t\t\t\taria-hidden=\"true\"\n\t\t\t\tfocusable=\"false\"\n\t\t\t>\n\t\t\t\t<g [attr.transform]=\"logo.transform\">\n\t\t\t\t\t@for (path of logo.paths; track $index) {\n\t\t\t\t\t\t<path [attr.d]=\"path\"></path>\n\t\t\t\t\t}\n\t\t\t\t</g>\n\t\t\t</svg>\n\t\t</span>\n\t} @else {\n\t\t<span class=\"tile monogram\" [class.large]=\"large\" aria-hidden=\"true\">{{ tileMonogram(provider) }}</span>\n\t}\n</ng-template>\n\n<nb-card class=\"ai-chat-settings\" [nbSpinner]=\"loading() || connecting()\" nbSpinnerStatus=\"primary\">\n\t<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 LIST VIEW (default) \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\n\t@if (view() === 'list') {\n\t\t<nb-card-header>\n\t\t\t<div class=\"page-header\">\n\t\t\t\t<div>\n\t\t\t\t\t<h5>{{ 'AI_CHAT_UI.SETTINGS.TITLE' | translate }}</h5>\n\t\t\t\t\t<p class=\"description\">{{ 'AI_CHAT_UI.SETTINGS.DESCRIPTION' | translate }}</p>\n\t\t\t\t</div>\n\t\t\t\t<!-- Header actions only once something is configured: with an empty list\n\t\t\t\t     the centred call-to-action below is the single obvious next step,\n\t\t\t\t     and showing both put two identical green buttons on one screen. -->\n\t\t\t\t@if (configuredProviders().length || voiceProviders().length) {\n\t\t\t\t\t<div class=\"header-actions\">\n\t\t\t\t\t\t<button nbButton status=\"success\" (click)=\"showCatalog()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.ADD_PROVIDER' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button nbButton outline status=\"success\" (click)=\"showVoiceCatalog()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"mic-outline\"></nb-icon>\n\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.ADD_VOICE_PROVIDER' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t}\n\t\t\t</div>\n\t\t</nb-card-header>\n\t\t<nb-card-body>\n\t\t\t<!-- Where is the chat? Answer it here \u2014 configuring a provider is the\n\t\t\t     only place the user learns whether the chat turned on, and why not. -->\n\t\t\t@if (chatNoticeMeta(); as notice) {\n\t\t\t\t<div class=\"chat-notice\" [ngClass]=\"notice.status\" role=\"status\">\n\t\t\t\t\t<nb-icon [icon]=\"notice.icon\" [status]=\"notice.status\"></nb-icon>\n\t\t\t\t\t<div class=\"notice-text\">\n\t\t\t\t\t\t<span class=\"notice-title\">{{ notice.title | translate }}</span>\n\t\t\t\t\t\t<span class=\"notice-hint\">{{ notice.hint | translate }}</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t@if (chatNotice() === 'ready') {\n\t\t\t\t\t\t<button nbButton size=\"small\" status=\"success\" class=\"notice-action\" (click)=\"openChat()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"message-circle-outline\"></nb-icon>\n\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.STATUS.OPEN_CHAT' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t}\n\n\t\t\t@if (!loading() && !configuredProviders().length && !voiceProviders().length) {\n\t\t\t\t<div class=\"empty-state\">\n\t\t\t\t\t<span class=\"empty-illustration\" aria-hidden=\"true\">\n\t\t\t\t\t\t<nb-icon icon=\"cube-outline\"></nb-icon>\n\t\t\t\t\t</span>\n\t\t\t\t\t<h6 class=\"empty-title\">{{ 'AI_CHAT_UI.SETTINGS.LIST.EMPTY_TITLE' | translate }}</h6>\n\t\t\t\t\t<p class=\"empty-hint\">{{ 'AI_CHAT_UI.SETTINGS.LIST.EMPTY' | translate }}</p>\n\t\t\t\t\t<div class=\"empty-actions\">\n\t\t\t\t\t\t<button nbButton status=\"success\" size=\"medium\" (click)=\"showCatalog()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.ADD_PROVIDER' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button nbButton outline status=\"success\" size=\"medium\" (click)=\"showVoiceCatalog()\">\n\t\t\t\t\t\t\t<nb-icon icon=\"mic-outline\"></nb-icon>\n\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.ADD_VOICE_PROVIDER' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<!-- Name the providers on offer so the empty state teaches what this\n\t\t\t\t\t     page is for, instead of only asking for a click. -->\n\t\t\t\t\t<p class=\"empty-providers\">{{ 'AI_CHAT_UI.SETTINGS.LIST.EMPTY_PROVIDERS' | translate }}</p>\n\t\t\t\t</div>\n\t\t\t}\n\n\t\t\t@if (configuredProviders().length) {\n\t\t\t\t<div class=\"provider-rows\">\n\t\t\t\t\t<div class=\"row-head\">\n\t\t\t\t\t\t<span>{{ 'AI_CHAT_UI.SETTINGS.LIST.NAME' | translate }}</span>\n\t\t\t\t\t\t<span>{{ 'AI_CHAT_UI.SETTINGS.LIST.SOURCE' | translate }}</span>\n\t\t\t\t\t\t<span>{{ 'AI_CHAT_UI.SETTINGS.LIST.ENABLED' | translate }}</span>\n\t\t\t\t\t\t<span class=\"actions-col\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t@for (provider of configuredProviders(); track provider.id) {\n\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t<span class=\"cell name\">\n\t\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t\t\t[ngTemplateOutlet]=\"providerTile\"\n\t\t\t\t\t\t\t\t\t[ngTemplateOutletContext]=\"{ $implicit: provider }\"\n\t\t\t\t\t\t\t\t></ng-container>\n\t\t\t\t\t\t\t\t<span class=\"label\">\n\t\t\t\t\t\t\t\t\t{{ provider.label }}\n\t\t\t\t\t\t\t\t\t@if (defaultProviderId() === provider.id) {\n\t\t\t\t\t\t\t\t\t\t<span class=\"default-chip\">{{\n\t\t\t\t\t\t\t\t\t\t\t'AI_CHAT_UI.SETTINGS.LIST.DEFAULT' | translate\n\t\t\t\t\t\t\t\t\t\t}}</span>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class=\"cell\">\n\t\t\t\t\t\t\t\t<nb-badge\n\t\t\t\t\t\t\t\t\tclass=\"static-badge\"\n\t\t\t\t\t\t\t\t\t[text]=\"getBadgeKey(provider) | translate\"\n\t\t\t\t\t\t\t\t\t[status]=\"getBadgeStatus(provider)\"\n\t\t\t\t\t\t\t\t></nb-badge>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class=\"cell\">\n\t\t\t\t\t\t\t\t@if (getCredential(provider.id)?.id) {\n\t\t\t\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\t\t[checked]=\"getCredential(provider.id)?.enabled ?? false\"\n\t\t\t\t\t\t\t\t\t\t[disabled]=\"saving() === provider.id\"\n\t\t\t\t\t\t\t\t\t\t(checkedChange)=\"toggleEnabled(provider, $event)\"\n\t\t\t\t\t\t\t\t\t></nb-toggle>\n\t\t\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t\t\t\t<span class=\"env-note\">{{ 'AI_CHAT_UI.SETTINGS.LIST.VIA_ENV' | translate }}</span>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class=\"cell actions-col\">\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\t(click)=\"showConfigure(provider.id)\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"settings-2-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.CONFIGURE' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t@if (getCredential(provider.id)) {\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\t\t(click)=\"delete(provider)\"\n\t\t\t\t\t\t\t\t\t\t[disabled]=\"deleting() === provider.id\"\n\t\t\t\t\t\t\t\t\t\t[nbSpinner]=\"deleting() === provider.id\"\n\t\t\t\t\t\t\t\t\t\tnbSpinnerSize=\"tiny\"\n\t\t\t\t\t\t\t\t\t\tnbSpinnerStatus=\"danger\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t<nb-icon icon=\"trash-2-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t}\n\n\t\t\t<!-- \u2500\u2500 Voice (dictation) \u2500\u2500\n\t\t\t     Which configured providers can transcribe, and which one is the tenant's voice\n\t\t\t     default. Shown whenever the page has SOMETHING configured: a tenant with a chat\n\t\t\t     provider but no voice provider needs to learn here why dictation is off. -->\n\t\t\t@if (!loading() && (configuredProviders().length || voiceProviders().length)) {\n\t\t\t\t<section class=\"voice-section\" aria-labelledby=\"ai-chat-voice-title\">\n\t\t\t\t\t<div class=\"section-head\">\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<h6 id=\"ai-chat-voice-title\">\n\t\t\t\t\t\t\t\t<nb-icon icon=\"mic-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.VOICE.TITLE' | translate }}\n\t\t\t\t\t\t\t</h6>\n\t\t\t\t\t\t\t<p class=\"description\">{{ 'AI_CHAT_UI.SETTINGS.VOICE.DESCRIPTION' | translate }}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t@if (voiceProviders().length) {\n\t\t\t\t\t\t<div class=\"provider-rows\">\n\t\t\t\t\t\t\t<div class=\"row-head\">\n\t\t\t\t\t\t\t\t<span>{{ 'AI_CHAT_UI.SETTINGS.LIST.NAME' | translate }}</span>\n\t\t\t\t\t\t\t\t<span>{{ 'AI_CHAT_UI.SETTINGS.LIST.SOURCE' | translate }}</span>\n\t\t\t\t\t\t\t\t<span>{{ 'AI_CHAT_UI.SETTINGS.VOICE.MODEL' | translate }}</span>\n\t\t\t\t\t\t\t\t<span class=\"actions-col\"></span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t@for (provider of voiceProviders(); track provider.id) {\n\t\t\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t\t\t\t<span class=\"cell name\">\n\t\t\t\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t\t\t\t\t[ngTemplateOutlet]=\"providerTile\"\n\t\t\t\t\t\t\t\t\t\t\t[ngTemplateOutletContext]=\"{ $implicit: provider }\"\n\t\t\t\t\t\t\t\t\t\t></ng-container>\n\t\t\t\t\t\t\t\t\t\t<span class=\"label\">\n\t\t\t\t\t\t\t\t\t\t\t{{ provider.label }}\n\t\t\t\t\t\t\t\t\t\t\t@if (defaultVoiceProviderId() === provider.id) {\n\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"default-chip voice\">{{\n\t\t\t\t\t\t\t\t\t\t\t\t\t'AI_CHAT_UI.SETTINGS.VOICE.DEFAULT' | translate\n\t\t\t\t\t\t\t\t\t\t\t\t}}</span>\n\t\t\t\t\t\t\t\t\t\t\t} @else {\n\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"fallback-chip\">{{\n\t\t\t\t\t\t\t\t\t\t\t\t\t'AI_CHAT_UI.SETTINGS.VOICE.FALLBACK' | translate\n\t\t\t\t\t\t\t\t\t\t\t\t}}</span>\n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t@if (provider.local) {\n\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"capability-chip local\">{{\n\t\t\t\t\t\t\t\t\t\t\t\t\t'AI_CHAT_UI.SETTINGS.BADGE.LOCAL' | translate\n\t\t\t\t\t\t\t\t\t\t\t\t}}</span>\n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<span class=\"cell\">\n\t\t\t\t\t\t\t\t\t\t<nb-badge\n\t\t\t\t\t\t\t\t\t\t\tclass=\"static-badge\"\n\t\t\t\t\t\t\t\t\t\t\t[text]=\"getVoiceBadgeKey(provider) | translate\"\n\t\t\t\t\t\t\t\t\t\t\t[status]=\"getVoiceBadgeStatus(provider)\"\n\t\t\t\t\t\t\t\t\t\t></nb-badge>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<span class=\"cell speech-model\">\n\t\t\t\t\t\t\t\t\t\t{{ getCredential(provider.id)?.speechModel || provider.defaultSpeechModel || '\u2014' }}\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<span class=\"cell actions-col\">\n\t\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t\t\t\t(click)=\"showConfigure(provider.id)\"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t<nb-icon icon=\"settings-2-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.CONFIGURE' | translate }}\n\t\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t} @else {\n\t\t\t\t\t\t<div class=\"voice-empty\">\n\t\t\t\t\t\t\t<nb-icon icon=\"mic-off-outline\" status=\"warning\"></nb-icon>\n\t\t\t\t\t\t\t<div class=\"notice-text\">\n\t\t\t\t\t\t\t\t<span class=\"notice-title\">{{ 'AI_CHAT_UI.SETTINGS.VOICE.EMPTY' | translate }}</span>\n\t\t\t\t\t\t\t\t<span class=\"notice-hint\">{{ 'AI_CHAT_UI.SETTINGS.VOICE.EMPTY_HINT' | translate }}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<button nbButton size=\"small\" status=\"success\" class=\"notice-action\" (click)=\"showVoiceCatalog()\">\n\t\t\t\t\t\t\t\t<nb-icon icon=\"plus-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.VOICE.ADD' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\t\t\t\t</section>\n\t\t\t}\n\t\t</nb-card-body>\n\t}\n\n\t<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 CATALOG VIEW (?add=1) \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\n\t@if (view() === 'catalog') {\n\t\t<nb-card-header>\n\t\t\t<div class=\"page-header\">\n\t\t\t\t<div>\n\t\t\t\t\t<button nbButton ghost size=\"small\" class=\"back\" (click)=\"showList()\">\n\t\t\t\t\t\t<nb-icon icon=\"arrow-back-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.BACK' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t@if (catalogFilter() === 'voice') {\n\t\t\t\t\t\t<h5>{{ 'AI_CHAT_UI.SETTINGS.CATALOG.VOICE_TITLE' | translate }}</h5>\n\t\t\t\t\t\t<p class=\"description\">{{ 'AI_CHAT_UI.SETTINGS.CATALOG.VOICE_DESCRIPTION' | translate }}</p>\n\t\t\t\t\t} @else {\n\t\t\t\t\t\t<h5>{{ 'AI_CHAT_UI.SETTINGS.CATALOG.TITLE' | translate }}</h5>\n\t\t\t\t\t\t<p class=\"description\">{{ 'AI_CHAT_UI.SETTINGS.CATALOG.DESCRIPTION' | translate }}</p>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</nb-card-header>\n\t\t<nb-card-body>\n\t\t\t@if (!loading() && !catalogProviders().length) {\n\t\t\t\t<p class=\"empty-state\">\n\t\t\t\t\t{{\n\t\t\t\t\t\t(catalogFilter() === 'voice'\n\t\t\t\t\t\t\t? 'AI_CHAT_UI.SETTINGS.CATALOG.NO_VOICE_PROVIDERS'\n\t\t\t\t\t\t\t: 'AI_CHAT_UI.SETTINGS.NO_PROVIDERS'\n\t\t\t\t\t\t) | translate\n\t\t\t\t\t}}\n\t\t\t\t</p>\n\t\t\t}\n\t\t\t<div class=\"catalog-grid\">\n\t\t\t\t@for (provider of catalogProviders(); track provider.id) {\n\t\t\t\t\t<button type=\"button\" class=\"catalog-card\" (click)=\"showConfigure(provider.id)\">\n\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t[ngTemplateOutlet]=\"providerTile\"\n\t\t\t\t\t\t\t[ngTemplateOutletContext]=\"{ $implicit: provider, large: true }\"\n\t\t\t\t\t\t></ng-container>\n\t\t\t\t\t\t<span class=\"name\">{{ provider.label }}</span>\n\t\t\t\t\t\t<!-- Capability chips: what this provider can do for the tenant. -->\n\t\t\t\t\t\t<span class=\"capabilities\">\n\t\t\t\t\t\t\t@if (provider.chatCapable !== false) {\n\t\t\t\t\t\t\t\t<span class=\"capability-chip chat\">{{ 'AI_CHAT_UI.SETTINGS.BADGE.CHAT' | translate }}</span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t@if (provider.speechCapable) {\n\t\t\t\t\t\t\t\t<span class=\"capability-chip speech\">\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"mic-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.BADGE.SPEECH' | translate }}\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t@if (provider.local) {\n\t\t\t\t\t\t\t\t<span class=\"capability-chip local\">{{ 'AI_CHAT_UI.SETTINGS.BADGE.LOCAL' | translate }}</span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t@if (catalogFilter() === 'voice' ? isVoiceConfigured(provider) : provider.configured) {\n\t\t\t\t\t\t\t<span class=\"configured\">\n\t\t\t\t\t\t\t\t<nb-icon icon=\"checkmark-circle-2\" status=\"success\"></nb-icon>\n\t\t\t\t\t\t\t\t{{ (catalogFilter() === 'voice' ? getVoiceBadgeKey(provider) : getBadgeKey(provider)) | translate }}\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t\t@if (provider.connectType) {\n\t\t\t\t\t\t\t<span class=\"connect-chip\">{{\n\t\t\t\t\t\t\t\t'AI_CHAT_UI.SETTINGS.CATALOG.SUPPORTS_CONNECT' | translate\n\t\t\t\t\t\t\t}}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</button>\n\t\t\t\t}\n\t\t\t</div>\n\t\t</nb-card-body>\n\t}\n\n\t<!-- \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 CONFIG VIEW (?provider=<id>) \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 -->\n\t@if (view() === 'config' && selectedProvider(); as provider) {\n\t\t<nb-card-header>\n\t\t\t<div class=\"page-header\">\n\t\t\t\t<div>\n\t\t\t\t\t<button nbButton ghost size=\"small\" class=\"back\" (click)=\"backFromConfigure(provider)\">\n\t\t\t\t\t\t<nb-icon icon=\"arrow-back-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.BACK' | translate }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<div class=\"config-title\">\n\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t[ngTemplateOutlet]=\"providerTile\"\n\t\t\t\t\t\t\t[ngTemplateOutletContext]=\"{ $implicit: provider }\"\n\t\t\t\t\t\t></ng-container>\n\t\t\t\t\t\t<h5>{{ provider.label }}</h5>\n\t\t\t\t\t\t<nb-badge\n\t\t\t\t\t\t\tclass=\"static-badge\"\n\t\t\t\t\t\t\t[text]=\"(isVoiceOnly(provider) ? getVoiceBadgeKey(provider) : getBadgeKey(provider)) | translate\"\n\t\t\t\t\t\t\t[status]=\"isVoiceOnly(provider) ? getVoiceBadgeStatus(provider) : getBadgeStatus(provider)\"\n\t\t\t\t\t\t></nb-badge>\n\t\t\t\t\t\t<span class=\"capabilities\">\n\t\t\t\t\t\t\t@if (provider.speechCapable) {\n\t\t\t\t\t\t\t\t<span class=\"capability-chip speech\">\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"mic-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.BADGE.SPEECH' | translate }}\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t@if (provider.local) {\n\t\t\t\t\t\t\t\t<span class=\"capability-chip local\">{{ 'AI_CHAT_UI.SETTINGS.BADGE.LOCAL' | translate }}</span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t@if (isVoiceOnly(provider)) {\n\t\t\t\t\t\t<p class=\"platform-notice\">{{ 'AI_CHAT_UI.SETTINGS.FORM.VOICE_ONLY_NOTICE' | translate }}</p>\n\t\t\t\t\t}\n\t\t\t\t\t@if (isOnPlatformKey(provider)) {\n\t\t\t\t\t\t<!-- The badge alone would leave the user wondering why a provider they never\n\t\t\t\t\t\t     configured is working. Say it plainly, and point at the way out. -->\n\t\t\t\t\t\t<p class=\"platform-notice\">{{ 'AI_CHAT_UI.SETTINGS.PLATFORM_NOTICE' | translate }}</p>\n\t\t\t\t\t}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</nb-card-header>\n\t\t<nb-card-body>\n\t\t\t<!-- Connect flow (providers that support it) -->\n\t\t\t@if (provider.connectType) {\n\t\t\t\t<div class=\"connect-box\">\n\t\t\t\t\t<button nbButton status=\"primary\" (click)=\"connect(provider)\">\n\t\t\t\t\t\t<nb-icon icon=\"flash-outline\"></nb-icon>\n\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.CONNECT.BUTTON' | translate: { provider: provider.label } }}\n\t\t\t\t\t</button>\n\t\t\t\t\t<span class=\"hint\">{{ 'AI_CHAT_UI.SETTINGS.CONNECT.HINT' | translate }}</span>\n\t\t\t\t\t<div class=\"divider\">\n\t\t\t\t\t\t<span>{{ 'AI_CHAT_UI.SETTINGS.CONNECT.OR_MANUAL' | translate }}</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t}\n\n\t\t\t@if (getForm(provider.id); as form) {\n\t\t\t\t<form [formGroup]=\"form\" (ngSubmit)=\"save(provider)\" class=\"config-form\">\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" [for]=\"'apiKey-' + provider.id\">\n\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\t(provider.requiresApiKey === false\n\t\t\t\t\t\t\t\t\t? 'AI_CHAT_UI.SETTINGS.FORM.API_KEY_LABEL_OPTIONAL'\n\t\t\t\t\t\t\t\t\t: 'AI_CHAT_UI.SETTINGS.FORM.API_KEY'\n\t\t\t\t\t\t\t\t) | translate\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t@if (provider.apiKeysUrl) {\n\t\t\t\t\t\t\t\t<a\n\t\t\t\t\t\t\t\t\tclass=\"get-key\"\n\t\t\t\t\t\t\t\t\t[href]=\"provider.apiKeysUrl\"\n\t\t\t\t\t\t\t\t\ttarget=\"_blank\"\n\t\t\t\t\t\t\t\t\trel=\"noopener noreferrer\"\n\t\t\t\t\t\t\t\t\t>{{ 'AI_CHAT_UI.SETTINGS.FORM.GET_KEY' | translate }} \u2197</a\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<nb-form-field>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t[id]=\"'apiKey-' + provider.id\"\n\t\t\t\t\t\t\t\tformControlName=\"apiKey\"\n\t\t\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t\t\t\t[type]=\"isKeyRevealed(provider.id) ? 'text' : 'password'\"\n\t\t\t\t\t\t\t\t[placeholder]=\"\n\t\t\t\t\t\t\t\t\tgetCredential(provider.id)?.apiKey ||\n\t\t\t\t\t\t\t\t\t('AI_CHAT_UI.SETTINGS.FORM.API_KEY_PLACEHOLDER' | translate)\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbSuffix\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\tsize=\"small\"\n\t\t\t\t\t\t\t\t(click)=\"toggleKeyReveal(provider.id)\"\n\t\t\t\t\t\t\t\t[attr.aria-label]=\"\n\t\t\t\t\t\t\t\t\t(isKeyRevealed(provider.id)\n\t\t\t\t\t\t\t\t\t\t? 'AI_CHAT_UI.SETTINGS.FORM.HIDE_KEY'\n\t\t\t\t\t\t\t\t\t\t: 'AI_CHAT_UI.SETTINGS.FORM.SHOW_KEY'\n\t\t\t\t\t\t\t\t\t) | translate\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<nb-icon\n\t\t\t\t\t\t\t\t\t[icon]=\"isKeyRevealed(provider.id) ? 'eye-off-outline' : 'eye-outline'\"\n\t\t\t\t\t\t\t\t></nb-icon>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</nb-form-field>\n\t\t\t\t\t\t@if (provider.requiresApiKey === false) {\n\t\t\t\t\t\t\t<span class=\"hint\">{{ 'AI_CHAT_UI.SETTINGS.FORM.API_KEY_OPTIONAL' | translate }}</span>\n\t\t\t\t\t\t} @else if (getCredential(provider.id)) {\n\t\t\t\t\t\t\t<span class=\"hint\">{{ 'AI_CHAT_UI.SETTINGS.FORM.API_KEY_KEEP' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t\t@if (form.controls.apiKey.touched && form.controls.apiKey.hasError('required')) {\n\t\t\t\t\t\t\t<span class=\"error\">{{ 'AI_CHAT_UI.SETTINGS.FORM.API_KEY_REQUIRED' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t<label class=\"label\" [for]=\"'baseUrl-' + provider.id\">\n\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\t(provider.requiresBaseUrl\n\t\t\t\t\t\t\t\t\t? 'AI_CHAT_UI.SETTINGS.FORM.BASE_URL_REQUIRED_LABEL'\n\t\t\t\t\t\t\t\t\t: 'AI_CHAT_UI.SETTINGS.FORM.BASE_URL'\n\t\t\t\t\t\t\t\t) | translate\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t</label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t[id]=\"'baseUrl-' + provider.id\"\n\t\t\t\t\t\t\tformControlName=\"baseUrl\"\n\t\t\t\t\t\t\ttype=\"url\"\n\t\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t\t\t[placeholder]=\"baseUrlPlaceholder(provider)\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t@if (provider.requiresBaseUrl) {\n\t\t\t\t\t\t\t<span class=\"hint\">{{ 'AI_CHAT_UI.SETTINGS.FORM.BASE_URL_GATEWAY_HINT' | translate }}</span>\n\t\t\t\t\t\t} @else if (provider.local) {\n\t\t\t\t\t\t\t<span class=\"hint\">{{ 'AI_CHAT_UI.SETTINGS.FORM.BASE_URL_LOCAL_HINT' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t\t@if (form.controls.baseUrl.touched && form.controls.baseUrl.hasError('required')) {\n\t\t\t\t\t\t\t<span class=\"error\">{{ 'AI_CHAT_UI.SETTINGS.FORM.BASE_URL_REQUIRED' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t\t@if (form.controls.baseUrl.touched && form.controls.baseUrl.hasError('pattern')) {\n\t\t\t\t\t\t\t<span class=\"error\">{{ 'AI_CHAT_UI.SETTINGS.FORM.BASE_URL_INVALID' | translate }}</span>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<!-- \u2500\u2500 Voice / speech-to-text (speech-capable providers) \u2500\u2500 -->\n\t\t\t\t\t@if (provider.speechCapable) {\n\t\t\t\t\t\t<div class=\"form-group voice-group\">\n\t\t\t\t\t\t\t<label class=\"label\" [for]=\"'ai-chat-speech-model-' + provider.id\">\n\t\t\t\t\t\t\t\t<span class=\"label-with-icon\">\n\t\t\t\t\t\t\t\t\t<nb-icon icon=\"mic-outline\"></nb-icon>\n\t\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.FORM.SPEECH_MODEL' | translate }}\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<ng-select\n\t\t\t\t\t\t\t\tclass=\"model-select\"\n\t\t\t\t\t\t\t\t[labelForId]=\"'ai-chat-speech-model-' + provider.id\"\n\t\t\t\t\t\t\t\tformControlName=\"speechModel\"\n\t\t\t\t\t\t\t\tbindValue=\"id\"\n\t\t\t\t\t\t\t\tbindLabel=\"label\"\n\t\t\t\t\t\t\t\t[items]=\"speechModelOptions(provider)\"\n\t\t\t\t\t\t\t\t[clearable]=\"true\"\n\t\t\t\t\t\t\t\t[searchable]=\"true\"\n\t\t\t\t\t\t\t\t[searchFn]=\"searchModel\"\n\t\t\t\t\t\t\t\t[placeholder]=\"\n\t\t\t\t\t\t\t\t\tprovider.defaultSpeechModel || ('AI_CHAT_UI.SETTINGS.FORM.SPEECH_MODEL_NONE' | translate)\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t[notFoundText]=\"'AI_CHAT_UI.SETTINGS.FORM.MODELS_NOT_FOUND' | translate\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<ng-template ng-option-tmp let-model=\"item\">\n\t\t\t\t\t\t\t\t\t<span class=\"model-label\">{{ model.label }}</span>\n\t\t\t\t\t\t\t\t\t<span class=\"model-id\">\n\t\t\t\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\t\t\t\tmodel.id === CUSTOM_MODEL\n\t\t\t\t\t\t\t\t\t\t\t\t? ('AI_CHAT_UI.SETTINGS.FORM.CUSTOM_SPEECH_MODEL_PLACEHOLDER' | translate)\n\t\t\t\t\t\t\t\t\t\t\t\t: model.id\n\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t\t\t</ng-select>\n\t\t\t\t\t\t\t<span class=\"hint\">{{ 'AI_CHAT_UI.SETTINGS.FORM.SPEECH_MODEL_HINT' | translate }}</span>\n\t\t\t\t\t\t\t@if (form.controls.speechModel.value === CUSTOM_MODEL) {\n\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\tclass=\"custom-model\"\n\t\t\t\t\t\t\t\t\t[id]=\"'ai-chat-custom-speech-model-' + provider.id\"\n\t\t\t\t\t\t\t\t\tformControlName=\"customSpeechModel\"\n\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t\t\t\t\t[attr.aria-label]=\"'AI_CHAT_UI.SETTINGS.FORM.CUSTOM_SPEECH_MODEL_PLACEHOLDER' | translate\"\n\t\t\t\t\t\t\t\t\t[placeholder]=\"'AI_CHAT_UI.SETTINGS.FORM.CUSTOM_SPEECH_MODEL_PLACEHOLDER' | translate\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t<label class=\"voice-default-toggle\">\n\t\t\t\t\t\t\t\t<nb-toggle\n\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\t[checked]=\"voiceDefaultControl.value === provider.id\"\n\t\t\t\t\t\t\t\t\t(checkedChange)=\"setVoiceDefault(provider, $event)\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.FORM.USE_AS_VOICE_DEFAULT' | translate }}\n\t\t\t\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<span class=\"hint\">{{ 'AI_CHAT_UI.SETTINGS.FORM.USE_AS_VOICE_DEFAULT_HINT' | translate }}</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\n\t\t\t\t\t<!-- The chat model picker + chat default are meaningless for a voice-only provider. -->\n\t\t\t\t\t@if (!isVoiceOnly(provider)) {\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label class=\"label\" [for]=\"'ai-chat-model-' + provider.id\">\n\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.FORM.DEFAULT_MODEL' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<ng-select\n\t\t\t\t\t\t\t\tclass=\"model-select\"\n\t\t\t\t\t\t\t\t[labelForId]=\"'ai-chat-model-' + provider.id\"\n\t\t\t\t\t\t\t\tformControlName=\"defaultModel\"\n\t\t\t\t\t\t\t\tbindValue=\"id\"\n\t\t\t\t\t\t\t\tbindLabel=\"label\"\n\t\t\t\t\t\t\t\t[items]=\"modelOptions(provider)\"\n\t\t\t\t\t\t\t\t[loading]=\"isLoadingModels(provider.id)\"\n\t\t\t\t\t\t\t\t[clearable]=\"true\"\n\t\t\t\t\t\t\t\t[searchable]=\"true\"\n\t\t\t\t\t\t\t\t[searchFn]=\"searchModel\"\n\t\t\t\t\t\t\t\t[virtualScroll]=\"true\"\n\t\t\t\t\t\t\t\t[placeholder]=\"'AI_CHAT_UI.SETTINGS.FORM.DEFAULT_MODEL_NONE' | translate\"\n\t\t\t\t\t\t\t\t[notFoundText]=\"'AI_CHAT_UI.SETTINGS.FORM.MODELS_NOT_FOUND' | translate\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<!--\n\t\t\t\t\t\t\t\t\tEvery row is two lines, including the \"Custom model\u2026\" sentinel: ng-select's\n\t\t\t\t\t\t\t\t\tvirtual scroll measures one item and applies that height to all of them, so a\n\t\t\t\t\t\t\t\t\tsingle short row would smear the scroll offset across a 250-entry list.\n\t\t\t\t\t\t\t\t-->\n\t\t\t\t\t\t\t\t<ng-template ng-option-tmp let-model=\"item\">\n\t\t\t\t\t\t\t\t\t<span class=\"model-label\">{{ model.label }}</span>\n\t\t\t\t\t\t\t\t\t<span class=\"model-id\">\n\t\t\t\t\t\t\t\t\t\t{{\n\t\t\t\t\t\t\t\t\t\t\tmodel.id === CUSTOM_MODEL\n\t\t\t\t\t\t\t\t\t\t\t\t? ('AI_CHAT_UI.SETTINGS.FORM.CUSTOM_MODEL_PLACEHOLDER' | translate)\n\t\t\t\t\t\t\t\t\t\t\t\t: model.id\n\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</ng-template>\n\t\t\t\t\t\t\t</ng-select>\n\t\t\t\t\t\t\t@if (modelSourceKey(provider); as sourceKey) {\n\t\t\t\t\t\t\t\t<span class=\"hint\">{{ sourceKey | translate }}</span>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t@if (form.controls.defaultModel.value === CUSTOM_MODEL) {\n\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\tnbInput\n\t\t\t\t\t\t\t\t\tfullWidth\n\t\t\t\t\t\t\t\t\tclass=\"custom-model\"\n\t\t\t\t\t\t\t\t\t[id]=\"'ai-chat-custom-model-' + provider.id\"\n\t\t\t\t\t\t\t\t\tformControlName=\"customModel\"\n\t\t\t\t\t\t\t\t\ttype=\"text\"\n\t\t\t\t\t\t\t\t\tautocomplete=\"off\"\n\t\t\t\t\t\t\t\t\t[attr.aria-label]=\"'AI_CHAT_UI.SETTINGS.FORM.CUSTOM_MODEL_PLACEHOLDER' | translate\"\n\t\t\t\t\t\t\t\t\t[placeholder]=\"'AI_CHAT_UI.SETTINGS.FORM.CUSTOM_MODEL_PLACEHOLDER' | translate\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t}\n\n\t\t\t\t\t<div class=\"form-group toggles\">\n\t\t\t\t\t\t<nb-toggle formControlName=\"enabled\" status=\"primary\">\n\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.FORM.ENABLED' | translate }}\n\t\t\t\t\t\t</nb-toggle>\n\t\t\t\t\t\t@if (!isVoiceOnly(provider)) {\n\t\t\t\t\t\t\t<label class=\"default-radio\">\n\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\ttype=\"radio\"\n\t\t\t\t\t\t\t\t\tname=\"defaultProvider\"\n\t\t\t\t\t\t\t\t\t[value]=\"provider.id\"\n\t\t\t\t\t\t\t\t\t[checked]=\"defaultProviderControl.value === provider.id\"\n\t\t\t\t\t\t\t\t\t(change)=\"defaultProviderControl.setValue(provider.id)\"\n\t\t\t\t\t\t\t\t\t[attr.aria-label]=\"\n\t\t\t\t\t\t\t\t\t\t('AI_CHAT_UI.SETTINGS.FORM.USE_AS_DEFAULT' | translate) + ': ' + provider.label\n\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.FORM.USE_AS_DEFAULT' | translate }}\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"actions\">\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\ttype=\"submit\"\n\t\t\t\t\t\t\t[disabled]=\"saving() === provider.id\"\n\t\t\t\t\t\t\t[nbSpinner]=\"saving() === provider.id\"\n\t\t\t\t\t\t\tnbSpinnerSize=\"tiny\"\n\t\t\t\t\t\t\tnbSpinnerStatus=\"control\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.SAVE' | translate }}\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t@if (getCredential(provider.id)) {\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\tstatus=\"danger\"\n\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\t(click)=\"delete(provider)\"\n\t\t\t\t\t\t\t\t[disabled]=\"deleting() === provider.id\"\n\t\t\t\t\t\t\t\t[nbSpinner]=\"deleting() === provider.id\"\n\t\t\t\t\t\t\t\tnbSpinnerSize=\"tiny\"\n\t\t\t\t\t\t\t\tnbSpinnerStatus=\"danger\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t{{ 'AI_CHAT_UI.SETTINGS.ACTIONS.DELETE' | translate }}\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t}\n\t\t\t\t\t</div>\n\t\t\t\t</form>\n\t\t\t}\n\t\t</nb-card-body>\n\t}\n</nb-card>\n", styles: [":host{display:block}.ai-chat-settings .page-header{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:1rem}.ai-chat-settings .page-header h5{margin:0}.ai-chat-settings .page-header .description{margin:.25rem 0 0;font-size:.875rem;opacity:.7}.ai-chat-settings .page-header .back{margin:0 0 .5rem -.5rem;opacity:.8}.ai-chat-settings .page-header .header-actions{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:flex-end;min-width:0}.ai-chat-settings .capabilities{display:inline-flex;flex-wrap:wrap;gap:.25rem;justify-content:center}.ai-chat-settings .capability-chip{display:inline-flex;align-items:center;gap:.2rem;font-size:.6875rem;font-weight:600;letter-spacing:.02em;padding:.125rem .5rem;border-radius:1rem;background:var(--color-basic-transparent-200);color:var(--text-hint-color);white-space:nowrap}.ai-chat-settings .capability-chip nb-icon{font-size:.8125rem;width:.8125rem;height:.8125rem}.ai-chat-settings .capability-chip.speech{background:var(--color-info-transparent-200);color:var(--color-info-700)}.ai-chat-settings .capability-chip.local{background:var(--color-warning-transparent-200);color:var(--color-warning-800)}.ai-chat-settings .tile{display:inline-flex;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;border-radius:.5rem;flex-shrink:0;-webkit-user-select:none;user-select:none}.ai-chat-settings .tile.large{width:3.5rem;height:3.5rem;border-radius:.75rem}.ai-chat-settings .tile.brand{background:var(--color-basic-transparent-100);border:1px solid var(--color-basic-transparent-200);padding:.375rem;color:var(--text-basic-color)}.ai-chat-settings .tile.brand.large{padding:.625rem}.ai-chat-settings .tile.brand .mark{width:100%;height:100%;fill:currentColor}.ai-chat-settings .tile.monogram{background:var(--color-basic-transparent-200);border:1px solid var(--color-basic-transparent-300);color:var(--text-basic-color);font-weight:700;font-size:.8125rem;letter-spacing:.02em}.ai-chat-settings .tile.monogram.large{font-size:1.125rem}.ai-chat-settings .static-badge{position:static;white-space:nowrap}.ai-chat-settings .chat-notice{display:flex;align-items:center;gap:.75rem;margin-bottom:1rem;padding:.625rem .875rem;border:1px solid var(--color-basic-transparent-300);border-radius:var(--border-radius);background:var(--color-basic-transparent-100)}.ai-chat-settings .chat-notice>nb-icon{font-size:1.25rem;width:1.25rem;height:1.25rem;flex-shrink:0}.ai-chat-settings .chat-notice .notice-text{display:flex;flex-direction:column;gap:.125rem;min-width:0}.ai-chat-settings .chat-notice .notice-title{font-size:.875rem;font-weight:600;color:var(--text-basic-color)}.ai-chat-settings .chat-notice .notice-hint{font-size:.75rem;color:var(--text-hint-color)}.ai-chat-settings .chat-notice .notice-action{margin-left:auto;flex-shrink:0}.ai-chat-settings .chat-notice.success{border-color:var(--color-success-transparent-300);background:var(--color-success-transparent-100)}.ai-chat-settings .chat-notice.warning{border-color:var(--color-warning-transparent-300);background:var(--color-warning-transparent-100)}.ai-chat-settings .chat-notice.danger{border-color:var(--color-danger-transparent-300);background:var(--color-danger-transparent-100)}.ai-chat-settings .chat-notice.info{border-color:var(--color-info-transparent-300);background:var(--color-info-transparent-100)}.ai-chat-settings .empty-state{display:flex;flex-direction:column;align-items:center;gap:.5rem;min-height:22rem;justify-content:center;text-align:center}.ai-chat-settings .empty-state p{margin:0}.ai-chat-settings .empty-state .empty-illustration{display:inline-flex;align-items:center;justify-content:center;width:3.5rem;height:3.5rem;margin-bottom:.5rem;border-radius:50%;background:var(--color-basic-transparent-200)}.ai-chat-settings .empty-state .empty-illustration nb-icon{font-size:1.75rem;width:1.75rem;height:1.75rem;color:var(--text-hint-color)}.ai-chat-settings .empty-state .empty-title{margin:0;font-size:1rem;font-weight:600;color:var(--text-basic-color)}.ai-chat-settings .empty-state .empty-hint{max-width:26rem;color:var(--text-hint-color)}.ai-chat-settings .empty-state button{margin-top:.75rem}.ai-chat-settings .empty-state .empty-actions{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center}.ai-chat-settings .empty-state .empty-providers{margin-top:.75rem;font-size:.75rem;color:var(--text-hint-color);opacity:.75}.ai-chat-settings .voice-section{margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--color-basic-transparent-300)}.ai-chat-settings .voice-section .section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:.5rem}.ai-chat-settings .voice-section .section-head h6{display:inline-flex;align-items:center;gap:.375rem;margin:0;font-size:.9375rem;font-weight:600}.ai-chat-settings .voice-section .section-head h6 nb-icon{font-size:1rem;width:1rem;height:1rem}.ai-chat-settings .voice-section .section-head .description{margin:.25rem 0 0;font-size:.8125rem;opacity:.7}.ai-chat-settings .voice-section .speech-model{font-family:var(--font-family-mono, monospace);font-size:.75rem;opacity:.8;word-break:break-all}.ai-chat-settings .voice-section .fallback-chip{margin-left:.5rem;font-size:.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;padding:.125rem .5rem;border-radius:1rem;background:var(--color-basic-transparent-200);color:var(--text-hint-color)}.ai-chat-settings .voice-section .capability-chip{margin-left:.375rem}.ai-chat-settings .voice-section .voice-empty{display:flex;align-items:center;gap:.75rem;padding:.625rem .875rem;border:1px solid var(--color-warning-transparent-300);border-radius:var(--border-radius);background:var(--color-warning-transparent-100)}.ai-chat-settings .voice-section .voice-empty>nb-icon{font-size:1.25rem;width:1.25rem;height:1.25rem;flex-shrink:0}.ai-chat-settings .voice-section .voice-empty .notice-text{display:flex;flex-direction:column;gap:.125rem;min-width:0}.ai-chat-settings .voice-section .voice-empty .notice-title{font-size:.875rem;font-weight:600;color:var(--text-basic-color)}.ai-chat-settings .voice-section .voice-empty .notice-hint{font-size:.75rem;color:var(--text-hint-color)}.ai-chat-settings .voice-section .voice-empty .notice-action{margin-left:auto;flex-shrink:0}.ai-chat-settings .provider-rows{display:flex;flex-direction:column;min-width:0;overflow-x:auto}.ai-chat-settings .provider-rows .row-head,.ai-chat-settings .provider-rows .row{display:grid;grid-template-columns:minmax(14rem,1.4fr) minmax(9rem,1fr) minmax(7rem,.7fr) auto;gap:1rem;align-items:center;padding:.75rem .5rem}.ai-chat-settings .provider-rows .row-head{font-size:.75rem;text-transform:uppercase;letter-spacing:.04em;opacity:.6;border-bottom:1px solid var(--color-basic-transparent-300)}.ai-chat-settings .provider-rows .row{border-bottom:1px solid var(--color-basic-transparent-200)}.ai-chat-settings .provider-rows .row:last-child{border-bottom:none}.ai-chat-settings .provider-rows .cell.name{display:inline-flex;align-items:center;gap:.75rem;font-weight:600}.ai-chat-settings .provider-rows .default-chip{margin-left:.5rem;font-size:.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;padding:.125rem .5rem;border-radius:1rem;background:var(--color-success-transparent-200);color:var(--color-success-800)}.ai-chat-settings .provider-rows .env-note{font-size:.75rem;opacity:.6}.ai-chat-settings .provider-rows .actions-col{display:inline-flex;align-items:center;gap:.25rem;justify-content:flex-end}.ai-chat-settings .catalog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(11rem,1fr));gap:1rem}.ai-chat-settings .catalog-card{display:flex;flex-direction:column;align-items:center;gap:.625rem;padding:1.5rem 1rem 1.25rem;border:1px solid var(--color-basic-transparent-300);border-radius:.75rem;background:transparent;cursor:pointer;transition:border-color .12s ease,transform .12s ease,box-shadow .12s ease;color:inherit;font:inherit}.ai-chat-settings .catalog-card:hover,.ai-chat-settings .catalog-card:focus-visible{border-color:var(--color-primary-default);transform:translateY(-2px);box-shadow:0 4px 16px var(--color-primary-transparent-200);outline:none}.ai-chat-settings .catalog-card .name{font-weight:600}.ai-chat-settings .catalog-card .configured{display:inline-flex;align-items:center;gap:.25rem;font-size:.75rem;color:var(--color-success-800)}.ai-chat-settings .catalog-card .configured nb-icon{font-size:.9375rem}.ai-chat-settings .catalog-card .connect-chip{font-size:.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;padding:.125rem .5rem;border-radius:1rem;background:var(--color-primary-transparent-200);color:var(--color-primary-700)}:host-context(.nb-theme-gauzy-dark) .ai-chat-settings .default-chip,:host-context(.nb-theme-gauzy-dark) .ai-chat-settings .configured,:host-context(.nb-theme-dark) .ai-chat-settings .default-chip,:host-context(.nb-theme-dark) .ai-chat-settings .configured,:host-context(.nb-theme-cosmic) .ai-chat-settings .default-chip,:host-context(.nb-theme-cosmic) .ai-chat-settings .configured,:host-context(.nb-theme-material-dark) .ai-chat-settings .default-chip,:host-context(.nb-theme-material-dark) .ai-chat-settings .configured{color:var(--color-success-300)}:host-context(.nb-theme-gauzy-dark) .ai-chat-settings .connect-chip,:host-context(.nb-theme-dark) .ai-chat-settings .connect-chip,:host-context(.nb-theme-cosmic) .ai-chat-settings .connect-chip,:host-context(.nb-theme-material-dark) .ai-chat-settings .connect-chip{color:var(--color-primary-300)}:host-context(.nb-theme-gauzy-dark) .ai-chat-settings .capability-chip.speech,:host-context(.nb-theme-dark) .ai-chat-settings .capability-chip.speech,:host-context(.nb-theme-cosmic) .ai-chat-settings .capability-chip.speech,:host-context(.nb-theme-material-dark) .ai-chat-settings .capability-chip.speech{color:var(--color-info-300)}:host-context(.nb-theme-gauzy-dark) .ai-chat-settings .capability-chip.local,:host-context(.nb-theme-dark) .ai-chat-settings .capability-chip.local,:host-context(.nb-theme-cosmic) .ai-chat-settings .capability-chip.local,:host-context(.nb-theme-material-dark) .ai-chat-settings .capability-chip.local{color:var(--color-warning-300)}.ai-chat-settings .config-title{display:flex;align-items:center;gap:.75rem}.ai-chat-settings .platform-notice{margin:.5rem 0 0;max-width:42rem;font-size:.75rem;line-height:1.4;opacity:.85}.ai-chat-settings .connect-box{display:flex;flex-direction:column;align-items:flex-start;gap:.5rem;margin-bottom:1.25rem}.ai-chat-settings .connect-box .hint{font-size:.75rem;opacity:.7}.ai-chat-settings .connect-box .divider{align-self:stretch;display:flex;align-items:center;gap:.75rem;margin-top:.75rem;font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;opacity:.6}.ai-chat-settings .connect-box .divider:before,.ai-chat-settings .connect-box .divider:after{content:\"\";flex:1;border-top:1px solid var(--color-basic-transparent-300)}.ai-chat-settings .config-form{max-width:34rem}.ai-chat-settings .form-group{margin-bottom:1rem}.ai-chat-settings .form-group .label{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:.25rem}.ai-chat-settings .form-group .get-key{font-size:.75rem;text-decoration:none}.ai-chat-settings .form-group .get-key:hover{text-decoration:underline}.ai-chat-settings .form-group .hint{display:block;margin-top:.25rem;font-size:.75rem;opacity:.7}.ai-chat-settings .form-group .error{display:block;margin-top:.25rem;font-size:.75rem;color:var(--color-danger-default)}.ai-chat-settings .form-group .custom-model{margin-top:.5rem}.ai-chat-settings .form-group .model-select,.ai-chat-settings .form-group .model-select .model-label{display:block}.ai-chat-settings .form-group .model-select .model-id{display:block;font-size:.6875rem;font-family:var(--font-family-mono, monospace);opacity:.6}.ai-chat-settings .form-group.toggles{display:flex;flex-wrap:wrap;align-items:center;gap:1rem}.ai-chat-settings .form-group.voice-group{padding:.75rem .875rem;border:1px solid var(--color-info-transparent-300);border-radius:var(--border-radius);background:var(--color-info-transparent-100)}.ai-chat-settings .form-group.voice-group .label-with-icon{display:inline-flex;align-items:center;gap:.375rem}.ai-chat-settings .form-group.voice-group .voice-default-toggle{display:block;margin:.75rem 0 0}.ai-chat-settings .form-group .default-radio{display:inline-flex;align-items:center;gap:.375rem;margin:0;cursor:pointer}.ai-chat-settings .form-group .default-radio input[type=radio]{accent-color:var(--color-primary-default);width:1rem;height:1rem;margin:0;cursor:pointer}.ai-chat-settings .actions{display:flex;align-items:center;gap:.5rem}\n"] }]
        }] });
//# sourceMappingURL=ai-chat-settings.component.js.map