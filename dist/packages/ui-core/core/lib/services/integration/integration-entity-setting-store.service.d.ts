import { Observable } from 'rxjs';
import { IEntitySettingToSync, IIntegrationEntitySetting, IIntegrationTenant } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export interface IJobMatchingEntity {
    previousValue: IIntegrationEntitySetting | null;
    currentValue: IIntegrationEntitySetting | null;
}
export declare class IntegrationEntitySettingServiceStoreService {
    private _jobMatchingEntity$;
    jobMatchingEntity$: Observable<IJobMatchingEntity>;
    private _entitiesToSync$;
    entitiesToSync$: Observable<IEntitySettingToSync>;
    constructor();
    /**
     * Create an IEntitySettingToSync object based on the provided items.
     * @param items - An array of IIntegrationEntitySetting items.
     * @returns An IEntitySettingToSync object containing previous and current values.
     */
    setEntitySettingsValue(items: IIntegrationEntitySetting[]): void;
    /**
     * Get the current value of entity settings synchronization.
     * @returns The current value as an IEntitySettingToSync object.
     */
    getEntitySettingsValue(): IEntitySettingToSync;
    /**
     * Sets the job matching entity state in the IntegrationEntitySettingServiceStoreService.
     * This function takes a new job matching entity setting and updates the internal state.
     *
     * @param newEntity - The new job matching entity setting to be set. It represents the updated state for job matching entities.
     */
    setJobMatchingEntity(newEntity: IIntegrationEntitySetting): void;
    /**
     * Updates the AI job matching entity setting in IntegrationEntitySettingServiceStoreService
     * based on the provided integration stream.
     *
     * @param integration$ - An Observable stream of IIntegrationTenant representing the integration data.
     * @returns An Observable stream of IIntegrationEntitySetting representing the updated AI job matching entity setting.
     */
    updateAIJobMatchingEntity(integration$: Observable<IIntegrationTenant>): Observable<IIntegrationEntitySetting>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IntegrationEntitySettingServiceStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IntegrationEntitySettingServiceStoreService>;
}
