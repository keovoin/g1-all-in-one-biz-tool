"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const utils_1 = require("./../core/utils");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const role_entity_1 = require("./role.entity");
const context_1 = require("./../core/context");
const import_record_1 = require("./../export-import/import-record");
const mikro_orm_role_repository_1 = require("./repository/mikro-orm-role.repository");
const type_orm_role_repository_1 = require("./repository/type-orm-role.repository");
let RoleService = class RoleService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmRoleRepository, mikroOrmRoleRepository, _commandBus) {
        super(typeOrmRoleRepository, mikroOrmRoleRepository);
        this.typeOrmRoleRepository = typeOrmRoleRepository;
        this.mikroOrmRoleRepository = mikroOrmRoleRepository;
        this._commandBus = _commandBus;
    }
    /**
     * Creates multiple roles for each tenant and saves them.
     * @param tenants - An array of tenants for which roles will be created.
     * @returns A promise that resolves to an array of created roles.
     */
    async createBulk(tenants) {
        const roles = [];
        const rolesNames = Object.values(contracts_1.RolesEnum);
        for await (const tenant of tenants) {
            for await (const name of rolesNames) {
                const role = new role_entity_1.Role();
                role.name = name;
                role.tenant = tenant;
                role.isSystem = contracts_1.SYSTEM_DEFAULT_ROLES.includes(name);
                roles.push(role);
            }
        }
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const em = this.mikroOrmRoleRepository.getEntityManager();
                roles.forEach((r) => em.persist(r));
                await em.flush();
                return roles;
            }
            case utils_1.MultiORMEnum.TypeORM:
            default:
                return await this.typeOrmRoleRepository.save(roles);
        }
    }
    async migrateRoles() {
        const roles = await this.find({
            where: {
                tenantId: context_1.RequestContext.currentTenantId()
            }
        });
        const payload = [];
        for await (const item of roles) {
            const { id: sourceId, name } = item;
            payload.push({
                name,
                isImporting: true,
                sourceId
            });
        }
        return payload;
    }
    async migrateImportRecord(roles) {
        let records = [];
        for await (const item of roles) {
            const { isImporting, sourceId, name } = item;
            if (isImporting && sourceId) {
                const destination = await this.findOneByOptions({
                    where: {
                        tenantId: context_1.RequestContext.currentTenantId(),
                        name
                    },
                    order: {
                        createdAt: 'DESC'
                    }
                });
                if (destination) {
                    records.push(await this._commandBus.execute(new import_record_1.ImportRecordUpdateOrCreateCommand({
                        entityType: this.tableName,
                        sourceId,
                        destinationId: destination.id,
                        tenantId: context_1.RequestContext.currentTenantId()
                    })));
                }
            }
        }
        return records;
    }
    /**
     * Few Roles can't be removed/delete for tenant
     * RolesEnum.SUPER_ADMIN, RolesEnum.ADMIN, RolesEnum.EMPLOYEE, RolesEnum.VIEWER, RolesEnum.CANDIDATE
     *
     * @param id
     * @returns
     */
    async delete(id) {
        return await super.delete({
            id,
            isSystem: false,
            name: (0, typeorm_1.Not)((0, typeorm_1.In)(contracts_1.SYSTEM_DEFAULT_ROLES))
        });
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_role_repository_1.TypeOrmRoleRepository,
        mikro_orm_role_repository_1.MikroOrmRoleRepository,
        cqrs_1.CommandBus])
], RoleService);
//# sourceMappingURL=role.service.js.map