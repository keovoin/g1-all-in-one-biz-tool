"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const currency_entity_1 = require("./currency.entity");
const currency_service_1 = require("./currency.service");
let CurrencyController = class CurrencyController {
    constructor(currencyService) {
        this.currencyService = currencyService;
    }
    async findAll() {
        return this.currencyService.findAll();
    }
};
exports.CurrencyController = CurrencyController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all currencies.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found currencies',
        type: currency_entity_1.Currency
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], CurrencyController.prototype, "findAll", null);
exports.CurrencyController = CurrencyController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Currency'),
    (0, common_1.Controller)('/currency'),
    (0, common_2.Public)(),
    tslib_1.__metadata("design:paramtypes", [currency_service_1.CurrencyService])
], CurrencyController);
//# sourceMappingURL=currency.controller.js.map