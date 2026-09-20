import { Injectable } from '@angular/core';
import { PermissionsEnum } from '@gauzy/contracts';
import { Store } from '../store/store.service';
import { FavoriteService } from './favorite.service';
import { FavoriteStoreService } from './favorite-store.service';
import * as i0 from "@angular/core";
import * as i1 from "./favorite.service";
import * as i2 from "./favorite-store.service";
import * as i3 from "../store/store.service";
export class GenericFavoriteService {
    constructor(favoriteService, favoriteStoreService, store) {
        this.favoriteService = favoriteService;
        this.favoriteStoreService = favoriteStoreService;
        this.store = store;
    }
    /**
     * Loads the list of favorites for a given entity type, for the current user or all for admin.
     * @param entityType The BaseEntityEnum type (e.g., Employee, OrganizationProject, etc.)
     * @param organization The current organization
     * @param employeeId (optional) The employee ID (if not admin)
     */
    async loadFavorites(entityType, organization, employeeId) {
        const { id: organizationId, tenantId } = organization || {};
        if (!organizationId || !tenantId) {
            return [];
        }
        const isAdmin = this.store.hasAnyPermission(PermissionsEnum.ALL_ORG_VIEW);
        let items = [];
        if (isAdmin && !employeeId) {
            // Admin: fetch all favorites for the organization
            const result = await this.favoriteService.findAll({
                where: {
                    organizationId,
                    tenantId,
                    entity: entityType
                }
            });
            items = result.items;
        }
        else {
            // Normal user: fetch only the current employee's favorites
            const effectiveEmployeeId = employeeId || this.store.user?.employee?.id;
            if (!effectiveEmployeeId) {
                return [];
            }
            const result = await this.favoriteService.findByEmployee({
                where: {
                    organizationId,
                    tenantId,
                    employeeId: effectiveEmployeeId,
                    entity: entityType
                }
            });
            items = result.items;
        }
        return items;
    }
    /**
     * Adds or removes an entity from favorites, then refreshes the sidebar menu.
     * @param entityType The BaseEntityEnum type
     * @param entityId The ID of the entity
     * @param organization The current organization
     * @param employeeId (optional) The employee ID
     * @param currentFavorites The current list of favorites for this entity type
     */
    async toggleFavorite(entityType, entityId, organization, employeeId, currentFavorites) {
        if (!entityType || !entityId || !organization?.id || !organization?.tenantId) {
            throw new Error('Invalid parameters: entityType, entityId, and organization with id/tenantId are required');
        }
        if (!Array.isArray(currentFavorites)) {
            throw new Error('currentFavorites must be an array');
        }
        try {
            const isFav = this.isFavorite(entityId, entityType, currentFavorites);
            if (isFav) {
                // Remove from favorites
                const fav = this.getFavoriteForEntity(entityId, entityType, currentFavorites);
                if (fav) {
                    await this.favoriteService.delete(fav.id);
                }
            }
            else {
                // Add to favorites
                const { id: organizationId, tenantId } = organization;
                const effectiveEmployeeId = employeeId || this.store.user?.employee?.id;
                const input = {
                    entity: entityType,
                    entityId,
                    organizationId,
                    tenantId,
                    employeeId: effectiveEmployeeId
                };
                await this.favoriteService.create(input);
            }
            // Refresh the sidebar menu
            // Refresh the sidebar menu
            this.favoriteStoreService.refreshFavorites();
        }
        catch (error) {
            console.error('Error toggling favorite:', error);
            throw new Error('Failed to update favorite status');
        }
    }
    /**
     * Checks if an entity is a favorite in the provided list.
     * @param entityId The ID of the entity
     * @param entityType The BaseEntityEnum type
     * @param favorites The list of favorites
     */
    isFavorite(entityId, entityType, favorites) {
        return favorites.some((fav) => fav.entityId === entityId && fav.entity === entityType);
    }
    /**
     * Finds the favorite object for a given entity in the provided list.
     * @param entityId The ID of the entity
     * @param entityType The BaseEntityEnum type
     * @param favorites The list of favorites
     */
    getFavoriteForEntity(entityId, entityType, favorites) {
        return favorites.find((fav) => fav.entityId === entityId && fav.entity === entityType);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GenericFavoriteService, deps: [{ token: i1.FavoriteService }, { token: i2.FavoriteStoreService }, { token: i3.Store }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GenericFavoriteService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GenericFavoriteService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.FavoriteService }, { type: i2.FavoriteStoreService }, { type: i3.Store }] });
//# sourceMappingURL=generic-favorite.service.js.map