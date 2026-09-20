import { ICommand } from '@nestjs/cqrs';
import { IDashboardWidgetCreateInput } from '@gauzy/contracts';
export declare class DashboardWidgetCreateCommand implements ICommand {
    readonly input: IDashboardWidgetCreateInput;
    static readonly type = "[DashboardWidget] Create";
    constructor(input: IDashboardWidgetCreateInput);
}
