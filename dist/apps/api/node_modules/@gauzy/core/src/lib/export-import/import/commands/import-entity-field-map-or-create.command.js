"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportEntityFieldMapOrCreateCommand = void 0;
class ImportEntityFieldMapOrCreateCommand {
    constructor(repository, where, entity, sourceId) {
        this.repository = repository;
        this.where = where;
        this.entity = entity;
        this.sourceId = sourceId;
    }
}
exports.ImportEntityFieldMapOrCreateCommand = ImportEntityFieldMapOrCreateCommand;
ImportEntityFieldMapOrCreateCommand.type = '[Import Entity] Map Or Create';
//# sourceMappingURL=import-entity-field-map-or-create.command.js.map