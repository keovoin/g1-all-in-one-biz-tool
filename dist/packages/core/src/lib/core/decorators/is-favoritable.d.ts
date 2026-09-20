import { BaseEntityEnum } from '@gauzy/contracts';
export declare const FAVORITE_SERVICE = "FAVORITE_SERVICE";
export declare const FAVORITABLE_TYPE = "favoriteEntity";
export declare const FavoriteService: (type: BaseEntityEnum) => import("@nestjs/common").CustomDecorator<string>;
