"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Favorite = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const mikro_orm_favorite_repository_1 = require("./repository/mikro-orm-favorite.repository");
let Favorite = class Favorite extends internal_1.BasePerEntityType {
};
exports.Favorite = Favorite;
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Favorite.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Favorite.prototype, "employeeId", void 0);
exports.Favorite = Favorite = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('favorite', { mikroOrmRepository: () => mikro_orm_favorite_repository_1.MikroOrmFavoriteRepository })
], Favorite);
//# sourceMappingURL=favorite.entity.js.map