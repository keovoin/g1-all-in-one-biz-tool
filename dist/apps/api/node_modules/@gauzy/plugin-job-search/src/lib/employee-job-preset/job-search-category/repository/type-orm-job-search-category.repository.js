"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmJobSearchCategoryRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_search_category_entity_1 = require("../job-search-category.entity");
let TypeOrmJobSearchCategoryRepository = class TypeOrmJobSearchCategoryRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmJobSearchCategoryRepository = TypeOrmJobSearchCategoryRepository;
exports.TypeOrmJobSearchCategoryRepository = TypeOrmJobSearchCategoryRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(job_search_category_entity_1.JobSearchCategory)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmJobSearchCategoryRepository);
//# sourceMappingURL=type-orm-job-search-category.repository.js.map