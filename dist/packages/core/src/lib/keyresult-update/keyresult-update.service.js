"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyResultUpdateService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const utils_1 = require("./../core/utils");
const type_orm_keyresult_update_repository_1 = require("./repository/type-orm-keyresult-update.repository");
const mikro_orm_keyresult_update_repository_1 = require("./repository/mikro-orm-keyresult-update.repository");
let KeyResultUpdateService = class KeyResultUpdateService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmKeyResultUpdateRepository, mikroOrmKeyResultUpdateRepository) {
        super(typeOrmKeyResultUpdateRepository, mikroOrmKeyResultUpdateRepository);
    }
    /**
     *
     * @param keyResultId
     * @returns
     */
    async findByKeyResultId(keyResultId) {
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const items = await this.mikroOrmRepository.find({ keyResultId });
                return items.map((e) => this.serialize(e));
            }
            case utils_1.MultiORMEnum.TypeORM:
            default:
                return await this.typeOrmRepository
                    .createQueryBuilder('key_result_update')
                    .where('key_result_update.keyResultId = :keyResultId', {
                    keyResultId
                })
                    .getMany();
        }
    }
};
exports.KeyResultUpdateService = KeyResultUpdateService;
exports.KeyResultUpdateService = KeyResultUpdateService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_keyresult_update_repository_1.TypeOrmKeyResultUpdateRepository,
        mikro_orm_keyresult_update_repository_1.MikroOrmKeyResultUpdateRepository])
], KeyResultUpdateService);
//# sourceMappingURL=keyresult-update.service.js.map