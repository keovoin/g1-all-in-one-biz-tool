import { ITimeOffCreateInput, IPagination, ITimeOffFindInput } from '@gauzy/contracts';
import { TimeOffRequest } from './time-off-request.entity';
import { TenantAwareCrudService } from './../core/crud';
import { TypeOrmRequestApprovalRepository } from '../request-approval/repository/type-orm-request-approval.repository';
import { MikroOrmTimeOffRequestRepository } from './repository/mikro-orm-time-off-request.repository';
import { TypeOrmTimeOffRequestRepository } from './repository/type-orm-time-off-request.repository';
export declare class TimeOffRequestService extends TenantAwareCrudService<TimeOffRequest> {
    readonly typeOrmTimeOffRequestRepository: TypeOrmTimeOffRequestRepository;
    readonly mikroOrmTimeOffRequestRepository: MikroOrmTimeOffRequestRepository;
    readonly typeOrmRequestApprovalRepository: TypeOrmRequestApprovalRepository;
    constructor(typeOrmTimeOffRequestRepository: TypeOrmTimeOffRequestRepository, mikroOrmTimeOffRequestRepository: MikroOrmTimeOffRequestRepository, typeOrmRequestApprovalRepository: TypeOrmRequestApprovalRepository);
    /**
     * Creates a new time off request and its associated approval record.
     *
     * @param entity - The input data for creating a time off request.
     * @returns A promise that resolves to the saved TimeOffRequest.
     * @throws {BadRequestException} If any error occurs during the creation process.
     */
    create(entity: ITimeOffCreateInput): Promise<TimeOffRequest>;
    getAllTimeOffRequests(relations: string[], findInput: ITimeOffFindInput): Promise<IPagination<TimeOffRequest>>;
    updateTimeOffByAdmin(id: string, timeOffRequest: ITimeOffCreateInput): Promise<TimeOffRequest>;
    updateStatusTimeOffByAdmin(id: string, status: string): Promise<TimeOffRequest>;
    /**
     * Time Off Request override pagination method
     *
     * @param options
     * @returns
     */
    pagination(options: any): Promise<{
        items: TimeOffRequest[];
        total: number;
    }>;
}
