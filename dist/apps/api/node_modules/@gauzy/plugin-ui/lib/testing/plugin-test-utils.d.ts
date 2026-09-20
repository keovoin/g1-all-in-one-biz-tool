import { Observable } from 'rxjs';
import type { PluginUiDefinition, PluginSettingsSchema } from '../plugin-ui.types';
import type { PageExtensionDefinition } from '../plugin-extension/page-extension-slot.types';
import { type PluginEvent, type EmitOptions, type SubscribeOptions } from '../plugin-extension/plugin-event-bus.service';
import { PluginStateService } from '../plugin-host/plugin-state.service';
import { PageExtensionRegistryService } from '../plugin-extension/page-extension-registry.service';
import { PluginSettingsRegistryService } from '../plugin-host/plugin-settings-registry.service';
import { PluginServiceRegistryService } from '../plugin-host/plugin-service-registry.service';
/**
 * Options for creating a test plugin definition.
 */
export interface CreateTestPluginOptions {
    id?: string;
    routes?: PluginUiDefinition['routes'];
    tabs?: PluginUiDefinition['tabs'];
    extensions?: PageExtensionDefinition[];
    translations?: Record<string, Record<string, any>>;
    settings?: PluginSettingsSchema;
    options?: Record<string, unknown>;
}
/**
 * Creates a minimal `PluginUiDefinition` for unit testing.
 *
 * @example
 * ```ts
 * const plugin = createTestPlugin({ id: 'test-plugin' });
 * expect(plugin.id).toBe('test-plugin');
 * expect(plugin.bootstrap).toBeDefined();
 * ```
 */
export declare function createTestPlugin(opts?: CreateTestPluginOptions): PluginUiDefinition;
/**
 * Mock event bus for testing inter-plugin communication.
 *
 * Records all emitted events and provides helpers for asserting.
 *
 * @example
 * ```ts
 * const eventBus = new MockEventBus();
 * eventBus.emit('my-event', { data: 42 });
 * expect(eventBus.emittedEvents).toHaveLength(1);
 * expect(eventBus.getEmittedByType('my-event')[0].payload).toEqual({ data: 42 });
 * ```
 */
export declare class MockEventBus {
    private readonly _stream$;
    private readonly _emitted;
    /** All emitted events. */
    get emittedEvents(): ReadonlyArray<PluginEvent>;
    /** Observable stream of all events (matches PluginEventBusService.events$). */
    readonly events$: Observable<PluginEvent<unknown>>;
    emit<T = unknown>(type: string, payload: T, options?: EmitOptions): void;
    on<T = unknown>(type: string, options?: SubscribeOptions): Observable<PluginEvent<T>>;
    onPattern<T = unknown>(pattern: string, options?: SubscribeOptions): Observable<PluginEvent<T>>;
    once<T = unknown>(type: string, callback: (event: PluginEvent<T>) => void, options?: SubscribeOptions): void;
    /** Gets emitted events filtered by type. */
    getEmittedByType<T = unknown>(type: string): PluginEvent<T>[];
    /** Gets emitted events filtered by source. */
    getEmittedBySource(source: string): PluginEvent[];
    /** Clears all recorded events. */
    clear(): void;
    /** Completes the stream. */
    destroy(): void;
}
/**
 * Options for TestPluginHarness.
 */
export interface TestPluginHarnessOptions {
    /** Custom event bus (defaults to MockEventBus). */
    eventBus?: MockEventBus;
    /** Pre-populate state. */
    initialState?: Record<string, unknown>;
    /** Pre-populate settings. */
    initialSettings?: Record<string, unknown>;
}
/**
 * Test harness for mounting/bootstrapping a plugin in isolation.
 *
 * Provides mock services and utilities for testing plugin behavior
 * without Angular's TestBed.
 *
 * @example
 * ```ts
 * const harness = new TestPluginHarness(myPlugin, {
 *   initialState: { 'my-plugin:count': 0 }
 * });
 *
 * // Bootstrap the plugin
 * await harness.bootstrap();
 *
 * // Access services
 * harness.state.set('my-plugin:count', 42);
 * expect(harness.state.get('my-plugin:count')).toBe(42);
 *
 * // Check registered extensions
 * expect(harness.extensions.getExtensions('dashboard-widgets')).toHaveLength(1);
 *
 * // Check emitted events
 * harness.eventBus.emit('my-event', { data: 'test' });
 * expect(harness.eventBus.emittedEvents).toHaveLength(1);
 *
 * harness.destroy();
 * ```
 */
export declare class TestPluginHarness {
    readonly eventBus: MockEventBus;
    readonly state: PluginStateService;
    readonly extensions: PageExtensionRegistryService;
    readonly settings: PluginSettingsRegistryService;
    readonly serviceRegistry: PluginServiceRegistryService;
    readonly plugin: PluginUiDefinition;
    private _bootstrapped;
    constructor(plugin: PluginUiDefinition, options?: TestPluginHarnessOptions);
    /**
     * Bootstraps the plugin by calling its bootstrap callback (if any)
     * and registering its extensions.
     */
    bootstrap(): Promise<void>;
    /**
     * Cleans up the harness.
     */
    destroy(): void;
    /**
     * Creates a minimal mock injector that returns harness services.
     */
    private _createMockInjector;
}
