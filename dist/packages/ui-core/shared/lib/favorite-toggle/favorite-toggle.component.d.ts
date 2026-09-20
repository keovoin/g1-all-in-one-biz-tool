import { EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseEntityEnum, IFavorite, IOrganization } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { GenericFavoriteService, Store } from '@gauzy/ui-core/core';
import { ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class FavoriteToggleComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _genericFavoriteService;
    private readonly _store;
    private readonly _toastrService;
    entityType: BaseEntityEnum;
    entityId: string;
    entityName?: string;
    size: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
    status: 'basic' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'control';
    disabled: boolean;
    showLabel: boolean;
    spacing: 'default' | 'detail' | 'list';
    favoriteToggled: EventEmitter<{
        isFavorite: boolean;
        favorite?: IFavorite;
    }>;
    organization: IOrganization;
    favorites: IFavorite[];
    loading: boolean;
    constructor(translateService: TranslateService, _genericFavoriteService: GenericFavoriteService, _store: Store, _toastrService: ToastrService);
    ngOnInit(): void;
    /**
     * Load favorites for the current entity type
     */
    private _loadFavorites;
    /**
     * Check if the current entity is a favorite
     */
    get isFavorite(): boolean;
    /**
     * Get CSS classes for the button based on spacing preference
     */
    get buttonClasses(): string;
    /**
     * Get the favorite object for the current entity
     */
    get favoriteObject(): IFavorite | undefined;
    /**
     * Get the appropriate icon based on favorite status
     */
    get icon(): string;
    /**
     * Get the appropriate icon status based on favorite status
     */
    get iconStatus(): string;
    /**
     * Get the appropriate tooltip text
     */
    get tooltipText(): string;
    /**
     * Get the appropriate button label
     */
    get buttonLabel(): string;
    /**
     * Toggle favorite status
     */
    toggleFavorite(): Promise<void>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FavoriteToggleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FavoriteToggleComponent, "ngx-favorite-toggle", never, { "entityType": { "alias": "entityType"; "required": false; }; "entityId": { "alias": "entityId"; "required": false; }; "entityName": { "alias": "entityName"; "required": false; }; "size": { "alias": "size"; "required": false; }; "status": { "alias": "status"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "showLabel": { "alias": "showLabel"; "required": false; }; "spacing": { "alias": "spacing"; "required": false; }; }, { "favoriteToggled": "favoriteToggled"; }, never, never, false, never>;
}
