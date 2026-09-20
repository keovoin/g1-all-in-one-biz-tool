import { ICommandHandler } from '@nestjs/cqrs';
import { JobPreset } from '../../job-preset.entity';
import { CreateJobPresetCommand } from '../create-job-preset.command';
import { TypeOrmJobPresetRepository } from '../../repository/type-orm-job-preset.repository';
import { TypeOrmJobPresetUpworkJobSearchCriterionRepository } from '../../repository/type-orm-job-preset-upwork-job-search-criterion.repository';
export declare class CreateJobPresetHandler implements ICommandHandler<CreateJobPresetCommand> {
    private readonly typeOrmJobPresetRepository;
    private readonly typeOrmJobPresetUpworkJobSearchCriterionRepository;
    constructor(typeOrmJobPresetRepository: TypeOrmJobPresetRepository, typeOrmJobPresetUpworkJobSearchCriterionRepository: TypeOrmJobPresetUpworkJobSearchCriterionRepository);
    /**
     * Executes the command to create a job preset.
     *
     * @param command The command containing the input data for creating the job preset.
     * @returns A Promise that resolves to the created job preset.
     */
    execute(command: CreateJobPresetCommand): Promise<JobPreset>;
}
