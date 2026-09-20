import { Repository } from 'typeorm';
import { EmployeeProposalTemplate } from '../employee-proposal-template.entity';
export declare class TypeOrmEmployeeProposalTemplateRepository extends Repository<EmployeeProposalTemplate> {
    readonly repository: Repository<EmployeeProposalTemplate>;
    constructor(repository: Repository<EmployeeProposalTemplate>);
}
