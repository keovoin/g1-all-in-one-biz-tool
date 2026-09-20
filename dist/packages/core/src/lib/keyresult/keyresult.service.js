"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyResultService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_keyresult_repository_1 = require("./repository/type-orm-keyresult.repository");
const mikro_orm_keyresult_repository_1 = require("./repository/mikro-orm-keyresult.repository");
let KeyResultService = class KeyResultService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmKeyResultRepository, mikroOrmKeyResultRepository) {
        super(typeOrmKeyResultRepository, mikroOrmKeyResultRepository);
    }
    /**
     * Creates or updates multiple key results in bulk (Upsert).
     *
     * @param {KeyResult[]} input - An array of `KeyResult` objects to be saved into the database.
     * @returns {Promise<KeyResult[]>} - A promise resolving to the saved key results.
     *
     * @description
     * This method performs a bulk save operation, which creates new entries or updates existing ones
     * based on the primary key (upsert semantics). It delegates to the `saveMany()` helper which
     * utilizes TypeORM's `save()` method for efficient persistence.
     */
    async createBulk(input) {
        return await this.saveMany(input);
    }
};
exports.KeyResultService = KeyResultService;
exports.KeyResultService = KeyResultService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_keyresult_repository_1.TypeOrmKeyResultRepository,
        mikro_orm_keyresult_repository_1.MikroOrmKeyResultRepository])
], KeyResultService);
//# sourceMappingURL=keyresult.service.js.map