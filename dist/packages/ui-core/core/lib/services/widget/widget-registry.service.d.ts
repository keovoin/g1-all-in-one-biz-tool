import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { IWidgetRegistry, WidgetCategory, WidgetPageLocationId, WidgetRegistryConfig } from './widget-registry.types';
import * as i0 from "@angular/core";
export declare class WidgetRegistryService implements IWidgetRegistry {
    /**
     * @description
     * Registry for storing page widget configurations.
     *
     * This Map stores arrays of WidgetRegistryConfig objects, keyed by WidgetPageLocationId.
     */
    private readonly registry;
    /**
     * Global `widgetId` -> config index, so a persisted placement can resolve
     * its widget without knowing which location registered it.
     */
    private readonly byId;
    /** Resolved component cache, so a widget dropped twice only loads once. */
    private readonly componentCache;
    private readonly _widgets$;
    /**
     * All registered widgets, emitting again whenever registrations change
     * (plugins register during app initialization and may be enabled later).
     */
    readonly widgets$: Observable<WidgetRegistryConfig[]>;
    /**
     * Retrieves the current widget registry.
     *
     * This method returns a map of widget configurations, organized by their page locations.
     *
     * @returns A `Map` where each key is a `WidgetPageLocationId` and each value is an array of
     *          `WidgetRegistryConfig` objects associated with that page location.
     */
    getRegistry(): ReadonlyMap<WidgetPageLocationId, WidgetRegistryConfig[]>;
    /**
     * Registers a single widget with the service.
     *
     * This method is responsible for registering a widget by adding its configuration
     * to the widget registry. It ensures that the widget configuration includes the
     * necessary properties (`widgetId` and `location`) before proceeding to add it
     * to the registry. If any of these properties are missing, it throws an error.
     *
     * @param config - The configuration object for the widget to be registered.
     * @throws Error - Throws an error if the `widgetId` or `location` properties are missing.
     */
    registerWidget(config: WidgetRegistryConfig): void;
    /**
     * Registers a widget, replacing any existing registration with the same id.
     *
     * Unlike {@link registerWidget} this never throws on duplicates, which makes
     * it safe for hot module replacement and for plugins that re-register when
     * they are toggled on and off at runtime.
     *
     * @param config - The configuration object for the widget.
     */
    registerOrReplaceWidget(config: WidgetRegistryConfig): void;
    /**
     * Retrieves a widget configuration by its global id, regardless of the
     * location it was registered at.
     *
     * @param widgetId - The registry key persisted on a dashboard placement.
     * @returns The widget configuration, or `undefined` when it is not registered
     *          (e.g. its plugin is disabled, or the widget was removed).
     */
    getWidget(widgetId: string): WidgetRegistryConfig | undefined;
    /**
     * Streams the registered widgets, optionally narrowed to one palette category.
     *
     * @param category - Optional category filter.
     */
    getWidgets$(category?: WidgetCategory): Observable<WidgetRegistryConfig[]>;
    /**
     * Resolves (and caches) the component class backing a widget.
     *
     * @param widgetId - The widget's registry key.
     * @returns The component type, or `null` when the widget is unknown or
     *          declares no component.
     */
    resolveComponent(widgetId: string): Promise<Type<any> | null>;
    /** Emits the flattened registry to `widgets$` subscribers. */
    private publish;
    /**
     * Registers multiple widgets with the service.
     *
     * This method adds multiple widget configurations to the registry. It processes each
     * configuration sequentially by calling `registerWidget` for each one.
     *
     * @param configs An array of configuration objects for the widgets to be registered. Each
     *                object in the array should follow the `WidgetRegistryConfig` schema.
     * @throws Error if any widget ID is missing or if any widget ID already exists.
     */
    registerWidgets(configs: WidgetRegistryConfig[]): void;
    /**
     * Retrieves the widgets registered at a specific location.
     *
     * @param location - The location for which to retrieve the widgets.
     *
     * @returns An array of `WidgetRegistryConfig` objects registered at the specified location.
     *          If no widgets are registered at the location, an empty array is returned.
     */
    getLocationWidgets(location: WidgetPageLocationId): WidgetRegistryConfig[];
    static ɵfac: i0.ɵɵFactoryDeclaration<WidgetRegistryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WidgetRegistryService>;
}
