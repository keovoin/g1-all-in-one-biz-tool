"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportEntityFieldMapOrCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const cqrs_2 = require("@nestjs/cqrs");
const utils_1 = require("@gauzy/utils");
const core_1 = require("./../../../../core");
const import_record_1 = require("./../../../import-record");
const export_redact_decorator_1 = require("../../../export-redact.decorator");
const import_entity_field_map_or_create_command_1 = require("./../import-entity-field-map-or-create.command");
let ImportEntityFieldMapOrCreateHandler = class ImportEntityFieldMapOrCreateHandler {
    constructor(_commandBus) {
        this._commandBus = _commandBus;
    }
    async execute(event) {
        const { repository, where, entity, sourceId } = event;
        try {
            if ((0, utils_1.isNotEmpty)(where)) {
                return await repository.findOneOrFail({
                    where,
                    order: {
                        createdAt: 'DESC'
                    }
                });
            }
            throw new common_1.NotFoundException();
        }
        catch (error) {
            try {
                const { record, success } = await this._commandBus.execute(new import_record_1.ImportRecordFindOrFailCommand({
                    tenantId: core_1.RequestContext.currentTenantId(),
                    sourceId,
                    entityType: repository.metadata.tableName
                }));
                if (success && record) {
                    const { destinationId } = record;
                    // This row was imported before, so this is an UPDATE of a live row. An export
                    // archive carries placeholders where credentials were (GHSA-j5h5-r956-rxc3); writing
                    // them back would replace working tokens and password digests with masks and nulls.
                    return await repository.save({
                        id: destinationId,
                        ...(0, export_redact_decorator_1.omitExportRedactionPlaceholders)(repository.metadata.target, entity)
                    });
                }
                throw new common_1.NotFoundException(`The import record was not found`);
            }
            catch (error) {
                return await this._create(repository, entity);
            }
        }
    }
    async _create(repository, entity) {
        try {
            const obj = repository.create(entity);
            // https://github.com/Microsoft/TypeScript/issues/21592
            return await repository.save(obj);
        }
        catch (err) {
            throw new common_1.BadRequestException(err);
        }
    }
};
exports.ImportEntityFieldMapOrCreateHandler = ImportEntityFieldMapOrCreateHandler;
exports.ImportEntityFieldMapOrCreateHandler = ImportEntityFieldMapOrCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(import_entity_field_map_or_create_command_1.ImportEntityFieldMapOrCreateCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_2.CommandBus])
], ImportEntityFieldMapOrCreateHandler);
//# sourceMappingURL=import-entity-field-map-or-create.handler.js.map