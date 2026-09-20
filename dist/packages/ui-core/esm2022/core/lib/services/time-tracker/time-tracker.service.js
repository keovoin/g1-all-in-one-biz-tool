import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timer } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import { StoreConfig, Store, Query } from '@datorama/akita';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from '@gauzy/ui-config';
import { TimeLogType, TimeLogSourceEnum } from '@gauzy/contracts';
import { API_PREFIX, BACKGROUND_SYNC_INTERVAL, buildHttpParams, toLocal, toUTC } from '@gauzy/ui-core/common';
import { Store as AppStore } from '../store/store.service';
import * as i0 from "@angular/core";
import * as i1 from "../store/store.service";
import * as i2 from "@angular/common/http";
/**
 * Creates and returns the initial state for the timer.
 *
 * @returns The initial TimerState object.
 */
export function createInitialTimerState() {
    const defaultTimerConfig = {
        isBillable: true,
        organizationId: null,
        tenantId: null,
        projectId: null,
        taskId: null,
        organizationContactId: null,
        organizationTeamId: null,
        description: null,
        logType: TimeLogType.TRACKED,
        source: TimeLogSourceEnum.WEB_TIMER,
        startedAt: null,
        stoppedAt: null
    };
    // Retrieve and parse the stored timer configuration, if available
    const storedConfig = (() => {
        try {
            return JSON.parse(localStorage.getItem('timerConfig') || '{}');
        }
        catch (error) {
            console.error('Error parsing timerConfig from localStorage:', error);
            return {};
        }
    })();
    // Merge default and stored configurations
    const timerConfig = { ...defaultTimerConfig, ...storedConfig };
    // Return the complete initial TimerState
    return {
        showTimerWindow: false,
        duration: 0,
        currentSessionDuration: 0,
        running: false,
        position: { x: 0, y: 0 },
        timerConfig
    };
}
let TimerStore = class TimerStore extends Store {
    constructor() {
        super(createInitialTimerState());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimerStore, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimerStore, providedIn: 'root' }); }
};
TimerStore = __decorate([
    StoreConfig({ name: 'timer' }),
    __metadata("design:paramtypes", [])
], TimerStore);
export { TimerStore };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimerStore, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
export class TimerQuery extends Query {
    constructor(store) {
        super(store);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimerQuery, deps: [{ token: TimerStore }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimerQuery, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimerQuery, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: TimerStore }] });
