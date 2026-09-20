import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Interface for timer state
 */
export interface ITimerState {
    countdown: number;
    isActive: boolean;
    isResent: boolean;
}
/**
 * Service to handle countdown timer functionality.
 * Provides a reusable timer that can be shared across components.
 */
export declare class CountdownTimerService implements OnDestroy {
    private readonly _timerState;
    private timer?;
    private readonly DEFAULT_COUNTDOWN;
    /**
     * Observable stream of timer state
     */
    readonly timerState$: Observable<ITimerState>;
    /**
     * Get current timer state
     */
    get currentState(): ITimerState;
    /**
     * Get current countdown value
     */
    get countdown(): number;
    /**
     * Check if timer is currently active
     */
    get isActive(): boolean;
    /**
     * Check if code was resent (timer is running)
     */
    get isResent(): boolean;
    /**
     * Starts a countdown timer with the specified duration.
     *
     * @param duration The countdown duration in seconds (default: 30)
     */
    startTimer(duration?: number): void;
    /**
     * Stops the timer and resets the state.
     */
    stopTimer(): void;
    /**
     * Resets the timer to initial state without starting it.
     */
    resetTimer(): void;
    /**
     * Checks if the timer can be started (not currently active).
     */
    canStart(): boolean;
    /**
     * Cleanup method to be called when the service is destroyed.
     * This ensures no memory leaks from active subscriptions.
     */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CountdownTimerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CountdownTimerService>;
}
