"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentImporterRegistry = void 0;
const common_1 = require("@nestjs/common");
/**
 * Process-wide registry of document importers.
 *
 * Static (not Nest DI) on purpose: an integration plugin registers in its own bootstrap
 * without importing `DocsModule`, exactly like the vector-store provider seam.
 */
class DocumentImporterRegistry {
    /**
     * Registers (or replaces) an importer.
     *
     * @param importer The importer to register.
     */
    static register(importer) {
        if (!importer?.id) {
            throw new Error('A document importer must expose a stable `id`.');
        }
        if (this.importers.has(importer.id)) {
            this.logger.warn(`Document importer '${importer.id}' was already registered — replacing.`);
        }
        this.importers.set(importer.id, importer);
        this.logger.log(`Document importer registered: ${importer.id}`);
    }
    /**
     * Removes an importer (plugin teardown).
     *
     * @param id The importer id.
     */
    static unregister(id) {
        this.importers.delete(id);
    }
    /**
     * Resolves one importer by id.
     *
     * @param id The importer id.
     * @returns The importer, or undefined when not registered.
     */
    static resolve(id) {
        return this.importers.get(id);
    }
    /** Whether an importer with that id is registered. */
    static has(id) {
        return this.importers.has(id);
    }
    /** All registered importers, in registration order. */
    static list() {
        return [...this.importers.values()];
    }
    /** Drops every registration (tests / teardown). */
    static clear() {
        this.importers.clear();
    }
}
exports.DocumentImporterRegistry = DocumentImporterRegistry;
DocumentImporterRegistry.logger = new common_1.Logger('DocumentImporterRegistry');
DocumentImporterRegistry.importers = new Map();
//# sourceMappingURL=document-importer.interface.js.map