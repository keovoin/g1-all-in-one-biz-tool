"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const database_helper_1 = require("./../database/database.helper");
const utils_1 = require("./../core/utils");
const mikro_orm_skill_repository_1 = require("./repository/mikro-orm-skill.repository");
const type_orm_skill_repository_1 = require("./repository/type-orm-skill.repository");
let SkillService = class SkillService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmSkillRepository, mikroOrmSkillRepository) {
        super(typeOrmSkillRepository, mikroOrmSkillRepository);
    }
    /**
     * Finds a skill by its name.
     *
     * @param {string} name - The name of the skill to retrieve.
     * @returns {Promise<Skill | null>} - A promise resolving to the skill entity if found, or `null` if not found.
     */
    async findOneByName(name) {
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const item = await this.mikroOrmRepository.findOne({ name });
                return item ? this.serialize(item) : null;
            }
            case utils_1.MultiORMEnum.TypeORM:
            default:
                return await this.typeOrmRepository
                    .createQueryBuilder('skill')
                    .where((0, database_helper_1.prepareSQLQuery)(`"skill"."name" = :name`), { name })
                    .getOne();
        }
    }
};
exports.SkillService = SkillService;
exports.SkillService = SkillService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_skill_repository_1.TypeOrmSkillRepository, mikro_orm_skill_repository_1.MikroOrmSkillRepository])
], SkillService);
//# sourceMappingURL=skill.service.js.map