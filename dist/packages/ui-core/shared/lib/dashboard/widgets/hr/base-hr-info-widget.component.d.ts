import { OnInit, Signal, Type } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { BonusTypeEnum, EmployeeStatisticsHistoryEnum, ID, IMonthAggregatedEmployeeStatistics } from '@gauzy/contracts';
import { EmployeeStatisticsService, IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { BaseDashboardWidgetComponent } from '../../widget-host/base-dashboard-widget.component';
import { IHrStatisticsTotals } from './hr-statistics.utils';
import * as i0 from "@angular/core";
/**
 * Shared data layer for every Human Resources info-block widget.
 *
 * All nine blocks are projections of the very same
 * `/employee-statistics/months` payload, so they all subscribe to the ambient
 * dashboard context here and fetch through
 * {@link EmployeeMonthStatisticsCacheService}, which collapses their nine
 * identical in-flight requests into one — that is the whole reason a block is
 * cheap enough to be dropped on a canvas nine times.
 *
 * Subclasses only decide *which* number of the payload they show, how it is
 * labelled, and which history dialog (if any) it opens; they never fetch.
 */
export declare abstract class BaseHrInfoWidgetComponent extends BaseDashboardWidgetComponent implements OnInit {
    private readonly _statisticsCache;
    /** Surfaces secondary (dialog) failures without touching the widget's own state. */
    private readonly _errorHandling;
    /** Record-level history behind the aggregates; used by the history dialogs. */
    protected readonly employeeStatistics: EmployeeStatisticsService;
    /**
     * Optional on purpose: `NbDialogService` comes from `NbDialogModule.forRoot()`.
     * A widget is created through the host's own injector and may be rendered by a
     * shell that never registered it, and a missing history dialog must not take
     * the whole figure down with a NullInjectorError.
     */
    protected readonly dialogs: NbDialogService;
    /** Built by hand (rather than injected) so the widget needs no `providers`. */
    private readonly _currencyPipe;
    private readonly _currencyPositionPipe;
    /** Manual re-fetch trigger, fed by {@link refresh}. */
    private readonly _reload$;
    /** Latest context, for the labels and the history dialogs. */
    protected readonly widgetContext: import("@angular/core").WritableSignal<IDashboardWidgetContext>;
    /** Latest monthly rows; `null` until the first successful fetch. */
    protected readonly statistics: import("@angular/core").WritableSignal<IMonthAggregatedEmployeeStatistics[]>;
    /** Everything the blocks render, derived from {@link statistics}. */
    protected readonly totals: Signal<IHrStatisticsTotals>;
    /** The employee the figures are about, or `null` when none is in scope. */
    protected readonly employeeId: Signal<ID | null>;
    /** Drives the card's "select an employee" empty state. */
    protected readonly hasEmployee: Signal<boolean>;
    /** ISO currency code the amounts are formatted in. */
    protected readonly currency: Signal<string>;
    /** Whether the symbol goes before or after the amount. */
    protected readonly currencyPosition: Signal<string>;
    /** The organization's bonus rule, or `null` when it pays no bonuses. */
    protected readonly bonusType: Signal<BonusTypeEnum | null>;
    /** Percentage the organization's bonus rule applies. */
    protected readonly bonusPercentage: Signal<number>;
    /**
     * Starts the context and statistics subscriptions.
     *
     * Deliberately does NOT call `super.ngOnInit()`: the base class' default is to
     * call {@link refresh} on every context emission, which here would push an
     * extra value through `_reload$` and fetch the same payload twice.
     */
    ngOnInit(): void;
    /**
     * Re-fetches the statistics payload, clearing any previous error first.
     *
     * Invoked by the widget host's refresh control and by the card's retry button.
     */
    refresh(): void;
    /**
     * Formats an amount the way the legacy Human Resources page does: through the
     * `currency` pipe, then repositioned per the organization's preference.
     *
     * @param amount - The raw amount.
     * @returns The display string; the bare number when no currency is configured.
     */
    protected formatAmount(amount: number | null | undefined): string;
    /**
     * Colour for an amount that is only "good" while it is positive.
     *
     * @param amount - The raw amount.
     * @param positive - Colour used at or above zero.
     * @param negative - Colour used below zero.
     */
    protected signedColor(amount: number, positive: string, negative: string): string;
    /**
     * Opens the records-history dialog for one of this employee's figures.
     *
     * @param type - Which history to load; `null`/`undefined` makes the click inert
     *               (the bonus blocks have no history behind them, exactly as on
     *               the legacy page).
     */
    openHistory(type: EmployeeStatisticsHistoryEnum | null | undefined): void;
    /**
     * Reports the failure of a SECONDARY action (a history dialog) without
     * touching the widget's own state.
     *
     * Routing these through `setError()` would put an already-loaded card into
     * its error state, hiding correct totals behind a retry button because an
     * optional, read-only dialog failed to open.
     *
     * @param error - Anything thrown or rejected by the dialog's data/bundle load.
     */
    protected reportActionError(error: unknown): void;
    /**
     * Loads a component that is DECLARED in an NgModule (not standalone).
     *
     * Importing only the component file is not enough: Ivy registers a declared
     * component's template scope when the *NgModule* file is evaluated, so a
     * dialog opened without that would render with its own directives unresolved.
     * Both files are therefore imported, and both stay out of the widget's initial
     * chunk — history dialogs drag in the whole smart-table stack.
     *
     * @param loadModule - Dynamic import of the declaring NgModule file.
     * @param loadComponent - Dynamic import of the component file.
     * @param pick - Selects the component class from the component module's exports.
     */
    protected loadDeclaredComponent<T>(loadModule: () => Promise<unknown>, loadComponent: () => Promise<any>, pick: (module: any) => Type<T>): Promise<Type<T>>;
    /** Mirrors every context emission into {@link widgetContext} for the labels. */
    private observeContext;
    /**
     * Wires `context$` (plus manual reloads) to the cached statistics endpoint and
     * mirrors the request lifecycle into the `loading` / `error` signals.
     */
    private observeStatistics;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseHrInfoWidgetComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseHrInfoWidgetComponent, never, never, {}, {}, never, never, true, never>;
}
