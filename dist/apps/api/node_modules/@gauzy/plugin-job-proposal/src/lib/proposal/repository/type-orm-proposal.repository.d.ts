import { Repository } from 'typeorm';
import { Proposal } from '../proposal.entity';
export declare class TypeOrmProposalRepository extends Repository<Proposal> {
    readonly repository: Repository<Proposal>;
    constructor(repository: Repository<Proposal>);
}
