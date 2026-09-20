// ─── definePluginEvent ──────────────────────────────────────────────────────
/**
 * Defines a strongly-typed plugin event.
 *
 * Returns a contract object that can be used to create type-safe emitters
 * and subscribers. The contract itself is a plain data object — it does NOT
 * reference the event bus, so it can be used in plugin definitions without
 * Angular DI.
 *
 * Convention: prefix event types with the plugin ID (e.g. 'time-tracker:time-tracked').
 *
 * @example
 * ```ts
 * // Define events in your plugin's event file:
 * interface TimeTrackedPayload {
 *   duration: number;
 *   projectId: string;
 *   taskId?: string;
 * }
 *
 * export const TimeTrackedEvent = definePluginEvent<TimeTrackedPayload>(
 *   'time-tracker',
 *   'time-tracker:time-tracked',
 *   'Emitted when time tracking stops with the tracked duration.'
 * );
 *
 * // Emit (in your plugin code):
 * const handle = bindEventTobus(TimeTrackedEvent, eventBus);
 * handle.emit({ duration: 3600, projectId: '123' });
 *
 * // Subscribe (in another plugin):
 * const handle = bindEventToBus(TimeTrackedEvent, eventBus);
 * handle.on().subscribe(event => {
 *   console.log('Tracked:', event.payload.duration); // ← fully typed
 * });
 * ```
 *
 * @param pluginId The owning plugin ID.
 * @param type The event type string (unique across plugins).
 * @param description Optional human-readable description.
 */
export function definePluginEvent(pluginId, type, description) {
    return Object.freeze({ type, pluginId, description });
}
// ─── bindEventToBus ─────────────────────────────────────────────────────────
/**
 * Binds an event contract to the event bus, returning a type-safe handle.
 *
 * @example
 * ```ts
 * // In Angular service or plugin bootstrap:
 * const handle = bindEventToBus(TimeTrackedEvent, this.eventBus);
 * handle.emit({ duration: 3600, projectId: '123' });
 *
 * // In React via useInjector:
 * const eventBus = useInjector(PluginEventBusService);
 * const handle = useMemo(() => bindEventToBus(TimeTrackedEvent, eventBus), [eventBus]);
 * handle.on().subscribe(event => { ... });
 * ```
 */
export function bindEventToBus(contract, eventBus) {
    return {
        contract,
        emit(payload, metadata) {
            eventBus.emit(contract.type, payload, {
                source: contract.pluginId,
                metadata
            });
        },
        on(options) {
            return eventBus.on(contract.type, options);
        },
        once(callback, options) {
            eventBus.once(contract.type, callback, options);
        }
    };
}
/**
 * Registry for plugin event schemas.
 *
 * Allows plugins to declare which events they emit and consume,
 * enabling introspection, documentation, and runtime validation.
 *
 * @example
 * ```ts
 * const registry = new PluginEventSchemaRegistry();
 *
 * // Plugin A declares it emits TimeTrackedEvent:
 * registry.registerEmitter('time-tracker', TimeTrackedEvent);
 *
 * // Plugin B declares it consumes TimeTrackedEvent:
 * registry.registerConsumer('analytics', TimeTrackedEvent);
 *
 * // Introspect:
 * registry.getEventsForPlugin('time-tracker'); // → [{ contract, direction: 'emits' }]
 * registry.getConsumersOf('time-tracker:time-tracked'); // → ['analytics']
 * ```
 */
export class PluginEventSchemaRegistry {
    _schemas = new Map();
    /**
     * Registers that a plugin emits an event.
     */
    registerEmitter(pluginId, contract) {
        this._register(pluginId, contract, 'emits');
    }
    /**
     * Registers that a plugin consumes an event.
     */
    registerConsumer(pluginId, contract) {
        this._register(pluginId, contract, 'consumes');
    }
    /**
     * Gets all event schemas for a plugin.
     */
    getEventsForPlugin(pluginId) {
        const entries = this._schemas.get(pluginId);
        return entries ? Array.from(entries.values()) : [];
    }
    /**
     * Gets all plugin IDs that emit a specific event type.
     */
    getEmittersOf(eventType) {
        const result = [];
        for (const [pluginId, entries] of this._schemas) {
            const entry = entries.get(eventType);
            if (entry && (entry.direction === 'emits' || entry.direction === 'both')) {
                result.push(pluginId);
            }
        }
        return result;
    }
    /**
     * Gets all plugin IDs that consume a specific event type.
     */
    getConsumersOf(eventType) {
        const result = [];
        for (const [pluginId, entries] of this._schemas) {
            const entry = entries.get(eventType);
            if (entry && (entry.direction === 'consumes' || entry.direction === 'both')) {
                result.push(pluginId);
            }
        }
        return result;
    }
    /**
     * Gets all registered event types.
     */
    getAllEventTypes() {
        const types = new Set();
        for (const entries of this._schemas.values()) {
            for (const key of entries.keys()) {
                types.add(key);
            }
        }
        return Array.from(types);
    }
    /**
     * Unregisters all schemas for a plugin.
     */
    unregisterByPlugin(pluginId) {
        this._schemas.delete(pluginId);
    }
    /**
     * Clears all schemas.
     */
    clear() {
        this._schemas.clear();
    }
    _register(pluginId, contract, direction) {
        if (!this._schemas.has(pluginId)) {
            this._schemas.set(pluginId, new Map());
        }
        const entries = this._schemas.get(pluginId);
        const existing = entries.get(contract.type);
        if (existing) {
            // If already registered in opposite direction, mark as 'both'
            if (existing.direction !== direction) {
                entries.set(contract.type, { contract, direction: 'both' });
            }
        }
        else {
            entries.set(contract.type, { contract, direction });
        }
    }
}
//# sourceMappingURL=plugin-event-contracts.js.map