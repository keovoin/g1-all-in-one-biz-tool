import { Repository } from 'typeorm';
import { Language } from '../language.entity';
export declare class TypeOrmLanguageRepository extends Repository<Language> {
    readonly repository: Repository<Language>;
    constructor(repository: Repository<Language>);
}
