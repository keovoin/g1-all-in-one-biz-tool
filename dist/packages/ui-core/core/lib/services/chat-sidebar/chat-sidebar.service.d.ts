import { Type } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Configuration for a chat sidebar panel.
 */
export interface IChatSidebarConfig {
    /** Factory that returns the component to render inside the sidebar. */
    loadComponent: () => Promise<Type<any>> | Type<any>;
    /** Optional CSS class applied to the nb-sidebar element. */
    class?: string;
    /** Whether the sidebar starts expanded when no user preference is stored yet. */
    defaultExpanded?: boolean;
}
/** Docking side of the chat panel. */
export type ChatSidebarPosition = 'start' | 'end';
/**
 * The persisted slice of the panel state — exactly what travels to the server
 * as `IUserUiPreferences.aiChat` and what the local mirror keeps per user.
 * `detachedView` is deliberately NOT part of it (it describes the window, not
 * the user's preference).
 */
export type IChatSidebarState = {
    expanded: boolean;
    position: ChatSidebarPosition;
    width: number;
    maximized: boolean;
};
export declare const MIN_CHAT_WIDTH = 300;
export declare const MAX_CHAT_WIDTH = 860;
/**
 * Router path of the standalone ("detached") chat window.
 *
 * It is registered at the app root (see `apps/gauzy/src/app/app.routes.ts`)
 * rather than through the page route registry: every registry location is a
 * child of `/pages`, which renders the `PagesComponent` shell (nav menu
 * sidebar + header + footer), and the detached window must show the chat
 * alone.
 */
export declare const CHAT_DETACHED_WINDOW_PATH = "/ai-chat/window";
/**
 * ChatSidebarService
 *
 * Manages the dedicated chat sidebar slot in the layout.
 * Decoupled from `NavigationBuilderService` which handles
 * the right-side dynamic sidebars (changelog, settings, etc.).
 *
 * Plugins register a chat sidebar component via `register()`.
 * The layout template reads `config()` to conditionally render
 * the sidebar between the menu sidebar and main content, and
 * `expanded()` to drive its collapse/expand state.
 *
 * STATE PERSISTENCE (per user, across browsers) — precedence on every apply:
 *   1. server state — `Store.user.uiPreferences.aiChat` (what `GET /user/me`
 *      returned, or what the last write merged), field by field;
 *   2. local mirror — per-user localStorage keys (legacy un-keyed keys as a
 *      one-time fallback), used for first paint and while offline;
 *   3. defaults — `IChatSidebarConfig.defaultExpanded`, 'start', 384px, not maximized.
 * Every user-driven change updates the signals at once, mirrors to
 * localStorage, and (debounced) PUTs `{ aiChat }` to `/user/ui-preferences`,
 * fire-and-forget; the merged result is written back into `Store.user` so the
 * next `user$` emission agrees with what the panel shows.
 */
