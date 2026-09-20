import { Repository } from 'typeorm';
import { SimWorkflowExecution } from '../sim-workflow-execution.entity';
export declare class TypeOrmSimWorkflowExecutionRepository extends Repository<SimWorkflowExecution> {
    readonly repository: Repository<SimWorkflowExecution>;
    constructor(repository: Repository<SimWorkflowExecution>);
}
