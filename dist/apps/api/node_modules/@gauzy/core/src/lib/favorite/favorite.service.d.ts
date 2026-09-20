import { DeleteResult } from 'typeorm';
import { ID, IFavorite, IFavoriteCreateInput, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO, TenantAwareCrudService } from './../core/crud';
import { Favorite } from './favorite.entity';
import { TypeOrmFavoriteRepository } from './repository/type-orm-favorite.repository';
import { MikroOrmFavoriteRepository } from './repository/mikro-orm-favorite.repository';
import { EmployeeService } from '../employee/employee.service';
import { GlobalFavoriteDiscoveryService } from './global-favorite-service.service';
export declare class FavoriteService extends TenantAwareCrudService<Favorite> {
    private readonly favoriteDiscoveryService;
    readonly typeOrmFavoriteRepository: TypeOrmFavoriteRepository;
    readonly mikroOrmFavoriteRepository: MikroOrmFavoriteRepository;
    private readonly employeeService;
    constructor(favoriteDiscoveryService: GlobalFavoriteDiscoveryService, typeOrmFavoriteRepository: TypeOrmFavoriteRepository, mikroOrmFavoriteRepository: MikroOrmFavoriteRepository, employeeService: EmployeeService);
    /**
     * @description Find favorites by employee
     * @param {BaseQueryDTO<Favorite>} options Filter criteria to find favorites
     * @returns A promise that resolves to paginated list of favorites
     * @memberof FavoriteService
     */
    findFavoritesByEmployee(options: BaseQueryDTO<Favorite>): Promise<IPagination<IFavorite>>;
    /**
     * @description Mark entity element as favorite
     * @param {IFavoriteCreateInput} entity - Data to create favorite element
     * @returns A promise that resolves to the created or found favorite element
     * @memberof FavoriteService
     */
    create(entity: IFavoriteCreateInput): Promise<IFavorite>;
    /**
     * Checks if the current user has an admin or super admin role
     */
    private hasAdminRole;
    /**
     * @description Delete element from favorites for current employee
     * @param {ID} id - The favorite ID to be deleted
     * @returns  A promise that resolved at the deleteResult
     * @memberof FavoriteService
     */
    delete(id: ID): Promise<DeleteResult>;
    /**
     * @description Get favorites elements details
     * @param options - Favorite query params
     * @returns A promise resolved at favorites elements records
     * @memberof FavoriteService
     */
    getFavoriteDetails(options?: BaseQueryDTO<Favorite>): Promise<any>;
}
