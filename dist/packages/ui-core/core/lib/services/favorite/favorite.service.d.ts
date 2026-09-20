import { HttpClient } from '@angular/common/http';
import { IFavorite, IFavoriteCreateInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class FavoriteService {
    private http;
    FAVORITE_URL: string;
    constructor(http: HttpClient);
    create(favorite: IFavoriteCreateInput): Promise<IFavorite>;
    findByEmployee(params?: any): Promise<{
        items: IFavorite[];
        total: number;
    }>;
    getFavoriteDetails(params?: any): Promise<{
        items: IFavorite[];
        total: number;
    }>;
    findAll(params?: any): Promise<{
        items: IFavorite[];
        total: number;
    }>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<FavoriteService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FavoriteService>;
}
