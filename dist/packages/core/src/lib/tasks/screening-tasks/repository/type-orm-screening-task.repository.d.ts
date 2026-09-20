import { Repository } from 'typeorm';
import { ScreeningTask } from '../screening-task.entity';
export declare class TypeOrmScreeningTaskRepository extends Repository<ScreeningTask> {
    readonly repository: Repository<ScreeningTask>;
    constructor(repository: Repository<ScreeningTask>);
}
