import { Signal } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * One rendered level of the breadcrumb trail.
 */
export interface IBreadcrumb {
    /** Translated, human readable label. */
    label: string;
    /** Absolute router link, or `null` when this level has no navigable route. */
    link: string | null;
    /** Optional icon rendered instead of the label (the "home" crumb). */
    icon?: string;
}
/**
 * Breadcrumb trail for the current route.
 *
 * Labels are resolved from the navigation menu tree instead of the raw URL, so every
 * crumb shows the same translated wording as the sidebar. Mounted once by
 * `ngx-header-title`, which gives every page carrying a page title a trail without
 * touching page templates. When the URL has no navigation menu entry the trail falls
 * back to the URL segments, so a page never renders an empty nav.
 */
export declare class BreadcrumbComponent {
    /** Application home — `/pages` redirects here. */
    private static readonly HOME_LINK;
    /** Segments that are record identifiers (uuid / numeric): they carry no readable meaning. */
    private static readonly ID_SEGMENT;
    /**
     * Menu sections skipped while matching. "Favorites" mirrors links that already live
     * elsewhere in the tree, so a page marked as favorite would otherwise win the match and render
     * as "Favorites / …" instead of its real place in the hierarchy.
     */
    private static readonly IGNORED_SECTION_IDS;
    /** Namespaces probed (in order) when a URL segment has no navigation menu entry. */
    private static readonly SEGMENT_TRANSLATION_NAMESPACES;
    private readonly _router;
    private readonly _navMenuBuilderService;
    private readonly _translateService;
    private readonly _breadcrumbTailService;
    /** Current URL, tracked across navigations. */
    private readonly _url;
    /**
     * Navigation menu tree — the source of translated, hierarchy-aware labels.
     *
     * A broken menu must not take the page title down with it: the trail degrades to
     * its URL-derived fallback instead (the sidebar treats menu errors the same way).
     */
    private readonly _menu;
    /**
     * Emits whenever the resolved translations change so the trail can be re-translated
     * in place.
     *
     * `onLangChange` alone is not enough: the trail is built during the first paint,
     * which regularly happens BEFORE the i18n bundle has finished loading. Every label
     * then falls back to the menu item's hard-coded English `title` and, with no further
     * language change, stays English for the rest of the session. `onTranslationChange`
     * (bundle loaded / extended) and `onDefaultLangChange` close that window.
     */
    private readonly _language;
    /** The trail for the current route, outermost level first. */
    readonly breadcrumbs: Signal<IBreadcrumb[]>;
    /**
     * Builds the breadcrumb trail for a URL.
     *
     * @param url Current router URL — may carry a query string, fragment or matrix params.
     * @param sections Navigation menu sections as defined by the menu builder.
     * @param tailKeys i18n keys for levels the current page entered without navigating.
     * @returns The ordered trail; empty outside the `/pages` shell.
     */
    private buildTrail;
    /**
     * Maps the page-supplied tail keys to crumbs.
     *
     * They address a state of the page rather than a route, so they are never links.
     *
     * @param keys i18n keys, outermost level first.
     * @returns The crumbs, falling back to a humanized key when the translation is missing.
     */
    private tailCrumbs;
    /**
     * Checks whether a path is the application home itself.
     *
     * @param path Normalized URL path.
     * @returns True for `/pages` and for the route the home crumb points at.
     */
    private isHomePath;
    /**
     * Finds the deepest navigation menu item whose link is an ancestor of (or equal to) the path.
     *
     * @param path Normalized URL path.
     * @param sections Navigation menu sections to search.
     * @returns The matched item together with its ancestor sections, or `null` when nothing matches.
     */
    private findDeepestMatch;
    /**
     * Walks the menu tree and collects every item whose link covers the path.
     *
     * @param path Normalized URL path.
     * @param items Menu items at the current level.
     * @param ancestors Sections walked through to reach `items`.
     * @returns All matching items, in tree order.
     */
    private collectMatches;
    /**
     * Ranks a match by how much of the path its link accounts for.
     *
     * @param match Candidate match.
     * @returns The comparable score — the number of segments the link covers.
     */
    private matchScore;
    /**
     * Builds crumbs for the URL segments left over after the matched menu link.
     *
     * These levels are deliberately not links: nothing guarantees an intermediate URL
     * resolves to a route (`/pages/employees/edit` on its own is a 404), and a dead
     * crumb is worse than a plain one.
     *
     * @param path Normalized URL path.
     * @param basePath The already-covered prefix of the path.
     * @returns Crumbs for the remaining, meaningful segments.
     */
    private segmentCrumbs;
    /**
     * Removes empty and repeated levels and marks the last crumb as the current page.
     *
     * @param crumbs Raw trail.
     * @returns The trail ready for rendering.
     */
    private finalize;
    /**
     * Maps a navigation menu item to a crumb.
     *
     * @param item Navigation menu item.
     * @returns The crumb, linked only when the menu item itself defines a route.
     */
    private toCrumb;
    /**
     * The root crumb, pointing at the application home.
     *
     * @returns The home crumb.
     */
    private homeCrumb;
    /**
     * Resolves a readable label for a URL segment that has no navigation menu entry.
     *
     * @param segment Raw URL segment (e.g. `edit`, `expense-recurring`).
     * @returns A translated label when a matching i18n key exists, a humanized segment otherwise.
     */
    private labelForSegment;
    /**
     * Translates a key, treating "missing" as absent.
     *
     * @param key i18n key.
     * @returns The translation, or `null` when the key is unknown (ngx-translate echoes the key back)
     *          or resolves to a namespace object rather than a string.
     */
    private translateOrNull;
    /**
     * Turns a URL segment into title case words.
     *
     * @param segment Raw URL segment.
     * @returns The humanized text (`expense-recurring` → `Expense Recurring`).
     */
    private humanize;
    /**
     * Strips the query string, fragment, matrix params and any trailing slash from a URL.
     *
     * @param url Router URL or menu link.
     * @returns The bare path.
     */
    private toPath;
    /**
     * Checks whether a link addresses the path itself or one of its ancestors, comparing
     * whole segments so `/pages/tag` never matches `/pages/tags`.
     *
     * @param link Candidate ancestor path.
     * @param path Current path.
     * @returns True when `link` is `path` or a segment-aligned prefix of it.
     */
    private isAncestorPath;
    static ɵfac: i0.ɵɵFactoryDeclaration<BreadcrumbComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BreadcrumbComponent, "ngx-breadcrumbs", never, {}, {}, never, never, false, never>;
}
