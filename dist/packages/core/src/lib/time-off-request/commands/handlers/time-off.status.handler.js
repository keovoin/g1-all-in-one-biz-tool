"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffStatusHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("../../../core/context");
const time_off_status_command_1 = require("../time-off.status.command");
const type_orm_time_off_request_repository_1 = require("../../repository/type-orm-time-off-request.repository");
const type_orm_request_approval_repository_1 = require("../../../request-approval/repository/type-orm-request-approval.repository");
let TimeOffStatusHandler = class TimeOffStatusHandler {
    constructor(typeOrmTimeOffRequestRepository, typeOrmRequestApprovalRepository) {
        this.typeOrmTimeOffRequestRepository = typeOrmTimeOffRequestRepository;
        this.typeOrmRequestApprovalRepository = typeOrmRequestApprovalRepository;
    }
    async execute(command) {
        const { id, status } = command;
        // Both repositories are RAW (not tenant-aware): the request and its approval row must be
        // resolved inside the caller's tenant, or an admin of tenant A could approve / deny any tenant
        // B request by UUID (GHSA-gwpq-mmw7-vx85 class).
        const tenantId = context_1.RequestContext.currentTenantId();
        if (!id || !tenantId) {
            throw new common_1.NotFoundException('Request time off not found');
        }
        const [timeOffRequest, requestApproval] = await Promise.all([
            this.typeOrmTimeOffRequestRepository.findOneBy({ id, tenantId }),
            this.typeOrmRequestApprovalRepository.findOneBy({ requestId: id, tenantId })
        ]);
        if (!timeOffRequest) {
            throw new common_1.NotFoundException('Request time off not found');
        }
        timeOffRequest.status = status;
        if (requestApproval) {
            requestApproval.status = contracts_1.StatusTypesMapRequestApprovalEnum[status];
            await this.typeOrmRequestApprovalRepository.save(requestApproval);
        }
        return await this.typeOrmTimeOffRequestRepository.save(timeOffRequest);
    }
};
exports.TimeOffStatusHandler = TimeOffStatusHandler;
exports.TimeOffStatusHandler = TimeOffStatusHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(time_off_status_command_1.TimeOffStatusCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_time_off_request_repository_1.TypeOrmTimeOffRequestRepository,
        type_orm_request_approval_repository_1.TypeOrmRequestApprovalRepository])
], TimeOffStatusHandler);
//# sourceMappingURL=time-off.status.handler.js.map