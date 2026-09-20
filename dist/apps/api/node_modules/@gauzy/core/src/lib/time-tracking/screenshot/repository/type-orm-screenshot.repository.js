"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmScreenshotRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const screenshot_entity_1 = require("../screenshot.entity");
let TypeOrmScreenshotRepository = class TypeOrmScreenshotRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmScreenshotRepository = TypeOrmScreenshotRepository;
exports.TypeOrmScreenshotRepository = TypeOrmScreenshotRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(screenshot_entity_1.Screenshot)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmScreenshotRepository);
//# sourceMappingURL=type-orm-screenshot.repository.js.map