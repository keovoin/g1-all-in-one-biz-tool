import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class ZapierStoreService {
    constructor() {
        this._triggers$ = new BehaviorSubject([]);
        this._actions$ = new BehaviorSubject([]);
        this._isLoading$ = new BehaviorSubject(false);
        this._error$ = new BehaviorSubject(null);
        this._webhooks$ = new BehaviorSubject([]);
        this._isWebhookLoading$ = new BehaviorSubject(false);
        this._webhookError$ = new BehaviorSubject(null);
    }
    /**
     * Get available triggers
     */
    get triggers$() {
        return this._triggers$.asObservable();
    }
    /**
     * Get available actions
     */
    get actions$() {
        return this._actions$.asObservable();
    }
    /**
     * Get loading state
     */
    get isLoading$() {
        return this._isLoading$.asObservable();
    }
    /**
     * Get error state
     */
    get error$() {
        return this._error$.asObservable();
    }
    /**
     * Get webhooks state
     */
    get webhooks$() {
        return this._webhooks$.asObservable();
    }
    /**
     * Get webhook loading state
     */
    get isWebhookLoading$() {
        return this._isWebhookLoading$.asObservable();
    }
    /**
     * Get webhook error state
     */
    get webhookError$() {
        return this._webhookError$.asObservable();
    }
    /**
     * Set triggers
     */
    setTriggers(triggers) {
        this._triggers$.next(triggers);
    }
    /**
     * Set actions
     */
    setActions(actions) {
        this._actions$.next(actions);
    }
    /**
     * Set loading state
     */
    setLoading(loading) {
        this._isLoading$.next(loading);
    }
    /**
     * Set error state
     */
    setError(error) {
        this._error$.next(error);
    }
    /**
     * Set webhooks
     */
    setWebhooks(webhooks) {
        this._webhooks$.next(webhooks);
    }
    /**
     * Add a new webhook to the store
     */
    addWebhook(webhook) {
        const currentWebhooks = this._webhooks$.getValue();
        this._webhooks$.next([...currentWebhooks, webhook]);
    }
    /**
     * Remove a webhook from the store
     */
    removeWebhook(webhookId) {
        const currentWebhooks = this._webhooks$.getValue();
        this._webhooks$.next(currentWebhooks.filter((webhook) => webhook.id !== webhookId));
    }
    /**
     * Set webhook loading state
     */
    setWebhookLoading(loading) {
        this._isWebhookLoading$.next(loading);
    }
    /**
     * Set webhook error state
     */
    setWebhookError(error) {
        this._webhookError$.next(error);
    }
    /**
     * Clear error state
     */
    clearError() {
        this._error$.next(null);
    }
    /**
     * Clear webhook error state
     */
    clearWebhookError() {
        this._webhookError$.next(null);
    }
    /**
     * Reset store state
     */
    reset() {
        this._triggers$.next([]);
        this._actions$.next([]);
        this._isLoading$.next(false);
        this._error$.next(null);
        this._webhooks$.next([]);
        this._isWebhookLoading$.next(false);
        this._webhookError$.next(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ZapierStoreService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ZapierStoreService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ZapierStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=zapier-store.service.js.map