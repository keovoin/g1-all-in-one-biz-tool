import { IColumns } from 'angular2-smart-table';
import { PageDataTablePageId } from '../../common/component-registry.types';
import { IPageDataTableRegistry, PageDataTableRegistryConfig } from './page-data-table-registry.types';
import * as i0 from "@angular/core";
export declare class PageDataTableRegistryService implements IPageDataTableRegistry {
    /**
     * Registry for storing page data table column configurations.
     *
     * This Map stores arrays of PageDataTableRegistryConfig objects, keyed by PageDataTablePageId.
     */
    private readonly registry;
    /**
     * Retrieves a read-only copy of the data table registry.
     *
     * This method returns a new `Map` instance based on the current state of the registry.
     * This approach ensures that the original `registry` is not directly modified by
     * external code, preserving immutability and encapsulation.
     *
     * @returns A `ReadonlyMap` containing the current data table registry. This map
     *          cannot be modified, ensuring that the internal state remains unchanged.
     */
    getRegistry(): ReadonlyMap<PageDataTablePageId, PageDataTableRegistryConfig[]>;
    /**
     * Register a column configurations.
     *
     * This method registers a new column configuration in the service's internal registry.
     * It ensures that each configuration has a valid location property and checks if a column with the same
     * location and id already exists to prevent duplicate entries. If the configurations are valid and unique,
     * it adds them to the registry.
     *
     * @param config The configuration for the column.
     * @throws Will throw an error if a column with the same location and id has already been registered.
     */
    registerPageDataTableColumn(config: PageDataTableRegistryConfig): void;
    /**
     * Register multiple column configurations.
     *
     * This method registers multiple new column configurations in the service's internal registry.
     * It ensures that each configuration has a valid location property and checks if a column with the same
     * location and id already exists to prevent duplicate entries. If the configurations are valid and unique,
     * it adds them to the registry.
     *
     * @param configs The array of configurations for the columns.
     * @throws Will throw an error if a column with the same location and id has already been registered.
     */
    registerPageDataTableColumns(configs: PageDataTableRegistryConfig[]): void;
    /**
     * Retrieves the data table column configurations associated with a specific registry ID.
     *
     * This method fetches an array of `PageDataTableRegistryConfig` objects that are associated with the provided
     * `PageDataTablePageId`. If any configurations are found, they are sorted based on their `order` property in
     * ascending order. If no configurations are found, an empty array is returned.
     *
     * @param dataTableId The identifier for the data table.
     * @returns An array of `PageDataTableRegistryConfig` objects associated with the specified `dataTableId`,
     *          sorted by the `order` property in ascending order.
     */
    getColumnsByDataTableId(dataTableId: PageDataTablePageId): PageDataTableRegistryConfig[];
    /**
     * Maps a PageDataTableRegistryConfig object to an IColumn object.
     *
     * @param config The PageDataTableRegistryConfig object to map.
     * @returns The corresponding IColumn object.
     */
    private mapConfigToColumn;
    /**
     * Retrieves a list of unique columns for a specific page location, based on the provided location.
     *
     * This method fetches all registered data table columns for the specified `PageDataTablePageId`,
     * removes any duplicate columns based on their location and ID, and maps the remaining configurations
     * to an array of `IColumn` objects.
     *
     * The uniqueness of each column is determined by the combination of its location and ID. If a duplicate
     * column is found (i.e., one with the same location and ID as another), it is filtered out. The resulting
     * list of columns is returned.
     *
     * @param registryId - The identifier used to look up the data table column configurations for a specific page location.
     * @returns An array of `IColumn` objects representing the unique columns for the specified page location.
     */
    getPageDataTableColumns(dataTableId: PageDataTablePageId): IColumns;
    /**
     * Retrieves a specific column configuration by its dataTableId and columnId.
     *
     * @param dataTableId The identifier for the data table.
     * @param columnId The identifier for the column.
     * @returns The `IColumn` object for the specified column, or `null` if not found.
     */
    getColumnById(dataTableId: PageDataTablePageId, columnId: string): IColumns | null;
    /**
     * Deletes a data table from the registry.
     *
     * This method removes the specified data table from the registry. If the data table does not exist,
     * it logs a warning message. Additionally, if the operation is successful, it logs an informational message.
     *
     * @param dataTableId The identifier of the data table to be removed.
     * @returns void
     */
    deleteDataTable(dataTableId: PageDataTablePageId): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PageDataTableRegistryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PageDataTableRegistryService>;
}
