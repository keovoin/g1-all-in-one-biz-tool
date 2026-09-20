"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionEntityManager = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ConnectionEntityManager = class ConnectionEntityManager {
    constructor(entityManager) {
        this.entityManager = entityManager;
    }
    /**
     * Retrieves the raw EntityManager instance.
     *
     * @returns The raw EntityManager instance.
     */
    get rawEntityManager() {
        return this.entityManager;
    }
    /**
     * Retrieves the raw connection from the EntityManager.
     *
     * @returns The raw connection from the EntityManager.
     */
    get rawConnection() {
        return this.entityManager.dataSource;
    }
    /**
     * Returns a TypeORM repository based on the provided target.
     *
     * @param target The target entity type or entity schema for which to retrieve the repository.
     * @returns The TypeORM repository for the specified target entity.
     */
    getRepository(target) {
        return this.rawEntityManager.getRepository(target);
    }
};
exports.ConnectionEntityManager = ConnectionEntityManager;
exports.ConnectionEntityManager = ConnectionEntityManager = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectEntityManager)()),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.EntityManager])
], ConnectionEntityManager);
//# sourceMappingURL=connection-entity-manager.js.map