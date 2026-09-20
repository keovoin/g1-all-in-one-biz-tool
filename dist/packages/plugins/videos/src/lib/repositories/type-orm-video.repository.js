"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmVideoRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const video_entity_1 = require("../entities/video.entity");
let TypeOrmVideoRepository = class TypeOrmVideoRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmVideoRepository = TypeOrmVideoRepository;
exports.TypeOrmVideoRepository = TypeOrmVideoRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(video_entity_1.Video)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmVideoRepository);
//# sourceMappingURL=type-orm-video.repository.js.map