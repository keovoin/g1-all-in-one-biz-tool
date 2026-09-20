"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyresultTemplateService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const mikro_orm_keyresult_template_repository_1 = require("./repository/mikro-orm-keyresult-template.repository");
const type_orm_keyresult_template_repository_1 = require("./repository/type-orm-keyresult-template.repository");
let KeyresultTemplateService = class KeyresultTemplateService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmKeyResultTemplateRepository, mikroOrmKeyResultTemplateRepository) {
        super(typeOrmKeyResultTemplateRepository, mikroOrmKeyResultTemplateRepository);
    }
};
exports.KeyresultTemplateService = KeyresultTemplateService;
exports.KeyresultTemplateService = KeyresultTemplateService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_keyresult_template_repository_1.TypeOrmKeyResultTemplateRepository,
        mikro_orm_keyresult_template_repository_1.MikroOrmKeyResultTemplateRepository])
], KeyresultTemplateService);
//# sourceMappingURL=keyresult-template.service.js.map