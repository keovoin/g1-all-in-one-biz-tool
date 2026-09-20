"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicInvoiceService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("@gauzy/config");
const internal_1 = require("./../../core/entities/internal");
const utils_1 = require("../../core/utils");
const type_orm_invoice_repository_1 = require("../../invoice/repository/type-orm-invoice.repository");
let PublicInvoiceService = class PublicInvoiceService {
    constructor(typeOrmInvoiceRepository) {
        this.typeOrmInvoiceRepository = typeOrmInvoiceRepository;
    }
    /**
     * Find public invoice by token
     *
     * @param params
     * @param relations
     * @returns
     */
    async findOneByConditions(params, relations = []) {
        if (!params.id || !params.token) {
            throw new common_1.ForbiddenException();
        }
        try {
            // verify token
            const { id, organizationId, tenantId } = (0, jsonwebtoken_1.verify)(params.token, config_1.environment.JWT_SECRET);
            // Get invoice
            return await this.typeOrmInvoiceRepository.findOneOrFail({
                select: {
                    tenant: {
                        name: true,
                        logo: true
                    },
                    organization: {
                        name: true,
                        officialName: true,
                        brandColor: true
                    },
                    fromOrganization: {
                        name: true,
                        officialName: true,
                        brandColor: true
                    },
                    invoiceItems: {
                        id: true,
                        description: true,
                        quantity: true,
                        price: true,
                        totalValue: true,
                        applyDiscount: true,
                        employeeId: true,
                        employee: {
                            id: true,
                            userId: true,
                            user: {
                                id: true,
                                firstName: true,
                                lastName: true
                            }
                        },
                        projectId: true,
                        project: {
                            id: true,
                            imageUrl: true,
                            name: true,
                            description: true
                        },
                        productId: true,
                        product: {
                            id: true,
                            code: true,
                            imageUrl: true
                        },
                        expenseId: true,
                        expense: {
                            id: true,
                            purpose: true
                        },
                        taskId: true,
                        task: {
                            id: true,
                            title: true,
                            description: true
                        }
                    },
                    toContact: {
                        id: true,
                        contactType: true,
                        imageUrl: true,
                        name: true
                    }
                },
                where: {
                    id,
                    organizationId,
                    tenantId
                },
                ...(relations ? { relations: (0, utils_1.parseFindOptionsRelations)(relations) } : {})
            });
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    /**
     * Update public invoice
     *
     * @param params
     * @param entity
     * @returns
     */
    async updateInvoice(params, entity) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(params.token, config_1.environment.JWT_SECRET);
            // Only an estimate-email token (estimate-email.service.ts) carries `invoiceId`; other
            // JWT_SECRET-signed tokens do not. Without this check a missing `invoiceId` was dropped from
            // the where and `findOneByOrFail` matched an ARBITRARY invoice of that organization/tenant,
            // which was then updated with the caller's body. The token must also name the invoice in the URL.
            const invoiceId = decoded?.invoiceId;
            if (!invoiceId || !decoded?.tenantId || invoiceId !== params.id) {
                throw new common_1.ForbiddenException('Invalid estimate token');
            }
            const invoice = await this.typeOrmInvoiceRepository.findOneByOrFail({
                id: invoiceId,
                organizationId: decoded.organizationId ?? (0, typeorm_2.IsNull)(),
                tenantId: decoded.tenantId
            });
            return await this.typeOrmInvoiceRepository.update(invoice.id, entity);
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.PublicInvoiceService = PublicInvoiceService;
exports.PublicInvoiceService = PublicInvoiceService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(internal_1.Invoice)),
    tslib_1.__metadata("design:paramtypes", [type_orm_invoice_repository_1.TypeOrmInvoiceRepository])
], PublicInvoiceService);
//# sourceMappingURL=public-invoice.service.js.map