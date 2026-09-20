"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const country_entity_1 = require("./country.entity");
const country_service_1 = require("./country.service");
let CountryController = class CountryController {
    constructor(countryService) {
        this.countryService = countryService;
    }
    async findAll() {
        return this.countryService.findAll();
    }
};
exports.CountryController = CountryController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all countries.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found countries',
        type: country_entity_1.Country
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], CountryController.prototype, "findAll", null);
exports.CountryController = CountryController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Country'),
    (0, common_1.Controller)('/country'),
    (0, common_2.Public)(),
    tslib_1.__metadata("design:paramtypes", [country_service_1.CountryService])
], CountryController);
//# sourceMappingURL=country.controller.js.map