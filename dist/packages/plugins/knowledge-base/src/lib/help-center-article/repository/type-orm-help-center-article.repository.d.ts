import { Repository } from 'typeorm';
import { HelpCenterArticle } from '../help-center-article.entity';
export declare class TypeOrmHelpCenterArticleRepository extends Repository<HelpCenterArticle> {
    readonly repository: Repository<HelpCenterArticle>;
    constructor(repository: Repository<HelpCenterArticle>);
}
