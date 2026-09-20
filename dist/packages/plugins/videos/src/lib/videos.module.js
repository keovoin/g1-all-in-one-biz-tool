"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosModule = void 0;
const tslib_1 = require("tslib");
const nestjs_1 = require("@mikro-orm/nestjs");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@gauzy/core");
const handlers_1 = require("./commands/handlers");
const video_entity_1 = require("./entities/video.entity");
const video_subscriber_1 = require("./subscribers/video.subscriber");
const handlers_2 = require("./queries/handlers");
const type_orm_video_repository_1 = require("./repositories/type-orm-video.repository");
const videos_service_1 = require("./services/videos.service");
const videos_controller_1 = require("./videos.controller");
let VideosModule = class VideosModule {
};
exports.VideosModule = VideosModule;
exports.VideosModule = VideosModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [videos_controller_1.VideosController],
        imports: [typeorm_1.TypeOrmModule.forFeature([video_entity_1.Video]), nestjs_1.MikroOrmModule.forFeature([video_entity_1.Video]), core_1.RolePermissionModule, cqrs_1.CqrsModule],
        providers: [videos_service_1.VideosService, video_subscriber_1.VideoSubscriber, type_orm_video_repository_1.TypeOrmVideoRepository, ...handlers_1.CommandHandlers, ...handlers_2.QueryHandlers],
        exports: [videos_service_1.VideosService]
    })
], VideosModule);
//# sourceMappingURL=videos.module.js.map