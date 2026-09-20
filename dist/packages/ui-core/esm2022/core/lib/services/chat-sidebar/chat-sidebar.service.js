import { inject, Injectable, signal } from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '../store/store.service';
import { UsersService } from '../users/users.service';
import * as i0 from "@angular/core";
/**
 * localStorage key prefix. Two generations of keys exist:
 * - legacy, un-keyed (`gauzy_chat_sidebar_expanded` ...) — written before the
 *   state was per user; still READ as a fallback so existing users keep their
 *   state the first time they log in after the upgrade;
 * - per user (`gauzy_chat_sidebar_<userId>_expanded` ...) — the fast local
 *   mirror used for first paint and when the server has nothing yet. Keyed by
 *   user id so two accounts on one browser never see each other's layout.
 */
const CHAT_SIDEBAR_STORAGE_PREFIX = 'gauzy_chat_sidebar';
/** Field name → storage suffix. */
const STORAGE_SUFFIX = {
    expanded: 'expanded',
    position: 'position',
    width: 'width',
    maximized: 'maximized'
};
/** Default / minimum / maximum chat panel width (px). */
const DEFAULT_CHAT_WIDTH = 384;
export const MIN_CHAT_WIDTH = 300;
export const MAX_CHAT_WIDTH = 860;
/** Delay between the last state change and the server write. */
const PERSIST_DEBOUNCE_MS = 600;
/**
 * Router path of the standalone ("detached") chat window.
 *
 * It is registered at the app root (see `apps/gauzy/src/app/app.routes.ts`)
 * rather than through the page route registry: every registry location is a
 * child of `/pages`, which renders the `PagesComponent` shell (nav menu
 * sidebar + header + footer), and the detached window must show the chat
 * alone.
 */
export const CHAT_DETACHED_WINDOW_PATH = '/ai-chat/window';
/**
 * `window.open` target name. A constant (not `_blank`) so re-opening reuses
 * the same window instead of stacking one popup per click.
 */
const CHAT_DETACHED_WINDOW_NAME = 'gauzy-ai-chat';
/**
 * `window.open` features: a resizable popup roughly the width of the docked
 * panel and tall enough to hold a conversation, which the user can then drag
 * onto another monitor.
 */
