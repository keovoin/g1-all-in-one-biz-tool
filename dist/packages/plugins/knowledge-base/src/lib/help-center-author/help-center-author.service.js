"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterAuthorService = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const utils_1 = require("@gauzy/utils");
const type_orm_help_center_author_repository_1 = require("./repository/type-orm-help-center-author.repository");
const mikro_orm_help_center_author_repository_1 = require("./repository/mikro-orm-help-center-author.repository");
let HelpCenterAuthorService = class HelpCenterAuthorService extends core_1.TenantAwareCrudService {
    constructor(typeOrmHelpCenterAuthorRepository, mikroOrmHelpCenterAuthorRepository) {
        super(typeOrmHelpCenterAuthorRepository, mikroOrmHelpCenterAuthorRepository);
    }
    /**
     * Get authors by article ID.
     *
     * @param articleId - The ID of the article to filter authors by.
     * @returns A promise that resolves to an array of help center authors for the article.
     */
    async findByArticleId(articleId) {
        return await this.find({
            where: { articleId }
        });
    }
    /**
     * Create authors in Bulk
     *
     * @param input
     * @returns
     */
    async createBulk(input) {
        return await this.saveMany(input);
    }
    /**
     * Delete authors by IDs in Bulk
     *
     * @param ids
     * @returns
     */
    async deleteBulk(ids) {
        if ((0, utils_1.isNotEmpty)(ids)) {
            return await this.delete({ id: (0, typeorm_1.In)(ids) });
        }
        return { affected: 0, raw: [] };
    }
    /**
     * Get all authors with optional filters and relations.
     *
     * @param options - Find options to customize the query (e.g., relations, order).
     * @returns A promise that resolves to an array of help center authors.
     */
    async getAll(options) {
        return await this.find(options);
    }
};
exports.HelpCenterAuthorService = HelpCenterAuthorService;
exports.HelpCenterAuthorService = HelpCenterAuthorService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_help_center_author_repository_1.TypeOrmHelpCenterAuthorRepository,
        mikro_orm_help_center_author_repository_1.MikroOrmHelpCenterAuthorRepository])
], HelpCenterAuthorService);
//# sourceMappingURL=help-center-author.service.js.map