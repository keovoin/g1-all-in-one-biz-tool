"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentInboundAddressController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const inbound_address_service_1 = require("../capture/inbound-address.service");
const document_inbound_address_dto_1 = require("../dto/document-inbound-address.dto");
/**
 * Tenant-facing management of inbound email capture addresses.
 *
 * Guarded exactly like every other Documents settings surface — tenant, permission and feature
 * flag — which is what distinguishes it from the `@Public()` webhook that *receives* the mail.
 *
 * Mutating routes require `DOCS_MANAGE` rather than `DOCS_UPDATE`: adding a capture address opens
 * an ingestion channel into the organization, which is an administrative act, not document editing.
 */
let DocumentInboundAddressController = class DocumentInboundAddressController {
    constructor(inboundAddressService) {
        this.inboundAddressService = inboundAddressService;
    }
    /**
     * Lists the organization's capture addresses, minting the platform one on first call.
     *
     * `webhookSecretHash` is stripped from every response — a hash is still a verifier, and this
     * endpoint is readable by anyone with `DOCS_READ`.
     */
    async list(query) {
        const { tenantId, organizationId } = this.scope(query?.organizationId);
        const rows = await this.inboundAddressService.listForOrganization(tenantId, organizationId);
        return rows.map((row) => this.toResponse(row));
    }
    /**
     * Registers a capture address on a domain the organization owns.
     *
     * The response carries the relay secret in plaintext — the only time it is ever returned.
     */
    async create(input) {
        if (input.kind !== contracts_1.DocumentInboundAddressKindEnum.CUSTOM_DOMAIN) {
            // The platform address is minted automatically; offering a second way to create one
            // would let a caller mint duplicates for the same organization.
            throw new common_1.BadRequestException('A platform address is provisioned automatically — only a custom domain can be created here.');
        }
        const { tenantId, organizationId } = this.scope(input?.organizationId);
        const { row, secret } = await this.inboundAddressService.createCustomDomain(tenantId, organizationId, input);
        return {
            address: this.toResponse(row),
            secret,
            verification: this.inboundAddressService.describeVerification(row)
        };
    }
    /**
     * The DNS record to publish, and where verification currently stands.
     */
    async verification(id, query) {
        const { tenantId, organizationId } = this.scope(query?.organizationId);
        const rows = await this.inboundAddressService.listForOrganization(tenantId, organizationId);
        const row = rows.find((candidate) => candidate.id === id);
        if (!row) {
            throw new common_1.BadRequestException('Inbound address not found.');
        }
        return this.inboundAddressService.describeVerification(row);
    }
    /**
     * Performs the DNS lookup and arms the address if the record is present.
     */
    async verify(id, body) {
        const { tenantId, organizationId } = this.scope(body?.organizationId);
        return this.inboundAddressService.verifyDomain(tenantId, organizationId, id);
    }
    /**
     * Issues a new relay secret, invalidating the previous one. Returned in plaintext once.
     */
    async rotateSecret(id, body) {
        const { tenantId, organizationId } = this.scope(body?.organizationId);
        return this.inboundAddressService.rotateSecret(tenantId, organizationId, id);
    }
    /**
     * Mints a new token for a platform address — i.e. a new address. Use when the current one
     * has leaked and started collecting junk.
     */
    async rotateAddress(id, body) {
        const { tenantId, organizationId } = this.scope(body?.organizationId);
        const row = await this.inboundAddressService.rotateAddress(tenantId, organizationId, id);
        return this.toResponse(row);
    }
    /**
     * Updates the sender allowlist, body-import preference, or active flag.
     */
    async update(id, input) {
        const { tenantId, organizationId } = this.scope(input?.organizationId);
        const row = await this.inboundAddressService.update(tenantId, organizationId, id, input);
        return this.toResponse(row);
    }
    /**
     * Resolves the effective scope, preferring an explicit organization over the request context.
     */
    scope(organizationId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const resolved = (organizationId ?? core_1.RequestContext.currentOrganizationId());
        if (!tenantId || !resolved) {
            throw new common_1.BadRequestException('An organization scope is required.');
        }
        return { tenantId, organizationId: resolved };
    }
    /**
     * Response projection. Drops `webhookSecretHash` — never expose a verifier, even hashed.
     */
    toResponse(row) {
        const { webhookSecretHash, senderAllowlistRaw, ...rest } = row;
        return {
            ...rest,
            // Surface the allowlist as a list rather than the raw JSON text column.
            senderAllowlist: row.senderAllowlist
        };
    }
};
exports.DocumentInboundAddressController = DocumentInboundAddressController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "List the organization's inbound capture addresses." }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Addresses retrieved successfully.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [document_inbound_address_dto_1.DocumentInboundAddressQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentInboundAddressController.prototype, "list", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Register an inbound capture address on a tenant-owned domain.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'Address created; verification pending.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_MANAGE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [document_inbound_address_dto_1.CreateDocumentInboundAddressDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentInboundAddressController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Show the DNS record required to verify a custom inbound domain.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Verification details retrieved.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Get)('/:id/verification'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, document_inbound_address_dto_1.DocumentInboundAddressQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentInboundAddressController.prototype, "verification", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Check the DNS TXT record and verify the domain.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Verification attempted.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_MANAGE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Post)('/:id/verify'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, document_inbound_address_dto_1.DocumentInboundAddressQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentInboundAddressController.prototype, "verify", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Rotate the relay secret for an inbound address.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Secret rotated.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_MANAGE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Post)('/:id/rotate-secret'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, document_inbound_address_dto_1.DocumentInboundAddressQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentInboundAddressController.prototype, "rotateSecret", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Rotate a platform capture address to a new token.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Address rotated.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_MANAGE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Post)('/:id/rotate-address'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, document_inbound_address_dto_1.DocumentInboundAddressQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentInboundAddressController.prototype, "rotateAddress", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an inbound capture address.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Address updated.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_MANAGE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, document_inbound_address_dto_1.UpdateDocumentInboundAddressDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentInboundAddressController.prototype, "update", null);
exports.DocumentInboundAddressController = DocumentInboundAddressController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Documents Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard, core_1.FeatureFlagGuard),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_DOCUMENTS),
    (0, common_1.Controller)('/plugins/docs/inbound-addresses'),
    tslib_1.__metadata("design:paramtypes", [inbound_address_service_1.InboundAddressService])
], DocumentInboundAddressController);
//# sourceMappingURL=document-inbound-address.controller.js.map