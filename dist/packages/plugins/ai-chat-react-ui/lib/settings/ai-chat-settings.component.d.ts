import { OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NbComponentStatus } from '@nebular/theme';
import { IAiChatModel, IAiChatProvider, IAiProviderCredential } from '@gauzy/contracts';
import { IProviderLogo } from './provider-logos';
import * as i0 from "@angular/core";
/**
 * What the page tells the user about the chat itself, once they have (or
 * tried to) configure a provider. Each kind maps to one notice in
 * {@link CHAT_NOTICES}.
 */
type AiChatNoticeKind = 'ready' | 'no-permission' | 'globally-disabled' | 'credentials-unusable' | 'unreachable';
/** Typed shape of the per-provider credential form. */
interface ProviderCredentialForm {
    apiKey: FormControl<string>;
    baseUrl: FormControl<string>;
    /** Nullable: `null` is "no default model", which ng-select renders as its placeholder. */
    defaultModel: FormControl<string | null>;
    customModel: FormControl<string>;
    enabled: FormControl<boolean>;
    /** Speech-to-text model for dictation (speech-capable providers). `null` = provider default. */
    speechModel: FormControl<string | null>;
    customSpeechModel: FormControl<string>;
}
/** Which providers the catalog view offers: everything, or only the ones that can transcribe. */
type CatalogFilter = 'all' | 'voice';
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
export declare class AiChatSettingsComponent implements OnInit {
    /** Select value meaning "type a custom model id" (used by the template). */
    readonly CUSTOM_MODEL = "__custom__";
    /** Whether the initial config + credentials load is in flight. */
    readonly loading: import("@angular/core").WritableSignal<boolean>;
    /** Provider id whose credential is currently being saved (or `null`). */
    readonly saving: import("@angular/core").WritableSignal<string>;
    /** Provider id whose credential is currently being deleted (or `null`). */
    readonly deleting: import("@angular/core").WritableSignal<string>;
    /** True while a Connect (PKCE) exchange is being completed. */
    readonly connecting: import("@angular/core").WritableSignal<boolean>;
    /** Providers registered on the backend, in their defined display order. */
    readonly providers: import("@angular/core").WritableSignal<IAiChatProvider[]>;
    /** The tenant's current default provider id (from the backend config). */
    readonly defaultProviderId: import("@angular/core").WritableSignal<string>;
    /** The tenant's current default VOICE (dictation) provider id (from the backend config). */
    readonly defaultVoiceProviderId: import("@angular/core").WritableSignal<string>;
    /** Whether the backend can transcribe for this tenant right now (`config.speechConfigured`). */
    readonly speechConfigured: import("@angular/core").WritableSignal<boolean>;
    /** Current view: driven by the route query params. */
    readonly view: import("@angular/core").WritableSignal<"list" | "config" | "catalog">;
    /** What the catalog view offers (`?add=1` → all, `?add=voice` → speech-capable only). */
    readonly catalogFilter: import("@angular/core").WritableSignal<CatalogFilter>;
    /** Provider selected in the config view. */
    readonly selectedProviderId: import("@angular/core").WritableSignal<string>;
    /**
     * Live model catalogues, indexed by provider id, fetched when a provider's config view opens.
     *
     * Absent until then — {@link modelsFor} falls back to the curated list carried by `/config`, so
     * the picker is never empty while this is loading or if it fails.
     */
    private readonly modelCatalogues;
    /**
     * Provider ids whose catalogue is in flight.
     *
     * A SET, not one id. Switching from provider A to B before A returns had A's completion clear the
     * single slot, dropping B's spinner while B was still loading — and leaving A's guard open, so
     * going back to A fired a duplicate request.
     */
    private readonly loadingModels;
    /**
     * Memoised picker items per provider, so `[items]` is referentially stable across change
     * detection. Plain map, not a signal: it is a cache of a derived value, never a source of truth.
     */
    private readonly modelOptionsCache;
    /**
     * Per-provider generation counter, bumped by {@link invalidateCatalogue}.
     *
     * Dropping the cached entry is not enough on its own: a fetch that was already in flight when the
     * credential changed still resolves, and storing THAT answer re-caches the pre-change list — and
     * the `has(providerId)` guard then blocks the refetch it was invalidated for. A response whose
     * generation no longer matches is discarded instead.
     */
    private readonly catalogueGeneration;
    /** The provider object for the config view. */
    readonly selectedProvider: import("@angular/core").Signal<IAiChatProvider>;
    /** Providers that are configured (tenant key or server env) — the list view rows. */
    readonly configuredProviders: import("@angular/core").Signal<IAiChatProvider[]>;
    /**
     * Providers that can transcribe AND have credentials — the "Voice (dictation)" rows.
     *
     * Not `configured`: that is the CHAT verdict, and a voice-only provider (Deepgram, a local
     * whisper server) is never chat-configured. `credentialSource` is emitted whenever credentials
     * resolve, capability aside, so it is the speech-side "configured". Sorted so the tenant's voice
     * default leads — that is the order dictation tries them in.
     */
    readonly voiceProviders: import("@angular/core").Signal<IAiChatProvider[]>;
    /** All speech-capable providers (configured or not) — the voice catalog. */
    readonly speechCapableProviders: import("@angular/core").Signal<IAiChatProvider[]>;
    /** Providers offered by the catalog view under the current filter. */
    readonly catalogProviders: import("@angular/core").Signal<IAiChatProvider[]>;
    /**
     * Tenant credentials indexed by provider id (API keys masked).
     * A signal because {@link chatNotice} has to react to it: a saved-but-unusable
     * credential is exactly the case the notice exists to explain.
     */
    private readonly credentialsByProvider;
    /** Per-provider reactive forms indexed by provider id. */
    private forms;
    /** Provider ids whose API key input is shown as plain text. */
    private revealedKeys;
    /** Radio control: which provider is the tenant's default for chat. */
    readonly defaultProviderControl: FormControl<string>;
    /**
     * Which provider is the tenant's default for VOICE (dictation). Independent of the chat default:
     * a tenant may chat through Anthropic and dictate through a local whisper server. `null` means
     * "no pin" — dictation then walks the speech-capable providers in order.
     */
    readonly voiceDefaultControl: FormControl<string>;
    private readonly fb;
    private readonly store;
    private readonly availability;
    private readonly chatSidebar;
    private readonly settingsService;
    private readonly dialogService;
    private readonly toastrService;
    private readonly translateService;
    private readonly cdr;
    private readonly router;
    private readonly route;
    private readonly destroyRef;
    /**
     * Which notice (if any) to show about the chat itself — the answer to
     * "I configured a provider, so where is the chat?".
     *
     * Stays `null` while the page is loading, while the availability check is
     * still pending, and for a brand-new tenant that has configured nothing yet
     * (the empty state already tells that user what to do).
     */
    readonly chatNotice: import("@angular/core").Signal<AiChatNoticeKind>;
    /** Presentation (status, icon, i18n keys) of the current chat notice. */
    readonly chatNoticeMeta: import("@angular/core").Signal<{
        status: NbComponentStatus;
        icon: string;
        title: string;
        hint: string;
    }>;
    ngOnInit(): void;
    showList(): void;
    showCatalog(): void;
    /** The catalog narrowed to providers that can transcribe — the "+ Add AI Voice Provider" flow. */
    showVoiceCatalog(): void;
    showConfigure(providerId: string): void;
    /**
     * Back from the config view: to the voice catalog for a voice-only provider (that is where the
     * user came from), otherwise to the full catalog.
     */
    backFromConfigure(provider: IAiChatProvider): void;
    /** True for a provider that transcribes but cannot chat (Deepgram, a local whisper server …). */
    isVoiceOnly(provider: IAiChatProvider): boolean;
    /** True when a speech-capable provider has credentials — i.e. it can serve dictation now. */
    isVoiceConfigured(provider: IAiChatProvider): boolean;
    /**
     * Loads the provider configuration and tenant credentials, then
     * (re)builds one credential form per registered provider.
     */
    load(): void;
    /**
     * Re-evaluates whether the chat is now available.
     *
     * Saving/deleting/connecting a credential flips the backend verdict but
     * emits nothing the sidebar registration listens to, so without this call
     * the chat only appears after a full page reload.
     */
    private refreshChatAvailability;
    /** Expands the chat sidebar, so "where is the chat?" is one click away. */
    openChat(): void;
    /**
     * The brand mark bundled for a provider, or `null` when none is bundled.
     *
     * @param providerId Registered provider id, e.g. `openai`.
     * @returns The mark to draw in the provider's tile, `null` to fall back to
     * the monogram tile (see {@link tileMonogram}).
     */
    providerLogo(providerId: string): IProviderLogo | null;
    /**
     * Initials for the fallback monogram tile, drawn only for providers that
     * ship no brand mark — a provider contributed by a future plugin, say.
     * Rendering initials keeps that tile from collapsing into an empty box.
     *
     * @param provider The provider to label.
     * @returns Up to two uppercase initials, one per leading word of the label
     * (so "Vercel AI Gateway" reads "VA", not "VE").
     */
    tileMonogram(provider: IAiChatProvider): string;
    /**
     * Fetches a provider's model catalogue for the picker.
     *
     * Fails soft in both directions: an error leaves the curated list in place (the endpoint itself
     * already degrades to curated rather than erroring, so this only catches transport failures), and
     * a second visit to the same provider re-uses what was already fetched instead of re-calling an
     * upstream API on every back-and-forth between the list and the config view.
     */
    loadModels(providerId: string): void;
    /** Whether this provider's catalogue is being fetched right now. */
    isLoadingModels(providerId: string): boolean;
    /**
     * Forget a provider's cached catalogue, so the next visit re-fetches it.
     *
     * Called whenever the CREDENTIAL changes, because the catalogue depends on it. Without this, the
     * flow the whole feature exists to fix reappears one step later: a provider running on the shared
     * free key shows the free-tier list, the user saves their own key in that very form, and on
     * returning they are still offered the four free models — the cached answer to a question that no
     * longer applies.
     */
    private invalidateCatalogue;
    /**
     * The models to offer for a provider: the fetched catalogue when there is one, else the curated
     * list that came with `/config`.
     */
    modelsFor(provider: IAiChatProvider): IAiChatModel[];
    /**
     * Picker items: the models plus the "Custom model…" sentinel.
     *
     * The sentinel stays even with a live catalogue. Providers ship models faster than any catalogue
     * endpoint reflects them, and a paid model can be addressable by a key long before it is listed —
     * so there has to be a way to type an id in by hand.
     */
    modelOptions(provider: IAiChatProvider): IAiChatModel[];
    /**
     * Search a model by its ID as well as its label.
     *
     * ng-select's default search only looks at the label, and on the routing providers the label is a
     * display name ("Anthropic: Claude Sonnet 5") while the id is the slug
     * (`anthropic/claude-sonnet-5`). Pasting the id you were handed — the thing the empty-state text
     * tells you to type — matched nothing and reported the model as absent while it sat in the list.
     */
    readonly searchModel: (term: string, model: IAiChatModel) => boolean;
    /**
     * The note under the model picker explaining where its list came from, or `null` when the list is
     * live and complete (the ordinary case needs no explanation).
     */
    modelSourceKey(provider: IAiChatProvider): string | null;
    /**
     * Re-decides "known model vs custom" once the catalogue arrives.
     *
     * {@link buildForms} runs before the fetch and can only compare against the curated list, so a
     * saved model that is real but simply not curated starts out shown as a custom id. Left alone it
     * would stay that way — a text box next to a dropdown that in fact contains the very model.
     */
    private reconcileModelSelection;
    /**
     * Picker items for the speech model: the provider's speech catalogue plus the "Custom…"
     * sentinel. Memoised per provider like {@link modelOptions}, for the same ng-select reason.
     */
    speechModelOptions(provider: IAiChatProvider): IAiChatModel[];
    /** Memoised speech-model picker items per provider (see {@link modelOptionsCache}). */
    private readonly speechModelOptionsCache;
    /**
     * Whether the API key input may be left blank for this provider — local servers
     * (`requiresApiKey: false`), or an existing credential whose stored key is kept on a blank
     * update.
     */
    isApiKeyOptional(provider: IAiChatProvider): boolean;
    /** Placeholder for the base URL input: the provider's conventional address, else a generic one. */
    baseUrlPlaceholder(provider: IAiChatProvider): string;
    /** Returns the credential form for a provider. */
    getForm(providerId: string): FormGroup<ProviderCredentialForm>;
    /** Returns the tenant credential (masked) for a provider, if any. */
    getCredential(providerId: string): IAiProviderCredential | undefined;
    /** Whether the API key input of a provider is shown as plain text. */
    isKeyRevealed(providerId: string): boolean;
    /** Toggles the API key input of a provider between password and plain text. */
    toggleKeyReveal(providerId: string): void;
    /**
     * Returns the translation key for a provider's configuration badge.
     *
     * Every credential source needs its OWN badge. This used to branch on 'environment' and fall
     * through to TENANT_KEY, which meant a tenant running on the shared platform key was told it had
     * entered its own — the one message that is both false and the opposite of the nudge we want,
     * since bringing your own key is exactly how you escape the shared rate limit.
     */
    getBadgeKey(provider: IAiChatProvider): string;
    /** Returns the badge status color for a provider's configuration state. */
    getBadgeStatus(provider: IAiChatProvider): string;
    /** True when this provider is running on the shared, product-supplied free key. */
    isOnPlatformKey(provider: IAiChatProvider): boolean;
    /**
     * Credential badge for the VOICE rows: same sources as {@link getBadgeKey}, but keyed on
     * "credentials resolve" rather than on the chat verdict — a voice-only provider is never
     * chat-`configured` and would otherwise always read "Not configured" while transcribing fine.
     */
    getVoiceBadgeKey(provider: IAiChatProvider): string;
    /** Badge status colour for the voice rows (see {@link getVoiceBadgeKey}). */
    getVoiceBadgeStatus(provider: IAiChatProvider): string;
    /**
     * Quick enable/disable of a provider's tenant credential from the list.
     * Only available for tenant-key rows (env credentials have no toggle).
     */
    toggleEnabled(provider: IAiChatProvider, enabled: boolean): void;
    /**
     * Starts the provider's Connect flow: generates a PKCE verifier +
     * S256 challenge, stashes the verifier in sessionStorage and sends the
     * browser to the provider's authorize page. The provider redirects back
     * to this page with `?code=...`.
     */
    connect(provider: IAiChatProvider): Promise<void>;
    /**
     * Completes a Connect flow after the provider redirected back with a
     * code: the backend exchanges code + verifier for an API key and stores
     * it as the tenant credential.
     */
    private completeConnect;
    /**
     * Strips the one-time `?code=...` from the URL and reloads the page data
     * after a Connect exchange settled (either way).
     */
    private finishConnect;
    private readConnectSession;
    private base64Url;
    private providerLabel;
    /**
     * Saves the credential of a provider: `POST` (upsert) when the tenant has
     * no credential yet, `PUT` when one exists. A blank API key on update
     * keeps the stored key.
     */
    save(provider: IAiChatProvider): void;
    /** Deletes the tenant credential of a provider after confirmation. */
    delete(provider: IAiChatProvider): void;
    /**
     * Builds one reactive form per registered provider, prefilled from the
     * tenant's existing credential (if any). The API key is required only
     * on create — on update a blank value keeps the stored key.
     */
    private buildForms;
    /** Points the two page-wide exclusive controls at whatever the SAVED credentials say. */
    private syncExclusiveControls;
    /**
     * Toggle handler for "Use as default voice provider": exclusive (ticking here unticks the
     * previous voice default), and unticking clears the pin — the toggle is only ever ON for the
     * provider currently held by the control, so `false` can only mean "this one, off".
     */
    setVoiceDefault(provider: IAiChatProvider, checked: boolean): void;
    /**
     * Shows an error toast including the backend's actual message (e.g. a
     * misconfigured ENCRYPTION_KEY or a rejected Connect exchange) so
     * failures are diagnosable instead of a generic "something went wrong".
     */
    private showError;
    private extractErrorMessage;
    static ɵfac: i0.ɵɵFactoryDeclaration<AiChatSettingsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AiChatSettingsComponent, "gz-ai-chat-settings", never, {}, {}, never, never, true, never>;
}
export {};
