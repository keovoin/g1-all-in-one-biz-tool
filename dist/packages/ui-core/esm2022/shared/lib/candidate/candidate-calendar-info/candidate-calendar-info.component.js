import { __decorate, __metadata } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { CandidateInterviewService, Store } from '@gauzy/ui-core/core';
import { firstValueFrom } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { disableCursor } from '@fullcalendar/core/internal';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import moment from 'moment';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/core";
import * as i3 from "@fullcalendar/angular";
import * as i4 from "@angular/common";
import * as i5 from "@ngx-translate/core";
let CandidateCalendarInfoComponent = class CandidateCalendarInfoComponent {
    constructor(dialogRef, candidateInterviewService, store) {
        this.dialogRef = dialogRef;
        this.candidateInterviewService = candidateInterviewService;
        this.store = store;
        this.calendarEvents = [];
        this.isPast = false;
        this.calendarOptions = {
            initialView: 'timeGridWeek',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            themeSystem: 'bootstrap',
            plugins: [dayGridPlugin, timeGrigPlugin, interactionPlugin, bootstrapPlugin],
            weekends: true,
            height: 'auto',
            selectable: true,
            selectAllow: ({ start, end }) => moment(start).isSame(moment(end), 'day'),
            select: this.handleEventSelect.bind(this),
            dateClick: this.handleDateClick.bind(this),
            eventMouseEnter: this.handleEventMouseEnter.bind(this),
            eventMouseLeave: this.handleEventMouseLeave.bind(this)
        };
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(debounceTime(100), distinctUntilChange(), filter((organization) => !!organization), tap((organization) => (this.organization = organization)), tap(() => this.getCandidateInterviews()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * GET candidate calendar interview events
     *
     * @returns
     */
    async getCandidateInterviews() {
        if (!this.organization) {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;
        const interviews = (await firstValueFrom(this.candidateInterviewService.getAll(['interviewers'], {
            tenantId,
            organizationId
        }))).items;
        this.calendarEvents = [];
        for (const interview of interviews) {
            this.calendarEvents.push({
                title: interview.title,
                start: interview.startTime,
                end: interview.endTime,
                candidateId: interview.candidateId,
                id: interview.id,
                extendedProps: {
                    id: interview.id
                },
                backgroundColor: '#36f'
            });
        }
        this.calendarOptions.events = this.calendarEvents;
    }
    /**
     * Continue with selected date range times
     *
     * @returns
     */
    continue() {
        if (this.isPastDates()) {
            return;
        }
        this.dialogRef.close({
            startTime: this.eventStartTime,
            endTime: this.eventEndTime
        });
    }
    handleDateClick(event) {
        if (event.view.type === 'dayGridMonth') {
            this.calendar.getApi().changeView('timeGridWeek', event.date);
        }
    }
    handleEventSelect(event) {
        this.eventStartTime = event.start;
        this.eventEndTime = event.end;
        if (this.isPastDates()) {
            disableCursor();
            this.isPast = true;
        }
        else {
            this.isPast = false;
        }
    }
    handleEventMouseEnter({ el }) {
        if (this.hasOverflow(el.querySelector('.fc-event-main'))) {
            el.style.position = 'unset';
        }
    }
    handleEventMouseLeave({ el }) {
        el.removeAttribute('style');
    }
    hasOverflow(el) {
        if (!el) {
            return;
        }
        const curOverflow = el.style ? el.style.overflow : 'hidden';
        if (!curOverflow || curOverflow === 'visible') {
            el.style.overflow = 'hidden';
        }
        const isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
        if (el.style) {
            el.style.overflow = curOverflow;
        }
        return isOverflowing;
    }
    closeDialog() {
        this.dialogRef.close();
    }
    /**
     * If, selected date range is past
     *
     * @returns {Boolean}
     */
    isPastDates() {
        if (!this.eventStartTime) {
            return;
        }
        return moment(this.eventStartTime).diff(moment()) < 0;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateCalendarInfoComponent, deps: [{ token: i1.NbDialogRef }, { token: i2.CandidateInterviewService }, { token: i2.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: CandidateCalendarInfoComponent, isStandalone: false, selector: "ga-candidate-interviews-calendar-info", viewQueries: [{ propertyName: "calendar", first: true, predicate: ["calendar"], descendants: true, static: true }], ngImport: i0, template: "<nb-card class=\"card-calendar\">\n  <nb-card-header class=\"card-calendar-header\">\n    <h4>\n      {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.SCHEDULED_INTERVIEWS' | translate }}\n    </h4>\n    <nb-icon\n      icon=\"close-outline\"\n      class=\"icons\"\n      (click)=\"closeDialog()\"\n    ></nb-icon>\n  </nb-card-header>\n  <nb-card-body>\n    <full-calendar\n      #calendar\n      class=\"calendar\"\n      [options]=\"calendarOptions\"\n    ></full-calendar>\n  </nb-card-body>\n  <div class=\"button\">\n    <button\n      nbButton\n      status=\"danger\"\n      (click)=\"closeDialog()\"\n      >\n      {{ 'BUTTONS.CANCEL' | translate }}\n    </button>\n    <button\n      nbButton\n      status=\"success\"\n      [disabled]=\"!eventStartTime || isPast\"\n      (click)=\"continue()\"\n      >\n      @if (!isPast) {\n        <span>\n          {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.CONTINUE' | translate }}\n          @if (eventStartTime) {\n            <span>\n              {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.WITH' | translate }} :\n              {{ eventStartTime | date: 'mediumDate' }},\n              {{ eventStartTime | date: 'shortTime' }}-{{ eventEndTime | date: 'shortTime' }}\n            </span>\n          }\n        </span>\n      } @else {\n        <span>\n          {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.PAST_DATE' | translate }}\n        </span>\n      }\n    </button>\n  </div>\n</nb-card>\n", styles: [".calendar{height:43rem}.card-calendar{max-width:75rem;overflow-y:scroll}.icons{margin-right:10px;color:gray!important}.card-calendar-header{display:flex;flex-direction:row;justify-content:space-between;align-items:center}.button{padding:0 5rem;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin:10px 0}\n"], dependencies: [{ kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i3.FullCalendarComponent, selector: "full-calendar", inputs: ["options", "deepChangeDetection", "events", "eventSources", "resources"] }, { kind: "pipe", type: i4.DatePipe, name: "date" }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
CandidateCalendarInfoComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [NbDialogRef,
        CandidateInterviewService,
        Store])
], CandidateCalendarInfoComponent);
export { CandidateCalendarInfoComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateCalendarInfoComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-candidate-interviews-calendar-info', standalone: false, template: "<nb-card class=\"card-calendar\">\n  <nb-card-header class=\"card-calendar-header\">\n    <h4>\n      {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.SCHEDULED_INTERVIEWS' | translate }}\n    </h4>\n    <nb-icon\n      icon=\"close-outline\"\n      class=\"icons\"\n      (click)=\"closeDialog()\"\n    ></nb-icon>\n  </nb-card-header>\n  <nb-card-body>\n    <full-calendar\n      #calendar\n      class=\"calendar\"\n      [options]=\"calendarOptions\"\n    ></full-calendar>\n  </nb-card-body>\n  <div class=\"button\">\n    <button\n      nbButton\n      status=\"danger\"\n      (click)=\"closeDialog()\"\n      >\n      {{ 'BUTTONS.CANCEL' | translate }}\n    </button>\n    <button\n      nbButton\n      status=\"success\"\n      [disabled]=\"!eventStartTime || isPast\"\n      (click)=\"continue()\"\n      >\n      @if (!isPast) {\n        <span>\n          {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.CONTINUE' | translate }}\n          @if (eventStartTime) {\n            <span>\n              {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.WITH' | translate }} :\n              {{ eventStartTime | date: 'mediumDate' }},\n              {{ eventStartTime | date: 'shortTime' }}-{{ eventEndTime | date: 'shortTime' }}\n            </span>\n          }\n        </span>\n      } @else {\n        <span>\n          {{ 'CANDIDATES_PAGE.EDIT_CANDIDATE.INTERVIEW.PAST_DATE' | translate }}\n        </span>\n      }\n    </button>\n  </div>\n</nb-card>\n", styles: [".calendar{height:43rem}.card-calendar{max-width:75rem;overflow-y:scroll}.icons{margin-right:10px;color:gray!important}.card-calendar-header{display:flex;flex-direction:row;justify-content:space-between;align-items:center}.button{padding:0 5rem;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin:10px 0}\n"] }]
        }], ctorParameters: () => [{ type: i1.NbDialogRef }, { type: i2.CandidateInterviewService }, { type: i2.Store }], propDecorators: { calendar: [{
                type: ViewChild,
                args: ['calendar', { static: true }]
            }] } });
//# sourceMappingURL=candidate-calendar-info.component.js.map