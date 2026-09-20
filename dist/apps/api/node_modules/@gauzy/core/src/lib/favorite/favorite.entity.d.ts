import { EntityRepositoryType } from '@mikro-orm/core';
import { ID, IEmployee, IFavorite } from '@gauzy/contracts';
import { BasePerEntityType } from '../core/entities/internal';
import { MikroOrmFavoriteRepository } from './repository/mikro-orm-favorite.repository';
export declare class Favorite extends BasePerEntityType implements IFavorite {
    [EntityRepositoryType]?: MikroOrmFavoriteRepository;
    /**
     * Employee
     */
    employee?: IEmployee;
    employeeId?: ID;
}
