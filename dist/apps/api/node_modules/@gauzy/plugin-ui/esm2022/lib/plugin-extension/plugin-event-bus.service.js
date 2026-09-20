import { Injectable } from '@angular/core';
import { Subject, Observable, filter, map } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Plugin Event Bus Service.
 *
 * Provides a centralized event bus for inter-plugin communication.
 * Plugins can emit events and subscribe to events from other plugins.
 *
 * @example
 * ```typescript
 * // Emit an event
 * eventBus.emit('time-tracked', { duration: 3600, projectId: '123' });
 *
 * // Subscribe to events
 * eventBus.on('time-tracked').subscribe(event => {
 *   console.log('Time tracked:', event.payload);
 * });
 *
 * // Subscribe with filtering
 * eventBus.on('*', { source: 'time-tracker-plugin' }).subscribe(event => {
 *   console.log('Event from time-tracker:', event);
 * });
 * ```
 */
export class PluginEventBusService {
    _eventStream$ = new Subject();
    _subscriptions = new Map();
    /**
     * Observable stream of all events.
     */
    events$ = this._eventStream$.asObservable();
    /**
     * Emits an event to the event bus.
     *
     * @param type Event type/name
     * @param payload Event payload data
     * @param options Optional emit options
     */
    emit(type, payload, options) {
        const event = {
            type,
            payload,
            source: options?.source,
            timestamp: Date.now(),
            metadata: options?.metadata
        };
        this._eventStream$.next(event);
    }
    /**
     * Subscribes to events of a specific type.
     *
     * @param type Event type to subscribe to, or '*' for all events
     * @param options Optional subscribe options for filtering
     * @returns Observable of matching events
     */
    on(type, options) {
        return this._eventStream$.pipe(filter((event) => {
            // Type filter
            if (type !== '*' && event.type !== type) {
                return false;
            }
            // Source filter
            if (options?.source && event.source !== options.source) {
                return false;
            }
            // Timestamp filter
            if (options?.afterTimestamp && event.timestamp <= options.afterTimestamp) {
                return false;
            }
            return true;
        }), map((event) => event));
    }
    /**
     * Subscribes to events matching a pattern.
     * Supports wildcards: 'user.*' matches 'user.created', 'user.updated', etc.
     *
     * @param pattern Event type pattern with optional wildcards
     * @param options Optional subscribe options
     * @returns Observable of matching events
     */
    onPattern(pattern, options) {
        // Escape regex metacharacters, then convert wildcard '*' back to '.*'
        const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
        const regex = new RegExp('^' + escaped + '$');
        return this._eventStream$.pipe(filter((event) => {
            if (!regex.test(event.type)) {
                return false;
            }
            if (options?.source && event.source !== options.source) {
                return false;
            }
            if (options?.afterTimestamp && event.timestamp <= options.afterTimestamp) {
                return false;
            }
            return true;
        }), map((event) => event));
    }
    /**
     * Subscribes to an event once, then automatically unsubscribes.
     *
     * @param type Event type to subscribe to
     * @param callback Callback function
     * @param options Optional subscribe options
     */
    once(type, callback, options) {
        const subscription = this.on(type, options).subscribe((event) => {
            callback(event);
            subscription.unsubscribe();
        });
    }
    /**
     * Registers a subscription for a plugin (for automatic cleanup).
     *
     * @param pluginId Plugin ID
     * @param subscription Subscription to track
     */
    registerSubscription(pluginId, subscription) {
        const subs = this._subscriptions.get(pluginId) ?? [];
        subs.push(subscription);
        this._subscriptions.set(pluginId, subs);
    }
    /**
     * Unsubscribes all subscriptions for a plugin.
     * Call this when a plugin is destroyed.
     *
     * @param pluginId Plugin ID
     */
    unsubscribeByPlugin(pluginId) {
        const subs = this._subscriptions.get(pluginId);
        if (subs) {
            subs.forEach((sub) => sub.unsubscribe());
            this._subscriptions.delete(pluginId);
        }
    }
    /**
     * Creates a scoped event emitter for a plugin.
     * Events emitted through this emitter automatically include the plugin source.
     *
     * @param pluginId Plugin ID
     * @returns Scoped event emitter
     */
    forPlugin(pluginId) {
        return new PluginEventEmitter(this, pluginId);
    }
    ngOnDestroy() {
        this._eventStream$.complete();
        this._subscriptions.forEach((subs) => subs.forEach((sub) => sub.unsubscribe()));
        this._subscriptions.clear();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginEventBusService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginEventBusService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PluginEventBusService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/**
 * Scoped event emitter for a specific plugin.
 */
export class PluginEventEmitter {
    _eventBus;
    _pluginId;
    constructor(_eventBus, _pluginId) {
        this._eventBus = _eventBus;
        this._pluginId = _pluginId;
    }
    /**
     * Emits an event with the plugin source automatically set.
     */
    emit(type, payload, metadata) {
        this._eventBus.emit(type, payload, {
            source: this._pluginId,
            metadata
        });
    }
    /**
     * Subscribes to events and registers for automatic cleanup on `destroy()`.
     */
    on(type, options) {
        return this._trackSubscription(this._eventBus.on(type, options));
    }
    /**
     * Subscribes to events matching a pattern and registers for automatic cleanup on `destroy()`.
     */
    onPattern(pattern, options) {
        return this._trackSubscription(this._eventBus.onPattern(pattern, options));
    }
    /**
     * Wraps an observable so that subscriptions are automatically tracked
     * for cleanup when `destroy()` is called.
     */
    _trackSubscription(source$) {
        const pluginId = this._pluginId;
        const eventBus = this._eventBus;
        return new Observable((subscriber) => {
            const sub = source$.subscribe(subscriber);
            eventBus.registerSubscription(pluginId, sub);
            return sub;
        });
    }
    /**
     * Subscribes once then unsubscribes.
     */
    once(type, callback, options) {
        this._eventBus.once(type, callback, options);
    }
    /**
     * Cleans up all subscriptions for this plugin.
     */
    destroy() {
        this._eventBus.unsubscribeByPlugin(this._pluginId);
    }
}
//# sourceMappingURL=plugin-event-bus.service.js.map