import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { ID, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../../core/crud';
import { DashboardWidget } from './dashboard-widget.entity';
import { DashboardWidgetService } from './dashboard-widget.service';
import { CreateDashboardWidgetDTO, UpdateDashboardWidgetDTO } from './dto';
export declare class DashboardWidgetController extends CrudController<DashboardWidget> {
    private readonly dashboardWidgetService;
    private readonly commandBus;
    constructor(dashboardWidgetService: DashboardWidgetService, commandBus: CommandBus);
    findAll(params: BaseQueryDTO<DashboardWidget>): Promise<IPagination<DashboardWidget>>;
    findById(id: ID, params: BaseQueryDTO<DashboardWidget>): Promise<DashboardWidget>;
    create(entity: CreateDashboardWidgetDTO): Promise<DashboardWidget>;
    update(id: ID, entity: UpdateDashboardWidgetDTO): Promise<DashboardWidget>;
    delete(id: ID): Promise<DeleteResult>;
}
