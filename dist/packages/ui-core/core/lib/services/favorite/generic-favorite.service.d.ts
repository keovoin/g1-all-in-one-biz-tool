import { BaseEntityEnum, IFavorite, IOrganization } from '@gauzy/contracts';
import { Store } from '../store/store.service';
import { FavoriteService } from './favorite.service';
import { FavoriteStoreService } from './favorite-store.service';
import * as i0 from "@angular/core";
export declare class GenericFavoriteService {
    private readonly favoriteService;
    private readonly favoriteStoreService;
    private readonly store;
    constructor(favoriteService: FavoriteService, favoriteStoreService: FavoriteStoreService, store: Store);
    /**
     * Loads the list of favorites for a given entity type, for the current user or all for admin.
     * @param entityType The BaseEntityEnum type (e.g., Employee, OrganizationProject, etc.)
     * @param organization The current organization
     * @param employeeId (optional) The employee ID (if not admin)
     */
    loadFavorites(entityType: BaseEntityEnum, organization: IOrganization, employeeId?: string): Promise<IFavorite[]>;
    /**
     * Adds or removes an entity from favorites, then refreshes the sidebar menu.
     * @param entityType The BaseEntityEnum type
     * @param entityId The ID of the entity
     * @param organization The current organization
     * @param employeeId (optional) The employee ID
     * @param currentFavorites The current list of favorites for this entity type
     */
    toggleFavorite(entityType: BaseEntityEnum, entityId: string, organization: IOrganization, employeeId: string | undefined, currentFavorites: IFavorite[]): Promise<void>;
    /**
     * Checks if an entity is a favorite in the provided list.
     * @param entityId The ID of the entity
     * @param entityType The BaseEntityEnum type
     * @param favorites The list of favorites
     */
    isFavorite(entityId: string, entityType: BaseEntityEnum, favorites: IFavorite[]): boolean;
    /**
     * Finds the favorite object for a given entity in the provided list.
     * @param entityId The ID of the entity
     * @param entityType The BaseEntityEnum type
     * @param favorites The list of favorites
     */
    getFavoriteForEntity(entityId: string, entityType: BaseEntityEnum, favorites: IFavorite[]): IFavorite | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<GenericFavoriteService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GenericFavoriteService>;
}
