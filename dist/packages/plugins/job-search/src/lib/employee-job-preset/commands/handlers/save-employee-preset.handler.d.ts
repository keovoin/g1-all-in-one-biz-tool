import { ICommandHandler } from '@nestjs/cqrs';
import { GauzyAIService } from '@gauzy/plugin-integration-ai';
import { TypeOrmEmployeeRepository } from '@gauzy/core';
import { JobPreset } from '../../job-preset.entity';
import { SaveEmployeePresetCommand } from '../save-employee-preset.command';
import { TypeOrmJobPresetRepository } from '../../repository/type-orm-job-preset.repository';
import { TypeOrmEmployeeUpworkJobsSearchCriterionRepository } from '../../repository/type-orm-employee-upwork-jobs-search-criterion.repository';
export declare class SaveEmployeePresetHandler implements ICommandHandler<SaveEmployeePresetCommand> {
    private readonly _typeOrmJobPresetRepository;
    private readonly _typeOrmEmployeeRepository;
    private readonly _typeOrmEmployeeUpworkJobsSearchCriterionRepository;
    private readonly _gauzyAIService;
    constructor(_typeOrmJobPresetRepository: TypeOrmJobPresetRepository, _typeOrmEmployeeRepository: TypeOrmEmployeeRepository, _typeOrmEmployeeUpworkJobsSearchCriterionRepository: TypeOrmEmployeeUpworkJobsSearchCriterionRepository, _gauzyAIService: GauzyAIService);
    /**
     * Saves employee presets and syncs job search criteria.
     *
     * @param command The SaveEmployeePresetCommand object containing input data.
     * @returns A Promise resolving to an array of JobPreset objects.
     */
    execute(command: SaveEmployeePresetCommand): Promise<JobPreset[]>;
}
