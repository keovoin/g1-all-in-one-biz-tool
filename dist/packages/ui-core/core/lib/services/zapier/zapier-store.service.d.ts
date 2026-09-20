import { Observable } from 'rxjs';
import { IZapierEndpoint, IZapierWebhook } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ZapierStoreService {
    private _triggers$;
    private _actions$;
    private _isLoading$;
    private _error$;
    private _webhooks$;
    private _isWebhookLoading$;
    private _webhookError$;
    /**
     * Get available triggers
     */
    get triggers$(): Observable<IZapierEndpoint[]>;
    /**
     * Get available actions
     */
    get actions$(): Observable<IZapierEndpoint[]>;
    /**
     * Get loading state
     */
    get isLoading$(): Observable<boolean>;
    /**
     * Get error state
     */
    get error$(): Observable<string>;
    /**
     * Get webhooks state
     */
    get webhooks$(): Observable<IZapierWebhook[]>;
    /**
     * Get webhook loading state
     */
    get isWebhookLoading$(): Observable<boolean>;
    /**
     * Get webhook error state
     */
    get webhookError$(): Observable<string>;
    /**
     * Set triggers
     */
    setTriggers(triggers: IZapierEndpoint[]): void;
    /**
     * Set actions
     */
    setActions(actions: IZapierEndpoint[]): void;
    /**
     * Set loading state
     */
    setLoading(loading: boolean): void;
    /**
     * Set error state
     */
    setError(error: string): void;
    /**
     * Set webhooks
     */
    setWebhooks(webhooks: IZapierWebhook[]): void;
    /**
     * Add a new webhook to the store
     */
    addWebhook(webhook: IZapierWebhook): void;
    /**
     * Remove a webhook from the store
     */
    removeWebhook(webhookId: string): void;
    /**
     * Set webhook loading state
     */
    setWebhookLoading(loading: boolean): void;
    /**
     * Set webhook error state
     */
    setWebhookError(error: string): void;
    /**
     * Clear error state
     */
    clearError(): void;
    /**
     * Clear webhook error state
     */
    clearWebhookError(): void;
    /**
     * Reset store state
     */
    reset(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ZapierStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ZapierStoreService>;
}
