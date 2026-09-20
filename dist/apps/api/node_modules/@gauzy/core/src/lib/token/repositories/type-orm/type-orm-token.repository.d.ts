import { Repository } from 'typeorm';
import { Token } from '../../entities/token.entity';
export declare class TypeOrmTokenRepository extends Repository<Token> {
    readonly repository: Repository<Token>;
    constructor(repository: Repository<Token>);
}