export declare class ChatSidebarService {
    /** The registered chat sidebar config (null if not registered). */
    readonly config: import("@angular/core").WritableSignal<IChatSidebarConfig>;
    /** Whether the chat sidebar is currently expanded. */
    readonly expanded: import("@angular/core").WritableSignal<boolean>;
    /**
     * Which side of the content the chat docks to:
     * 'start' → `Menu | Chat | Canvas`, 'end' → `Menu | Canvas | Chat`.
     */
    readonly position: import("@angular/core").WritableSignal<ChatSidebarPosition>;
    /** Chat panel width in pixels (user-resizable, persisted). */
    readonly width: import("@angular/core").WritableSignal<number>;
    /**
     * Maximized: the chat fills all space except the nav menu sidebar
     * (`Menu | Chat`); the canvas is hidden (kept alive) until restored.
     */
    readonly maximized: import("@angular/core").WritableSignal<boolean>;
    /**
     * Whether the chat is available for the current user — set by the
     * registering plugin once it has checked the user's permission and
     * the backend configuration (`GET /api/ai-chat/config`). The layout
     * and header render the chat sidebar/toggle only when this is true.
     */
    readonly available: import("@angular/core").WritableSignal<boolean>;
    /**
     * True only inside the detached chat window (the standalone
     * `/ai-chat/window` route sets it). The panel then drops the controls that
     * describe a docked panel — dock side, maximize, collapse, detach and the
     * drag-to-resize grip — because there is no layout around it any more.
     */
    readonly detachedView: import("@angular/core").WritableSignal<boolean>;
    /** Handle to the detached chat window, so a second detach focuses it. */
    private detachedWindow;
    /** Angular's Location — used to build the detached window's external URL. */
    private readonly location;
    /** App store — source of the current user (and its server-side `uiPreferences`). */
    private readonly store;
    /** API client for `PUT /user/ui-preferences`. */
    private readonly usersService;
    /** Id of the user whose state the signals currently reflect (null before login). */
    private userId;
    /**
     * The last state known to be on the server for `userId` — what we applied
     * from `user.uiPreferences.aiChat` or what the last successful write
     * returned. `null` = the server has nothing for this user yet. Used to
     * skip writes that would change nothing.
     */
    private serverState;
    /** True while incoming (server / mirror) state is being applied — no writes then. */
    private applying;
    /** Pending debounced server write. */
    private persistTimer;
    /** Pending debounced width persist (drag-resize calls setWidth per pointermove). */
    private widthPersistTimer;
    constructor();
    /** Update chat availability (permission + backend configuration). */
    setAvailable(available: boolean): void;
    /**
     * Register a component to render in the chat sidebar slot and apply the
     * persisted state (server > local mirror > config defaults).
     *
     * @param sidebarConfig - Configuration for the chat sidebar.
     * @throws Error if a chat sidebar is already registered.
     */
    register(sidebarConfig: IChatSidebarConfig): void;
    /**
     * Unregister the chat sidebar (e.g. on plugin teardown).
     */
    unregister(): void;
    /** Toggle the sidebar between expanded and collapsed. */
    toggle(): void;
    /** Expand the sidebar. */
    expand(): void;
    /** Collapse the sidebar. */
    collapse(): void;
    /**
     * Set the expand state and persist the user's preference.
     * Collapsing always leaves maximized mode.
     */
    setExpanded(expanded: boolean): void;
    /** Maximize the chat (`Menu | Chat`) or restore it to its normal width. */
    toggleMaximized(): void;
    /**
     * Open the chat in its own browser window (so it can live on a second
     * monitor) and close the docked panel, so the same conversation is never
     * running in two places at once.
     *
     * If the popup is blocked the docked panel is left open — otherwise the
     * chat would simply disappear with nothing to replace it.
     */
    detach(): void;
    /**
     * Set the chat panel width (px), clamped to sane bounds and persisted.
     * The signal updates immediately (live resize); the localStorage write
     * is debounced so a 60 Hz drag doesn't do synchronous I/O per frame, and
     * the server write is debounced on top of that.
     */
    setWidth(width: number): void;
    /** Move the chat to the other side of the content column and persist. */
    togglePosition(): void;
    /** Dock the chat to 'start' (left of the canvas) or 'end' (right). */
    setPosition(position: ChatSidebarPosition): void;
    /** Snapshot of the persisted slice of the current state. */
    snapshot(): IChatSidebarState;
    /**
     * `Store.user$` handler. Re-applies the state whenever a DIFFERENT user
     * appears (login / user switch on the same browser) or when the user
     * object carries server state — a `user$` emission without `aiChat` for
     * the same user (e.g. a profile edit) changes nothing.
     */
    private onUser;
    /** Extracts a validated `aiChat` slice from the user object, or null when absent. */
    private readRemote;
    /**
     * Resolves and applies the effective state, field by field:
     * server (`remote`) > local mirror > defaults. Writes nothing to the
     * server; the local mirror is refreshed to what was applied.
     */
    private applyState;
    /** Debounce a fire-and-forget server write of the current state. */
    private schedulePersist;
    /** Drop any pending server write (the width MIRROR timer keeps running — its write must land). */
    private cancelPersist;
    /** Teardown / user switch: nothing may fire afterwards, the width mirror timer included. */
    private cancelAllTimers;
    /**
     * PUT the current state to `/user/ui-preferences` if it differs from what
     * the server is known to hold, then mirror the merged result into
     * `Store.user.uiPreferences` (so the next `user$` emission does not revert
     * the panel). Failures are logged and swallowed — the panel must never break
     * because a preference could not be saved.
     */
    private persistNow;
    /** True when every field present in `b` equals the corresponding field in `a`. */
    private sameState;
    /** Per-user key when a user is known, legacy un-keyed key otherwise. */
    private storageKey;
    /** Write one field of the local mirror; storage failures are ignored (private mode / SSR). */
    private writeStored;
    /**
     * Read one field of the local mirror: the per-user key first, then — for
     * users who used the panel before it became per-user — the legacy un-keyed
     * key. Null when neither exists or storage is unavailable.
     */
    private readStored;
    /** Read the mirrored expand state; null when never set. */
    private readStoredExpanded;
    /** Read the mirrored maximized state; null when never set. */
    private readStoredMaximized;
    /** Read the mirrored width; null when never set or out of bounds. */
    private readStoredWidth;
    /** Read the mirrored docking side; null when never set. */
    private readStoredPosition;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChatSidebarService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ChatSidebarService>;
}
