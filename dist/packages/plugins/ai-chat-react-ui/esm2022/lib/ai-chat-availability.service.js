import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, debounceTime, map, shareReplay, switchMap } from 'rxjs/operators';
import { PermissionsEnum } from '@gauzy/contracts';
import { environment } from '@gauzy/ui-config';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
/** Verdict before the first evaluation settles. */
const PENDING = {
    available: false,
    reason: null,
    configuredProviders: 0,
    resolved: false
};
/**
 * AiChatAvailabilityService
 *
 * Single source of truth for "may this user use the AI chat, and if not, why?".
 *
 * The chat sidebar registration (`provideAiChatSidebar`) pushes the verdict into
 * `ChatSidebarService.available`, and the "AI Providers" settings page renders
 * the same verdict as a human-readable notice. Both read this one evaluation, so
 * the header toggle and the settings page can never disagree.
 *
 * The evaluation re-runs on user / role-permission changes **and** on demand via
 * {@link refresh}: configuring the first provider flips the backend verdict but
 * emits nothing on the store, so without an explicit trigger the chat would stay
 * hidden until a full page reload — which is exactly how users lost it.
 */
export class AiChatAvailabilityService {
    constructor() {
        this.store = inject(Store);
        this.http = inject(HttpClient);
        /** Manual re-evaluation trigger (credential saved / deleted / connected). */
        this.refreshTrigger$ = new BehaviorSubject(undefined);
        /**
         * The current verdict, re-evaluated on login/permission changes and on
         * {@link refresh}.
         *
         * `shareReplay` with `refCount: false` keeps the last verdict for late
         * subscribers: the settings page is created long after the sidebar
         * registration subscribed at bootstrap, and must not trigger a second
         * evaluation just by reading.
         */
        this.status$ = combineLatest([
            this.store.user$,
            this.store.userRolePermissions$,
            this.refreshTrigger$
        ]).pipe(debounceTime(100), switchMap(([user, rolePermissions]) => this.evaluate(user, rolePermissions)), shareReplay({ bufferSize: 1, refCount: false }));
        /** The current verdict as a signal (for templates and `computed`). */
        this.status = toSignal(this.status$, { initialValue: PENDING });
        /** Whether the chat may be shown to the current user. */
        this.available = computed(() => this.status().available, ...(ngDevMode ? [{ debugName: "available" }] : []));
    }
    /**
     * Re-evaluates availability now.
     *
     * Call after anything that can change the backend verdict — saving,
     * deleting, enabling/disabling or connecting a provider credential.
     */
    refresh() {
        this.refreshTrigger$.next();
    }
    /**
     * Runs the gates in order: authenticated → permitted → backend configured.
     *
     * @param user - The logged-in user, or `null`/`undefined` when signed out.
     * @param rolePermissions - The user's role permissions from the store.
     * @returns An observable emitting the resulting verdict.
     */
    evaluate(user, rolePermissions) {
        if (!user) {
            return of({
                available: false,
                reason: 'not-authenticated',
                configuredProviders: 0,
                resolved: true
            });
        }
        const permitted = this.isPermitted(rolePermissions, PermissionsEnum.AI_CHAT_ACCESS);
        // `/config` accepts EITHER permission (the settings page needs it too).
        // Asking without either would just log a 403 for every other user, so
        // short-circuit — those users have no AI surface to explain anything on.
        const mayReadConfig = permitted || this.isPermitted(rolePermissions, PermissionsEnum.AI_CHAT_SETTINGS);
        if (!mayReadConfig) {
            return of({
                available: false,
                reason: 'no-permission',
                configuredProviders: 0,
                resolved: true
            });
        }
        return this.http.get(`${environment.API_BASE_URL}/api/ai-chat/config`).pipe(map((config) => {
            const configuredProviders = (config?.providers ?? []).filter((provider) => provider.configured).length;
            if (!config?.enabled) {
                return {
                    available: false,
                    // Trust the server's reason; derive one for older APIs
                    // that answer without `disabledReason`.
                    reason: config?.disabledReason ?? (configuredProviders ? 'globally-disabled' : 'no-providers'),
                    configuredProviders,
                    resolved: true
                };
            }
            // The backend is ready but this role may not open the chat — the
            // distinction a tenant admin with only AI_CHAT_SETTINGS hits.
            if (!permitted) {
                return { available: false, reason: 'no-permission', configuredProviders, resolved: true };
            }
            return { available: true, reason: null, configuredProviders, resolved: true };
        }), catchError(() => of({
            available: false,
            reason: 'unreachable',
            configuredProviders: 0,
            resolved: true
        })));
    }
    /**
     * Whether a permission is present AND enabled in the given role permissions.
     *
     * @param rolePermissions - The user's role permissions from the store.
     * @param permission - The permission to look for.
     * @returns True when the role grants the permission.
     */
    isPermitted(rolePermissions, permission) {
        return (rolePermissions ?? []).some((rolePermission) => rolePermission.permission === permission && rolePermission.enabled);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AiChatAvailabilityService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AiChatAvailabilityService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AiChatAvailabilityService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=ai-chat-availability.service.js.map