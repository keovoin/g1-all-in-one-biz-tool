"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateEmailService = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const moment = require("moment");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("@gauzy/config");
const context_1 = require("../core/context");
const crud_1 = require("./../core/crud");
const estimate_email_entity_1 = require("./estimate-email.entity");
const type_orm_estimate_email_repository_1 = require("./repository/type-orm-estimate-email.repository");
const mikro_orm_estimate_email_repository_1 = require("./repository/mikro-orm-estimate-email.repository");
const type_orm_invoice_repository_1 = require("./../invoice/repository/type-orm-invoice.repository");
let EstimateEmailService = class EstimateEmailService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmEstimateEmailRepository, mikroOrmEstimateEmailRepository, typeOrmInvoiceRepository) {
        super(typeOrmEstimateEmailRepository, mikroOrmEstimateEmailRepository);
        this.typeOrmEstimateEmailRepository = typeOrmEstimateEmailRepository;
        this.mikroOrmEstimateEmailRepository = mikroOrmEstimateEmailRepository;
        this.typeOrmInvoiceRepository = typeOrmInvoiceRepository;
    }
    /**
     * Creates an estimate email entry and generates a JWT token for secure verification.
     *
     * @param {ID} id - The unique identifier of the invoice.
     * @param {string} email - The recipient's email address.
     * @returns {Promise<IEstimateEmail>} - A promise resolving to the created estimate email entry.
     *
     * @throws {HttpException} - Throws an `HttpException` if an error occurs during processing.
     *
     * @description
     * This method retrieves the invoice and its associated organization, determines the token expiration,
     * generates a JWT token, and saves the estimate email details, including the expiration date and security token.
     */
    async createEstimateEmail(id, email) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            // Fetch invoice and organization details
            const invoice = await this.typeOrmInvoiceRepository.findOneOrFail({
                where: { id },
                relations: { organization: true }
            });
            // Define token expiration
            const tokenExpiryPeriod = invoice.organization?.inviteExpiryPeriod ?? 7;
            const expireDate = moment().add(tokenExpiryPeriod, 'days').toDate();
            // Create payload for JWT
            const payload = {
                invoiceId: invoice.id,
                organizationId: invoice.organizationId,
                tenantId,
                email
            };
            // Generate JWT token
            const token = (0, jsonwebtoken_1.sign)(payload, config_1.environment.JWT_SECRET, {
                expiresIn: `${moment.duration(moment(expireDate).diff(moment())).asSeconds()}s`
            });
            // Prepare and save estimate email entry
            return await this.save(new estimate_email_entity_1.EstimateEmail({
                organizationId: invoice.organizationId,
                tenantId: context_1.RequestContext.currentTenantId(),
                email,
                expireDate,
                convertAcceptedEstimates: invoice.organization?.convertAcceptedEstimates ?? false,
                token
            }));
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to add estimate email: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Validate estimate email
     *
     * @param params
     * @param relations
     * @returns
     */
    async validate(params, relations = []) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(params.token, config_1.environment.JWT_SECRET);
            const { organizationId, tenantId, email, token } = decoded;
            const result = await this.findOneOrFailByOptions({
                select: {
                    tenant: {
                        name: true,
                        logo: true
                    },
                    organization: {
                        name: true,
                        officialName: true,
                        brandColor: true
                    }
                },
                where: {
                    email,
                    token,
                    organizationId,
                    tenantId,
                    expireDate: (0, typeorm_1.MoreThan)(moment().toDate())
                },
                ...(relations
                    ? {
                        relations: relations
                    }
                    : {})
            });
            if (!result.success) {
                throw result.error;
            }
            return result.record;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.EstimateEmailService = EstimateEmailService;
exports.EstimateEmailService = EstimateEmailService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_estimate_email_repository_1.TypeOrmEstimateEmailRepository,
        mikro_orm_estimate_email_repository_1.MikroOrmEstimateEmailRepository,
        type_orm_invoice_repository_1.TypeOrmInvoiceRepository])
], EstimateEmailService);
//# sourceMappingURL=estimate-email.service.js.map