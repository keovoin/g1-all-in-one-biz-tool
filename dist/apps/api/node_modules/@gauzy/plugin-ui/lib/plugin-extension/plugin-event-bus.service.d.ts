import { OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Event payload for plugin events.
 */
export interface PluginEvent<T = unknown> {
    /** Event type/name */
    type: string;
    /** Event payload data */
    payload: T;
    /** Source plugin ID */
    source?: string;
    /** Timestamp when the event was emitted */
    timestamp: number;
    /** Optional metadata */
    metadata?: Record<string, unknown>;
}
/**
 * Options for emitting events.
 */
export interface EmitOptions {
    /** Source plugin ID */
    source?: string;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
}
/**
 * Options for subscribing to events.
 */
export interface SubscribeOptions {
    /** Filter events by source plugin */
    source?: string;
    /** Only receive events emitted after this timestamp */
    afterTimestamp?: number;
}
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
export declare class PluginEventBusService implements OnDestroy {
    private readonly _eventStream$;
    private readonly _subscriptions;
    /**
     * Observable stream of all events.
     */
    readonly events$: Observable<PluginEvent<unknown>>;
    /**
     * Emits an event to the event bus.
     *
     * @param type Event type/name
     * @param payload Event payload data
     * @param options Optional emit options
     */
    emit<T = unknown>(type: string, payload: T, options?: EmitOptions): void;
    /**
     * Subscribes to events of a specific type.
     *
     * @param type Event type to subscribe to, or '*' for all events
     * @param options Optional subscribe options for filtering
     * @returns Observable of matching events
     */
    on<T = unknown>(type: string, options?: SubscribeOptions): Observable<PluginEvent<T>>;
    /**
     * Subscribes to events matching a pattern.
     * Supports wildcards: 'user.*' matches 'user.created', 'user.updated', etc.
     *
     * @param pattern Event type pattern with optional wildcards
     * @param options Optional subscribe options
     * @returns Observable of matching events
     */
    onPattern<T = unknown>(pattern: string, options?: SubscribeOptions): Observable<PluginEvent<T>>;
    /**
     * Subscribes to an event once, then automatically unsubscribes.
     *
     * @param type Event type to subscribe to
     * @param callback Callback function
     * @param options Optional subscribe options
     */
    once<T = unknown>(type: string, callback: (event: PluginEvent<T>) => void, options?: SubscribeOptions): void;
    /**
     * Registers a subscription for a plugin (for automatic cleanup).
     *
     * @param pluginId Plugin ID
     * @param subscription Subscription to track
     */
    registerSubscription(pluginId: string, subscription: Subscription): void;
    /**
     * Unsubscribes all subscriptions for a plugin.
     * Call this when a plugin is destroyed.
     *
     * @param pluginId Plugin ID
     */
    unsubscribeByPlugin(pluginId: string): void;
    /**
     * Creates a scoped event emitter for a plugin.
     * Events emitted through this emitter automatically include the plugin source.
     *
     * @param pluginId Plugin ID
     * @returns Scoped event emitter
     */
    forPlugin(pluginId: string): PluginEventEmitter;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PluginEventBusService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PluginEventBusService>;
}
/**
 * Scoped event emitter for a specific plugin.
 */
export declare class PluginEventEmitter {
    private readonly _eventBus;
    private readonly _pluginId;
    constructor(_eventBus: PluginEventBusService, _pluginId: string);
    /**
     * Emits an event with the plugin source automatically set.
     */
    emit<T = unknown>(type: string, payload: T, metadata?: Record<string, unknown>): void;
    /**
     * Subscribes to events and registers for automatic cleanup on `destroy()`.
     */
    on<T = unknown>(type: string, options?: SubscribeOptions): Observable<PluginEvent<T>>;
    /**
     * Subscribes to events matching a pattern and registers for automatic cleanup on `destroy()`.
     */
    onPattern<T = unknown>(pattern: string, options?: SubscribeOptions): Observable<PluginEvent<T>>;
    /**
     * Wraps an observable so that subscriptions are automatically tracked
     * for cleanup when `destroy()` is called.
     */
    private _trackSubscription;
    /**
     * Subscribes once then unsubscribes.
     */
    once<T = unknown>(type: string, callback: (event: PluginEvent<T>) => void, options?: SubscribeOptions): void;
    /**
     * Cleans up all subscriptions for this plugin.
     */
    destroy(): void;
}
