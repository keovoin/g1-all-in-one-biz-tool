"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MikroOrmUserRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const knex_1 = require("@mikro-orm/knex");
const mikro_orm_base_entity_repository_1 = require("../../core/repository/mikro-orm-base-entity.repository");
const user_entity_1 = require("../user.entity");
let MikroOrmUserRepository = class MikroOrmUserRepository extends mikro_orm_base_entity_repository_1.MikroOrmBaseEntityRepository {
    constructor(em) {
        super(em, user_entity_1.User);
    }
    /**
     * Checks if an entity with the given email already exists in the database.
     * This method uses findOne to efficiently check existence by stopping after
     * finding the first match, rather than counting all matching records.
     *
     * @param email The email address to check for existence in the database.
     * @returns A promise that resolves to `true` if an entity with the given email exists, otherwise `false`.
     */
    async exists(email) {
        const entity = await super.findOne({ email }, { fields: ['id'] });
        return entity !== null;
    }
};
exports.MikroOrmUserRepository = MikroOrmUserRepository;
exports.MikroOrmUserRepository = MikroOrmUserRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [knex_1.EntityManager])
], MikroOrmUserRepository);
//# sourceMappingURL=mikro-orm-user.repository.js.map