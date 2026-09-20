"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const mikro_orm_video_repository_1 = require("../repositories/mikro-orm-video.repository");
const type_orm_video_repository_1 = require("../repositories/type-orm-video.repository");
let VideosService = class VideosService extends core_1.TenantAwareCrudService {
    constructor(typeOrmVideoRepository, mikroOrmVideoRepository) {
        super(typeOrmVideoRepository, mikroOrmVideoRepository);
        this.typeOrmVideoRepository = typeOrmVideoRepository;
        this.mikroOrmVideoRepository = mikroOrmVideoRepository;
    }
};
exports.VideosService = VideosService;
exports.VideosService = VideosService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_video_repository_1.TypeOrmVideoRepository,
        mikro_orm_video_repository_1.MikroOrmVideoRepository])
], VideosService);
//# sourceMappingURL=videos.service.js.map