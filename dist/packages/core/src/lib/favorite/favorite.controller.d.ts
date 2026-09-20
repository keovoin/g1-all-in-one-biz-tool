import { DeleteResult } from 'typeorm';
import { ID, IFavorite } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../core/crud';
import { Favorite } from './favorite.entity';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDTO } from './dto';
export declare class FavoriteController extends CrudController<Favorite> {
    private readonly favoriteService;
    constructor(favoriteService: FavoriteService);
    /**
     * @description Mark entity element as favorite
     * @param {IFavoriteCreateInput} entity - Data to create favorite element
     * @returns A promise that resolves to the created or found favorite element
     * @memberof FavoriteService
     */
    create(entity: CreateFavoriteDTO): Promise<IFavorite>;
    /**
     * @description Find favorites by employee
     * @param {BaseQueryDTO<Favorite>} params Filter criteria to find favorites
     * @returns A promise that resolves to paginated list of favorites
     * @memberof FavoriteController
     */
    findFavoritesByEmployee(params: BaseQueryDTO<Favorite>): Promise<import("@gauzy/contracts").IPagination<IFavorite>>;
    /**
     * @description Get favorites elements details
     * @param params - Favorite query params
     * @returns A promise resolved at favorites elements records
     * @memberof FavoriteController
     */
    getFavoriteDetails(params: BaseQueryDTO<Favorite>): Promise<any>;
    /**
     * @description Delete element from favorites for current employee
     * @param {ID} id - The favorite ID to be deleted
     * @returns  A promise that resolved at the deleteResult
     * @memberof FavoriteController
     */
    delete(id: ID): Promise<DeleteResult>;
}
