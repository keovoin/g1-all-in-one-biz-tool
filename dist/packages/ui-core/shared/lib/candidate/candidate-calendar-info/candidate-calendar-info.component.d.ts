import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { CandidateInterviewService, Store } from '@gauzy/ui-core/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, DateSelectArg, EventHoveringArg } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import { IOrganization } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CandidateCalendarInfoComponent implements OnInit {
    protected readonly dialogRef: NbDialogRef<CandidateCalendarInfoComponent>;
    private readonly candidateInterviewService;
    private readonly store;
    calendar: FullCalendarComponent;
    calendarOptions: CalendarOptions;
    calendarEvents: EventInput[];
    eventStartTime: Date;
    eventEndTime: Date;
    isPast: boolean;
    titleText: string;
    employeeNames: string;
    organization: IOrganization;
    constructor(dialogRef: NbDialogRef<CandidateCalendarInfoComponent>, candidateInterviewService: CandidateInterviewService, store: Store);
    ngOnInit(): void;
    /**
     * GET candidate calendar interview events
     *
     * @returns
     */
    getCandidateInterviews(): Promise<void>;
    /**
     * Continue with selected date range times
     *
     * @returns
     */
    continue(): void;
    handleDateClick(event: DateClickArg): void;
    handleEventSelect(event: DateSelectArg): void;
    handleEventMouseEnter({ el }: EventHoveringArg): void;
    handleEventMouseLeave({ el }: EventHoveringArg): void;
    hasOverflow(el: HTMLElement): boolean;
    closeDialog(): void;
    /**
     * If, selected date range is past
     *
     * @returns {Boolean}
     */
    isPastDates(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateCalendarInfoComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CandidateCalendarInfoComponent, "ga-candidate-interviews-calendar-info", never, {}, {}, never, never, false, never>;
}