const CHAT_DETACHED_WINDOW_FEATURES = 'popup=yes,resizable=yes,scrollbars=yes,width=460,height=860';
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
export class ChatSidebarService {
    constructor() {
        /** The registered chat sidebar config (null if not registered). */
        this.config = signal(null, ...(ngDevMode ? [{ debugName: "config" }] : []));
        /** Whether the chat sidebar is currently expanded. */
        this.expanded = signal(false, ...(ngDevMode ? [{ debugName: "expanded" }] : []));
        /**
         * Which side of the content the chat docks to:
         * 'start' → `Menu | Chat | Canvas`, 'end' → `Menu | Canvas | Chat`.
         */
        this.position = signal('start', ...(ngDevMode ? [{ debugName: "position" }] : []));
        /** Chat panel width in pixels (user-resizable, persisted). */
        this.width = signal(DEFAULT_CHAT_WIDTH, ...(ngDevMode ? [{ debugName: "width" }] : []));
        /**
         * Maximized: the chat fills all space except the nav menu sidebar
         * (`Menu | Chat`); the canvas is hidden (kept alive) until restored.
         */
        this.maximized = signal(false, ...(ngDevMode ? [{ debugName: "maximized" }] : []));
        /**
         * Whether the chat is available for the current user — set by the
         * registering plugin once it has checked the user's permission and
         * the backend configuration (`GET /api/ai-chat/config`). The layout
         * and header render the chat sidebar/toggle only when this is true.
         */
        this.available = signal(false, ...(ngDevMode ? [{ debugName: "available" }] : []));
        /**
         * True only inside the detached chat window (the standalone
         * `/ai-chat/window` route sets it). The panel then drops the controls that
         * describe a docked panel — dock side, maximize, collapse, detach and the
         * drag-to-resize grip — because there is no layout around it any more.
         */
        this.detachedView = signal(false, ...(ngDevMode ? [{ debugName: "detachedView" }] : []));
        /** Handle to the detached chat window, so a second detach focuses it. */
        this.detachedWindow = null;
        /** Angular's Location — used to build the detached window's external URL. */
        this.location = inject(Location);
        /** App store — source of the current user (and its server-side `uiPreferences`). */
        this.store = inject(Store);
        /** API client for `PUT /user/ui-preferences`. */
        this.usersService = inject(UsersService);
        /** Id of the user whose state the signals currently reflect (null before login). */
        this.userId = null;
        /**
         * The last state known to be on the server for `userId` — what we applied
         * from `user.uiPreferences.aiChat` or what the last successful write
         * returned. `null` = the server has nothing for this user yet. Used to
         * skip writes that would change nothing.
         */
        this.serverState = null;
        /** True while incoming (server / mirror) state is being applied — no writes then. */
        this.applying = false;
        /** Pending debounced server write. */
        this.persistTimer = null;
        /** Pending debounced width persist (drag-resize calls setWidth per pointermove). */
        this.widthPersistTimer = null;
        // Root-scoped service: lives as long as the app, so no teardown needed.
        this.store.user$?.subscribe((user) => this.onUser(user));
    }
    /** Update chat availability (permission + backend configuration). */
    setAvailable(available) {
        this.available.set(available);
    }
    /**
     * Register a component to render in the chat sidebar slot and apply the
     * persisted state (server > local mirror > config defaults).
     *
     * @param sidebarConfig - Configuration for the chat sidebar.
     * @throws Error if a chat sidebar is already registered.
     */
    register(sidebarConfig) {
        if (this.config()) {
            throw new Error('A chat sidebar is already registered. Only one chat sidebar is supported.');
        }
        this.config.set(sidebarConfig);
        this.applyState(this.serverState);
    }
    /**
     * Unregister the chat sidebar (e.g. on plugin teardown).
     */
    unregister() {
        this.cancelAllTimers();
        this.config.set(null);
        this.expanded.set(false);
        this.maximized.set(false);
    }
    /** Toggle the sidebar between expanded and collapsed. */
    toggle() {
        this.setExpanded(!this.expanded());
    }
    /** Expand the sidebar. */
    expand() {
        this.setExpanded(true);
    }
    /** Collapse the sidebar. */
    collapse() {
        this.setExpanded(false);
    }
    /**
     * Set the expand state and persist the user's preference.
     * Collapsing always leaves maximized mode.
     */
    setExpanded(expanded) {
        this.expanded.set(expanded);
        if (!expanded) {
            this.maximized.set(false);
            this.writeStored('maximized', 'false');
        }
        this.writeStored('expanded', String(expanded));
        this.schedulePersist();
    }
    /** Maximize the chat (`Menu | Chat`) or restore it to its normal width. */
    toggleMaximized() {
        this.maximized.set(!this.maximized());
        if (this.maximized()) {
            this.expanded.set(true);
            this.writeStored('expanded', 'true');
        }
        this.writeStored('maximized', String(this.maximized()));
        this.schedulePersist();
    }
    /**
     * Open the chat in its own browser window (so it can live on a second
     * monitor) and close the docked panel, so the same conversation is never
     * running in two places at once.
     *
     * If the popup is blocked the docked panel is left open — otherwise the
     * chat would simply disappear with nothing to replace it.
     */
    detach() {
        if (typeof window === 'undefined') {
            return;
        }
        if (this.detachedWindow && !this.detachedWindow.closed) {
            this.detachedWindow.focus();
        }
        else {
            // `prepareExternalUrl` applies both the base href and the app's
            // hash location strategy (`useHash: true` in app.module.ts), so the
            // popup opens `/#/ai-chat/window` and survives a manual reload.
            const url = this.location.prepareExternalUrl(CHAT_DETACHED_WINDOW_PATH);
            this.detachedWindow = window.open(url, CHAT_DETACHED_WINDOW_NAME, CHAT_DETACHED_WINDOW_FEATURES);
        }
        if (this.detachedWindow) {
            this.collapse();
        }
    }
    /**
     * Set the chat panel width (px), clamped to sane bounds and persisted.
     * The signal updates immediately (live resize); the localStorage write
     * is debounced so a 60 Hz drag doesn't do synchronous I/O per frame, and
     * the server write is debounced on top of that.
     */
    setWidth(width) {
        const clamped = Math.round(Math.min(MAX_CHAT_WIDTH, Math.max(MIN_CHAT_WIDTH, width)));
        this.width.set(clamped);
        if (this.widthPersistTimer !== null) {
            clearTimeout(this.widthPersistTimer);
        }
        this.widthPersistTimer = setTimeout(() => {
            this.widthPersistTimer = null;
            this.writeStored('width', String(this.width()));
            this.schedulePersist();
        }, 250);
    }
    /** Move the chat to the other side of the content column and persist. */
    togglePosition() {
        this.setPosition(this.position() === 'start' ? 'end' : 'start');
    }
    /** Dock the chat to 'start' (left of the canvas) or 'end' (right). */
    setPosition(position) {
        this.position.set(position);
        this.writeStored('position', position);
        this.schedulePersist();
    }
    /** Snapshot of the persisted slice of the current state. */
    snapshot() {
        return {
            expanded: this.expanded(),
            position: this.position(),
            width: this.width(),
            maximized: this.maximized()
        };
    }
    /*
    |--------------------------------------------------------------------------
    | Incoming state (server / local mirror)
    |--------------------------------------------------------------------------
    */
    /**
     * `Store.user$` handler. Re-applies the state whenever a DIFFERENT user
     * appears (login / user switch on the same browser) or when the user
     * object carries server state — a `user$` emission without `aiChat` for
     * the same user (e.g. a profile edit) changes nothing.
     */
    onUser(user) {
        const nextUserId = user?.id ? String(user.id) : null;
        const userChanged = nextUserId !== this.userId;
        const remote = this.readRemote(user);
        if (userChanged) {
            // Never carry a pending write (or a "known server state") across users.
            this.cancelAllTimers();
            this.userId = nextUserId;
            this.serverState = remote;
            if (this.config()) {
                this.applyState(remote);
            }
            return;
        }
        if (remote && !this.sameState(remote, this.serverState)) {
            this.serverState = remote;
            if (this.config()) {
                this.applyState(remote);
            }
        }
    }
    /** Extracts a validated `aiChat` slice from the user object, or null when absent. */
    readRemote(user) {
        const raw = user?.uiPreferences?.aiChat;
        if (!raw || typeof raw !== 'object') {
            return null;
        }
        const remote = {};
        if (typeof raw.expanded === 'boolean')
            remote.expanded = raw.expanded;
        if (raw.position === 'start' || raw.position === 'end')
            remote.position = raw.position;
        if (typeof raw.width === 'number' && raw.width >= MIN_CHAT_WIDTH && raw.width <= MAX_CHAT_WIDTH) {
            remote.width = Math.round(raw.width);
        }
        if (typeof raw.maximized === 'boolean')
            remote.maximized = raw.maximized;
        return Object.keys(remote).length ? remote : null;
    }
    /**
     * Resolves and applies the effective state, field by field:
     * server (`remote`) > local mirror > defaults. Writes nothing to the
     * server; the local mirror is refreshed to what was applied.
     */
    applyState(remote) {
        const defaults = {
            expanded: this.config()?.defaultExpanded ?? false,
            position: 'start',
            width: DEFAULT_CHAT_WIDTH,
            maximized: false
        };
        const local = {
            expanded: this.readStoredExpanded() ?? undefined,
            position: this.readStoredPosition() ?? undefined,
            width: this.readStoredWidth() ?? undefined,
            maximized: this.readStoredMaximized() ?? undefined
        };
        const next = {
            expanded: remote?.expanded ?? local.expanded ?? defaults.expanded,
            position: remote?.position ?? local.position ?? defaults.position,
            width: remote?.width ?? local.width ?? defaults.width,
            maximized: remote?.maximized ?? local.maximized ?? defaults.maximized
        };
        // Maximized implies expanded; collapsed implies not maximized.
        if (next.maximized)
            next.expanded = true;
        if (!next.expanded)
            next.maximized = false;
        this.applying = true;
        try {
            this.expanded.set(next.expanded);
            this.position.set(next.position);
            this.width.set(next.width);
            this.maximized.set(next.maximized);
            this.writeStored('expanded', String(next.expanded));
            this.writeStored('position', next.position);
            this.writeStored('width', String(next.width));
            this.writeStored('maximized', String(next.maximized));
        }
        finally {
            this.applying = false;
        }
    }
    /*
    |--------------------------------------------------------------------------
    | Outgoing state (server write)
    |--------------------------------------------------------------------------
    */
    /** Debounce a fire-and-forget server write of the current state. */
    schedulePersist() {
        if (this.applying || !this.userId) {
            return;
        }
        this.cancelPersist();
        this.persistTimer = setTimeout(() => {
            this.persistTimer = null;
            void this.persistNow();
        }, PERSIST_DEBOUNCE_MS);
    }
    /** Drop any pending server write (the width MIRROR timer keeps running — its write must land). */
    cancelPersist() {
        if (this.persistTimer !== null) {
            clearTimeout(this.persistTimer);
            this.persistTimer = null;
        }
    }
    /** Teardown / user switch: nothing may fire afterwards, the width mirror timer included. */
    cancelAllTimers() {
        this.cancelPersist();
        if (this.widthPersistTimer !== null) {
            clearTimeout(this.widthPersistTimer);
            this.widthPersistTimer = null;
        }
    }
    /**
     * PUT the current state to `/user/ui-preferences` if it differs from what
     * the server is known to hold, then mirror the merged result into
     * `Store.user.uiPreferences` (so the next `user$` emission does not revert
     * the panel). Failures are logged and swallowed — the panel must never break
     * because a preference could not be saved.
     */
    async persistNow() {
        const userId = this.userId;
        if (!userId) {
            return;
        }
        const state = this.snapshot();
        if (this.sameState(state, this.serverState)) {
            return;
        }
        try {
            const merged = await this.usersService.updateUiPreferences({ aiChat: state });
            // The user may have changed while the request was in flight.
            if (this.userId !== userId) {
                return;
            }
            this.serverState = { ...state };
            const current = this.store.user;
            if (current && String(current.id) === userId) {
                const uiPreferences = merged && typeof merged === 'object' ? merged : { ...current.uiPreferences, aiChat: state };
                this.store.user = { ...current, uiPreferences };
            }
        }
        catch (error) {
            console.warn('[ChatSidebarService] Could not persist chat panel state:', error);
        }
    }
    /** True when every field present in `b` equals the corresponding field in `a`. */
    sameState(a, b) {
        if (!a || !b) {
            return false;
        }
        return (a.expanded === b.expanded && a.position === b.position && a.width === b.width && a.maximized === b.maximized);
    }
    /*
    |--------------------------------------------------------------------------
    | Local mirror (localStorage)
    |--------------------------------------------------------------------------
    */
    /** Per-user key when a user is known, legacy un-keyed key otherwise. */
    storageKey(field, userId = this.userId) {
        const suffix = STORAGE_SUFFIX[field];
        return userId
            ? `${CHAT_SIDEBAR_STORAGE_PREFIX}_${userId}_${suffix}`
            : `${CHAT_SIDEBAR_STORAGE_PREFIX}_${suffix}`;
    }
    /** Write one field of the local mirror; storage failures are ignored (private mode / SSR). */
    writeStored(field, value) {
        try {
            localStorage.setItem(this.storageKey(field), value);
        }
        catch {
            // Storage unavailable — state stays in-memory only.
        }
    }
    /**
     * Read one field of the local mirror: the per-user key first, then — for
     * users who used the panel before it became per-user — the legacy un-keyed
     * key. Null when neither exists or storage is unavailable.
     */
    readStored(field) {
        try {
            const keyed = localStorage.getItem(this.storageKey(field));
            if (keyed !== null) {
                return keyed;
            }
            if (!this.userId) {
                return null;
            }
            // One-time migration: the FIRST signed-in user inherits the pre-per-user value and the
            // legacy key is consumed, so later accounts on this browser start from their own state
            // (server, then defaults) instead of inheriting a stranger's layout.
            const legacyKey = this.storageKey(field, null);
            const legacy = localStorage.getItem(legacyKey);
            if (legacy !== null) {
                localStorage.setItem(this.storageKey(field), legacy);
                localStorage.removeItem(legacyKey);
            }
            return legacy;
        }
        catch {
            return null;
        }
    }
    /** Read the mirrored expand state; null when never set. */
    readStoredExpanded() {
        const stored = this.readStored('expanded');
        return stored === null ? null : stored === 'true';
    }
    /** Read the mirrored maximized state; null when never set. */
    readStoredMaximized() {
        const stored = this.readStored('maximized');
        return stored === null ? null : stored === 'true';
    }
    /** Read the mirrored width; null when never set or out of bounds. */
    readStoredWidth() {
        const stored = this.readStored('width');
        if (stored === null) {
            return null;
        }
        const value = Number(stored);
        return Number.isFinite(value) && value >= MIN_CHAT_WIDTH && value <= MAX_CHAT_WIDTH ? value : null;
    }
    /** Read the mirrored docking side; null when never set. */
    readStoredPosition() {
        const stored = this.readStored('position');
        return stored === 'start' || stored === 'end' ? stored : null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ChatSidebarService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ChatSidebarService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ChatSidebarService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=chat-sidebar.service.js.map