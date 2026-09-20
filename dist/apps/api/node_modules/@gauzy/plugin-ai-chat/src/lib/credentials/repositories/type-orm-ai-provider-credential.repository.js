"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmAiProviderCredentialRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ai_provider_credential_entity_1 = require("../ai-provider-credential.entity");
let TypeOrmAiProviderCredentialRepository = class TypeOrmAiProviderCredentialRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmAiProviderCredentialRepository = TypeOrmAiProviderCredentialRepository;
exports.TypeOrmAiProviderCredentialRepository = TypeOrmAiProviderCredentialRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(ai_provider_credential_entity_1.AiProviderCredential)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmAiProviderCredentialRepository);
//# sourceMappingURL=type-orm-ai-provider-credential.repository.js.map