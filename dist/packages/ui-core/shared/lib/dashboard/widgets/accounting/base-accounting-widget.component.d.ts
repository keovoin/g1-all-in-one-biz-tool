import { OnInit } from '@angular/core';
import { IAggregatedEmployeeStatistic, IStatisticSum } from '@gauzy/contracts';
import { BaseDashboardWidgetComponent } from '../../widget-host/base-dashboard-widget.component';
import * as i0 from "@angular/core";
/**
 * Shared data layer for every Accounting KPI widget.
 *
 * All four KPIs (income, expenses, profit, bonus) are projections of the very
 * same `/employee-statistics/aggregate` payload the Accounting page renders, so
 * they all subscribe to the ambient dashboard context here and fetch through
 * {@link AccountingStatisticsCacheService}. The cache collapses the four
 * identical in-flight requests into one — which is what makes a KPI cheap enough
 * to be dropped on a canvas four times.
 *
 * Subclasses only decide *which* number of the payload they show and how it is
 * coloured; they never fetch.
 */
export declare abstract class BaseAccountingWidgetComponent extends BaseDashboardWidgetComponent implements OnInit {
    private readonly _statisticsCache;
    /**
     * Currency formatter.
     *
     * Constructed rather than injected so a widget never needs `providers:
     * [CurrencyPipe]`: a canvas widget is created through the host's own injector
     * and would otherwise fail with a NullInjectorError on any page that does not
     * happen to provide the pipe. `DEFAULT_CURRENCY_CODE` is honoured, so an app
     * level override still applies when an organization declares no currency.
     */
    private readonly _currencyPipe;
    /** Moves the currency symbol to the side the organization configured. */
    private readonly _currencyPositionPipe;
    /** Manual re-fetch trigger, fed by {@link refresh}. */
    private readonly _reload$;
    /** Latest aggregate payload; `null` until the first successful fetch. */
    protected readonly statistics: import("@angular/core").WritableSignal<IAggregatedEmployeeStatistic>;
    /** Organization-wide totals of the selected period — what every KPI projects. */
    protected readonly total: import("@angular/core").Signal<IStatisticSum>;
    /**
     * Currency of the active organization.
     *
     * `undefined` — never `''` — when the organization declares none: an empty
     * currency code makes `CurrencyPipe` suppress the symbol entirely, which is
     * both wrong and the one input `CurrencyPositionPipe` cannot parse.
     */
    protected readonly currency: import("@angular/core").Signal<string>;
    /** `LEFT` / `RIGHT` placement of the currency symbol, as configured per organization. */
    protected readonly currencyPosition: import("@angular/core").Signal<string>;
    /**
     * Whether the organization runs a bonus scheme.
     *
     * The Accounting page hides its bonus KPI entirely when this is unset; the
     * bonus widget shows an explanatory hint instead, because a widget the user
     * placed deliberately must not render as a silent, permanent zero.
     */
    protected readonly hasBonusType: import("@angular/core").Signal<boolean>;
    /**
     * Starts the aggregate statistics subscription.
     *
     * Deliberately does NOT call `super.ngOnInit()`: the base class' default is to
     * call {@link refresh} on every context emission, which here would push an
     * extra value through `_reload$` and fetch the same payload twice. This class
     * subscribes to `context$` itself instead.
     */
    ngOnInit(): void;
    /**
     * Re-fetches the aggregate payload, clearing any previous error first.
     *
     * Invoked by the widget host's refresh control and by the card's retry button.
     */
    refresh(): void;
    /**
     * Formats an amount with the organization's currency and symbol position.
     *
     * @param amount - The raw amount from the aggregate payload.
     * @returns The formatted figure, ready to render.
     */
    protected formatCurrency(amount: number): string;
    /**
     * Wires `context$` (plus manual reloads) to the cached aggregate endpoint and
     * mirrors the request lifecycle into the `loading` / `error` signals.
     */
    private observeStatistics;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseAccountingWidgetComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseAccountingWidgetComponent, never, never, {}, {}, never, never, true, never>;
}
