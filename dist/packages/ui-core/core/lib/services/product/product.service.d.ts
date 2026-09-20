import { HttpClient } from '@angular/common/http';
import { IProduct, IProductFindInput, IProductTranslatableCreateInput, IProductTranslatable, IProductTranslated, IImageAsset } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ProductService {
    private http;
    PRODUCTS_URL: string;
    constructor(http: HttpClient);
    getAll(relations?: string[], findInput?: IProductFindInput, languageCode?: string): Promise<{
        items: IProductTranslatable[];
    }>;
    count(findInput: any): Promise<Number>;
    getAllTranslated(options: any, params: any, languageCode?: string): Promise<{
        items: IProductTranslated[];
    }>;
    getOneTranslated(id: string, relations?: string[], languageCode?: string): Promise<IProductTranslated>;
    getById(id: string, relations?: string[], findInput?: IProductFindInput): Promise<IProduct>;
    create(product: IProductTranslatableCreateInput): Promise<IProductTranslatable>;
    update(product: IProductTranslatableCreateInput): Promise<IProductTranslatable>;
    delete(id: string): Promise<any>;
    addGalleryImages(id: string, images: IImageAsset[]): Promise<IProductTranslatable>;
    deleteGalleryImage(id: string, image: IImageAsset): Promise<IProductTranslatable>;
    setAsFeatured(id: string, image: IImageAsset): Promise<IProductTranslatable>;
    deleteFeaturedImage(id: string): Promise<IProductTranslatable>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProductService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ProductService>;
}
