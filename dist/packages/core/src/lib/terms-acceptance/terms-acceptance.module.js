"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAcceptanceModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const terms_acceptance_entity_1 = require("./terms-acceptance.entity");
const terms_acceptance_controller_1 = require("./terms-acceptance.controller");
const terms_acceptance_service_1 = require("./terms-acceptance.service");
const type_orm_terms_acceptance_repository_1 = require("./repository/type-orm-terms-acceptance.repository");
const mikro_orm_terms_acceptance_repository_1 = require("./repository/mikro-orm-terms-acceptance.repository");
let TermsAcceptanceModule = class TermsAcceptanceModule {
};
exports.TermsAcceptanceModule = TermsAcceptanceModule;
exports.TermsAcceptanceModule = TermsAcceptanceModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([terms_acceptance_entity_1.TermsAcceptance]), nestjs_1.MikroOrmModule.forFeature([terms_acceptance_entity_1.TermsAcceptance])],
        controllers: [terms_acceptance_controller_1.TermsAcceptanceController],
        providers: [terms_acceptance_service_1.TermsAcceptanceService, type_orm_terms_acceptance_repository_1.TypeOrmTermsAcceptanceRepository, mikro_orm_terms_acceptance_repository_1.MikroOrmTermsAcceptanceRepository],
        exports: [terms_acceptance_service_1.TermsAcceptanceService, type_orm_terms_acceptance_repository_1.TypeOrmTermsAcceptanceRepository, mikro_orm_terms_acceptance_repository_1.MikroOrmTermsAcceptanceRepository]
    })
], TermsAcceptanceModule);
//# sourceMappingURL=terms-acceptance.module.js.map