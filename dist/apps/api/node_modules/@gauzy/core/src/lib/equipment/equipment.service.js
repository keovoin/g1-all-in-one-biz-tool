"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const utils_1 = require("@gauzy/utils");
const crud_1 = require("./../core/crud");
const type_orm_equipment_repository_1 = require("./repository/type-orm-equipment.repository");
const mikro_orm_equipment_repository_1 = require("./repository/mikro-orm-equipment.repository");
let EquipmentService = class EquipmentService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmEquipmentRepository, mikroOrmEquipmentRepository) {
        super(typeOrmEquipmentRepository, mikroOrmEquipmentRepository);
    }
    /**
     *
     * @returns
     */
    async getAll() {
        return await this.findAll({
            relations: {
                image: true,
                equipmentSharings: true,
                tags: true
            }
        });
    }
    /**
     *
     * @param filter
     * @returns
     */
    pagination(filter) {
        if ('where' in filter) {
            const { where } = filter;
            ['name', 'type', 'serialNumber'].forEach((param) => {
                if (param in where) {
                    const value = where[param];
                    if ((0, utils_1.isNotEmpty)(value))
                        filter.where[param] = (0, typeorm_1.Like)(`%${value}%`);
                }
            });
        }
        return super.paginate(filter);
    }
};
exports.EquipmentService = EquipmentService;
exports.EquipmentService = EquipmentService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_equipment_repository_1.TypeOrmEquipmentRepository,
        mikro_orm_equipment_repository_1.MikroOrmEquipmentRepository])
], EquipmentService);
//# sourceMappingURL=equipment.service.js.map