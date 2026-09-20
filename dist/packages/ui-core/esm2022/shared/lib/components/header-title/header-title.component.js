var HeaderTitleComponent_1;
import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewChild, inject } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { PermissionsEnum } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "ngx-permissions";
import * as i3 from "../breadcrumb/breadcrumb.component";
import * as i4 from "../../pipes/truncate.pipe";
import * as i5 from "@ngx-translate/core";
let HeaderTitleComponent = class HeaderTitleComponent {
    static { HeaderTitleComponent_1 = this; }
    /**
     * The title currently rendering the breadcrumb trail.
     *
     * A page may nest titles (a layout title around an embedded page that carries
     * its own — `ga-invites` inside the users page, for instance), and two trails
     * on one screen is worse than none. `ngOnInit` runs outermost-first, so the
     * page-level title claims the trail and any nested one stays quiet.
     */
    static { this.trailOwner = null; }
    /** Headings this component may be nested in — the trail is parked right after one. */
    static { this.HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6'; }
    /** Marks the flex row holding the heading so it is allowed to wrap. */
    static { this.HEADING_ROW_CLASS = 'ga-page-title-row'; }
    /** Marks the card header whose title and action row are laid out as one line. */
    static { this.PAGE_HEADER_CLASS = 'ga-page-header'; }
    /** Marks the block inside that header which carries the title and the trail. */
    static { this.PAGE_HEADER_MAIN_CLASS = 'ga-page-header-main'; }
    get allowEmployee() {
        return this._allowEmployee;
    }
    set allowEmployee(value) {
        this._allowEmployee = value;
    }
    get allowOrganization() {
        return this._allowOrganization;
    }
    set allowOrganization(value) {
        this._allowOrganization = value;
    }
    constructor(store, crd) {
        this.store = store;
        this.crd = crd;
        this.PermissionsEnum = PermissionsEnum;
        /** True when this instance is the one rendering the breadcrumb trail. */
        this.ownsTrail = false;
        this.elementRef = inject(ElementRef);
        this.renderer = inject(Renderer2);
        /** Element the trail was moved into, so it can be detached again on destroy. */
        this.trailHost = null;
        /** Card header marked as a one-line page header, so the mark can be undone. */
        this.pageHeader = null;
        /** Block inside it marked as the title side of that line. */
        this.pageHeaderMain = null;
        /**
         * Watches this title for becoming visible, so a trail stranded in a hidden
         * subtree can be taken over. See `claimTrailIfOrphaned`.
         */
        this.visibilityObserver = null;
        this._allowEmployee = true;
        /**
         * Whether the "for <Organization>" suffix renders after the title. Defaults to true — most
         * pages show org-scoped data. Product-level pages (About, Help) opt out: their content has
         * nothing to do with the selected organization, and the suffix read as a mistake there.
         */
        this._allowOrganization = true;
    }
    /**
     * Claims the breadcrumb trail (unless an outer title already holds it) and
     * tracks the selected organization / employee named in the title.
     */
    ngOnInit() {
        const owner = HeaderTitleComponent_1.trailOwner;
        // `isConnected` is the self-healing part: should an owner ever be dropped
        // without its ngOnDestroy running, the next title takes the trail over
        // rather than leaving every page without one.
        if (!owner || owner === this || !owner.elementRef.nativeElement.isConnected) {
            HeaderTitleComponent_1.trailOwner = this;
            this.ownsTrail = true;
        }
        const storeOrganization$ = this.store.selectedOrganization$.pipe(filter((organization) => !!organization));
        const storeEmployee$ = this.store.selectedEmployee$;
        combineLatest({ organization: storeOrganization$, employee: storeEmployee$ })
            .pipe(tap(({ organization, employee }) => {
            this.organization = organization;
            this.employee = employee;
            this.crd.detectChanges();
        }), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Moves the trail out of the heading it would otherwise be nested inside.
     */
    ngAfterViewInit() {
        this.relocateTrail();
        this.markPageHeader();
        this.observeVisibility();
    }
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
    observeVisibility() {
        if (typeof IntersectionObserver === 'undefined') {
            return;
        }
        this.visibilityObserver = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                this.claimTrailIfOrphaned();
            }
        });
        this.visibilityObserver.observe(this.elementRef.nativeElement);
    }
    /**
     * Takes the trail over when the current owner is gone or is no longer rendered.
     *
     * Runs from the observer callback — outside change detection — so the view can
     * be updated and the trail re-parked synchronously.
     */
    claimTrailIfOrphaned() {
        const owner = HeaderTitleComponent_1.trailOwner;
        if (owner === this) {
            return;
        }
        // A healthy owner keeps the trail; it is lost only by an owner that has been
        // detached, or one that no longer renders.
        if (owner && owner.elementRef.nativeElement.isConnected && owner.isRendered()) {
            return;
        }
        owner?.releaseTrail();
        HeaderTitleComponent_1.trailOwner = this;
        this.ownsTrail = true;
        // Render the trail element, then park it next to this title's heading.
        this.crd.detectChanges();
        this.relocateTrail();
    }
    /** Whether this title currently generates boxes (false under `display: none`). */
    isRendered() {
        return this.elementRef.nativeElement.getClientRects().length > 0;
    }
    /**
     * Gives up the trail, detaching the relocated element so it does not linger in
     * the old host once another title renders its own.
     */
    releaseTrail() {
        this.detachTrail();
        this.ownsTrail = false;
        this.crd.detectChanges();
    }
    /**
     * Releases the trail and detaches the relocated element — it lives outside
     * this component's host, so Angular's view destruction would leave it behind.
     */
    ngOnDestroy() {
        if (HeaderTitleComponent_1.trailOwner === this) {
            HeaderTitleComponent_1.trailOwner = null;
        }
        this.visibilityObserver?.disconnect();
        this.visibilityObserver = null;
        this.detachTrail();
        this.clearPageHeaderMarks();
    }
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
    markPageHeader() {
        const heading = this.elementRef.nativeElement.closest(HeaderTitleComponent_1.HEADING_SELECTOR);
        const header = heading?.closest('nb-card-header') ?? null;
        if (!heading || !header) {
            return;
        }
        // The title needs a block of its own to become the row's left-hand item.
        // Where the page dropped the heading straight into the card header there
        // is nothing to pair the buttons with, so that layout is left alone.
        const main = this.headerChildContaining(header, heading);
        if (!main) {
            return;
        }
        // Only a header that STACKS its children has a band to reclaim. One that
        // already runs as a row (`nb-card-header.card-header-title`, or a `d-flex`
        // without `flex-column`) places its children side by side on purpose, and
        // re-flowing it would push them onto separate lines instead.
        const { display, flexDirection } = getComputedStyle(header);
        if ((display === 'flex' || display === 'inline-flex') && flexDirection.startsWith('row')) {
            return;
        }
        // Nothing to lift. A page that grows an action row later keeps the layout
        // it has rather than a half-applied one.
        if (!header.querySelector('ngx-gauzy-button-action')) {
            return;
        }
        this.renderer.addClass(header, HeaderTitleComponent_1.PAGE_HEADER_CLASS);
        this.renderer.addClass(main, HeaderTitleComponent_1.PAGE_HEADER_MAIN_CLASS);
        this.pageHeader = header;
        this.pageHeaderMain = main;
    }
    /**
     * The card header's own child that `node` sits inside, or null when `node` is
     * that child itself — i.e. when the page gave the heading no wrapper.
     */
    headerChildContaining(header, node) {
        if (node.parentElement === header) {
            return null;
        }
        // `header` is known to be an ancestor of `node` (it was found with
        // `closest`), so the walk always terminates.
        let child = node.parentElement;
        while (child && child.parentElement !== header) {
            child = child.parentElement;
        }
        return child;
    }
    /** Undoes `markPageHeader` — the marks live outside this component's view. */
    clearPageHeaderMarks() {
        if (this.pageHeader) {
            this.renderer.removeClass(this.pageHeader, HeaderTitleComponent_1.PAGE_HEADER_CLASS);
            this.pageHeader = null;
        }
        if (this.pageHeaderMain) {
            this.renderer.removeClass(this.pageHeaderMain, HeaderTitleComponent_1.PAGE_HEADER_MAIN_CLASS);
            this.pageHeaderMain = null;
        }
    }
    /**
     * Removes the relocated trail from the host it was parked in. It lives outside
     * this component's view, so Angular's own teardown would leave it behind.
     */
    detachTrail() {
        // `this.trailHost &&` stays FIRST and the comparison stays an identity
        // check: the trail may have been detached already (`parentNode === null`),
        // and `null === null` would otherwise "match" a host that is itself null.
        const trail = this.trailRef?.nativeElement;
        if (this.trailHost && trail?.parentNode === this.trailHost) {
            this.renderer.removeChild(this.trailHost, trail);
        }
        this.trailHost = null;
    }
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
    relocateTrail() {
        const trail = this.trailRef?.nativeElement;
        if (!trail) {
            return;
        }
        const heading = this.elementRef.nativeElement.closest(HeaderTitleComponent_1.HEADING_SELECTOR);
        const host = heading?.parentElement;
        // Used outside a heading: the trail is already a block of its own, leave it.
        if (!heading || !host) {
            return;
        }
        this.renderer.insertBefore(host, trail, heading.nextSibling);
        this.renderer.addClass(host, HeaderTitleComponent_1.HEADING_ROW_CLASS);
        this.trailHost = host;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HeaderTitleComponent, deps: [{ token: i1.Store }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: HeaderTitleComponent, isStandalone: false, selector: "ngx-header-title", inputs: { allowEmployee: "allowEmployee", allowOrganization: "allowOrganization" }, viewQueries: [{ propertyName: "trailRef", first: true, predicate: ["trail"], descendants: true }], ngImport: i0, template: "<ng-content></ng-content>\n\n<ng-template [ngxPermissionsOnly]=\"PermissionsEnum.CHANGE_SELECTED_EMPLOYEE\">\n\t@if (allowEmployee && employee?.id) {\n\t\t<span> {{ 'HEADER_TITLE.FOR' | translate }} </span>\n\t\t<span> {{ employee?.fullName | truncate: 22 }} </span>\n\t}\n</ng-template>\n\n@if (allowOrganization && organization?.id) {\n\t<span class=\"name\">\n\t\t@if (allowEmployee && employee?.id) {\n\t\t\t<ng-template [ngxPermissionsOnly]=\"PermissionsEnum.CHANGE_SELECTED_EMPLOYEE\">\n\t\t\t\t{{ 'HEADER_TITLE.FROM' | translate }}\n\t\t\t</ng-template>\n\t\t\t<ng-template [ngxPermissionsExcept]=\"PermissionsEnum.CHANGE_SELECTED_EMPLOYEE\">\n\t\t\t\t{{ 'HEADER_TITLE.FOR' | translate }}\n\t\t\t</ng-template>\n\t\t} @else {\n\t\t\t{{ 'HEADER_TITLE.FOR' | translate }}\n\t\t}\n\t</span>\n\t<span class=\"org-name\">\n\t\t{{ organization?.name }}\n\t</span>\n}\n\n<!--\n  The breadcrumb trail. It is declared here so that every page carrying a title\n  gets one for free, but it is MOVED next to the heading on init (see\n  `relocateTrail`): this component is always used inside an <h4>, whose content\n  model is phrasing content only \u2014 a <nav><ol> nested in a heading is invalid\n  HTML and would be swallowed into the heading's accessible name.\n-->\n@if (ownsTrail) {\n\t<div #trail class=\"ga-page-title-trail\">\n\t\t<ngx-breadcrumbs></ngx-breadcrumbs>\n\t</div>\n}\n", styles: [":host{font-size:var(--gauzy-page-title-font-size, 1rem);font-weight:var(--gauzy-page-title-font-weight, 600);line-height:var(--gauzy-page-title-line-height, 1.5rem);letter-spacing:var(--gauzy-page-title-letter-spacing, -.01em);text-align:left}.name,.org-name{font-size:var(--gauzy-page-title-font-size, 1rem);font-weight:400;line-height:var(--gauzy-page-title-line-height, 1.5rem);letter-spacing:var(--gauzy-page-title-letter-spacing, -.01em);text-align:left;color:var(--text-hint-color)}.ga-page-title-trail{flex:0 0 100%;order:1;min-width:0;margin-top:.25rem}\n"], dependencies: [{ kind: "directive", type: i2.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "component", type: i3.BreadcrumbComponent, selector: "ngx-breadcrumbs" }, { kind: "pipe", type: i4.TruncatePipe, name: "truncate" }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
HeaderTitleComponent = HeaderTitleComponent_1 = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store,
        ChangeDetectorRef])
], HeaderTitleComponent);
export { HeaderTitleComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HeaderTitleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-header-title', standalone: false, template: "<ng-content></ng-content>\n\n<ng-template [ngxPermissionsOnly]=\"PermissionsEnum.CHANGE_SELECTED_EMPLOYEE\">\n\t@if (allowEmployee && employee?.id) {\n\t\t<span> {{ 'HEADER_TITLE.FOR' | translate }} </span>\n\t\t<span> {{ employee?.fullName | truncate: 22 }} </span>\n\t}\n</ng-template>\n\n@if (allowOrganization && organization?.id) {\n\t<span class=\"name\">\n\t\t@if (allowEmployee && employee?.id) {\n\t\t\t<ng-template [ngxPermissionsOnly]=\"PermissionsEnum.CHANGE_SELECTED_EMPLOYEE\">\n\t\t\t\t{{ 'HEADER_TITLE.FROM' | translate }}\n\t\t\t</ng-template>\n\t\t\t<ng-template [ngxPermissionsExcept]=\"PermissionsEnum.CHANGE_SELECTED_EMPLOYEE\">\n\t\t\t\t{{ 'HEADER_TITLE.FOR' | translate }}\n\t\t\t</ng-template>\n\t\t} @else {\n\t\t\t{{ 'HEADER_TITLE.FOR' | translate }}\n\t\t}\n\t</span>\n\t<span class=\"org-name\">\n\t\t{{ organization?.name }}\n\t</span>\n}\n\n<!--\n  The breadcrumb trail. It is declared here so that every page carrying a title\n  gets one for free, but it is MOVED next to the heading on init (see\n  `relocateTrail`): this component is always used inside an <h4>, whose content\n  model is phrasing content only \u2014 a <nav><ol> nested in a heading is invalid\n  HTML and would be swallowed into the heading's accessible name.\n-->\n@if (ownsTrail) {\n\t<div #trail class=\"ga-page-title-trail\">\n\t\t<ngx-breadcrumbs></ngx-breadcrumbs>\n\t</div>\n}\n", styles: [":host{font-size:var(--gauzy-page-title-font-size, 1rem);font-weight:var(--gauzy-page-title-font-weight, 600);line-height:var(--gauzy-page-title-line-height, 1.5rem);letter-spacing:var(--gauzy-page-title-letter-spacing, -.01em);text-align:left}.name,.org-name{font-size:var(--gauzy-page-title-font-size, 1rem);font-weight:400;line-height:var(--gauzy-page-title-line-height, 1.5rem);letter-spacing:var(--gauzy-page-title-letter-spacing, -.01em);text-align:left;color:var(--text-hint-color)}.ga-page-title-trail{flex:0 0 100%;order:1;min-width:0;margin-top:.25rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i0.ChangeDetectorRef }], propDecorators: { trailRef: [{
                type: ViewChild,
                args: ['trail']
            }], allowEmployee: [{
                type: Input
            }], allowOrganization: [{
                type: Input
            }] } });
//# sourceMappingURL=header-title.component.js.map