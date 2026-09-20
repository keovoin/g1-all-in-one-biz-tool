import { OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store, Query } from '@datorama/akita';
import { ITimeLog, ITimerToggleInput, TimeLogType, ITimerStatus, IOrganization, TimerState, ITimerStatusInput, ITimerPosition } from '@gauzy/contracts';
import { Store as AppStore } from '../store/store.service';
import { ITimerSynced } from './interfaces';
import * as i0 from "@angular/core";
/**
 * Creates and returns the initial state for the timer.
 *
 * @returns The initial TimerState object.
 */
export declare function createInitialTimerState(): TimerState;
export declare class TimerStore extends Store<TimerState> {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<TimerStore, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimerStore>;
}
export declare class TimerQuery extends Query<TimerState> {
    constructor(store: TimerStore);
    static ɵfac: i0.ɵɵFactoryDeclaration<TimerQuery, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimerQuery>;
}
export declare class TimeTrackerService implements OnDestroy {
    protected readonly timerStore: TimerStore;
    protected readonly timerQuery: TimerQuery;
    protected readonly store: AppStore;
    private readonly http;
    interval: any;
    showTimerWindow$: Observable<boolean>;
    duration$: Observable<number>;
    currentSessionDuration$: Observable<number>;
    $running: Observable<boolean>;
    $timerConfig: Observable<ITimerToggleInput>;
    organization: IOrganization;
    private _trackType$;
    trackType$: Observable<string>;
    private _worker;
    private _timerSynced;
    timer$: Observable<number>;
    constructor(timerStore: TimerStore, timerQuery: TimerQuery, store: AppStore, http: HttpClient);
    checkTimerStatus(payload: ITimerStatusInput): Promise<void>;
    /**
     * Gets the value indicating whether the timer window is shown.
     *
     * @returns A boolean indicating if the timer window is displayed.
     */
    get showTimerWindow(): boolean;
    /**
     * Sets the value indicating whether to show the timer window.
     *
     * @param value - A boolean value to set for displaying the timer window.
     */
    set showTimerWindow(value: boolean);
    /**
     * Gets the current duration of the timer.
     *
     * @returns The duration in seconds.
     */
    get duration(): number;
    /**
     * Sets the duration of the timer.
     *
     * @param value - A number representing the duration to set.
     */
    set duration(value: number);
    /**
     * Gets the current session duration of the timer.
     *
     * @returns The current session duration in seconds.
     */
    get currentSessionDuration(): number;
    /**
     * Sets the current session duration of the timer.
     *
     * @param value - A number representing the current session duration to set.
     */
    set currentSessionDuration(value: number);
    /**
     * Gets the configuration settings for the timer.
     *
     * @returns The timer configuration object.
     */
    get timerConfig(): ITimerToggleInput;
    /**
     * Sets the configuration settings for the timer.
     *
     * @param value - An object containing the timer configuration to set.
     */
    set timerConfig(value: ITimerToggleInput);
    /**
     * Gets the running state of the timer.
     *
     * @returns A boolean indicating if the timer is currently running.
     */
    get running(): boolean;
    /**
     * Sets the running state of the timer.
     *
     * @param value - A boolean value to indicate whether the timer should be running.
     */
    set running(value: boolean);
    /**
     * Gets the current position of the timer.
     *
     * @returns The current position or offset of the timer.
     */
    get position(): ITimerPosition;
    /**
     * Sets the position of the timer.
     *
     * @param offset - The offset value to set for the timer's position.
     */
    set position(offset: ITimerPosition);
    /**
     * Retrieves the timer status using the provided parameters.
     * @param input The input parameters for retrieving timer status.
     * @returns A promise that resolves to the timer status.
     */
    getTimerStatus(input: ITimerStatusInput): Promise<ITimerStatus>;
    openAndStartTimer(): void;
    toggle(): Promise<ITimeLog>;
    turnOnTimer(): void;
    turnOffTimer(): void;
    canStartTimer(): boolean;
    setTimeLogType(timeType: string): void;
    get timeType(): TimeLogType;
    set timeType(value: TimeLogType);
    clearTimeTracker(): void;
    private _runWorker;
    remoteToggle(): ITimeLog;
    get timerSynced(): ITimerSynced;
    set timerSynced(value: ITimerSynced);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeTrackerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimeTrackerService>;
}
