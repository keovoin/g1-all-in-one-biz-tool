"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const language_entity_1 = require("./language.entity");
const language_service_1 = require("./language.service");
let LanguageController = class LanguageController {
    constructor(languageService) {
        this.languageService = languageService;
    }
    async findAll(query) {
        return this.languageService.findAll(query);
    }
    async findByName(name) {
        return this.languageService.findOneByName(name);
    }
};
exports.LanguageController = LanguageController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all language.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found language',
        type: language_entity_1.Language
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    (0, common_2.Public)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], LanguageController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)('getByName/:name'),
    (0, common_2.Public)(),
    tslib_1.__param(0, (0, common_1.Param)('name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], LanguageController.prototype, "findByName", null);
exports.LanguageController = LanguageController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Languages'),
    (0, common_1.Controller)('/languages'),
    tslib_1.__metadata("design:paramtypes", [language_service_1.LanguageService])
], LanguageController);
//# sourceMappingURL=language.controller.js.map