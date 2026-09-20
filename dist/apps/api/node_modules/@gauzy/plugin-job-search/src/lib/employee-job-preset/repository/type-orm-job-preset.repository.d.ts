import { Repository } from 'typeorm';
import { JobPreset } from '../job-preset.entity';
export declare class TypeOrmJobPresetRepository extends Repository<JobPreset> {
    readonly repository: Repository<JobPreset>;
    constructor(repository: Repository<JobPreset>);
}
