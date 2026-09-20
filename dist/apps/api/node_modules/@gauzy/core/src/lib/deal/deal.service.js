"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const request_context_1 = require("../core/context/request-context");
const tenant_aware_crud_service_1 = require("./../core/crud/tenant-aware-crud.service");
const type_orm_deal_repository_1 = require("./repository/type-orm-deal.repository");
const mikro_orm_deal_repository_1 = require("./repository/mikro-orm-deal.repository");
let DealService = class DealService extends tenant_aware_crud_service_1.TenantAwareCrudService {
    constructor(typeOrmDealRepository, mikroOrmDealRepository) {
        super(typeOrmDealRepository, mikroOrmDealRepository);
        this.typeOrmDealRepository = typeOrmDealRepository;
        this.mikroOrmDealRepository = mikroOrmDealRepository;
    }
    /**
     * Creates a new deal entity.
     *
     * This method sets the `createdByUserId` using the current user's ID from the request context,
     * then calls the create method on the superclass (likely a service or repository) with the modified entity data.
     *
     * @param entity - The partial deal entity data to create.
     * @returns A promise that resolves to the created deal entity.
     */
    async create(entity) {
        try {
            // Call the create method on the superclass with the modified entity data
            return await super.create({
                ...entity,
                tenantId: request_context_1.RequestContext.currentTenantId() // Set the tenant ID
            });
        }
        catch (error) {
            // Handle any errors that occur during deal creation
            console.error(`Error occurred while creating deal: ${error.message}`);
            throw new common_1.HttpException(`Error occurred while creating deal: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.DealService = DealService;
exports.DealService = DealService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_deal_repository_1.TypeOrmDealRepository,
        mikro_orm_deal_repository_1.MikroOrmDealRepository])
], DealService);
//# sourceMappingURL=deal.service.js.map