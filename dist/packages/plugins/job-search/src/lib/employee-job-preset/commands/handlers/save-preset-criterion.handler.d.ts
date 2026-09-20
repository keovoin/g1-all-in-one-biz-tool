import { IMatchingCriterions } from '@gauzy/contracts';
import { ICommandHandler } from '@nestjs/cqrs';
import { TypeOrmEmployeeRepository } from '@gauzy/core';
import { SavePresetCriterionCommand } from '../save-preset-criterion.command';
import { TypeOrmJobPresetUpworkJobSearchCriterionRepository } from '../../repository/type-orm-job-preset-upwork-job-search-criterion.repository';
export declare class SavePresetCriterionHandler implements ICommandHandler<SavePresetCriterionCommand> {
    private readonly typeOrmEmployeeRepository;
    private readonly typeOrmJobPresetUpworkJobSearchCriterionRepository;
    constructor(typeOrmEmployeeRepository: TypeOrmEmployeeRepository, typeOrmJobPresetUpworkJobSearchCriterionRepository: TypeOrmJobPresetUpworkJobSearchCriterionRepository);
    /**
     * Executes the SavePresetCriterionCommand to save a preset criterion.
     *
     * @param command The command containing the input data for saving the preset criterion.
     * @returns The saved preset criterion.
     */
    execute(command: SavePresetCriterionCommand): Promise<IMatchingCriterions>;
}
