"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_service_1 = require("../core/crud/crud.service");
const type_orm_language_repository_1 = require("./repository/type-orm-language.repository");
const mikro_orm_language_repository_1 = require("./repository/mikro-orm-language.repository");
let LanguageService = class LanguageService extends crud_service_1.CrudService {
    constructor(typeOrmLanguageRepository, mikroOrmLanguageRepository) {
        super(typeOrmLanguageRepository, mikroOrmLanguageRepository);
    }
    /**
     * Finds a single Language entity by its name.
     *
     * @param name The name of the Language entity to be found.
     * @returns A promise that resolves to the Language entity if found, or null if not found.
     */
    findOneByName(name) {
        return super.findOneByOptions({
            where: { name }
        });
    }
};
exports.LanguageService = LanguageService;
exports.LanguageService = LanguageService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_language_repository_1.TypeOrmLanguageRepository,
        mikro_orm_language_repository_1.MikroOrmLanguageRepository])
], LanguageService);
//# sourceMappingURL=language.service.js.map