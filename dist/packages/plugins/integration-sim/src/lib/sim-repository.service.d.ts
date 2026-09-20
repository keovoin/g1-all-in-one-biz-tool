import { TenantAwareCrudService } from '@gauzy/core';
import { SimWorkflowExecution } from './sim-workflow-execution.entity';
import { TypeOrmSimWorkflowExecutionRepository } from './repository/type-orm-sim-workflow-execution.repository';
import { MikroOrmSimWorkflowExecutionRepository } from './repository/mikro-orm-sim-workflow-execution.repository';
export declare class SimRepositoryService extends TenantAwareCrudService<SimWorkflowExecution> {
    readonly typeOrmSimWorkflowExecutionRepository: TypeOrmSimWorkflowExecutionRepository;
    readonly mikroOrmSimWorkflowExecutionRepository: MikroOrmSimWorkflowExecutionRepository;
    constructor(typeOrmSimWorkflowExecutionRepository: TypeOrmSimWorkflowExecutionRepository, mikroOrmSimWorkflowExecutionRepository: MikroOrmSimWorkflowExecutionRepository);
}
