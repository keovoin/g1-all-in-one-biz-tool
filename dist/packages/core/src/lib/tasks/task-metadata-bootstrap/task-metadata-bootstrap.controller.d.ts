import { ITaskMetadataBootstrapResponse } from '@gauzy/contracts';
import { TaskMetadataBootstrapQueryDTO } from './dto';
import { TaskMetadataBootstrapService } from './task-metadata-bootstrap.service';
export declare class TaskMetadataBootstrapController {
    private readonly service;
    constructor(service: TaskMetadataBootstrapService);
    bootstrap(query: TaskMetadataBootstrapQueryDTO): Promise<ITaskMetadataBootstrapResponse>;
}
