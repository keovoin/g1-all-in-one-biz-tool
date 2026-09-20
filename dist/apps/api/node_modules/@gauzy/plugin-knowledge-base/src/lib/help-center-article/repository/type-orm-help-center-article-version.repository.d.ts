import { Repository } from 'typeorm';
import { HelpCenterArticleVersion } from '../help-center-article-version.entity';
export declare class TypeOrmHelpCenterArticleVersionRepository extends Repository<HelpCenterArticleVersion> {
    readonly repository: Repository<HelpCenterArticleVersion>;
    constructor(repository: Repository<HelpCenterArticleVersion>);
}
