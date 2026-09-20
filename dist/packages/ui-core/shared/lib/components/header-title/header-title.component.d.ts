import { AfterViewInit, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { IOrganization, ISelectedEmployee, PermissionsEnum } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class HeaderTitleComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly store;
    private readonly crd;
    /**
     * The title currently rendering the breadcrumb trail.
     *
     * A page may nest titles (a layout title around an embedded page that carries
     * its own — `ga-invites` inside the users page, for instance), and two trails
     * on one screen is worse than none. `ngOnInit` runs outermost-first, so the
     * page-level title claims the trail and any nested one stays quiet.
     */
    private static trailOwner;
    /** Headings this component may be nested in — the trail is parked right after one. */
    private static readonly HEADING_SELECTOR;
    /** Marks the flex row holding the heading so it is allowed to wrap. */
    private static readonly HEADING_ROW_CLASS;
    /** Marks the card header whose title and action row are laid out as one line. */
    private static readonly PAGE_HEADER_CLASS;
    /** Marks the block inside that header which carries the title and the trail. */
    private static readonly PAGE_HEADER_MAIN_CLASS;
    PermissionsEnum: typeof PermissionsEnum;
    organization: IOrganization;
    employee: ISelectedEmployee;
    /** True when this instance is the one rendering the breadcrumb trail. */
    ownsTrail: boolean;
    private readonly trailRef?;
    private readonly elementRef;
    private readonly renderer;
    /** Element the trail was moved into, so it can be detached again on destroy. */
    private trailHost;
    /** Card header marked as a one-line page header, so the mark can be undone. */
    private pageHeader;
    /** Block inside it marked as the title side of that line. */
    private pageHeaderMain;
    /**
     * Watches this title for becoming visible, so a trail stranded in a hidden
     * subtree can be taken over. See `claimTrailIfOrphaned`.
     */
    private visibilityObserver;
    _allowEmployee: boolean;
    get allowEmployee(): boolean;
    set allowEmployee(value: boolean);
    /**
     * Whether the "for <Organization>" suffix renders after the title. Defaults to true — most
     * pages show org-scoped data. Product-level pages (About, Help) opt out: their content has
     * nothing to do with the selected organization, and the suffix read as a mistake there.
     */
    _allowOrganization: boolean;
    get allowOrganization(): boolean;
    set allowOrganization(value: boolean);
    constructor(store: Store, crd: ChangeDetectorRef);
    /**
     * Claims the breadcrumb trail (unless an outer title already holds it) and
     * tracks the selected organization / employee named in the title.
     */
    ngOnInit(): void;
    /**
     * Moves the trail out of the heading it would otherwise be nested inside.
     */
    ngAfterViewInit(): void;
    /**
     * Starts watching for this title becoming visible.
     *
     * Ownership is claimed once, in `ngOnInit`, which is correct for a page whose
     * titles are all live at once — but not for a tabset. `gz-dynamic-tabs` creates
     * every tab's content up front and Nebular hides the inactive ones with
     * `display: none`, so on the dashboard the first tab ("Teams") claims the trail
     * and then takes it into a hidden subtree the moment another tab is selected,
     * leaving that tab with no breadcrumbs at all. `isConnected` does not catch this:
     * a `display: none` element is still connected.
     *
     * An observer is used rather than a check on each change-detection pass because
     * every way of asking "is this visible" forces layout; this way the question is
     * only asked when the browser reports the element actually came into view.
     */
    private observeVisibility;
    /**
     * Takes the trail over when the current owner is gone or is no longer rendered.
     *
     * Runs from the observer callback — outside change detection — so the view can
     * be updated and the trail re-parked synchronously.
     */
    private claimTrailIfOrphaned;
    /** Whether this title currently generates boxes (false under `display: none`). */
    private isRendered;
    /**
     * Gives up the trail, detaching the relocated element so it does not linger in
     * the old host once another title renders its own.
     */
    private releaseTrail;
    /**
     * Releases the trail and detaches the relocated element — it lives outside
     * this component's host, so Angular's view destruction would leave it behind.
     */
    ngOnDestroy(): void;
    /**
     * Marks the card header so the page action row can share the title's line.
     *
     * Pages render that header as a stack: a block holding the `<h4>` (with the
     * relocated trail under it), then a second block whose only content is the
     * action buttons pinned to its right edge. That second block is empty across
     * its whole width and costs the table below it about four rem of height, so
     * the two are marked here and laid out as one row by the `.ga-page-header`
     * rule in `styles/_overrides.scss`. Marking happens from this component
     * because the ~45 page templates involved share no wrapper class for them.
     */
    private markPageHeader;
    /**
     * The card header's own child that `node` sits inside, or null when `node` is
     * that child itself — i.e. when the page gave the heading no wrapper.
     */
    private headerChildContaining;
    /** Undoes `markPageHeader` — the marks live outside this component's view. */
    private clearPageHeaderMarks;
    /**
     * Removes the relocated trail from the host it was parked in. It lives outside
     * this component's view, so Angular's own teardown would leave it behind.
     */
    private detachTrail;
    /**
     * Parks the breadcrumb trail immediately after the heading that wraps this
     * component, as a sibling block.
     *
     * Every call site writes `<h4><ngx-header-title>…</ngx-header-title></h4>`,
     * and a heading may only contain phrasing content: rendering the trail's
     * `<nav><ol>` in place would be invalid HTML *and* would fold the crumb text
     * into the heading's accessible name ("Expenses for Acme Dashboards
     * Accounting Expenses, heading level 4"). Moving the element leaves the
     * Angular view — and therefore change detection — untouched.
     */
    private relocateTrail;
    static ɵfac: i0.ɵɵFactoryDeclaration<HeaderTitleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<HeaderTitleComponent, "ngx-header-title", never, { "allowEmployee": { "alias": "allowEmployee"; "required": false; }; "allowOrganization": { "alias": "allowOrganization"; "required": false; }; }, {}, never, ["*"], false, never>;
}
