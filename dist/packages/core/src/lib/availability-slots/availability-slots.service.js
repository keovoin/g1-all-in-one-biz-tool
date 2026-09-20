"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilitySlotsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_availability_slot_repository_1 = require("./repository/type-orm-availability-slot.repository");
const mikro_orm_availability_slot_repository_1 = require("./repository/mikro-orm-availability-slot.repository");
let AvailabilitySlotsService = class AvailabilitySlotsService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmAvailabilitySlotRepository, mikroOrmAvailabilitySlotRepository) {
        super(typeOrmAvailabilitySlotRepository, mikroOrmAvailabilitySlotRepository);
    }
    /**
     * Create bulk availability slots
     *
     * @param slots
     * @returns
     */
    async createBulk(slots) {
        return await super.saveMany(slots);
    }
};
exports.AvailabilitySlotsService = AvailabilitySlotsService;
exports.AvailabilitySlotsService = AvailabilitySlotsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_availability_slot_repository_1.TypeOrmAvailabilitySlotRepository,
        mikro_orm_availability_slot_repository_1.MikroOrmAvailabilitySlotRepository])
], AvailabilitySlotsService);
//# sourceMappingURL=availability-slots.service.js.map