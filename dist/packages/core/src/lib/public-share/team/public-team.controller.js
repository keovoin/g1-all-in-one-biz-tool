"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicTeamController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const common_2 = require("@gauzy/common");
const queries_1 = require("./queries");
const public_transform_interceptor_1 = require("./../public-transform.interceptor");
const dto_1 = require("./dto");
const pipes_1 = require("../../shared/pipes");
let PublicTeamController = class PublicTeamController {
    constructor(_queryBus) {
        this._queryBus = _queryBus;
    }
    /**
     * GET team by profile link
     *
     * @param params
     * @param options
     * @returns
     */
    async findOneByProfileLink(params, options) {
        return await this._queryBus.execute(new queries_1.FindPublicTeamQuery(params, options));
    }
};
exports.PublicTeamController = PublicTeamController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find Team by profile link.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one record'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(':profile_link/:id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.PublicTeamQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicTeamController.prototype, "findOneByProfileLink", null);
exports.PublicTeamController = PublicTeamController = tslib_1.__decorate([
    (0, common_2.Public)(),
    (0, common_1.UseInterceptors)(public_transform_interceptor_1.PublicTransformInterceptor),
    (0, common_1.Controller)('/public/team'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.QueryBus])
], PublicTeamController);
//# sourceMappingURL=public-team.controller.js.map