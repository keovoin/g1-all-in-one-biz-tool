"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const context_1 = require("../core/context");
const favorite_entity_1 = require("./favorite.entity");
const type_orm_favorite_repository_1 = require("./repository/type-orm-favorite.repository");
const mikro_orm_favorite_repository_1 = require("./repository/mikro-orm-favorite.repository");
const employee_service_1 = require("../employee/employee.service");
const global_favorite_service_service_1 = require("./global-favorite-service.service");
let FavoriteService = class FavoriteService extends crud_1.TenantAwareCrudService {
    constructor(favoriteDiscoveryService, typeOrmFavoriteRepository, mikroOrmFavoriteRepository, employeeService) {
        super(typeOrmFavoriteRepository, mikroOrmFavoriteRepository);
        this.favoriteDiscoveryService = favoriteDiscoveryService;
        this.typeOrmFavoriteRepository = typeOrmFavoriteRepository;
        this.mikroOrmFavoriteRepository = mikroOrmFavoriteRepository;
        this.employeeService = employeeService;
    }
    /**
     * @description Find favorites by employee
     * @param {BaseQueryDTO<Favorite>} options Filter criteria to find favorites
     * @returns A promise that resolves to paginated list of favorites
     * @memberof FavoriteService
     */
    async findFavoritesByEmployee(options) {
        try {
            const { where, relations = [], take, skip } = options;
            const employeeId = context_1.RequestContext.currentEmployeeId() || where.employeeId;
            return await super.findAll({
                where: { ...where, employeeId },
                ...(skip && { skip }),
                ...(take && { take }),
                ...(relations && { relations })
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * @description Mark entity element as favorite
     * @param {IFavoriteCreateInput} entity - Data to create favorite element
     * @returns A promise that resolves to the created or found favorite element
     * @memberof FavoriteService
     */
    async create(entity) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            const { entity: entityName, entityId, organizationId } = entity;
            // Always prioritize employeeId from RequestContext, fallback to the value from the body if not present in context
            const employeeId = context_1.RequestContext.currentEmployeeId() || entity.employeeId;
            // Validation: If no employeeId, only admin or super admin can proceed
            if (!employeeId && !this.hasAdminRole()) {
                throw new common_1.BadRequestException('Only admins can create a favorite at the organization level (without an employeeId).');
            }
            // Validate employee existence only if employeeId is present
            if (employeeId) {
                const employee = await this.employeeService.findOneByIdString(employeeId);
                if (!employee) {
                    throw new common_1.NotFoundException('Employee not found');
                }
            }
            // Check for existing favorite with the same parameters. An organization-level favorite has
            // NO employee: pin that with IsNull() so the de-duplication matches only organization-level
            // rows and never silently returns some other employee's favorite for the same entity.
            const findOptions = {
                tenantId,
                organizationId,
                employeeId: employeeId ?? (0, typeorm_1.IsNull)(),
                entity: entityName,
                entityId
            };
            let favorite;
            try {
                favorite = await this.findOneByWhereOptions(findOptions);
            }
            catch {
                favorite = null;
            }
            if (!favorite) {
                favorite = new favorite_entity_1.Favorite({ ...entity, employeeId });
            }
            // Create or return the existing favorite
            return await this.save(favorite);
        }
        catch (error) {
            console.error('Error while creating favorite:', error);
            throw new common_1.BadRequestException(`Favorite creation failed: ${error?.message || error}`);
        }
    }
    /**
     * Checks if the current user has an admin or super admin role
     */
    hasAdminRole() {
        return context_1.RequestContext.hasRoles([contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN]);
    }
    /**
     * @description Delete element from favorites for current employee
     * @param {ID} id - The favorite ID to be deleted
     * @returns  A promise that resolved at the deleteResult
     * @memberof FavoriteService
     */
    async delete(id) {
        try {
            if (!this.hasAdminRole()) {
                // "Current employee" means the caller's OWN employee record. RequestContext.currentEmployeeId()
                // is deliberately null for CHANGE_SELECTED_EMPLOYEE holders (e.g. managers), which used to
                // drop the employee predicate and let them delete anyone's favorite by id — and would now
                // (null -> IS NULL) stop them deleting even their own. Read the identity off the JWT user
                // instead, and fail closed when the caller has no employee identity at all.
                const employeeId = context_1.RequestContext.currentEmployeeId() ?? context_1.RequestContext.currentUser()?.employeeId;
                if (!employeeId) {
                    throw new common_1.ForbiddenException('Only the owning employee (or an admin) can delete a favorite.');
                }
                return await super.delete(id, {
                    where: { employeeId }
                });
            }
            // Even admins should respect tenant boundaries unless they're SUPER_ADMIN
            const deleteOptions = context_1.RequestContext.hasRoles([contracts_1.RolesEnum.SUPER_ADMIN])
                ? {}
                : { where: { tenantId: context_1.RequestContext.currentTenantId() } };
            return await super.delete(id, deleteOptions);
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * @description Get favorites elements details
     * @param options - Favorite query params
     * @returns A promise resolved at favorites elements records
     * @memberof FavoriteService
     */
    async getFavoriteDetails(options) {
        try {
            const { where } = options;
            const { entity } = where;
            const favoriteType = entity;
            // Find favorite elements with filtered params
            const favorites = await super.findAll(options);
            // Get related entity IDs
            const entityIds = favorites.items.map((favorite) => favorite.entityId);
            // Get current requested service
            const serviceWithMethods = this.favoriteDiscoveryService.getService(favoriteType);
            if (!serviceWithMethods) {
                throw new common_1.BadRequestException(`Service for entity of type ${entity} not found.`);
            }
            // related entity where condition (Filtered records with passed IDs)
            const whereCondition = { id: (0, typeorm_1.In)(entityIds) };
            // Get related favorite records using findAll method and passing query params
            const items = await this.favoriteDiscoveryService.callMethod(favoriteType, 'findAll', {
                where: whereCondition
            });
            // return found records for specific service
            return items;
        }
        catch (error) {
            console.error('Error while retrieving favorite details:', error);
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.FavoriteService = FavoriteService;
exports.FavoriteService = FavoriteService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [global_favorite_service_service_1.GlobalFavoriteDiscoveryService,
        type_orm_favorite_repository_1.TypeOrmFavoriteRepository,
        mikro_orm_favorite_repository_1.MikroOrmFavoriteRepository,
        employee_service_1.EmployeeService])
], FavoriteService);
//# sourceMappingURL=favorite.service.js.map