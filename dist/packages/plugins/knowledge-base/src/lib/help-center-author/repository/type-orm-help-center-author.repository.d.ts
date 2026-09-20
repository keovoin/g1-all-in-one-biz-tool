import { Repository } from 'typeorm';
import { HelpCenterAuthor } from '../help-center-author.entity';
export declare class TypeOrmHelpCenterAuthorRepository extends Repository<HelpCenterAuthor> {
    readonly repository: Repository<HelpCenterAuthor>;
    constructor(repository: Repository<HelpCenterAuthor>);
}
