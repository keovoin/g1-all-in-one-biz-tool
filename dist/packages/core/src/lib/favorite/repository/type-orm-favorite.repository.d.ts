import { Repository } from 'typeorm';
import { Favorite } from '../favorite.entity';
export declare class TypeOrmFavoriteRepository extends Repository<Favorite> {
    readonly repository: Repository<Favorite>;
    constructor(repository: Repository<Favorite>);
}
