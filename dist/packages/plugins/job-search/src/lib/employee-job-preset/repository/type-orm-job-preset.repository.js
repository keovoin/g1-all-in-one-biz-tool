"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmJobPresetRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_preset_entity_1 = require("../job-preset.entity");
let TypeOrmJobPresetRepository = class TypeOrmJobPresetRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmJobPresetRepository = TypeOrmJobPresetRepository;
exports.TypeOrmJobPresetRepository = TypeOrmJobPresetRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(job_preset_entity_1.JobPreset)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmJobPresetRepository);
//# sourceMappingURL=type-orm-job-preset.repository.js.map