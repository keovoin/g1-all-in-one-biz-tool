"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTypeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_event_types_repository_1 = require("./repository/type-orm-event-types.repository");
const mikro_orm_event_type_repository_1 = require("./repository/mikro-orm-event-type.repository");
let EventTypeService = class EventTypeService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmEventTypeRepository, mikroOrmEventTypeRepository) {
        super(typeOrmEventTypeRepository, mikroOrmEventTypeRepository);
    }
};
exports.EventTypeService = EventTypeService;
exports.EventTypeService = EventTypeService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_event_types_repository_1.TypeOrmEventTypeRepository,
        mikro_orm_event_type_repository_1.MikroOrmEventTypeRepository])
], EventTypeService);
//# sourceMappingURL=event-type.service.js.map