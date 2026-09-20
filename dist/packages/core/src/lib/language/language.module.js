"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageModule = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const language_service_1 = require("./language.service");
const language_controller_1 = require("./language.controller");
const language_entity_1 = require("./language.entity");
const type_orm_language_repository_1 = require("./repository/type-orm-language.repository");
const mikro_orm_language_repository_1 = require("./repository/mikro-orm-language.repository");
let LanguageModule = class LanguageModule {
};
exports.LanguageModule = LanguageModule;
exports.LanguageModule = LanguageModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([language_entity_1.Language]), nestjs_1.MikroOrmModule.forFeature([language_entity_1.Language])],
        controllers: [language_controller_1.LanguageController],
        providers: [language_service_1.LanguageService, type_orm_language_repository_1.TypeOrmLanguageRepository, mikro_orm_language_repository_1.MikroOrmLanguageRepository],
        exports: [language_service_1.LanguageService]
    })
], LanguageModule);
//# sourceMappingURL=language.module.js.map