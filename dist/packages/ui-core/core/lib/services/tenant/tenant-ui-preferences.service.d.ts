import { ITenantUiPreferences, ITenantUiPreferencesUpdateInput, PreferredUiEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * Tenant-wide UI preferences: which flavour (Angular or React) of a page that exists in both
 * flavours the tenant wants to see.
 *
 * Read by everyone (routes pick their component with {@link preferredUiCanMatch}), written by
 * tenant administrators from Settings → General. The value is cached per tenant for the session
 * and mirrored to localStorage PER TENANT, so a reload never flashes the wrong flavour while the
 * API answers — and a tenant switch never shows the previous tenant's flavour.
 */
export declare class TenantUiPreferencesService {
    private readonly http;
    private readonly store;
    private readonly API_URL;
    /** The tenant whose preference the signal currently reflects (`null` = nothing loaded from the API yet). */
    private loadedForTenantId;
    /** The tenant whose local mirror last seeded the signal — re-seed whenever the signed-in tenant differs. */
    private seededForTenantId;
    /** The in-flight request and the tenant it was issued for — a completion for another tenant is ignored. */
    private pending;
    /** The current preference — Angular until the API (or the tenant's local mirror) says otherwise. */
    readonly preferredUi: import("@angular/core").WritableSignal<PreferredUiEnum>;
    readonly preferredUi$: import("rxjs").Observable<PreferredUiEnum>;
    /** `true` when the tenant asked for the React flavour. */
    readonly isReact: import("@angular/core").Signal<boolean>;
    constructor();
    /**
     * Resolves the preference for the signed-in tenant, fetching it once per tenant.
     * Concurrent callers (several `canMatch` guards of one navigation) share the same request;
     * a tenant switch while a request is pending starts a new request for the new tenant and the
     * old response is discarded.
     */
    ensureLoaded(): Promise<PreferredUiEnum>;
    /** Re-reads the preference from the API regardless of the cache. */
    reload(): Promise<PreferredUiEnum>;
    /**
     * Persists a new preference for the whole tenant (requires `TENANT_SETTING`) and applies it
     * locally so the current session switches without a reload.
     */
    update(input: ITenantUiPreferencesUpdateInput): Promise<ITenantUiPreferences>;
    /** Forgets the cached preference and this tenant's mirror (call on logout / tenant switch). */
    reset(): void;
    private currentTenantId;
    private apply;
    static ɵfac: i0.ɵɵFactoryDeclaration<TenantUiPreferencesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TenantUiPreferencesService>;
}
