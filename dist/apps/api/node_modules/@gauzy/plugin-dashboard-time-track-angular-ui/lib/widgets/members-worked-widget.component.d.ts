import { OnInit } from '@angular/core';
import { BaseTimeTrackCounterWidgetComponent } from './base-time-track-counter-widget.component';
import * as i0 from "@angular/core";
/**
 * Counter widget: how many members logged time in the selected range.
 *
 * The counter-point strip compares that number against the organization's total
 * head count, so an "8" reads very differently in a team of 9 than in a team of 90.
 */
export declare class MembersWorkedWidgetComponent extends BaseTimeTrackCounterWidgetComponent implements OnInit {
    private readonly _employeesService;
    /** Total members in the organization — the counter-point denominator. */
    protected readonly totalEmployees: import("@angular/core").WritableSignal<number>;
    /** Members that logged time in the selected range. */
    protected readonly membersWorked: import("@angular/core").Signal<number>;
    /**
     * Starts the shared counts subscription and the organization head-count lookup.
     */
    ngOnInit(): void;
    /**
     * Keeps the total head count in sync with the active organization.
     *
     * A failure here only degrades the strip's scale, never the headline figure,
     * so it is swallowed instead of surfacing an error state on the whole widget.
     */
    private observeEmployeesCount;
    static ɵfac: i0.ɵɵFactoryDeclaration<MembersWorkedWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MembersWorkedWidgetComponent, "gz-members-worked-widget", never, {}, {}, never, never, true, never>;
}
