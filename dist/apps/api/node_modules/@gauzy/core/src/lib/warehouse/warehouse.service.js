"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const mikro_orm_warehouse_repository_1 = require("./repository/mikro-orm-warehouse.repository");
const type_orm_warehouse_repository_1 = require("./repository/type-orm-warehouse.repository");
let WarehouseService = class WarehouseService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmWarehouseRepository, mikroOrmWarehouseRepository) {
        super(typeOrmWarehouseRepository, mikroOrmWarehouseRepository);
        this.typeOrmWarehouseRepository = typeOrmWarehouseRepository;
        this.mikroOrmWarehouseRepository = mikroOrmWarehouseRepository;
    }
    /**
     * Finds a warehouse by its unique identifier.
     *
     * @param {ID} id - The unique identifier of the warehouse.
     * @param {string[]} [relations=[]] - Optional array of related entities to be included in the query.
     * @returns {Promise<IWarehouse>} - A promise resolving to the warehouse entity if found.
     *
     * @description
     * This method retrieves a warehouse entity by its ID, optionally loading related entities.
     * It uses the `findOneByIdString` method from the parent repository/service.
     *
     * @example
     * ```ts
     * const warehouse = await warehouseService.findById('123e4567-e89b-12d3-a456-426614174000', ['products', 'employees']);
     * console.log(warehouse);
     * ```
     */
    async findById(id, relations = []) {
        return await super.findOneByIdString(id, { relations });
    }
};
exports.WarehouseService = WarehouseService;
exports.WarehouseService = WarehouseService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_warehouse_repository_1.TypeOrmWarehouseRepository,
        mikro_orm_warehouse_repository_1.MikroOrmWarehouseRepository])
], WarehouseService);
//# sourceMappingURL=warehouse.service.js.map