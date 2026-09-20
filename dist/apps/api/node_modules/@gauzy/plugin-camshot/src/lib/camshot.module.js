"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamshotModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const camshot_controller_1 = require("./camshot.controller");
const handlers_1 = require("./commands/handlers");
const camshot_service_1 = require("./services/camshot.service");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const camshot_entity_1 = require("./entity/camshot.entity");
const nestjs_1 = require("@mikro-orm/nestjs");
const type_orm_camshot_repository_1 = require("./repositories/type-orm-camshot.repository");
const mikro_orm_camshot_repository_1 = require("./repositories/mikro-orm-camshot.repository");
const core_1 = require("@gauzy/core");
const camshot_subscriber_1 = require("./subscribers/camshot.subscriber");
const queries_1 = require("./queries");
let CamshotModule = class CamshotModule {
};
exports.CamshotModule = CamshotModule;
exports.CamshotModule = CamshotModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [camshot_controller_1.CamshotController],
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([camshot_entity_1.Camshot]),
            nestjs_1.MikroOrmModule.forFeature([camshot_entity_1.Camshot]),
            core_1.RolePermissionModule
        ],
        providers: [
            camshot_service_1.CamshotService,
            type_orm_camshot_repository_1.TypeOrmCamshotRepository,
            mikro_orm_camshot_repository_1.MikroOrmCamshotRepository,
            camshot_subscriber_1.CamshotSubscriber,
            ...handlers_1.commandHandlers,
            ...queries_1.queryHandlers
        ],
    })
], CamshotModule);
//# sourceMappingURL=camshot.module.js.map