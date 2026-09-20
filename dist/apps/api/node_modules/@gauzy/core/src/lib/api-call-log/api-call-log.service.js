"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCallLogService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const crud_1 = require("./../core/crud");
const mikro_orm_api_call_log_repository_1 = require("./repository/mikro-orm-api-call-log.repository");
const type_orm_api_call_log_repository_1 = require("./repository/type-orm-api-call-log.repository");
let ApiCallLogService = class ApiCallLogService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmApiCallLogRepository, mikroOrmApiCallLogRepository) {
        super(typeOrmApiCallLogRepository, mikroOrmApiCallLogRepository);
        this.typeOrmApiCallLogRepository = typeOrmApiCallLogRepository;
        this.mikroOrmApiCallLogRepository = mikroOrmApiCallLogRepository;
    }
    /**
     * Retrieves a paginated list of API call logs with optional filters applied.
     *
     * @param filters Object containing filtering options such as `correlationId`, `url`, `method`, etc.
     * @returns A promise that resolves to a paginated list of `IApiCallLog` objects.
     */
    async findAllLogs(filters) {
        // Ensure that filters are properly defined
        const queryOptions = {
            where: {},
            take: filters.take ?? 100, // Default to 100 if not provided
            skip: filters.skip ? filters.take * (filters.skip - 1) : 0 // Calculate offset
        };
        // Apply sorting options (if provided)
        if (filters.order) {
            queryOptions.order = filters.order; // Order, in which entities should be ordered. Default to ASC if no order is provided.
        }
        // Check if `filters.where` is an array or an object, then apply individual filters
        if (!Array.isArray(filters)) {
            if (filters.organizationId) {
                queryOptions.where['organizationId'] = filters.organizationId;
            }
            if (filters.correlationId) {
                queryOptions.where['correlationId'] = filters.correlationId;
            }
            if (filters.statusCode) {
                queryOptions.where['statusCode'] = filters.statusCode;
            }
            if (filters.ipAddress) {
                queryOptions.where['ipAddress'] = filters.ipAddress;
            }
            if (filters.method) {
                queryOptions.where['method'] = filters.method;
            }
            if (filters.userId) {
                queryOptions.where['userId'] = filters.userId;
            }
            // Apply date range filters for requestTime
            if (filters.startRequestTime || filters.endRequestTime) {
                // The start date for filtering, defaults to the start of today.
                const start = filters.startRequestTime
                    ? moment(filters.startRequestTime).toDate()
                    : moment().startOf('day').toDate();
                // The end date for filtering, defaults to the end of today.
                const end = filters.endRequestTime
                    ? moment(filters.endRequestTime).toDate()
                    : moment().endOf('day').toDate(); // Default to end of today if no end date is provided
                // Retrieves a date range filter using the `start` and `end` values.
                queryOptions.where['requestTime'] = (0, typeorm_1.Between)(start, end);
            }
        }
        // Perform the query with filters, sorting, and pagination applied
        return await super.findAll(queryOptions);
    }
};
exports.ApiCallLogService = ApiCallLogService;
exports.ApiCallLogService = ApiCallLogService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_api_call_log_repository_1.TypeOrmApiCallLogRepository,
        mikro_orm_api_call_log_repository_1.MikroOrmApiCallLogRepository])
], ApiCallLogService);
//# sourceMappingURL=api-call-log.service.js.map