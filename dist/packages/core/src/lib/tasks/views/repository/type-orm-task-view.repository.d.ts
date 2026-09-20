import { Repository } from 'typeorm';
import { TaskView } from '../view.entity';
export declare class TypeOrmTaskViewRepository extends Repository<TaskView> {
    readonly repository: Repository<TaskView>;
    constructor(repository: Repository<TaskView>);
}
