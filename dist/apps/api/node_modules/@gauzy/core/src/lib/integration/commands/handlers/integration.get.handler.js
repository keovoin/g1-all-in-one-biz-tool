"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationGetHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const integration_get_command_1 = require("./../integration.get.command");
const database_helper_1 = require("./../../../database/database.helper");
const utils_1 = require("./../../../core/utils");
const type_orm_integration_repository_1 = require("../../repository/type-orm-integration.repository");
const mikro_orm_integration_repository_1 = require("../../repository/mikro-orm-integration.repository");
let IntegrationGetHandler = class IntegrationGetHandler {
    constructor(typeOrmIntegrationRepository, mikroOrmIntegrationRepository) {
        this.typeOrmIntegrationRepository = typeOrmIntegrationRepository;
        this.mikroOrmIntegrationRepository = mikroOrmIntegrationRepository;
        this.ormType = (0, utils_1.getORMType)();
    }
    /**
     *
     * @param command
     * @returns
     */
    async execute(command) {
        const { input } = command;
        const { integrationTypeId, searchQuery, filter } = input;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const where = {
                    integrationTypes: { id: integrationTypeId }
                };
                if (searchQuery) {
                    where.name = { $ilike: `${searchQuery.toLowerCase()}%` };
                }
                if (filter === 'true' || filter === 'false') {
                    where.isPaid = filter === 'true';
                }
                const items = await this.mikroOrmIntegrationRepository.find(where, {
                    populate: ['integrationTypes'],
                    orderBy: { order: 'ASC' }
                });
                return items;
            }
            case utils_1.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmIntegrationRepository.createQueryBuilder('integration');
                query.leftJoinAndSelect('integration.integrationTypes', 'integrationTypes');
                query.where((0, database_helper_1.prepareSQLQuery)('"integrationTypes"."id" = :id'), { id: integrationTypeId });
                query.andWhere(`LOWER(${query.alias}.name) LIKE :name`, { name: `${searchQuery.toLowerCase()}%` });
                if (filter === 'true' || filter === 'false') {
                    query.andWhere(`${query.alias}.isPaid = :isPaid`, { isPaid: filter === 'true' });
                }
                return await query.orderBy(`${query.alias}.order`, 'ASC').getMany();
            }
        }
    }
};
exports.IntegrationGetHandler = IntegrationGetHandler;
exports.IntegrationGetHandler = IntegrationGetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_get_command_1.IntegrationGetCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_integration_repository_1.TypeOrmIntegrationRepository,
        mikro_orm_integration_repository_1.MikroOrmIntegrationRepository])
], IntegrationGetHandler);
//# sourceMappingURL=integration.get.handler.js.map