"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportHistoryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../../core/crud");
const context_1 = require("./../../core/context");
const file_storage_1 = require("./../../core/file-storage");
const type_orm_import_history_repository_1 = require("./repository/type-orm-import-history.repository");
const mikro_orm_import_history_repository_1 = require("./repository/mikro-orm-import-history.repository");
let ImportHistoryService = class ImportHistoryService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmImportHistoryRepository, mikroOrmImportHistoryRepository) {
        super(typeOrmImportHistoryRepository, mikroOrmImportHistoryRepository);
    }
    /**
     *
     * @returns
     */
    async findAll() {
        try {
            return await super.findAll({
                order: {
                    importDate: 'DESC'
                }
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Reads back the archive one of the current tenant's imports was made from.
     *
     * 🛑 The archive is a full tenant data dump. It used to be offered through `fullUrl`, a public
     * `/public/import/import-<unix-seconds>-<0..999>.zip` URL any unauthenticated caller could guess.
     * It is now reachable only through this method, behind the import-history route's permissions,
     * and only for a row of the caller's OWN tenant.
     *
     * The tenant condition is spelled out here rather than left to `TenantAwareCrudService`, whose
     * `findOneWithTenant()` adds nothing when there is no current user — and a request with no tenant
     * is refused outright instead of being allowed to query with the condition missing.
     *
     * @param id - The import-history row.
     * @returns The original file name and the archive's bytes.
     * @throws ForbiddenException when the request carries no tenant.
     * @throws NotFoundException when the row is not the tenant's, or its archive no longer exists.
     */
    async getArchive(id) {
        const tenantId = context_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.ForbiddenException();
        }
        const history = await this.findOneByIdString(id, { where: { tenantId } });
        if (!history?.path || history.tenantId !== tenantId) {
            throw new common_1.NotFoundException('The requested import archive was not found');
        }
        // The local provider logs and resolves `undefined` for a missing file; cloud providers throw.
        let content;
        try {
            content = await new file_storage_1.FileStorage().getProvider().getFile(history.path);
        }
        catch {
            content = undefined;
        }
        if (!content) {
            throw new common_1.NotFoundException('The requested import archive was not found');
        }
        return { file: history.file, content };
    }
};
exports.ImportHistoryService = ImportHistoryService;
exports.ImportHistoryService = ImportHistoryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_import_history_repository_1.TypeOrmImportHistoryRepository,
        mikro_orm_import_history_repository_1.MikroOrmImportHistoryRepository])
], ImportHistoryService);
//# sourceMappingURL=import-history.service.js.map