"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundshotModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const soundshot_controller_1 = require("./soundshot.controller");
const handlers_1 = require("./commands/handlers");
const soundshot_service_1 = require("./services/soundshot.service");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const soundshot_entity_1 = require("./entity/soundshot.entity");
const nestjs_1 = require("@mikro-orm/nestjs");
const type_orm_soundshot_repository_1 = require("./repositories/type-orm-soundshot.repository");
const mikro_orm_soundshot_repository_1 = require("./repositories/mikro-orm-soundshot.repository");
const core_1 = require("@gauzy/core");
const soundshot_subscriber_1 = require("./subscribers/soundshot.subscriber");
const queries_1 = require("./queries");
let SoundshotModule = class SoundshotModule {
};
exports.SoundshotModule = SoundshotModule;
exports.SoundshotModule = SoundshotModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [soundshot_controller_1.SoundshotController],
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([soundshot_entity_1.Soundshot]),
            nestjs_1.MikroOrmModule.forFeature([soundshot_entity_1.Soundshot]),
            core_1.RolePermissionModule
        ],
        providers: [
            soundshot_service_1.SoundshotService,
            type_orm_soundshot_repository_1.TypeOrmSoundshotRepository,
            mikro_orm_soundshot_repository_1.MikroOrmSoundshotRepository,
            soundshot_subscriber_1.SoundshotSubscriber,
            ...handlers_1.commandHandlers,
            ...queries_1.queryHandlers
        ],
    })
], SoundshotModule);
//# sourceMappingURL=soundshot.module.js.map