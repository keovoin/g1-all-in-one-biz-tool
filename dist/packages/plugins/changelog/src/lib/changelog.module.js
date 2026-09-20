"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const cqrs_1 = require("@nestjs/cqrs");
const changelog_entity_1 = require("./changelog.entity");
const changelog_controller_1 = require("./changelog.controller");
const changelog_service_1 = require("./changelog.service");
const handlers_1 = require("./commands/handlers");
const type_orm_changelog_repository_1 = require("./repository/type-orm-changelog.repository");
let ChangelogModule = class ChangelogModule {
};
exports.ChangelogModule = ChangelogModule;
exports.ChangelogModule = ChangelogModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [changelog_controller_1.ChangelogController],
        imports: [typeorm_1.TypeOrmModule.forFeature([changelog_entity_1.Changelog]), nestjs_1.MikroOrmModule.forFeature([changelog_entity_1.Changelog]), cqrs_1.CqrsModule],
        providers: [changelog_service_1.ChangelogService, type_orm_changelog_repository_1.TypeOrmChangelogRepository, ...handlers_1.CommandHandlers]
    })
], ChangelogModule);
//# sourceMappingURL=changelog.module.js.map