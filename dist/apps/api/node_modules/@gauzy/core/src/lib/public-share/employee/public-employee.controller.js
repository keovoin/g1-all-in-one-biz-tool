"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicEmployeeController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const dto_1 = require("./../../core/dto");
const queries_1 = require("./queries");
const public_employee_query_dto_1 = require("./dto/public-employee-query.dto");
const public_transform_interceptor_1 = require("./../public-transform.interceptor");
const pipes_1 = require("../../shared/pipes");
let PublicEmployeeController = class PublicEmployeeController {
    constructor(queryBus) {
        this.queryBus = queryBus;
    }
    /**
     * GET public employees in the specific organization
     *
     * @param params
     * @param options
     * @returns
     */
    async findPublicEmployeesByOrganization(conditions, options) {
        return await this.queryBus.execute(new queries_1.FindPublicEmployeesByOrganizationQuery(conditions, options.relations));
    }
    /**
     * GET public employee by profile link in the specific organization
     *
     * @param id
     * @param profile_link
     * @returns
     */
    async findPublicEmployeeByProfileLink(params, options) {
        return await this.queryBus.execute(new queries_1.FindOnePublicEmployeeQuery(params, options.relations));
    }
};
exports.PublicEmployeeController = PublicEmployeeController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find public information for all employees in the organization.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employees in the organization'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Records not found'
    }),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.TenantOrganizationBaseDTO,
        public_employee_query_dto_1.PublicEmployeeQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicEmployeeController.prototype, "findPublicEmployeesByOrganization", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find public information for one employee by profile link in the organization.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employee in the organization'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/:profile_link/:id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, public_employee_query_dto_1.PublicEmployeeQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicEmployeeController.prototype, "findPublicEmployeeByProfileLink", null);
exports.PublicEmployeeController = PublicEmployeeController = tslib_1.__decorate([
    (0, common_2.Public)(),
    (0, common_1.UseInterceptors)(public_transform_interceptor_1.PublicTransformInterceptor),
    (0, common_1.Controller)('/public/employee'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.QueryBus])
], PublicEmployeeController);
//# sourceMappingURL=public-employee.controller.js.map