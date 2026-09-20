import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Service to handle countdown timer functionality.
 * Provides a reusable timer that can be shared across components.
 */
export class CountdownTimerService {
    constructor() {
        this._timerState = new BehaviorSubject({
            countdown: 0,
            isActive: false,
            isResent: false
        });
        this.DEFAULT_COUNTDOWN = 30;
        /**
         * Observable stream of timer state
         */
        this.timerState$ = this._timerState.asObservable();
    }
    /**
     * Get current timer state
     */
    get currentState() {
        return this._timerState.value;
    }
    /**
     * Get current countdown value
     */
    get countdown() {
        return this._timerState.value.countdown;
    }
    /**
     * Check if timer is currently active
     */
    get isActive() {
        return this._timerState.value.isActive;
    }
    /**
     * Check if code was resent (timer is running)
     */
    get isResent() {
        return this._timerState.value.isResent;
    }
    /**
     * Starts a countdown timer with the specified duration.
     *
     * @param duration The countdown duration in seconds (default: 30)
     */
    startTimer(duration = this.DEFAULT_COUNTDOWN) {
        if (duration <= 0) {
            this.stopTimer();
            return;
        }
        // Stop any existing interval without resetting state to avoid flicker
        if (this.timer) {
            this.timer.unsubscribe();
            this.timer = undefined;
        }
        // Update state to show timer is active and code was resent
        this._timerState.next({
            countdown: duration,
            isActive: true,
            isResent: true
        });
        // Start the interval timer
        this.timer = interval(1000).subscribe(() => {
            const currentState = this._timerState.value;
            if (currentState.countdown > 0) {
                this._timerState.next({
                    ...currentState,
                    countdown: currentState.countdown - 1
                });
            }
            else {
                this.stopTimer();
            }
        });
    }
    /**
     * Stops the timer and resets the state.
     */
    stopTimer() {
        // Unsubscribe from the timer if it exists
        if (this.timer) {
            this.timer.unsubscribe();
            this.timer = undefined;
        }
        // Reset timer state
        this._timerState.next({
            countdown: 0,
            isActive: false,
            isResent: false
        });
    }
    /**
     * Resets the timer to initial state without starting it.
     */
    resetTimer() {
        this.stopTimer();
    }
    /**
     * Checks if the timer can be started (not currently active).
     */
    canStart() {
        return !this.isActive;
    }
    /**
     * Cleanup method to be called when the service is destroyed.
     * This ensures no memory leaks from active subscriptions.
     */
    ngOnDestroy() {
        this.stopTimer();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountdownTimerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountdownTimerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CountdownTimerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=countdown-timer.service.js.map