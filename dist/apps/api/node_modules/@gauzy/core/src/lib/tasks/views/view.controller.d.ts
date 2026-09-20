import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { ID, IPagination, ITaskView } from '@gauzy/contracts';
import { CrudController, FindOptionsQueryDTO, BaseQueryDTO } from '../../core/crud';
import { TaskView } from './view.entity';
import { TaskViewService } from './view.service';
import { CreateViewDTO, UpdateViewDTO } from './dto';
export declare class TaskViewController extends CrudController<TaskView> {
    private readonly taskViewService;
    private readonly commandBus;
    constructor(taskViewService: TaskViewService, commandBus: CommandBus);
    findAll(params: BaseQueryDTO<TaskView>): Promise<IPagination<ITaskView>>;
    findById(id: ID, params: FindOptionsQueryDTO<TaskView>): Promise<ITaskView>;
    create(entity: CreateViewDTO): Promise<ITaskView>;
    update(id: ID, entity: UpdateViewDTO): Promise<ITaskView>;
    delete(id: ID): Promise<DeleteResult>;
}