let TimeTrackerService = class TimeTrackerService {
    constructor(timerStore, timerQuery, store, http) {
        this.timerStore = timerStore;
        this.timerQuery = timerQuery;
        this.store = store;
        this.http = http;
        this.showTimerWindow$ = this.timerQuery.select((state) => state.showTimerWindow);
        this.duration$ = this.timerQuery.select((state) => state.duration);
        this.currentSessionDuration$ = this.timerQuery.select((state) => state.currentSessionDuration);
        this.$running = this.timerQuery.select((state) => state.running);
        this.$timerConfig = this.timerQuery.select((state) => state.timerConfig);
        this._trackType$ = new BehaviorSubject(this.timeType);
        this.trackType$ = this._trackType$.asObservable();
        this.timer$ = timer(BACKGROUND_SYNC_INTERVAL);
        this._runWorker();
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), untilDestroyed(this))
            .subscribe((organization) => {
            this.timerStore.update({
                timerConfig: {
                    ...this.timerConfig,
                    organizationId: organization.id,
                    tenantId: organization.tenantId
                }
            });
        });
    }
    /*
     * Check current timer status for employee only
     */
    async checkTimerStatus(payload) {
        delete payload.source;
        await this.getTimerStatus(payload)
            .then((status) => {
            this.duration = status.duration;
            if (status.lastLog && status.lastLog.isRunning) {
                this.currentSessionDuration = moment().diff(toLocal(status.lastLog.startedAt), 'seconds');
            }
            else {
                this.currentSessionDuration = 0;
            }
            // On refresh/delete TimeLog, we need to clear interval to prevent duplicate interval
            this.turnOffTimer();
            if (status.running) {
                this.turnOnTimer();
            }
        })
            .catch(() => { });
    }
    /**
     * Gets the value indicating whether the timer window is shown.
     *
     * @returns A boolean indicating if the timer window is displayed.
     */
    get showTimerWindow() {
        return this.timerQuery.getValue().showTimerWindow;
    }
    /**
     * Sets the value indicating whether to show the timer window.
     *
     * @param value - A boolean value to set for displaying the timer window.
     */
    set showTimerWindow(value) {
        this.timerStore.update({ showTimerWindow: value });
    }
    /**
     * Gets the current duration of the timer.
     *
     * @returns The duration in seconds.
     */
    get duration() {
        return this.timerQuery.getValue().duration;
    }
    /**
     * Sets the duration of the timer.
     *
     * @param value - A number representing the duration to set.
     */
    set duration(value) {
        this.timerStore.update({ duration: value });
    }
    /**
     * Gets the current session duration of the timer.
     *
     * @returns The current session duration in seconds.
     */
    get currentSessionDuration() {
        return this.timerQuery.getValue().currentSessionDuration;
    }
    /**
     * Sets the current session duration of the timer.
     *
     * @param value - A number representing the current session duration to set.
     */
    set currentSessionDuration(value) {
        this.timerStore.update({ currentSessionDuration: value });
    }
    /**
     * Gets the configuration settings for the timer.
     *
     * @returns The timer configuration object.
     */
    get timerConfig() {
        return this.timerQuery.getValue().timerConfig;
    }
    /**
     * Sets the configuration settings for the timer.
     *
     * @param value - An object containing the timer configuration to set.
     */
    set timerConfig(value) {
        this.timerStore.update({ timerConfig: value });
    }
    /**
     * Gets the running state of the timer.
     *
     * @returns A boolean indicating if the timer is currently running.
     */
    get running() {
        return this.timerQuery.getValue().running;
    }
    /**
     * Sets the running state of the timer.
     *
     * @param value - A boolean value to indicate whether the timer should be running.
     */
    set running(value) {
        this.timerStore.update({ running: value });
    }
    /**
     * Gets the current position of the timer.
     *
     * @returns The current position or offset of the timer.
     */
    get position() {
        return this.timerQuery.getValue().position;
    }
    /**
     * Sets the position of the timer.
     *
     * @param offset - The offset value to set for the timer's position.
     */
    set position(offset) {
        this.timerStore.update({ position: offset });
    }
    /**
     * Retrieves the timer status using the provided parameters.
     * @param input The input parameters for retrieving timer status.
     * @returns A promise that resolves to the timer status.
     */
    getTimerStatus(input) {
        const todayStart = toUTC(moment().startOf('day')).format('YYYY-MM-DD HH:mm:ss');
        const todayEnd = toUTC(moment().endOf('day')).format('YYYY-MM-DD HH:mm:ss');
        const params = buildHttpParams({ ...input, todayStart, todayEnd });
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/timer/status`, { params }));
    }
    // toggleTimer(request: ITimerToggleInput): Promise<ITimeLog> {
    // 	return firstValueFrom(
    // 		this.http.post<ITimeLog>(`${API_PREFIX}/timesheet/timer/toggle`, request)
    // 	);
    // }
    openAndStartTimer() {
        this.showTimerWindow = true;
        if (!this.running) {
            if (this.canStartTimer()) {
                this.currentSessionDuration = 0;
                this.toggle();
            }
        }
    }
    toggle() {
        if (this.running) {
            this.turnOffTimer();
            delete this.timerConfig.source;
            this.timerConfig = {
                ...this.timerConfig,
                stoppedAt: toUTC(moment()).toDate()
            };
            this.currentSessionDuration = 0;
            return firstValueFrom(this.http.post(`${API_PREFIX}/timesheet/timer/stop`, this.timerConfig));
        }
        else {
            this.currentSessionDuration = 0;
            this.turnOnTimer();
            this.timerConfig = {
                ...this.timerConfig,
                startedAt: toUTC(moment()).toDate(),
                source: TimeLogSourceEnum.WEB_TIMER
            };
            return firstValueFrom(this.http.post(`${API_PREFIX}/timesheet/timer/start`, this.timerConfig));
        }
    }
    turnOnTimer() {
        this.running = true;
        // post state of timer to worker on start timer
        this._worker.postMessage({
            isRunning: this.running,
            session: this.currentSessionDuration,
            duration: this.duration
        });
    }
    turnOffTimer() {
        this.running = false;
        // post running state to worker on turning off
        this._worker.postMessage({
            isRunning: this.running
        });
    }
    canStartTimer() {
        let isValid = true;
        if (this.organization) {
            if (this.organization.requireProject && !this.timerConfig.projectId) {
                isValid = false;
            }
            if (this.organization.requireTask && !this.timerConfig.taskId) {
                isValid = false;
            }
            if (this.organization.requireDescription && !this.timerConfig.description) {
                isValid = false;
            }
        }
        else {
            isValid = false;
        }
        return isValid;
    }
    setTimeLogType(timeType) {
        this._trackType$.next(timeType);
        this.timeType = timeType === TimeLogType.TRACKED ? TimeLogType.TRACKED : TimeLogType.MANUAL;
    }
    get timeType() {
        return this.timerConfig.logType;
    }
    set timeType(value) {
        this.timerConfig = {
            ...this.timerConfig,
            logType: value
        };
    }
    /*
     * Clear time tracker local store
     */
    clearTimeTracker() {
        this.timerStore.reset();
    }
    _runWorker() {
        if (typeof Worker !== 'undefined') {
            try {
                this._worker = new Worker(new URL(environment.CLIENT_BASE_URL + '/assets/workers/time-tracker.js'), {
                    type: 'module'
                });
                // retrieve message post from time tracker worker
                this._worker.onmessage = ({ data }) => {
                    this.currentSessionDuration = data.session;
                    this.duration = data.todayWorked;
                };
            }
            catch (error) {
                console.log('Invalid Time Tracker worker configuration', error?.message);
            }
        }
        else {
            console.log('Web worker does not supported on your browser');
        }
    }
    remoteToggle() {
        if (this.running) {
            this.turnOffTimer();
            this.timerConfig = {
                ...this.timerConfig,
                source: this.timerSynced.source,
                startedAt: this.timerSynced.startedAt,
                stoppedAt: this.timerSynced.stoppedAt
            };
            this.currentSessionDuration = 0;
            return this.timerSynced.lastLog;
        }
        else {
            this.duration = this.timerSynced.lastLog.duration;
            this.timerConfig = {
                ...this.timerConfig,
                organizationId: this.timerSynced.lastLog.organizationId,
                tenantId: this.timerSynced.lastLog.tenantId,
                projectId: this.timerSynced.lastLog.projectId,
                taskId: this.timerSynced.lastLog.taskId,
                organizationContactId: this.timerSynced.lastLog.organizationContactId,
                description: this.timerSynced.lastLog.description,
                source: this.timerSynced.source,
                startedAt: this.timerSynced.startedAt,
                stoppedAt: this.timerSynced.stoppedAt
            };
            this.turnOnTimer();
            return this.timerSynced.lastLog;
        }
    }
    get timerSynced() {
        return this._timerSynced;
    }
    set timerSynced(value) {
        this._timerSynced = value;
    }
    ngOnDestroy() {
        this._worker.terminate();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerService, deps: [{ token: TimerStore }, { token: TimerQuery }, { token: i1.Store }, { token: i2.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerService, providedIn: 'root' }); }
};
TimeTrackerService = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [TimerStore,
        TimerQuery,
        AppStore,
        HttpClient])
], TimeTrackerService);
export { TimeTrackerService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: TimerStore }, { type: TimerQuery }, { type: i1.Store }, { type: i2.HttpClient }] });
//# sourceMappingURL=time-tracker.service.js.map