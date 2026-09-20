import { Subscription } from 'rxjs';
import { FavoriteService } from './favorite.service';
import { Store } from '../store/store.service';
import { NavMenuSectionItem } from '../nav-builder/nav-builder-types';
import * as i0 from "@angular/core";
export declare class FavoriteStoreService {
    private readonly _favoriteService;
    private readonly _store;
    private readonly _favoriteItems$;
    readonly favoriteItems$: import("rxjs").Observable<NavMenuSectionItem[]>;
    private readonly _refresh$;
    protected _favoriteSubscription?: Subscription;
    constructor(_favoriteService: FavoriteService, _store: Store);
    refreshFavorites(): void;
    private _listenToChangesAndLoadFavorites;
    private _loadFavorites;
    private _truncateTitle;
    private _getFavoriteIcon;
    private _getFavoriteLink;
    static ɵfac: i0.ɵɵFactoryDeclaration<FavoriteStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FavoriteStoreService>;
}
