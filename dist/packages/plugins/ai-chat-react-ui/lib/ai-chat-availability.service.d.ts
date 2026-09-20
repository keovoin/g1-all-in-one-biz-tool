import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Why the AI chat is not available to the current user.
 *
 * Mirrors the gates the chat has to pass, in the order they are checked, so a
 * surface (settings page, sidebar) can explain the *specific* blocker instead
 * of just hiding itself.
 */
export type AiChatUnavailableReason = 
/** No user is logged in yet. */
'not-authenticated'
/** The user's role lacks `AI_CHAT_ACCESS`. */
 | 'no-permission'
/** The server turned the feature off (`GAUZY_AI_CHAT_ENABLED=false`). */
 | 'globally-disabled'
/** No registered provider has usable credentials for this tenant. */
 | 'no-providers'
/** `GET /api/ai-chat/config` failed — the verdict is unknown. */
 | 'unreachable';
/** Verdict of one availability evaluation. */
export interface IAiChatAvailability {
    /** Whether the chat surfaces (header toggle + sidebar) may be shown. */
    available: boolean;
    /** The closed gate; `null` while available or not yet evaluated. */
    reason: AiChatUnavailableReason | null;
    /** How many registered providers currently have usable credentials. */
    configuredProviders: number;
    /**
     * False until the first evaluation settled. Consumers use it to stay quiet
     * instead of flashing a wrong explanation during bootstrap.
     */
    resolved: boolean;
}
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
export declare class AiChatAvailabilityService {
    private readonly store;
    private readonly http;
    /** Manual re-evaluation trigger (credential saved / deleted / connected). */
    private readonly refreshTrigger$;
    /**
     * The current verdict, re-evaluated on login/permission changes and on
     * {@link refresh}.
     *
     * `shareReplay` with `refCount: false` keeps the last verdict for late
     * subscribers: the settings page is created long after the sidebar
     * registration subscribed at bootstrap, and must not trigger a second
     * evaluation just by reading.
     */
    readonly status$: Observable<IAiChatAvailability>;
    /** The current verdict as a signal (for templates and `computed`). */
    readonly status: Signal<IAiChatAvailability>;
    /** Whether the chat may be shown to the current user. */
    readonly available: Signal<boolean>;
    /**
     * Re-evaluates availability now.
     *
     * Call after anything that can change the backend verdict — saving,
     * deleting, enabling/disabling or connecting a provider credential.
     */
    refresh(): void;
    /**
     * Runs the gates in order: authenticated → permitted → backend configured.
     *
     * @param user - The logged-in user, or `null`/`undefined` when signed out.
     * @param rolePermissions - The user's role permissions from the store.
     * @returns An observable emitting the resulting verdict.
     */
    private evaluate;
    /**
     * Whether a permission is present AND enabled in the given role permissions.
     *
     * @param rolePermissions - The user's role permissions from the store.
     * @param permission - The permission to look for.
     * @returns True when the role grants the permission.
     */
    private isPermitted;
    static ɵfac: i0.ɵɵFactoryDeclaration<AiChatAvailabilityService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AiChatAvailabilityService>;
}
