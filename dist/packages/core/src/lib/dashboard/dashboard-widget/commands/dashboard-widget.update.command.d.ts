import { ICommand } from '@nestjs/cqrs';
import { ID, IDashboardWidgetUpdateInput } from '@gauzy/contracts';
export declare class DashboardWidgetUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IDashboardWidgetUpdateInput;
    static readonly type = "[DashboardWidget] Update";
    constructor(id: ID, input: IDashboardWidgetUpdateInput);
}
