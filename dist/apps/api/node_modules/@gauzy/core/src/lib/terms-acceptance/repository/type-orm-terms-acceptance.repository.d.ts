import { Repository } from 'typeorm';
import { TermsAcceptance } from '../terms-acceptance.entity';
export declare class TypeOrmTermsAcceptanceRepository extends Repository<TermsAcceptance> {
    readonly repository: Repository<TermsAcceptance>;
    constructor(repository: Repository<TermsAcceptance>);
}
