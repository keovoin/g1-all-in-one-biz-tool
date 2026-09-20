import { ICommandHandler } from '@nestjs/cqrs';
import { GauzyAIService } from '@gauzy/plugin-integration-ai';
import { IMatchingCriterions } from '@gauzy/contracts';
import { TypeOrmEmployeeRepository } from '@gauzy/core';
import { SaveEmployeeCriterionCommand } from '../save-employee-criterion.command';
import { TypeOrmEmployeeUpworkJobsSearchCriterionRepository } from '../../repository/type-orm-employee-upwork-jobs-search-criterion.repository';
export declare class SaveEmployeeCriterionHandler implements ICommandHandler<SaveEmployeeCriterionCommand> {
    private readonly typeOrmEmployeeRepository;
    private readonly typeOrmEmployeeUpworkJobsSearchCriterionRepository;
    private readonly _gauzyAIService;
    constructor(typeOrmEmployeeRepository: TypeOrmEmployeeRepository, typeOrmEmployeeUpworkJobsSearchCriterionRepository: TypeOrmEmployeeUpworkJobsSearchCriterionRepository, _gauzyAIService: GauzyAIService);
    /**
     * Executes the logic to save employee criterion.
     * @param command The command containing the input data.
     * @returns Promise<IMatchingCriterions> A promise resolving to the created matching criterion.
     */
    execute(command: SaveEmployeeCriterionCommand): Promise<IMatchingCriterions>;
}
