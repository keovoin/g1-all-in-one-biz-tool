"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagTypeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("../core/crud");
const mikro_orm_tag_type_repository_1 = require("./repository/mikro-orm-tag-type.repository");
const type_orm_tag_type_repository_1 = require("./repository/type-orm-tag-type.repository");
let TagTypeService = class TagTypeService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTagTypeRepository, mikroOrmTagTypeRepository) {
        super(typeOrmTagTypeRepository, mikroOrmTagTypeRepository);
    }
};
exports.TagTypeService = TagTypeService;
exports.TagTypeService = TagTypeService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_tag_type_repository_1.TypeOrmTagTypeRepository,
        mikro_orm_tag_type_repository_1.MikroOrmTagTypeRepository])
], TagTypeService);
//# sourceMappingURL=tag-type.service.js.map