import { CommandBus } from '@nestjs/cqrs';
import { IPagination, IApprovalPolicy, IListQueryInput, IRequestApprovalFindInput, ID } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../core';
import { ApprovalPolicy } from './approval-policy.entity';
import { ApprovalPolicyService } from './approval-policy.service';
import { CreateApprovalPolicyDTO, UpdateApprovalPolicyDTO } from './dto';
export declare class ApprovalPolicyController extends CrudController<ApprovalPolicy> {
    private readonly approvalPolicyService;
    private readonly commandBus;
    constructor(approvalPolicyService: ApprovalPolicyService, commandBus: CommandBus);
    /**
     * GET all approval policies except time off and equipment sharing policy
     *
     * @param data
     * @returns
     */
    findApprovalPoliciesForRequestApproval(data: IListQueryInput<IRequestApprovalFindInput>): Promise<IPagination<IApprovalPolicy>>;
    /**
     * GET approval policies by pagination
     *
     * @param options
     * @returns
     */
    pagination(options: BaseQueryDTO<ApprovalPolicy>): Promise<IPagination<IApprovalPolicy>>;
    /**
     * GET all approval policies
     *
     * @param data
     * @returns
     */
    findAll(options: BaseQueryDTO<ApprovalPolicy>): Promise<IPagination<IApprovalPolicy>>;
    /**
     * CREATE approval policy
     *
     * @param entity
     * @returns
     */
    create(entity: CreateApprovalPolicyDTO): Promise<IApprovalPolicy>;
    /**
     * UPDATE approval policy by id
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: ID, entity: UpdateApprovalPolicyDTO): Promise<IApprovalPolicy>;
}
