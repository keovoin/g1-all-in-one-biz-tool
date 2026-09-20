import { Repository } from 'typeorm';
import { HelpCenter } from '../help-center.entity';
export declare class TypeOrmHelpCenterRepository extends Repository<HelpCenter> {
    readonly repository: Repository<HelpCenter>;
    constructor(repository: Repository<HelpCenter>);
}
