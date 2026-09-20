"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudFactory = CrudFactory;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../core/dto");
const pipes_1 = require("./../../shared/pipes");
const base_query_dto_1 = require("../dto/base-query.dto");
/**
 * Base crud controller
 *
 * @param createDTO
 * @param updateDTO
 * @returns
 */
function CrudFactory(queryDTO, createDTO, updateDTO, countQueryDTO) {
    class BaseCrudController {
        constructor(crudService) {
            this.crudService = crudService;
        }
        /**
         *
         * @param options
         * @returns
         */
        async getCount(options) {
            return await this.crudService.countBy(options);
        }
        /**
         *
         * @param filter
         * @param options
         * @returns
         */
        async pagination(filter, ...options) {
            return await this.crudService.paginate(filter);
        }
        /**
         *
         * @param filter
         * @param options
         * @returns
         */
        async findAll(filter, ...options) {
            return await this.crudService.findAll(filter);
        }
        /**
         *
         * @param id
         * @param options
         * @returns
         */
        async findById(id, ...options) {
            return await this.crudService.findOneByIdString(id);
        }
        /**
         *
         * @param entity
         * @returns
         */
        async create(entity) {
            return await this.crudService.create(entity);
        }
        /**
         *
         * @param id
         * @param entity
         * @returns
         */
        async update(id, entity) {
            return await this.crudService.update(id, entity);
        }
        /**
         *
         * @param id
         * @returns
         */
        async delete(id) {
            return await this.crudService.delete(id);
        }
        /**
         * Soft deletes a record by ID.
         *
         * This endpoint marks a record as deleted without physically removing it from the database.
         * The soft-deleted record can be restored later.
         *
         * @param id The ID of the record to soft delete.
         * @returns The soft-deleted record.
         */
        async softRemove(id, ...options) {
            // Soft delete the record
            return await this.crudService.softRemove(id, options);
        }
        /**
         * Restores a soft-deleted record by ID.
         *
         * This endpoint restores a record that was previously soft-deleted,
         * allowing it to be used again in the application.
         *
         * @param id The ID of the record to restore.
         * @returns The restored record.
         */
        async softRecover(id, ...options) {
            // Restore the soft-deleted record
            return await this.crudService.softRecover(id, options);
        }
    }
    tslib_1.__decorate([
        (0, swagger_1.ApiOperation)({ summary: 'Find records count.' }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.OK,
            description: 'Found records count.'
        }),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        (0, common_1.Get)('count'),
        (0, common_1.UsePipes)(new pipes_1.AbstractValidationPipe({ transform: true, whitelist: true }, { query: countQueryDTO })),
        tslib_1.__param(0, (0, common_1.Query)()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], BaseCrudController.prototype, "getCount", null);
    tslib_1.__decorate([
        (0, swagger_1.ApiOperation)({ summary: 'Find all records using pagination.' }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.OK,
            description: 'Found records using pagination.'
        }),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        (0, common_1.Get)('pagination'),
        (0, common_1.UsePipes)(new pipes_1.AbstractValidationPipe({ transform: true, whitelist: true }, { query: queryDTO })),
        tslib_1.__param(0, (0, common_1.Query)()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [base_query_dto_1.BaseQueryDTO, Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], BaseCrudController.prototype, "pagination", null);
    tslib_1.__decorate([
        (0, swagger_1.ApiOperation)({ summary: 'Find all records.' }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.OK,
            description: 'Found all records.'
        }),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        (0, common_1.Get)(),
        (0, common_1.UsePipes)(new pipes_1.AbstractValidationPipe({ transform: true, whitelist: true }, { query: queryDTO })),
        tslib_1.__param(0, (0, common_1.Query)()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [base_query_dto_1.BaseQueryDTO, Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], BaseCrudController.prototype, "findAll", null);
    tslib_1.__decorate([
        (0, swagger_1.ApiOperation)({ summary: 'Find one record by id.' }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.OK,
            description: 'Found one record by id.'
        }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.NOT_FOUND,
            description: 'Record not found.'
        }),
        (0, common_1.HttpCode)(common_1.HttpStatus.OK),
        (0, common_1.Get)(':id'),
        tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], BaseCrudController.prototype, "findById", null);
    tslib_1.__decorate([
        (0, swagger_1.ApiOperation)({ summary: 'Create new record.' }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.CREATED,
            description: 'The record has been successfully created.'
        }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.BAD_REQUEST,
            description: 'Invalid input, The response body may contain clues as to what went wrong.'
        }),
        (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
        (0, common_1.Post)(),
        (0, common_1.UsePipes)(new pipes_1.AbstractValidationPipe({ transform: true, whitelist: true }, { body: createDTO })),
        tslib_1.__param(0, (0, common_1.Body)()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], BaseCrudController.prototype, "create", null);
    tslib_1.__decorate([
        (0, swagger_1.ApiOperation)({ summary: 'Update an existing record.' }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.ACCEPTED,
            description: 'The record has been successfully edited.'
        }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.NOT_FOUND,
            description: 'Record not found'
        }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.BAD_REQUEST,
            description: 'Invalid input, The response body may contain clues as to what went wrong.'
        }),
        (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
        (0, common_1.Put)(':id'),
        (0, common_1.UsePipes)(new pipes_1.AbstractValidationPipe({ transform: true, whitelist: true }, { body: updateDTO })),
        tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
        tslib_1.__param(1, (0, common_1.Body)()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], BaseCrudController.prototype, "update", null);
    tslib_1.__decorate([
        (0, swagger_1.ApiOperation)({ summary: 'Delete record.' }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.ACCEPTED,
            description: 'The record has been successfully deleted.'
        }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.NOT_FOUND,
            description: 'Record not found.'
        }),
        (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
        (0, common_1.Delete)(':id'),
        tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], BaseCrudController.prototype, "delete", null);
    tslib_1.__decorate([
        (0, swagger_1.ApiOperation)({ summary: 'Soft delete a record by ID' }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.ACCEPTED,
            description: 'Record soft deleted successfully'
        }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.NOT_FOUND,
            description: 'Record not found'
        }),
        (0, common_1.Delete)(':id/soft'),
        (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
        (0, common_1.UsePipes)(new pipes_1.AbstractValidationPipe({ whitelist: true }, { query: dto_1.TenantOrganizationBaseDTO })),
        tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], BaseCrudController.prototype, "softRemove", null);
    tslib_1.__decorate([
        (0, swagger_1.ApiOperation)({ summary: 'Restore a soft-deleted record by ID' }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.ACCEPTED,
            description: 'Record restored successfully'
        }),
        (0, swagger_1.ApiResponse)({
            status: common_1.HttpStatus.NOT_FOUND,
            description: 'Record not found or not in a soft-deleted state'
        }),
        (0, common_1.Put)(':id/recover'),
        (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
        (0, common_1.UsePipes)(new pipes_1.AbstractValidationPipe({ whitelist: true }, { query: dto_1.TenantOrganizationBaseDTO })),
        tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], BaseCrudController.prototype, "softRecover", null);
    return BaseCrudController;
}
//# sourceMappingURL=crud.factory.js.map