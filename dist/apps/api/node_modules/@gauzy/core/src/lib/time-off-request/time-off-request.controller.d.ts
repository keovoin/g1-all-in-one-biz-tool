import { CommandBus } from '@nestjs/cqrs';
import { IPagination, ITimeOff as ITimeOffRequest, ITimeOffCreateInput, ITimeOffUpdateInput, ID } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { TimeOffRequest } from './time-off-request.entity';
import { TimeOffRequestService } from './time-off-request.service';
export declare class TimeOffRequestController extends CrudController<TimeOffRequest> {
    private readonly timeOffRequestService;
    private readonly commandBus;
    constructor(timeOffRequestService: TimeOffRequestService, commandBus: CommandBus);
    pagination(options: BaseQueryDTO<TimeOffRequest>): Promise<IPagination<ITimeOffRequest>>;
    /**
     * UPDATE time off request approved
     *
     * @param id
     * @returns
     */
    timeOffRequestApproved(id: ID): Promise<ITimeOffRequest>;
    /**
     * UPDATE time off request denied
     *
     * @param id
     * @returns
     */
    timeOffRequestDenied(id: ID): Promise<ITimeOffRequest>;
    /**
     * GET all time off requests
     *
     * @param data
     * @returns
     */
    findAll(data: any): Promise<IPagination<ITimeOffRequest>>;
    /**
     * CREATE new time off request/holiday
     *
     * @param entity
     * @param options
     * @returns
     */
    create(entity: ITimeOffCreateInput): Promise<ITimeOffRequest>;
    /**
     * UPDATE time off request by id
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: ID, entity: ITimeOffUpdateInput): Promise<ITimeOffRequest>;
}
