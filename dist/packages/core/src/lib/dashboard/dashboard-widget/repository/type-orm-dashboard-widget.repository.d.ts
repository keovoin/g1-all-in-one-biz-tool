import { Repository } from 'typeorm';
import { DashboardWidget } from '../dashboard-widget.entity';
export declare class TypeOrmDashboardWidgetRepository extends Repository<DashboardWidget> {
    readonly repository: Repository<DashboardWidget>;
    constructor(repository: Repository<DashboardWidget>);
}
