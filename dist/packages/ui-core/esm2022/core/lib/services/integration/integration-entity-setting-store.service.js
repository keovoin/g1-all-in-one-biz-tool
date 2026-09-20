import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { clone } from 'underscore';
import { IntegrationEntity } from '@gauzy/contracts';
import * as i0 from "@angular/core";
let IntegrationEntitySettingServiceStoreService = class IntegrationEntitySettingServiceStoreService {
    constructor() {
        // Declare a private BehaviorSubject named '_jobMatchingEntity$' with an initial value.
        // This BehaviorSubject will hold and emit the current state of job matching entity settings synchronization.
        this._jobMatchingEntity$ = new BehaviorSubject({
            previousValue: null,
            currentValue: null
        });
        this.jobMatchingEntity$ = this._jobMatchingEntity$.asObservable();
        // Declare a private BehaviorSubject named '_entitiesToSync$' with an initial value.
        // This BehaviorSubject will hold and emit the current state of entity settings synchronization.
        this._entitiesToSync$ = new BehaviorSubject({
            previousValue: [],
            currentValue: []
        });
        // Declare a public Observable named 'entitiesToSync$' that exposes the data from '_entitiesToSync$'.
        this.entitiesToSync$ = this._entitiesToSync$.asObservable();
    }
    /**
     * Create an IEntitySettingToSync object based on the provided items.
     * @param items - An array of IIntegrationEntitySetting items.
     * @returns An IEntitySettingToSync object containing previous and current values.
     */
    setEntitySettingsValue(items) {
        // Create an IEntitySettingToSync object
        this._entitiesToSync$.next({
            previousValue: clone(items), // Clone the input items as the previous value
            currentValue: items // Set the input items as the current value
        });
    }
    /**
     * Get the current value of entity settings synchronization.
     * @returns The current value as an IEntitySettingToSync object.
     */
    getEntitySettingsValue() {
        // Use the 'getValue' method of '_entitiesToSync$' to retrieve the current value
        return this._entitiesToSync$.getValue();
    }
    /**
     * Sets the job matching entity state in the IntegrationEntitySettingServiceStoreService.
     * This function takes a new job matching entity setting and updates the internal state.
     *
     * @param newEntity - The new job matching entity setting to be set. It represents the updated state for job matching entities.
     */
    setJobMatchingEntity(newEntity) {
        // Retrieve the current value from the '_jobMatchingEntity$' BehaviorSubject
        const { currentValue } = this._jobMatchingEntity$.getValue();
        // Update the job matching entity state using 'next' on the BehaviorSubject
        this._jobMatchingEntity$.next({
            previousValue: currentValue,
            currentValue: newEntity
        });
    }
    /**
     * Updates the AI job matching entity setting in IntegrationEntitySettingServiceStoreService
     * based on the provided integration stream.
     *
     * @param integration$ - An Observable stream of IIntegrationTenant representing the integration data.
     * @returns An Observable stream of IIntegrationEntitySetting representing the updated AI job matching entity setting.
     */
    updateAIJobMatchingEntity(integration$) {
        return integration$.pipe(tap((integration) => {
            if (!integration) {
                // If integration is falsy, set a default entity setting and exit the function
                this.setJobMatchingEntity({ entity: IntegrationEntity.JOB_MATCHING, sync: false, isActive: false });
                return;
            }
        }), 
        // Extracting the 'entitySettings' property from the 'integration_tenant' object
        filter((integration) => !!integration && !!integration.isActive), 
        // Maps the integration to its 'entitySettings' property
        map((integration) => integration.entitySettings), 
        // Finding the entity setting related to the specified entity type
        map((entitySettings) => entitySettings.find((setting) => setting.entity === IntegrationEntity.JOB_MATCHING)), filter((entity) => !!entity), 
        // Updating the specified component property with the fetched entity setting
        tap((entity) => this.setJobMatchingEntity(entity)), 
        // Handling the component lifecycle to avoid memory leaks
        untilDestroyed(this));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationEntitySettingServiceStoreService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationEntitySettingServiceStoreService, providedIn: 'root' }); }
};
IntegrationEntitySettingServiceStoreService = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [])
], IntegrationEntitySettingServiceStoreService);
export { IntegrationEntitySettingServiceStoreService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationEntitySettingServiceStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=integration-entity-setting-store.service.js.map