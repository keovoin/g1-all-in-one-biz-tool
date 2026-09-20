import { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Collapses every smart table's filter row behind a funnel toggle in the
 * header row.
 *
 * The filter row (`tr.angular2-smart-filters`) is a full row of input-height
 * widgets that most visits never touch — it cost every list page a band of
 * vertical space and, with each page styling its own widgets, the inputs did
 * not even share a height. The row now starts hidden; a funnel button at the
 * right end of the title row shows it on demand.
 *
 * Attached by element selector through `SmartDataViewLayoutModule` (the
 * `SmartTableSettlingDirective` precedent), so all ~116 consuming modules get
 * the behavior with no template change. The button is real DOM appended into
 * the title row's last `th` — the library owns that subtree, so a
 * MutationObserver re-attaches the button whenever the header is re-rendered
 * (column rebuilds on language change, settings swaps, and so on).
 *
 * State rules, in priority order:
 *  1. a row with an ACTIVE filter is never hidden on load — hidden state would
 *     silently constrain the data;
 *  2. otherwise the user's last explicit choice (localStorage) wins — one
 *     preference for the whole app, deliberately, so tables feel consistent;
 *  3. otherwise: collapsed.
 * Collapsing does NOT clear filter values; while any are active the funnel
 * carries an indicator dot so hidden-but-filtering is always visible.
 */
export declare class SmartTableFilterToggleDirective implements OnInit, AfterViewInit, OnDestroy {
    /**
     * One app-wide preference: 'open' | 'closed'.
     *
     * Mirrored as a literal in the e2e fixtures (apps/gauzy-e2e/tests/support/
     * fixtures.ts and bdd.ts) — they run in a separate build that cannot import
     * this class. Rename both sides together.
     */
    static readonly STORAGE_KEY = "gauzy.smartTable.filtersOpen";
    collapsed: boolean;
    private readonly elementRef;
    private readonly renderer;
    private readonly zone;
    private readonly cdr;
    private readonly translate;
    private button;
    private observer;
    /** Teardown callbacks that live as long as the directive (button, lang sub). */
    private teardownFns;
    /**
     * Teardown callbacks for the delegated listeners on the CURRENT filter row,
     * disposed separately: the library rebuilds thead rows wholesale, and rolling
     * these into the long-lived list would grow it by a listener pair per rebuild.
     */
    private rowTeardownFns;
    /** Row currently carrying the delegated listeners, so teardown can forget it. */
    private listenedRow;
    /**
     * The stored preference is applied BEFORE the first render (OnInit), so the
     * host class is stable through the first change-detection pass — deciding it
     * any later flips a host binding after verification and throws NG0100 in dev
     * mode, which aborts rendering of the surrounding view.
     */
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private host;
    private filterRow;
    private titlesRow;
    /**
     * Puts the funnel into the title row's last header cell (or takes it away
     * again when the table renders without a usable filter row).
     */
    private ensureToggle;
    private createButton;
    /** (Re-)translates the button's accessible name and tooltip. */
    private applyLabel;
    private toggle;
    private syncAria;
    /** True while any filter widget in the row holds a value. */
    private hasActiveFilter;
    private reflectActiveState;
    private detachButton;
    static ɵfac: i0.ɵɵFactoryDeclaration<SmartTableFilterToggleDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<SmartTableFilterToggleDirective, "angular2-smart-table", never, {}, {}, never, never, false, never>;
}
